import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchBar } from '@/components/SearchBar';
import { FilterSidebar } from '@/components/FilterSidebar';
import { UniversityCard } from '@/components/UniversityCard';
import { LoadingState, UniversityCardSkeleton } from '@/components/LoadingState';
import { useUniversities, useFilteredUniversities, useUniqueStates } from '@/hooks/useUniversities';
import { FilterState } from '@/types/university';
import { Filter, X } from 'lucide-react';

export default function Universities() {
  const { universities, loading, error } = useUniversities();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    deadlineRange: null,
    aidAvailable: searchParams.get('filter') === 'aid' ? true : null,
    freeApplication: searchParams.get('filter') === 'free' ? true : null,
    noEssays: searchParams.get('filter') === 'noessays' ? true : null,
    testOptional: null,
    state: null,
  });

  const states = useUniqueStates(universities);
  const filteredUniversities = useFilteredUniversities(universities, filters);

  // Update search param when search changes
  useEffect(() => {
    if (filters.search) {
      searchParams.set('search', filters.search);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams, { replace: true });
  }, [filters.search]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

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
      
      <main className="flex-1 bg-muted/20">
        {/* Page Header */}
        <div className="bg-background border-b border-border/50">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="heading-section text-foreground mb-4">
              Browse Universities
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our comprehensive database of universities. Use the filters to find 
              the perfect schools for your application list.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Mobile Filter Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <SearchBar
                value={filters.search}
                onChange={(value) => handleFilterChange({ search: value })}
                placeholder="Search by name, city, or state..."
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border rounded-lg"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 bg-card border border-border/50 rounded-xl p-6">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  states={states}
                  totalCount={universities.length}
                  filteredCount={filteredUniversities.length}
                />
              </div>
            </aside>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-background">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-serif text-lg font-medium">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 overflow-auto max-h-[calc(100vh-80px)]">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    states={states}
                    totalCount={universities.length}
                    filteredCount={filteredUniversities.length}
                  />
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="mt-8 w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium"
                  >
                    Show {filteredUniversities.length} Results
                  </button>
                </div>
              </div>
            )}

            {/* University Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid gap-6">
                  {[...Array(6)].map((_, i) => (
                    <UniversityCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredUniversities.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="font-serif text-xl mb-2">No universities found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 stagger-children">
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
