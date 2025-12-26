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
}

export interface DeadlineRange {
  label: string;
  start: Date;
  end: Date;
}

export interface FilterState {
  search: string;
  deadlineRange: string | null;
  aidAvailable: boolean | null;
  freeApplication: boolean | null;
  noEssays: boolean | null;
  testOptional: boolean | null;
  state: string | null;
}

export const DEADLINE_RANGES: DeadlineRange[] = [
  { label: 'Jan 1 – Jan 5', start: new Date(2025, 0, 1), end: new Date(2025, 0, 5) },
  { label: 'Jan 6 – Jan 10', start: new Date(2025, 0, 6), end: new Date(2025, 0, 10) },
  { label: 'Jan 11 – Jan 15', start: new Date(2025, 0, 11), end: new Date(2025, 0, 15) },
  { label: 'Jan 16 – Feb 1', start: new Date(2025, 0, 16), end: new Date(2025, 1, 1) },
  { label: 'Feb 1 – Late', start: new Date(2025, 1, 1), end: new Date(2025, 11, 31) },
];
