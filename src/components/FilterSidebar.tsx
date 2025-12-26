import { FilterState, DEADLINE_RANGES } from '@/types/university';
import { FilterChip } from './FilterChip';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  states: string[];
  totalCount: number;
  filteredCount: number;
}

export function FilterSidebar({ 
  filters, 
  onFilterChange, 
  states,
  totalCount,
  filteredCount 
}: FilterSidebarProps) {
  const clearFilters = () => {
    onFilterChange({
      deadlineRange: null,
      aidAvailable: null,
      freeApplication: null,
      noEssays: null,
      testOptional: null,
      state: null,
    });
  };

  const hasActiveFilters = 
    filters.deadlineRange !== null ||
    filters.aidAvailable !== null ||
    filters.freeApplication !== null ||
    filters.noEssays !== null ||
    filters.testOptional !== null ||
    filters.state !== null;

  return (
    <div className="space-y-8">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-serif text-2xl font-medium">{filteredCount}</span>
          <span className="text-muted-foreground ml-2 text-sm">
            of {totalCount} universities
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Deadline Filters */}
      <div>
        <h4 className="text-caption mb-4">Deadline Window</h4>
        <div className="flex flex-wrap gap-2">
          {DEADLINE_RANGES.map(range => (
            <FilterChip
              key={range.label}
              label={range.label}
              active={filters.deadlineRange === range.label}
              onClick={() => 
                onFilterChange({ 
                  deadlineRange: filters.deadlineRange === range.label ? null : range.label 
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <h4 className="text-caption mb-4">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="Strong Aid"
            active={filters.aidAvailable === true}
            onClick={() => 
              onFilterChange({ 
                aidAvailable: filters.aidAvailable === true ? null : true 
              })
            }
          />
          <FilterChip
            label="Free Application"
            active={filters.freeApplication === true}
            onClick={() => 
              onFilterChange({ 
                freeApplication: filters.freeApplication === true ? null : true 
              })
            }
          />
          <FilterChip
            label="No Essays"
            active={filters.noEssays === true}
            onClick={() => 
              onFilterChange({ 
                noEssays: filters.noEssays === true ? null : true 
              })
            }
          />
          <FilterChip
            label="Test Optional"
            active={filters.testOptional === true}
            onClick={() => 
              onFilterChange({ 
                testOptional: filters.testOptional === true ? null : true 
              })
            }
          />
        </div>
      </div>

      {/* State Filter */}
      <div>
        <h4 className="text-caption mb-4">State</h4>
        <select
          value={filters.state || ''}
          onChange={(e) => onFilterChange({ state: e.target.value || null })}
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
        >
          <option value="">All States</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
