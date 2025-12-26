import { useState, useEffect, useMemo } from 'react';
import { University, FilterState } from '@/types/university';
import { parseMainCSV, parseExtrasCSV, mergeExtrasIntoUniversities, deduplicateUniversities } from '@/utils/csvParser';

const CSV_FILES = [
  '/data/universities-1.csv',
  '/data/universities-2.csv',
  '/data/universities-3.csv',
  '/data/universities-4.csv',
  '/data/universities-5.csv',
];

const EXTRAS_FILE = '/data/universities-extras.csv';

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Load all CSV files in parallel
        const csvPromises = CSV_FILES.map(file =>
          fetch(file).then(res => {
            if (!res.ok) throw new Error(`Failed to load ${file}`);
            return res.text();
          })
        );
        
        const extrasPromise = fetch(EXTRAS_FILE).then(res => {
          if (!res.ok) throw new Error(`Failed to load extras`);
          return res.text();
        });
        
        const [csvResults, extrasContent] = await Promise.all([
          Promise.all(csvPromises),
          extrasPromise,
        ]);
        
        // Parse all CSVs
        let allUniversities: University[] = [];
        for (const csvContent of csvResults) {
          const parsed = parseMainCSV(csvContent);
          allUniversities = [...allUniversities, ...parsed];
        }
        
        // Parse extras
        const extras = parseExtrasCSV(extrasContent);
        
        // Merge extras and deduplicate
        allUniversities = mergeExtrasIntoUniversities(allUniversities, extras);
        allUniversities = deduplicateUniversities(allUniversities);
        
        // Sort alphabetically
        allUniversities.sort((a, b) => a.institution.localeCompare(b.institution));
        
        setUniversities(allUniversities);
        setError(null);
      } catch (err) {
        console.error('Error loading universities:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return { universities, loading, error };
}

function parseDeadline(dateStr: string): Date | null {
  if (!dateStr || dateStr === '-' || dateStr === 'N/A') return null;
  
  // Handle formats like "Nov 1", "Jan 15", etc.
  const months: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const match = dateStr.match(/([A-Za-z]+)\s+(\d+)/);
  if (match) {
    const month = months[match[1]];
    const day = parseInt(match[2]);
    if (month !== undefined && !isNaN(day)) {
      // Use 2025 as the year for comparison
      return new Date(2025, month, day);
    }
  }
  
  return null;
}

function isInDeadlineRange(uni: University, rangeLabel: string): boolean {
  // Check all deadline fields
  const deadlines = [
    uni.earlyDecisionI,
    uni.earlyDecisionII,
    uni.earlyActionI,
    uni.earlyActionII,
    uni.regularDecision,
  ];
  
  const ranges: Record<string, { start: Date; end: Date }> = {
    'Jan 1 – Jan 5': { start: new Date(2025, 0, 1), end: new Date(2025, 0, 5) },
    'Jan 6 – Jan 10': { start: new Date(2025, 0, 6), end: new Date(2025, 0, 10) },
    'Jan 11 – Jan 15': { start: new Date(2025, 0, 11), end: new Date(2025, 0, 15) },
    'Jan 16 – Feb 1': { start: new Date(2025, 0, 16), end: new Date(2025, 1, 1) },
    'Feb 1 – Late': { start: new Date(2025, 1, 1), end: new Date(2025, 11, 31) },
  };
  
  const range = ranges[rangeLabel];
  if (!range) return true;
  
  for (const dl of deadlines) {
    const parsed = parseDeadline(dl);
    if (parsed && parsed >= range.start && parsed <= range.end) {
      return true;
    }
  }
  
  return false;
}

function hasAidAvailable(uni: University): boolean {
  const pctNeed = uni.percentNeedMet;
  if (pctNeed && pctNeed !== 'N/A' && pctNeed !== 'Not Reported') {
    const pct = parseInt(pctNeed);
    if (!isNaN(pct) && pct > 50) return true;
  }
  
  const intlRate = uni.internationalAcceptanceRate;
  if (intlRate && intlRate !== 'N/A' && intlRate !== 'Not Reported') {
    return true;
  }
  
  return false;
}

function isTestOptional(uni: University): boolean {
  const satPct = uni.percentSubmittingSAT?.toLowerCase() || '';
  const actPct = uni.percentSubmittingACT?.toLowerCase() || '';
  
  if (satPct.includes('blind') || actPct.includes('blind')) return true;
  if (satPct === 'test blind' || actPct === 'test blind') return true;
  
  // If submission rates are low, likely test optional
  const satNum = parseInt(satPct);
  const actNum = parseInt(actPct);
  if (!isNaN(satNum) && !isNaN(actNum) && satNum < 30 && actNum < 30) return true;
  
  return false;
}

export function useFilteredUniversities(universities: University[], filters: FilterState) {
  return useMemo(() => {
    return universities.filter(uni => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesSearch = 
          uni.institution.toLowerCase().includes(search) ||
          uni.city.toLowerCase().includes(search) ||
          uni.state.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }
      
      // Deadline filter
      if (filters.deadlineRange && !isInDeadlineRange(uni, filters.deadlineRange)) {
        return false;
      }
      
      // Aid filter
      if (filters.aidAvailable === true && !hasAidAvailable(uni)) {
        return false;
      }
      
      // Free application filter
      if (filters.freeApplication === true && !uni.freeApplication) {
        return false;
      }
      
      // No essays filter
      if (filters.noEssays === true && !uni.noSupplementalEssays) {
        return false;
      }
      
      // Test optional filter
      if (filters.testOptional === true && !isTestOptional(uni)) {
        return false;
      }
      
      // State filter
      if (filters.state && uni.state !== filters.state) {
        return false;
      }
      
      return true;
    });
  }, [universities, filters]);
}

export function useUniqueStates(universities: University[]): string[] {
  return useMemo(() => {
    const states = new Set<string>();
    universities.forEach(uni => {
      if (uni.state && uni.state.trim()) {
        states.add(uni.state.trim());
      }
    });
    return Array.from(states).sort();
  }, [universities]);
}
