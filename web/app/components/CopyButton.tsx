"use client";
import { useState } from "react";
export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return <button onClick={copy} className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted/80">{copied ? "Copied" : "Copy"}</button>;
}
