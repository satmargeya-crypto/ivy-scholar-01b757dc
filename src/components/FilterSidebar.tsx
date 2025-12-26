import { FilterState, DEADLINE_RANGES, DEMONSTRATED_INTEREST_OPTIONS, HOUSING_REQUIREMENT_OPTIONS } from '@/types/university';
import { FilterChip } from './FilterChip';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useCallback } from 'react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  states: string[];
  filterStats: {
    maxCost: number;
    maxEnrollment: number;
    maxMeritAward: number;
    maxNetROI: number;
    maxMedianEarnings: number;
  };
  totalCount: number;
  filteredCount: number;
  activeFilterCount: number;
}

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = false, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="filter-section">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-1 mb-3"
      >
        <span className="filter-section-title mb-0">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div className="space-y-3">{children}</div>}
    </div>
  );
}

function RangeSlider({ 
  label, value, onChange, min, max, step = 1, format = (v: number) => v.toString() 
}: { 
  label: string; 
  value: number | null; 
  onChange: (v: number | null) => void; 
  min: number; 
  max: number; 
  step?: number;
  format?: (v: number) => string;
}) {
  const displayValue = value ?? min;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value !== null ? format(displayValue) : 'Any'}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={displayValue}
        onChange={(e) => {
          const v = parseInt(e.target.value);
          onChange(v === min ? null : v);
        }}
        className="range-slider"
      />
    </div>
  );
}

export function FilterSidebar({ 
  filters, 
  onFilterChange,
  onClearFilters,
  states,
  filterStats,
  totalCount,
  filteredCount,
  activeFilterCount
}: FilterSidebarProps) {

  return (
    <div className="space-y-1">
      {/* Results count */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
        <div>
          <span className="font-serif text-2xl font-semibold">{filteredCount}</span>
          <span className="text-muted-foreground ml-2 text-sm">of {totalCount}</span>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <FilterSection title="Quick Filters" defaultOpen={true}>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="Strong Aid"
            active={filters.aidAvailable === true}
            onClick={() => onFilterChange({ aidAvailable: filters.aidAvailable === true ? null : true })}
          />
          <FilterChip
            label="Free App"
            active={filters.freeApplication === true}
            onClick={() => onFilterChange({ freeApplication: filters.freeApplication === true ? null : true })}
          />
          <FilterChip
            label="No Essays"
            active={filters.noEssays === true}
            onClick={() => onFilterChange({ noEssays: filters.noEssays === true ? null : true })}
          />
          <FilterChip
            label="Test Optional"
            active={filters.testOptional === true}
            onClick={() => onFilterChange({ testOptional: filters.testOptional === true ? null : true })}
          />
        </div>
      </FilterSection>

      {/* Deadline Filters */}
      <FilterSection title="Deadlines" defaultOpen={true}>
        <div className="flex flex-wrap gap-2 mb-3">
          {DEADLINE_RANGES.map(range => (
            <FilterChip
              key={range.label}
              label={range.label}
              active={filters.deadlineRange === range.label}
              onClick={() => onFilterChange({ deadlineRange: filters.deadlineRange === range.label ? null : range.label })}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip label="ED I" active={filters.hasED1 === true} onClick={() => onFilterChange({ hasED1: filters.hasED1 === true ? null : true })} />
          <FilterChip label="ED II" active={filters.hasED2 === true} onClick={() => onFilterChange({ hasED2: filters.hasED2 === true ? null : true })} />
          <FilterChip label="EA I" active={filters.hasEA1 === true} onClick={() => onFilterChange({ hasEA1: filters.hasEA1 === true ? null : true })} />
          <FilterChip label="EA II" active={filters.hasEA2 === true} onClick={() => onFilterChange({ hasEA2: filters.hasEA2 === true ? null : true })} />
        </div>
      </FilterSection>

      {/* Admissions & Selectivity */}
      <FilterSection title="Admissions">
        <RangeSlider
          label="Min Acceptance Rate"
          value={filters.acceptanceRateMin}
          onChange={(v) => onFilterChange({ acceptanceRateMin: v })}
          min={0} max={100} step={5}
          format={(v) => `${v}%`}
        />
        <RangeSlider
          label="Max Acceptance Rate"
          value={filters.acceptanceRateMax}
          onChange={(v) => onFilterChange({ acceptanceRateMax: v })}
          min={0} max={100} step={5}
          format={(v) => `${v}%`}
        />
        <div className="pt-2">
          <label className="text-xs text-muted-foreground mb-2 block">Demonstrated Interest</label>
          <select
            value={filters.demonstratedInterest?.[0] || ''}
            onChange={(e) => onFilterChange({ demonstratedInterest: e.target.value ? [e.target.value] : null })}
            className="custom-select"
          >
            <option value="">Any</option>
            {DEMONSTRATED_INTEREST_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* Financials */}
      <FilterSection title="Financials">
        <RangeSlider
          label="Max Cost of Attendance"
          value={filters.costOfAttendanceMax}
          onChange={(v) => onFilterChange({ costOfAttendanceMax: v })}
          min={0} max={filterStats.maxCost || 100000} step={5000}
          format={(v) => `$${(v/1000).toFixed(0)}k`}
        />
        <RangeSlider
          label="Min % Need Met"
          value={filters.percentNeedMetMin}
          onChange={(v) => onFilterChange({ percentNeedMetMin: v })}
          min={0} max={100} step={5}
          format={(v) => `${v}%`}
        />
        <RangeSlider
          label="Min Merit Award"
          value={filters.avgMeritAwardMin}
          onChange={(v) => onFilterChange({ avgMeritAwardMin: v })}
          min={0} max={filterStats.maxMeritAward || 50000} step={5000}
          format={(v) => `$${(v/1000).toFixed(0)}k`}
        />
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location">
        <select
          value={filters.state || ''}
          onChange={(e) => onFilterChange({ state: e.target.value || null })}
          className="custom-select"
        >
          <option value="">All States</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <RangeSlider
          label="Min Sunny Days/Year"
          value={filters.sunnyDaysMin}
          onChange={(v) => onFilterChange({ sunnyDaysMin: v })}
          min={100} max={300} step={10}
          format={(v) => `${v} days`}
        />
        <RangeSlider
          label="Min Jan Temp (°F)"
          value={filters.janTempMin}
          onChange={(v) => onFilterChange({ janTempMin: v })}
          min={0} max={70} step={5}
          format={(v) => `${v}°F`}
        />
      </FilterSection>

      {/* Student Body */}
      <FilterSection title="Student Body">
        <RangeSlider
          label="Min Enrollment"
          value={filters.enrollmentMin}
          onChange={(v) => onFilterChange({ enrollmentMin: v })}
          min={0} max={filterStats.maxEnrollment || 50000} step={1000}
          format={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v.toString()}
        />
        <RangeSlider
          label="Max Enrollment"
          value={filters.enrollmentMax}
          onChange={(v) => onFilterChange({ enrollmentMax: v })}
          min={0} max={filterStats.maxEnrollment || 50000} step={1000}
          format={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v.toString()}
        />
        <RangeSlider
          label="Min % International"
          value={filters.percentInternationalMin}
          onChange={(v) => onFilterChange({ percentInternationalMin: v })}
          min={0} max={30} step={1}
          format={(v) => `${v}%`}
        />
      </FilterSection>

      {/* Academic Outcomes */}
      <FilterSection title="Outcomes">
        <RangeSlider
          label="Min 4-Year Grad Rate"
          value={filters.graduationRate4YearMin}
          onChange={(v) => onFilterChange({ graduationRate4YearMin: v })}
          min={0} max={100} step={5}
          format={(v) => `${v}%`}
        />
        <RangeSlider
          label="Min Freshman Retention"
          value={filters.freshmanRetentionMin}
          onChange={(v) => onFilterChange({ freshmanRetentionMin: v })}
          min={0} max={100} step={5}
          format={(v) => `${v}%`}
        />
      </FilterSection>

      {/* Campus Life */}
      <FilterSection title="Campus Life">
        <select
          value={filters.housingRequirement || ''}
          onChange={(e) => onFilterChange({ housingRequirement: e.target.value || null })}
          className="custom-select"
        >
          <option value="">Any Housing Requirement</option>
          {HOUSING_REQUIREMENT_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <RangeSlider
          label="Min % On-Campus"
          value={filters.percentOnCampusMin}
          onChange={(v) => onFilterChange({ percentOnCampusMin: v })}
          min={0} max={100} step={5}
          format={(v) => `${v}%`}
        />
      </FilterSection>
    </div>
  );
}