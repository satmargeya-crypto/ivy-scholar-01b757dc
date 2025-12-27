import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Globe, FileText, DollarSign } from 'lucide-react';
import { University } from '@/types/university';
import { useMemo } from 'react';

interface UniversityCardProps {
  university: University;
}

function parseDeadlineDate(dateStr: string): Date | null {
  if (!dateStr || dateStr === '-' || dateStr === 'N/A') return null;
  
  const months: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const match = dateStr.match(/([A-Za-z]+)\s*(\d+)/);
  if (match) {
    const month = months[match[1]];
    const day = parseInt(match[2]);
    if (month !== undefined && !isNaN(day)) {
      const now = new Date();
      let year = now.getFullYear();
      const deadlineDate = new Date(year, month, day);
      if (deadlineDate < now) {
        year++;
      }
      return new Date(year, month, day);
    }
  }
  
  return null;
}

function getDaysLeft(uni: University): { days: number; deadline: string; type: string } | null {
  const deadlines = [
    { date: uni.regularDecision, type: 'Regular Decision' },
    { date: uni.earlyDecisionII, type: 'ED2' },
    { date: uni.earlyDecisionI, type: 'ED1' },
    { date: uni.earlyActionI, type: 'EA1' },
    { date: uni.earlyActionII, type: 'EA2' },
  ];
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  let closest: { days: number; deadline: string; type: string } | null = null;
  
  for (const dl of deadlines) {
    const parsed = parseDeadlineDate(dl.date);
    if (parsed) {
      const diffTime = parsed.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0 && (!closest || diffDays < closest.days)) {
        closest = { days: diffDays, deadline: dl.date, type: dl.type };
      }
    }
  }
  
  return closest;
}

function getDaysLeftColor(days: number): string {
  if (days < 5) return 'text-destructive';
  if (days <= 10) return 'text-warning';
  return 'text-muted-foreground';
}

function getDaysLeftBg(days: number): string {
  if (days < 5) return 'bg-destructive/10 border-destructive/20';
  if (days <= 10) return 'bg-warning/10 border-warning/20';
  return 'bg-muted/50 border-border';
}

export function UniversityCard({ university }: UniversityCardProps) {
  const daysLeftInfo = useMemo(() => getDaysLeft(university), [university]);
  
  return (
    <Link
      to={`/university/${university.id}`}
      className="card-editorial group block rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      <div className="p-6 md:p-7">
        {/* Header with Days Left */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-300 leading-tight">
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
          
          {/* Big Days Left Badge */}
          {daysLeftInfo && (
            <div className={`flex flex-col items-center px-4 py-3 rounded-xl border ${getDaysLeftBg(daysLeftInfo.days)}`}>
              <span className={`text-2xl md:text-3xl font-bold tabular-nums ${getDaysLeftColor(daysLeftInfo.days)}`}>
                {daysLeftInfo.days}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                days left
              </span>
            </div>
          )}
        </div>

        {/* Application Type & Deadline */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {daysLeftInfo && (
            <>
              <span className="badge-premium">
                {daysLeftInfo.type}
              </span>
              <span className="text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 inline mr-1" />
                {daysLeftInfo.deadline}
              </span>
            </>
          )}
        </div>

        {/* Key Info Badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {/* Fee Status */}
          {university.freeApplication && (
            <span className="badge-success">
              <DollarSign className="w-3 h-3 mr-1" />
              Free Scoir Application
            </span>
          )}
          
          {/* Essay Status */}
          {university.noSupplementalEssays && (
            <span className="badge-success">
              <FileText className="w-3 h-3 mr-1" />
              No Supplement Essay
            </span>
          )}
        </div>

        {/* Acceptance Rates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="stat-display p-3 rounded-lg bg-muted/30">
            <span className="stat-value text-lg font-semibold">
              {university.overallAcceptanceRate || '—'}
            </span>
            <span className="stat-label text-[10px] uppercase tracking-wider">Overall Accept</span>
          </div>
          <div className="stat-display p-3 rounded-lg bg-muted/30">
            <span className="stat-value text-lg font-semibold">
              {university.regularAcceptanceRate || '—'}
            </span>
            <span className="stat-label text-[10px] uppercase tracking-wider">Regular Accept</span>
          </div>
          <div className="stat-display p-3 rounded-lg bg-muted/30">
            <span className="stat-value text-lg font-semibold">
              {university.edAcceptanceRate || '—'}
            </span>
            <span className="stat-label text-[10px] uppercase tracking-wider">ED Accept</span>
          </div>
          <div className="stat-display p-3 rounded-lg bg-muted/30">
            <span className="stat-value text-lg font-semibold">
              {university.internationalAcceptanceRate || '—'}
            </span>
            <span className="stat-label text-[10px] uppercase tracking-wider">Int'l Accept</span>
          </div>
        </div>

        {/* International Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>{university.percentInternational || '—'} International</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{university.totalEnrollment ? parseInt(university.totalEnrollment.replace(/,/g, '')).toLocaleString() : '—'} Students</span>
            </div>
          </div>
          <span className="text-xs text-accent font-medium group-hover:translate-x-1 transition-transform">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}