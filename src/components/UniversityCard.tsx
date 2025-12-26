import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Award, ChevronRight } from 'lucide-react';
import { University } from '@/types/university';

interface UniversityCardProps {
  university: University;
}

function getEarliestDeadline(uni: University): string {
  const deadlines = [
    uni.earlyDecisionI,
    uni.earlyDecisionII,
    uni.earlyActionI,
    uni.earlyActionII,
    uni.regularDecision,
  ].filter(d => d && d !== '-' && d !== 'N/A');
  
  return deadlines[0] || 'Check website';
}

function getAidStatus(uni: University): { label: string; type: 'success' | 'warning' | 'muted' } {
  const pct = uni.percentNeedMet;
  if (!pct || pct === 'N/A' || pct === 'Not Reported') {
    return { label: 'Aid info unavailable', type: 'muted' };
  }
  
  const pctNum = parseInt(pct);
  if (!isNaN(pctNum)) {
    if (pctNum >= 90) return { label: `${pctNum}% need met`, type: 'success' };
    if (pctNum >= 70) return { label: `${pctNum}% need met`, type: 'warning' };
  }
  
  return { label: pct, type: 'muted' };
}

function getFeeStatus(uni: University): { label: string; isFree: boolean } {
  if (uni.freeApplication) {
    return { label: 'Free Application', isFree: true };
  }
  return { label: 'Application Fee', isFree: false };
}

export function UniversityCard({ university }: UniversityCardProps) {
  const deadline = getEarliestDeadline(university);
  const aidStatus = getAidStatus(university);
  const feeStatus = getFeeStatus(university);
  
  return (
    <Link
      to={`/university/${university.id}`}
      className="card-editorial group block rounded-xl overflow-hidden"
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h3 className="heading-card text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
              {university.institution}
            </h3>
            {(university.city || university.state) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  {[university.city, university.state].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Deadline badge */}
          <span className="badge-premium">
            <Calendar className="w-3 h-3 mr-1" />
            {deadline}
          </span>

          {/* Fee badge */}
          <span className={feeStatus.isFree ? 'badge-success' : 'badge-subtle'}>
            <DollarSign className="w-3 h-3 mr-1" />
            {feeStatus.label}
          </span>

          {/* Aid badge */}
          <span className={`inline-flex items-center px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full ${
            aidStatus.type === 'success' 
              ? 'bg-success/10 text-success border border-success/20' 
              : aidStatus.type === 'warning'
              ? 'bg-warning/10 text-warning border border-warning/20'
              : 'bg-muted text-muted-foreground'
          }`}>
            <Award className="w-3 h-3 mr-1" />
            {aidStatus.label}
          </span>

          {/* Essay badge */}
          {university.noSupplementalEssays && (
            <span className="badge-success">
              No Essays
            </span>
          )}
        </div>

        {/* Stats preview */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div className="stat-display">
            <span className="stat-value text-xl">
              {university.overallAcceptanceRate || '—'}
            </span>
            <span className="stat-label text-xs">Acceptance</span>
          </div>
          <div className="stat-display">
            <span className="stat-value text-xl">
              {university.totalEnrollment ? `${parseInt(university.totalEnrollment.replace(/,/g, '')).toLocaleString()}` : '—'}
            </span>
            <span className="stat-label text-xs">Students</span>
          </div>
          <div className="stat-display">
            <span className="stat-value text-xl">
              {university.percentInternational || '—'}
            </span>
            <span className="stat-label text-xs">Int'l</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
