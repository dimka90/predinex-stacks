'use client';

import { CheckCircle, Clock, XCircle, Grid3X3 } from 'lucide-react';
import { StatusFilter } from '../lib/market-types';

interface FilterControlsProps {
  selectedStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  counts?: {
    all: number;
    active: number;
    settled: number;
    expired: number;
  };
  isVerifiedOnly?: boolean;
  onVerifiedChange?: (verified: boolean) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  isMyBetsOnly?: boolean;
  onMyBetsChange?: (myBets: boolean) => void;
}

interface FilterOption {
  value: StatusFilter;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const filterOptions: FilterOption[] = [
  {
    value: 'all',
    label: 'All Markets',
    icon: <Grid3X3 className="w-4 h-4" />,
    description: 'Show all markets regardless of status'
  },
  {
    value: 'active',
    label: 'Active',
    icon: <Clock className="w-4 h-4" />,
    description: 'Markets currently accepting bets'
  },
  {
    value: 'settled',
    label: 'Settled',
    icon: <CheckCircle className="w-4 h-4" />,
    description: 'Markets with determined outcomes'
  },
  {
    value: 'expired',
    label: 'Expired',
    icon: <XCircle className="w-4 h-4" />,
    description: 'Markets past expiry without settlement'
  }
];

export default function FilterControls({
  selectedStatus,
  onStatusChange,
  counts,
  isVerifiedOnly = false,
  onVerifiedChange,
  selectedCategory = 'All',
  onCategoryChange,
  isMyBetsOnly = false,
  onMyBetsChange
}: FilterControlsProps) {
  const categories = ['All', 'Crypto', 'Sports', 'Politics', 'Tech', 'Culture'];

  const getFilterColor = (status: StatusFilter, isSelected: boolean) => {
    if (!isSelected) {
      return 'text-muted-foreground hover:text-foreground border-muted/30 hover:border-muted/50';
    }

    switch (status) {
      case 'all':
        return 'text-primary border-primary bg-primary/10';
      case 'active':
        return 'text-green-500 border-green-500 bg-green-500/10';
      case 'settled':
        return 'text-blue-500 border-blue-500 bg-blue-500/10';
      case 'expired':
        return 'text-red-500 border-red-500 bg-red-500/10';
      default:
        return 'text-muted-foreground border-muted/30';
    }
  };

  const getCount = (status: StatusFilter): number => {
    if (!counts) return 0;
    return counts[status] || 0;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Filter by Status</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {filterOptions.map((option) => {
            const isSelected = selectedStatus === option.value;
            const count = getCount(option.value);

            return (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200
                  ${getFilterColor(option.value, isSelected)}
                  hover:scale-105 active:scale-95
                `}
                title={option.description}
              >
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span className="text-sm font-medium">{option.label}</span>
                </div>

                {counts && (
                  <span className="text-xs opacity-75">
                    {count} market{count !== 1 ? 's' : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-muted/20">
        {/* Category Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange?.(cat)}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-bold transition-all border
                  ${selectedCategory === cat
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-muted/30 border-muted/50 text-muted-foreground hover:border-muted'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Toggle */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Verification</label>
          <button
            onClick={() => onVerifiedChange?.(!isVerifiedOnly)}
            className={`
              flex items-center gap-3 w-full p-3 rounded-xl border transition-all
              ${isVerifiedOnly
                ? 'bg-accent/10 border-accent/50 text-accent'
                : 'bg-muted/30 border-muted/50 text-muted-foreground'
              }
            `}
          >
            <div className={`w-10 h-5 rounded-full relative transition-colors ${isVerifiedOnly ? 'bg-accent' : 'bg-muted'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isVerifiedOnly ? 'left-6' : 'left-1'}`} />
            </div>
            <span className="text-sm font-bold">Show Verified</span>
          </button>
        </div>

        {/* My Bets Toggle */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">My Positions</label>
          <button
            onClick={() => onMyBetsChange?.(!isMyBetsOnly)}
            className={`
              flex items-center gap-3 w-full p-3 rounded-xl border transition-all
              ${isMyBetsOnly
                ? 'bg-primary/10 border-primary/50 text-primary'
                : 'bg-muted/30 border-muted/50 text-muted-foreground'
              }
            `}
          >
            <div className={`w-10 h-5 rounded-full relative transition-colors ${isMyBetsOnly ? 'bg-primary' : 'bg-muted'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isMyBetsOnly ? 'left-6' : 'left-1'}`} />
            </div>
            <span className="text-sm font-bold">My Bets Only</span>
          </button>
        </div>
      </div>
    </div>
  );
}