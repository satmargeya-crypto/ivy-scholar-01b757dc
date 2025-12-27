import { FilterState } from '@/types/university';
import { X, DollarSign, FileText, Calendar, Award, Globe } from 'lucide-react';

interface StickyFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  filteredCount: number;
  totalCount: number;
}

interface FilterChip {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  filterKey: keyof FilterState;
  value: boolean;
}

const QUICK_FILTERS: FilterChip[] = [
  { id: 'free', label: 'Free Scoir Application', icon: DollarSign, filterKey: 'freeApplication', value: true },
  { id: 'noessays', label: 'No Supplement Essay', icon: FileText, filterKey: 'noEssays', value: true },
  { id: 'aid', label: 'Strong Financial Aid', icon: Award, filterKey: 'aidAvailable', value: true },
  { id: 'ed2', label: 'ED2 Available', icon: Calendar, filterKey: 'hasED2', value: true },
  { id: 'intl', label: 'Int\'l Friendly', icon: Globe, filterKey: 'percentInternationalMin', value: true },
];

export function StickyFilterBar({ 
  filters, 
  onFilterChange, 
  filteredCount, 
  totalCount 
}: StickyFilterBarProps) {
  
  const toggleFilter = (filterKey: keyof FilterState) => {
    const currentValue = filters[filterKey];
    // Tap once to apply, tap again to remove
    if (currentValue === true || currentValue !== null) {
      onFilterChange({ [filterKey]: null });
    } else {
      if (filterKey === 'percentInternationalMin') {
        onFilterChange({ [filterKey]: 5 }); // At least 5% international
      } else {
        onFilterChange({ [filterKey]: true });
      }
    }
  };

  const isActive = (filterKey: keyof FilterState): boolean => {
    const value = filters[filterKey];
    return value === true || (typeof value === 'number' && value > 0);
  };

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
          {/* Results count */}
          <div className="flex-shrink-0 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredCount}</span>
            <span className="hidden sm:inline"> of {totalCount}</span>
          </div>
          
          <div className="h-6 w-px bg-border flex-shrink-0" />
          
          {/* Filter chips */}
          {QUICK_FILTERS.map(filter => {
            const active = isActive(filter.filterKey);
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.filterKey)}
                className={`
                  flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200 ease-out
                  ${active 
                    ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border/50'
                  }
                `}
              >
                <filter.icon className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{filter.label}</span>
                {active && (
                  <X className="w-3 h-3 ml-1 opacity-70" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}