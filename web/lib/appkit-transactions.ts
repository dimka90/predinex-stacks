import { openContractCall } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { PostConditionMode } from '@stacks/transactions';

export async function callContract(params: {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  network?: 'mainnet' | 'testnet';
  onFinish?: (data: any) => void;
  onCancel?: () => void;
}) {
  const network = params.network === 'testnet' ? new StacksTestnet() : new StacksMainnet();

  await openContractCall({
    network,
    contractAddress: params.contractAddress,
    contractName: params.contractName,
    functionName: params.functionName,
    functionArgs: params.functionArgs,
    postConditionMode: PostConditionMode.Allow,
    onFinish: params.onFinish,
    onCancel: params.onCancel,
  });
}
