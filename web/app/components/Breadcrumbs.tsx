'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-sm ${className}`}>
            <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                aria-label="Home"
            >
                <Home size={14} />
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={item.label} className="flex items-center gap-1.5">
                        <ChevronRight size={12} className="text-muted-foreground/50" />
                        {isLast || !item.href ? (
                            <span className="font-bold text-foreground tracking-tight">{item.label}</span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
