import { University } from '@/types/university';

function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

// Parse percentage string like "62%" to number 62
function parsePercent(value: string): number | undefined {
  if (!value || value === '-' || value === 'N/A' || value === 'Not Reported') return undefined;
  const match = value.match(/(\d+)/);
  if (match) {
    return parseInt(match[1]);
  }
  return undefined;
}

// Parse currency string like "$68,622" to number 68622
function parseCurrency(value: string): number | undefined {
  if (!value || value === '-' || value === 'N/A' || value === 'Not Reported') return undefined;
  // Handle ranges like "$24,997 (IS) / $43,287 (OS)" - take the first value
  const firstValue = value.split('/')[0].trim();
  const match = firstValue.replace(/[$,]/g, '').match(/(\d+)/);
  if (match) {
    return parseInt(match[1]);
  }
  return undefined;
}

// Parse number with commas like "1,171" to number 1171
function parseNumber(value: string): number | undefined {
  if (!value || value === '-' || value === 'N/A' || value === 'Not Reported') return undefined;
  const cleaned = value.replace(/,/g, '');
  const num = parseInt(cleaned);
  return isNaN(num) ? undefined : num;
}

// Parse score range like "540-640" to [540, 640]
function parseScoreRange(value: string): [number | undefined, number | undefined] {
  if (!value || value === '-' || value === 'N/A') return [undefined, undefined];
  const match = value.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2])];
  }
  return [undefined, undefined];
}

// Parse temperature string like "52°/33°" to get the high temp
function parseTemp(value: string): number | undefined {
  if (!value || value === '-' || value === 'N/A') return undefined;
  const match = value.match(/(\d+)°/);
  if (match) {
    return parseInt(match[1]);
  }
  return undefined;
}

export function parseMainCSV(csvContent: string): University[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const universities: University[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 10 || !values[0]) continue;
    
    const [satMathLow, satMathHigh] = parseScoreRange(values[6] || '');
    const [satRWLow, satRWHigh] = parseScoreRange(values[7] || '');
    const [actLow, actHigh] = parseScoreRange(values[8] || '');
    
    const university: University = {
      id: generateId(values[0]),
      institution: values[0] || '',
      edAcceptanceRate: values[1] || '',
      overallAcceptanceRate: values[2] || '',
      regularAcceptanceRate: values[3] || '',
      percentSubmittingSAT: values[4] || '',
      percentSubmittingACT: values[5] || '',
      satMath: values[6] || '',
      satRW: values[7] || '',
      act: values[8] || '',
      internationalAcceptanceRate: values[9] || '',
      demonstratedInterest: values[10] || '',
      earlyDecisionI: values[11] || '',
      earlyDecisionII: values[12] || '',
      earlyActionI: values[13] || '',
      earlyActionII: values[14] || '',
      regularDecision: values[15] || '',
      costOfAttendance: values[16] || '',
      percentMeritAid: values[17] || '',
      avgMeritAward: values[18] || '',
      percentNeedMet: values[19] || '',
      avgNeedBasedGrant: values[20] || '',
      percentOnCampus: values[21] || '',
      housingRequirement: values[22] || '',
      medianEarnings6Years: values[23] || '',
      medianEarnings10Years: values[24] || '',
      netROI20Years: values[25] || '',
      freshmanRetention: values[26] || '',
      graduationRate4Year: values[27] || '',
      graduationRate6Year: values[28] || '',
      notableScholarships: values[29] || '',
      csMedianSalary: values[30] || '',
      city: values[31] || '',
      state: values[32] || '',
      avgJanTemp: values[33] || '',
      avgAprilTemp: values[34] || '',
      avgJulyTemp: values[35] || '',
      avgOctTemp: values[36] || '',
      daysWithPrecipitation: values[37] || '',
      sunnyDays: values[38] || '',
      totalEnrollment: values[39] || '',
      percentFemale: values[40] || '',
      percentMale: values[41] || '',
      percentAfricanAmerican: values[42] || '',
      percentAsian: values[43] || '',
      percentHispanic: values[44] || '',
      percentWhite: values[45] || '',
      percentUnknown: values[46] || '',
      percentInternational: values[47] || '',
      // Parsed numeric values for filtering
      parsedAcceptanceRate: parsePercent(values[2]),
      parsedEDAcceptanceRate: parsePercent(values[1]),
      parsedRegularAcceptanceRate: parsePercent(values[3]),
      parsedCostOfAttendance: parseCurrency(values[16]),
      parsedPercentNeedMet: parsePercent(values[19]),
      parsedAvgMeritAward: parseCurrency(values[18]),
      parsedPercentMeritAid: parsePercent(values[17]),
      parsedNetROI: parseCurrency(values[25]),
      parsedMedianEarnings10Years: parseCurrency(values[24]),
      parsedGraduationRate4Year: parsePercent(values[27]),
      parsedGraduationRate6Year: parsePercent(values[28]),
      parsedFreshmanRetention: parsePercent(values[26]),
      parsedTotalEnrollment: parseNumber(values[39]),
      parsedPercentInternational: parsePercent(values[47]),
      parsedPercentOnCampus: parsePercent(values[21]),
      parsedSunnyDays: parseNumber(values[38]),
      parsedDaysWithPrecipitation: parseNumber(values[37]),
      parsedJanTemp: parseTemp(values[33]),
      parsedSATMathLow: satMathLow,
      parsedSATMathHigh: satMathHigh,
      parsedSATRWLow: satRWLow,
      parsedSATRWHigh: satRWHigh,
      parsedACTLow: actLow,
      parsedACTHigh: actHigh,
    };
    
    universities.push(university);
  }
  
  return universities;
}

export function parseExtrasCSV(csvContent: string): Map<string, { noEssays: boolean; freeApp: boolean }> {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const extras = new Map<string, { noEssays: boolean; freeApp: boolean }>();
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (!values[0]) continue;
    
    const name = values[0].toLowerCase().trim();
    extras.set(name, {
      noEssays: values[1]?.toLowerCase() === 'yes',
      freeApp: values[2]?.toLowerCase() === 'yes',
    });
  }
  
  return extras;
}

export function mergeExtrasIntoUniversities(
  universities: University[],
  extras: Map<string, { noEssays: boolean; freeApp: boolean }>
): University[] {
  return universities.map(uni => {
    const name = uni.institution.toLowerCase().trim();
    const extra = extras.get(name);
    
    if (extra) {
      return {
        ...uni,
        noSupplementalEssays: extra.noEssays,
        freeApplication: extra.freeApp,
      };
    }
    
    return uni;
  });
}

export function deduplicateUniversities(universities: University[]): University[] {
  const seen = new Map<string, University>();
  
  for (const uni of universities) {
    const key = uni.id;
    if (!seen.has(key)) {
      seen.set(key, uni);
    }
  }
  
  return Array.from(seen.values());
}