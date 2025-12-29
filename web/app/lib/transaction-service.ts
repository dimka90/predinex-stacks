/**
 * Transaction Service
 * Handles transaction formatting, signing, and broadcasting for Stacks wallets
 */

import { 
  makeContractCall, 
  broadcastTransaction, 
  AnchorMode, 
  PostConditionMode,
  ClarityValue,
  StacksTransaction,
  estimateContractFunctionCall,
  getNonce,
  StacksNetwork
} from '@stacks/transactions';
import { WalletSession, TransactionPayload } from './wallet-service';

export interface TransactionOptions {
  fee?: number;
  nonce?: number;
  anchorMode?: AnchorMode;
  postConditionMode?: PostConditionMode;
}

export interface TransactionResult {
  txId: string;
  transaction: StacksTransaction;
  broadcastResult: any;
}

export interface TransactionEstimate {
  estimatedFee: number;
  estimatedNonce: number;
  totalCost: number;
}

export class TransactionService {
  private network: StacksNetwork;

  constructor(network: StacksNetwork) {
    this.network = network;
  }

  /**
   * Estimate transaction costs
   */
  async estimateTransaction(
    payload: TransactionPayload,
    senderAddress: string
  ): Promise<TransactionEstimate> {
    try {
      // Estimate fee
      const feeEstimate = await estimateContractFunctionCall({
        contractAddress: payload.contractAddress,
        contractName: payload.contractName,
        functionName: payload.functionName,
        functionArgs: payload.functionArgs,
        senderAddress,
        network: this.network,
      });

      // Get current nonce
      const nonceResponse = await getNonce(senderAddress, this.network);
      
      return {
        estimatedFee: Number(feeEstimate),
        estimatedNonce: Number(nonceResponse),
        totalCost: Number(feeEstimate), // For contract calls, only fee is the cost
      };
    } catch (error) {
      console.error('Transaction estimation failed:', error);
      // Return reasonable defaults
      return {
        estimatedFee: 1000, // 0.001 STX
        estimatedNonce: 0,
        totalCost: 1000,
      };
    }
  }

  /**
   * Format transaction for wallet display
   */
  formatTransactionForDisplay(payload: TransactionPayload): {
    title: string;
    description: string;
    details: Array<{ label: string; value: string }>;
  } {
    const details = [
      { label: 'Contract', value: `${payload.contractAddress}.${payload.contractName}` },
      { label: 'Function', value: payload.functionName },
      { label: 'Arguments', value: `${payload.functionArgs.length} parameters` },
    ];

    if (payload.fee) {
      details.push({ label: 'Fee', value: `${payload.fee / 1000000} STX` });
    }

    return {
      title: `Call ${payload.functionName}`,
      description: `Execute function on ${payload.contractName} contract`,
      details,
    };
  }

  /**
   * Create transaction for signing
   */
  async createTransaction(
    payload: TransactionPayload,
    senderKey: string,
    options: TransactionOptions = {}
  ): Promise<StacksTransaction> {
    try {
      // Get estimates if not provided
      let fee = options.fee;
      let nonce = options.nonce;

      if (!fee || !nonce) {
        const senderAddress = this.getAddressFromPrivateKey(senderKey);
        const estimate = await this.estimateTransaction(payload, senderAddress);
        
        if (!fee) fee = estimate.estimatedFee;
        if (!nonce) nonce = estimate.estimatedNonce;
      }

      const txOptions = {
        contractAddress: payload.contractAddress,
        contractName: payload.contractName,
        functionName: payload.functionName,
        functionArgs: payload.functionArgs,
        senderKey,
        network: this.network,
        anchorMode: options.anchorMode || AnchorMode.Any,
        postConditionMode: options.postConditionMode || PostConditionMode.Allow,
        fee,
        nonce,
      };

      return await makeContractCall(txOptions);
    } catch (error) {
      console.error('Transaction creation failed:', error);
      throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Broadcast signed transaction
   */
  async broadcastTransaction(transaction: StacksTransaction): Promise<TransactionResult> {
    try {
      const broadcastResult = await broadcastTransaction(transaction, this.network);
      
      if (broadcastResult.error) {
        throw new Error(`Broadcast failed: ${broadcastResult.error}`);
      }

      return {
        txId: broadcastResult.txid,
        transaction,
        broadcastResult,
      };
    } catch (error) {
      console.error('Transaction broadcast failed:', error);
      throw new Error(`Failed to broadcast transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Complete transaction flow: create, sign, and broadcast
   */
  async executeTransaction(
    payload: TransactionPayload,
    senderKey: string,
    options: TransactionOptions = {}
  ): Promise<TransactionResult> {
    try {
      // Create transaction
      const transaction = await this.createTransaction(payload, senderKey, options);
      
      // Broadcast transaction (it's already signed by makeContractCall)
      return await this.broadcastTransaction(transaction);
    } catch (error) {
      console.error('Transaction execution failed:', error);
      throw error;
    }
  }

  /**
   * Validate transaction payload
   */
  validatePayload(payload: TransactionPayload): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload.contractAddress) {
      errors.push('Contract address is required');
    }

    if (!payload.contractName) {
      errors.push('Contract name is required');
    }

    if (!payload.functionName) {
      errors.push('Function name is required');
    }

    if (!Array.isArray(payload.functionArgs)) {
      errors.push('Function arguments must be an array');
    }

    // Validate contract address format
    if (payload.contractAddress && !this.isValidStacksAddress(payload.contractAddress)) {
      errors.push('Invalid contract address format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(txId: string): Promise<{
    status: 'pending' | 'success' | 'failed' | 'not_found';
    details?: any;
  }> {
    try {
      const response = await fetch(`${this.network.coreApiUrl}/extended/v1/tx/${txId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return { status: 'not_found' };
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const txData = await response.json();
      
      let status: 'pending' | 'success' | 'failed' = 'pending';
      
      if (txData.tx_status === 'success') {
        status = 'success';
      } else if (txData.tx_status === 'abort_by_response' || txData.tx_status === 'abort_by_post_condition') {
        status = 'failed';
      }

      return {
        status,
        details: txData,
      };
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      return { status: 'not_found' };
    }
  }

  /**
   * Helper: Extract address from private key (simplified)
   */
  private getAddressFromPrivateKey(privateKey: string): string {
    // This is a simplified implementation
    // In a real app, you'd use proper key derivation
    return 'SP1EXAMPLE'; // Placeholder
  }

  /**
   * Helper: Validate Stacks address format
   */
  private isValidStacksAddress(address: string): boolean {
    const stacksAddressRegex = /^S[PT][0-9A-HJKMNP-TV-Z]{39}$/;
    return stacksAddressRegex.test(address);
  }
}