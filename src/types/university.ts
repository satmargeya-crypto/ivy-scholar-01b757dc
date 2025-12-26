export interface University {
  id: string;
  institution: string;
  edAcceptanceRate: string;
  overallAcceptanceRate: string;
  regularAcceptanceRate: string;
  percentSubmittingSAT: string;
  percentSubmittingACT: string;
  satMath: string;
  satRW: string;
  act: string;
  internationalAcceptanceRate: string;
  demonstratedInterest: string;
  earlyDecisionI: string;
  earlyDecisionII: string;
  earlyActionI: string;
  earlyActionII: string;
  regularDecision: string;
  costOfAttendance: string;
  percentMeritAid: string;
  avgMeritAward: string;
  percentNeedMet: string;
  avgNeedBasedGrant: string;
  percentOnCampus: string;
  housingRequirement: string;
  medianEarnings6Years: string;
  medianEarnings10Years: string;
  netROI20Years: string;
  freshmanRetention: string;
  graduationRate4Year: string;
  graduationRate6Year: string;
  notableScholarships: string;
  csMedianSalary: string;
  city: string;
  state: string;
  avgJanTemp: string;
  avgAprilTemp: string;
  avgJulyTemp: string;
  avgOctTemp: string;
  daysWithPrecipitation: string;
  sunnyDays: string;
  totalEnrollment: string;
  percentFemale: string;
  percentMale: string;
  percentAfricanAmerican: string;
  percentAsian: string;
  percentHispanic: string;
  percentWhite: string;
  percentUnknown: string;
  percentInternational: string;
  // From extras CSV
  noSupplementalEssays?: boolean;
  freeApplication?: boolean;
  // Parsed numeric values for filtering
  parsedAcceptanceRate?: number;
  parsedEDAcceptanceRate?: number;
  parsedRegularAcceptanceRate?: number;
  parsedCostOfAttendance?: number;
  parsedPercentNeedMet?: number;
  parsedAvgMeritAward?: number;
  parsedPercentMeritAid?: number;
  parsedNetROI?: number;
  parsedMedianEarnings10Years?: number;
  parsedGraduationRate4Year?: number;
  parsedGraduationRate6Year?: number;
  parsedFreshmanRetention?: number;
  parsedTotalEnrollment?: number;
  parsedPercentInternational?: number;
  parsedPercentOnCampus?: number;
  parsedSunnyDays?: number;
  parsedDaysWithPrecipitation?: number;
  parsedJanTemp?: number;
  parsedSATMathLow?: number;
  parsedSATMathHigh?: number;
  parsedSATRWLow?: number;
  parsedSATRWHigh?: number;
  parsedACTLow?: number;
  parsedACTHigh?: number;
}

export interface DeadlineRange {
  label: string;
  start: Date;
  end: Date;
}

export interface FilterState {
  search: string;
  // Deadline filters
  deadlineRange: string | null;
  hasED1: boolean | null;
  hasED2: boolean | null;
  hasEA1: boolean | null;
  hasEA2: boolean | null;
  // Admissions & Selectivity
  acceptanceRateMin: number | null;
  acceptanceRateMax: number | null;
  satScoreMin: number | null;
  satScoreMax: number | null;
  actScoreMin: number | null;
  actScoreMax: number | null;
  testOptional: boolean | null;
  demonstratedInterest: string[] | null;
  // Financials
  costOfAttendanceMax: number | null;
  percentNeedMetMin: number | null;
  avgMeritAwardMin: number | null;
  percentMeritAidMin: number | null;
  netROIMin: number | null;
  medianEarnings10YearsMin: number | null;
  // Location
  state: string | null;
  sunnyDaysMin: number | null;
  precipitationDaysMax: number | null;
  janTempMin: number | null;
  // Student Body
  enrollmentMin: number | null;
  enrollmentMax: number | null;
  percentInternationalMin: number | null;
  // Academic Outcomes
  graduationRate4YearMin: number | null;
  freshmanRetentionMin: number | null;
  // Campus Life
  housingRequirement: string | null;
  percentOnCampusMin: number | null;
  // Quick filters
  aidAvailable: boolean | null;
  freeApplication: boolean | null;
  noEssays: boolean | null;
}

export const DEADLINE_RANGES: DeadlineRange[] = [
  { label: 'Jan 1 – Jan 5', start: new Date(2025, 0, 1), end: new Date(2025, 0, 5) },
  { label: 'Jan 6 – Jan 10', start: new Date(2025, 0, 6), end: new Date(2025, 0, 10) },
  { label: 'Jan 11 – Jan 15', start: new Date(2025, 0, 11), end: new Date(2025, 0, 15) },
  { label: 'Jan 16 – Feb 1', start: new Date(2025, 0, 16), end: new Date(2025, 1, 1) },
  { label: 'Feb 1 – Late', start: new Date(2025, 1, 1), end: new Date(2025, 11, 31) },
];

export const DEMONSTRATED_INTEREST_OPTIONS = [
  'Very Important',
  'Important', 
  'Considered',
  'Not Considered'
];

export const HOUSING_REQUIREMENT_OPTIONS = [
  'Through Freshman Year',
  'Through Sophomore Year',
  'Through Junior Year',
  'Through Senior Year'
];

export const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  deadlineRange: null,
  hasED1: null,
  hasED2: null,
  hasEA1: null,
  hasEA2: null,
  acceptanceRateMin: null,
  acceptanceRateMax: null,
  satScoreMin: null,
  satScoreMax: null,
  actScoreMin: null,
  actScoreMax: null,
  testOptional: null,
  demonstratedInterest: null,
  costOfAttendanceMax: null,
  percentNeedMetMin: null,
  avgMeritAwardMin: null,
  percentMeritAidMin: null,
  netROIMin: null,
  medianEarnings10YearsMin: null,
  state: null,
  sunnyDaysMin: null,
  precipitationDaysMax: null,
  janTempMin: null,
  enrollmentMin: null,
  enrollmentMax: null,
  percentInternationalMin: null,
  graduationRate4YearMin: null,
  freshmanRetentionMin: null,
  housingRequirement: null,
  percentOnCampusMin: null,
  aidAvailable: null,
  freeApplication: null,
  noEssays: null,
};