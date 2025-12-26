import { useState, useEffect, useMemo, useCallback } from 'react';
import { University, FilterState, DEFAULT_FILTER_STATE } from '@/types/university';
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
        
        let allUniversities: University[] = [];
        for (const csvContent of csvResults) {
          const parsed = parseMainCSV(csvContent);
          allUniversities = [...allUniversities, ...parsed];
        }
        
        const extras = parseExtrasCSV(extrasContent);
        allUniversities = mergeExtrasIntoUniversities(allUniversities, extras);
        allUniversities = deduplicateUniversities(allUniversities);
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
  
  const months: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const match = dateStr.match(/([A-Za-z]+)\s+(\d+)/);
  if (match) {
    const month = months[match[1]];
    const day = parseInt(match[2]);
    if (month !== undefined && !isNaN(day)) {
      return new Date(2025, month, day);
    }
  }
  
  return null;
}

function isInDeadlineRange(uni: University, rangeLabel: string): boolean {
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

function hasDeadlineType(uni: University, type: 'ED1' | 'ED2' | 'EA1' | 'EA2'): boolean {
  const field = {
    ED1: uni.earlyDecisionI,
    ED2: uni.earlyDecisionII,
    EA1: uni.earlyActionI,
    EA2: uni.earlyActionII,
  }[type];
  
  return !!field && field !== '-' && field !== 'N/A';
}

function hasAidAvailable(uni: University): boolean {
  const pct = uni.parsedPercentNeedMet;
  if (pct !== undefined && pct > 50) return true;
  
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
      
      // Deadline range filter
      if (filters.deadlineRange && !isInDeadlineRange(uni, filters.deadlineRange)) {
        return false;
      }
      
      // Deadline type filters
      if (filters.hasED1 === true && !hasDeadlineType(uni, 'ED1')) return false;
      if (filters.hasED2 === true && !hasDeadlineType(uni, 'ED2')) return false;
      if (filters.hasEA1 === true && !hasDeadlineType(uni, 'EA1')) return false;
      if (filters.hasEA2 === true && !hasDeadlineType(uni, 'EA2')) return false;
      
      // Acceptance rate filter
      if (filters.acceptanceRateMin !== null && uni.parsedAcceptanceRate !== undefined) {
        if (uni.parsedAcceptanceRate < filters.acceptanceRateMin) return false;
      }
      if (filters.acceptanceRateMax !== null && uni.parsedAcceptanceRate !== undefined) {
        if (uni.parsedAcceptanceRate > filters.acceptanceRateMax) return false;
      }
      
      // SAT score filter (check if user's score falls in school's range)
      if (filters.satScoreMin !== null) {
        const userScore = filters.satScoreMin;
        // User score should be >= school's 25th percentile (we use combined SAT)
        const schoolMin = (uni.parsedSATMathLow || 0) + (uni.parsedSATRWLow || 0);
        if (schoolMin > 0 && userScore < schoolMin * 0.9) return false; // 10% buffer
      }
      if (filters.satScoreMax !== null) {
        const userScore = filters.satScoreMax;
        const schoolMax = (uni.parsedSATMathHigh || 1600) + (uni.parsedSATRWHigh || 1600);
        if (schoolMax < 3200 && userScore > schoolMax * 1.1) return false;
      }
      
      // ACT score filter
      if (filters.actScoreMin !== null && uni.parsedACTLow !== undefined) {
        if (filters.actScoreMin < uni.parsedACTLow * 0.9) return false;
      }
      
      // Test optional filter
      if (filters.testOptional === true && !isTestOptional(uni)) {
        return false;
      }
      
      // Demonstrated interest filter
      if (filters.demonstratedInterest && filters.demonstratedInterest.length > 0) {
        if (!filters.demonstratedInterest.includes(uni.demonstratedInterest)) {
          return false;
        }
      }
      
      // Cost of attendance filter
      if (filters.costOfAttendanceMax !== null && uni.parsedCostOfAttendance !== undefined) {
        if (uni.parsedCostOfAttendance > filters.costOfAttendanceMax) return false;
      }
      
      // Percent need met filter
      if (filters.percentNeedMetMin !== null && uni.parsedPercentNeedMet !== undefined) {
        if (uni.parsedPercentNeedMet < filters.percentNeedMetMin) return false;
      }
      
      // Merit aid filters
      if (filters.avgMeritAwardMin !== null && uni.parsedAvgMeritAward !== undefined) {
        if (uni.parsedAvgMeritAward < filters.avgMeritAwardMin) return false;
      }
      if (filters.percentMeritAidMin !== null && uni.parsedPercentMeritAid !== undefined) {
        if (uni.parsedPercentMeritAid < filters.percentMeritAidMin) return false;
      }
      
      // ROI filters
      if (filters.netROIMin !== null && uni.parsedNetROI !== undefined) {
        if (uni.parsedNetROI < filters.netROIMin) return false;
      }
      if (filters.medianEarnings10YearsMin !== null && uni.parsedMedianEarnings10Years !== undefined) {
        if (uni.parsedMedianEarnings10Years < filters.medianEarnings10YearsMin) return false;
      }
      
      // State filter
      if (filters.state && uni.state !== filters.state) {
        return false;
      }
      
      // Weather filters
      if (filters.sunnyDaysMin !== null && uni.parsedSunnyDays !== undefined) {
        if (uni.parsedSunnyDays < filters.sunnyDaysMin) return false;
      }
      if (filters.precipitationDaysMax !== null && uni.parsedDaysWithPrecipitation !== undefined) {
        if (uni.parsedDaysWithPrecipitation > filters.precipitationDaysMax) return false;
      }
      if (filters.janTempMin !== null && uni.parsedJanTemp !== undefined) {
        if (uni.parsedJanTemp < filters.janTempMin) return false;
      }
      
      // Enrollment filter
      if (filters.enrollmentMin !== null && uni.parsedTotalEnrollment !== undefined) {
        if (uni.parsedTotalEnrollment < filters.enrollmentMin) return false;
      }
      if (filters.enrollmentMax !== null && uni.parsedTotalEnrollment !== undefined) {
        if (uni.parsedTotalEnrollment > filters.enrollmentMax) return false;
      }
      
      // International student filter
      if (filters.percentInternationalMin !== null && uni.parsedPercentInternational !== undefined) {
        if (uni.parsedPercentInternational < filters.percentInternationalMin) return false;
      }
      
      // Graduation rate filter
      if (filters.graduationRate4YearMin !== null && uni.parsedGraduationRate4Year !== undefined) {
        if (uni.parsedGraduationRate4Year < filters.graduationRate4YearMin) return false;
      }
      
      // Retention filter
      if (filters.freshmanRetentionMin !== null && uni.parsedFreshmanRetention !== undefined) {
        if (uni.parsedFreshmanRetention < filters.freshmanRetentionMin) return false;
      }
      
      // Housing requirement filter
      if (filters.housingRequirement && uni.housingRequirement) {
        if (!uni.housingRequirement.toLowerCase().includes(filters.housingRequirement.toLowerCase())) {
          return false;
        }
      }
      
      // On-campus filter
      if (filters.percentOnCampusMin !== null && uni.parsedPercentOnCampus !== undefined) {
        if (uni.parsedPercentOnCampus < filters.percentOnCampusMin) return false;
      }
      
      // Quick filters
      if (filters.aidAvailable === true && !hasAidAvailable(uni)) {
        return false;
      }
      if (filters.freeApplication === true && !uni.freeApplication) {
        return false;
      }
      if (filters.noEssays === true && !uni.noSupplementalEssays) {
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

export function useFilterStats(universities: University[]) {
  return useMemo(() => {
    let maxCost = 0;
    let maxEnrollment = 0;
    let maxMeritAward = 0;
    let maxNetROI = 0;
    let maxMedianEarnings = 0;
    
    universities.forEach(uni => {
      if (uni.parsedCostOfAttendance && uni.parsedCostOfAttendance > maxCost) {
        maxCost = uni.parsedCostOfAttendance;
      }
      if (uni.parsedTotalEnrollment && uni.parsedTotalEnrollment > maxEnrollment) {
        maxEnrollment = uni.parsedTotalEnrollment;
      }
      if (uni.parsedAvgMeritAward && uni.parsedAvgMeritAward > maxMeritAward) {
        maxMeritAward = uni.parsedAvgMeritAward;
      }
      if (uni.parsedNetROI && uni.parsedNetROI > maxNetROI) {
        maxNetROI = uni.parsedNetROI;
      }
      if (uni.parsedMedianEarnings10Years && uni.parsedMedianEarnings10Years > maxMedianEarnings) {
        maxMedianEarnings = uni.parsedMedianEarnings10Years;
      }
    });
    
    return {
      maxCost: Math.ceil(maxCost / 10000) * 10000,
      maxEnrollment: Math.ceil(maxEnrollment / 1000) * 1000,
      maxMeritAward: Math.ceil(maxMeritAward / 5000) * 5000,
      maxNetROI: Math.ceil(maxNetROI / 100000) * 100000,
      maxMedianEarnings: Math.ceil(maxMedianEarnings / 10000) * 10000,
    };
  }, [universities]);
}

export function useActiveFilterCount(filters: FilterState): number {
  return useMemo(() => {
    let count = 0;
    const skip = ['search'];
    
    for (const [key, value] of Object.entries(filters)) {
      if (skip.includes(key)) continue;
      if (value !== null && value !== undefined) {
        if (Array.isArray(value) && value.length > 0) count++;
        else if (!Array.isArray(value)) count++;
      }
    }
    
    return count;
  }, [filters]);
}