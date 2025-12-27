import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchBar } from '@/components/SearchBar';
import { FilterSidebar } from '@/components/FilterSidebar';
import { UniversityCard } from '@/components/UniversityCard';
import { StickyFilterBar } from '@/components/StickyFilterBar';
import { UniversityCardSkeleton } from '@/components/LoadingState';
import { useUniversities, useFilteredUniversities, useUniqueStates, useFilterStats, useActiveFilterCount } from '@/hooks/useUniversities';
import { FilterState, DEFAULT_FILTER_STATE } from '@/types/university';
import { Filter, X } from 'lucide-react';

export default function Universities() {
  const { universities, loading, error } = useUniversities();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>(() => {
    const initial = { ...DEFAULT_FILTER_STATE };
    initial.search = searchParams.get('search') || '';
    if (searchParams.get('filter') === 'aid') initial.aidAvailable = true;
    if (searchParams.get('filter') === 'free') initial.freeApplication = true;
    if (searchParams.get('filter') === 'noessays') initial.noEssays = true;
    return initial;
  });

  const states = useUniqueStates(universities);
  const filterStats = useFilterStats(universities);
  const filteredUniversities = useFilteredUniversities(universities, filters);
  const activeFilterCount = useActiveFilterCount(filters);

  useEffect(() => {
    if (filters.search) {
      searchParams.set('search', filters.search);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams, { replace: true });
  }, [filters.search]);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTER_STATE, search: filters.search });
  }, [filters.search]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-2xl mb-2">Unable to load data</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Sticky Filter Bar */}
      <StickyFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        filteredCount={filteredUniversities.length}
        totalCount={universities.length}
      />
      
      <main className="flex-1 bg-secondary/30">
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 md:py-10">
            <h1 className="heading-section text-foreground mb-3">
              Browse Universities
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm">
              Sorted by closest deadline. Universities with approaching deadlines appear first.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar
                value={filters.search}
                onChange={(value) => handleFilterChange({ search: value })}
                placeholder="Search by name, city, or state..."
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border rounded-lg text-sm font-medium"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              {activeFilterCount > 0 && (
                <span className="bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-36 bg-card border border-border rounded-xl p-5 max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                  states={states}
                  filterStats={filterStats}
                  totalCount={universities.length}
                  filteredCount={filteredUniversities.length}
                  activeFilterCount={activeFilterCount}
                />
              </div>
            </aside>

            {showMobileFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-background">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-serif text-lg font-medium">Advanced Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5 overflow-auto max-h-[calc(100vh-140px)]">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                    states={states}
                    filterStats={filterStats}
                    totalCount={universities.length}
                    filteredCount={filteredUniversities.length}
                    activeFilterCount={activeFilterCount}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm"
                  >
                    Show {filteredUniversities.length} Results
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1">
              {loading ? (
                <div className="grid gap-4">
                  {[...Array(6)].map((_, i) => (
                    <UniversityCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredUniversities.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="font-serif text-xl mb-2">No universities found</h3>
                  <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredUniversities.map(university => (
                    <UniversityCard key={university.id} university={university} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}