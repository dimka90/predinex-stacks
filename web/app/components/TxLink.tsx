import { explorerTxUrl } from "../lib/constants";
export default function TxLink({ txId, network = "mainnet" }: { txId: string; network?: string }) {
  return (
    <a href={explorerTxUrl(txId, network)} target="_blank" rel="noopener noreferrer"
       className="text-primary hover:underline font-mono text-xs">
      {txId.slice(0, 8)}...{txId.slice(-6)}
    </a>
  );
}
