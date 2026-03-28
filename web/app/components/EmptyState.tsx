'use client';

import { SearchX, Inbox } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'search' | 'inbox';
  actionLabel?: string;
  actionHref?: string;
}

/**
 * EmptyState - Premium placeholder for empty lists or missing data.
 */
export default function EmptyState({
  title,
  description,
  icon = 'inbox',
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const Icon = icon === 'search' ? SearchX : Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel border-dashed border-white/5">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        <Icon size={32} className="text-muted-foreground/50" />
      </div>
      <h3 className="text-xl font-black tracking-tight mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
