"use client";
import { useState } from "react";
interface TooltipProps { content: string; children: React.ReactNode; }
export default function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && <div className="absolute bottom-full mb-1 px-2 py-1 text-xs bg-black/80 text-white rounded whitespace-nowrap z-50">{content}</div>}
    </div>
  );
}
