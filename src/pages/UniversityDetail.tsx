import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoadingState } from '@/components/LoadingState';
import { useUniversities } from '@/hooks/useUniversities';
import { University } from '@/types/university';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  GraduationCap,
  Thermometer,
  Sun,
  Cloud,
  Award,
  TrendingUp,
  FileText
} from 'lucide-react';

function InfoSection({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="font-serif text-2xl font-medium mb-6 pb-3 border-b border-border/50">
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoItem({ 
  label, 
  value,
  icon
}: { 
  label: string; 
  value: string | undefined;
  icon?: React.ReactNode;
}) {
  if (!value || value === '-' || value === 'N/A' || value === 'Not Reported') {
    return null;
  }
  
  return (
    <div className="info-item">
      <div className="info-label flex items-center gap-2">
        {icon}
        {label}
      </div>
      <div className="info-value">{value}</div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon
}: {
  label: string;
  value: string | undefined;
  icon: React.ReactNode;
}) {
  const displayValue = value && value !== '-' && value !== 'N/A' && value !== 'Not Reported' 
    ? value 
    : '—';
    
  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 text-center">
      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <div className="font-serif text-2xl font-medium mb-1">{displayValue}</div>
      <div className="text-xs text-muted-foreground tracking-wider uppercase">{label}</div>
    </div>
  );
}

export default function UniversityDetail() {
  const { id } = useParams<{ id: string }>();
  const { universities, loading, error } = useUniversities();
  const [university, setUniversity] = useState<University | null>(null);

  useEffect(() => {
    if (!loading && universities.length > 0 && id) {
      const found = universities.find(u => u.id === id);
      setUniversity(found || null);
    }
  }, [universities, loading, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <LoadingState />
        <Footer />
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-2xl mb-2">University not found</h2>
            <p className="text-muted-foreground mb-4">
              {error || "We couldn't find the university you're looking for."}
            </p>
            <Link
              to="/universities"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all universities
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 border-b border-border/50">
          <div className="container mx-auto px-4 py-12 md:py-16">
            {/* Breadcrumb */}
            <Link
              to="/universities"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to universities
            </Link>

            {/* Title */}
            <h1 className="heading-display text-foreground mb-4 max-w-4xl">
              {university.institution}
            </h1>

            {/* Location */}
            {(university.city || university.state) && (
              <div className="flex items-center gap-2 text-muted-foreground text-lg mb-8">
                <MapPin className="w-5 h-5" />
                <span>
                  {[university.city, university.state].filter(Boolean).join(', ')}
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {university.noSupplementalEssays && (
                <span className="badge-success">
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  No Supplemental Essays
                </span>
              )}
              {university.freeApplication && (
                <span className="badge-success">
                  <DollarSign className="w-3.5 h-3.5 mr-1" />
                  Free Application
                </span>
              )}
              {university.percentNeedMet && 
               university.percentNeedMet !== 'N/A' && 
               university.percentNeedMet !== 'Not Reported' &&
               parseInt(university.percentNeedMet) >= 90 && (
                <span className="badge-premium">
                  <Award className="w-3.5 h-3.5 mr-1" />
                  {university.percentNeedMet} Need Met
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="py-12 border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <StatCard
                label="Acceptance Rate"
                value={university.overallAcceptanceRate}
                icon={<Users className="w-5 h-5 text-accent" />}
              />
              <StatCard
                label="Total Enrollment"
                value={university.totalEnrollment}
                icon={<GraduationCap className="w-5 h-5 text-accent" />}
              />
              <StatCard
                label="Int'l Students"
                value={university.percentInternational}
                icon={<Users className="w-5 h-5 text-accent" />}
              />
              <StatCard
                label="Retention Rate"
                value={university.freshmanRetention}
                icon={<TrendingUp className="w-5 h-5 text-accent" />}
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            
            {/* Deadlines */}
            <InfoSection title="Application Deadlines">
              <div className="info-grid">
                <InfoItem 
                  label="Early Decision I" 
                  value={university.earlyDecisionI}
                  icon={<Calendar className="w-3.5 h-3.5" />}
                />
                <InfoItem 
                  label="Early Decision II" 
                  value={university.earlyDecisionII}
                  icon={<Calendar className="w-3.5 h-3.5" />}
                />
                <InfoItem 
                  label="Early Action I" 
                  value={university.earlyActionI}
                  icon={<Calendar className="w-3.5 h-3.5" />}
                />
                <InfoItem 
                  label="Early Action II" 
                  value={university.earlyActionII}
                  icon={<Calendar className="w-3.5 h-3.5" />}
                />
                <InfoItem 
                  label="Regular Decision" 
                  value={university.regularDecision}
                  icon={<Calendar className="w-3.5 h-3.5" />}
                />
              </div>
            </InfoSection>

            {/* Acceptance Rates */}
            <InfoSection title="Acceptance Rates">
              <div className="info-grid">
                <InfoItem label="Overall" value={university.overallAcceptanceRate} />
                <InfoItem label="Early Decision" value={university.edAcceptanceRate} />
                <InfoItem label="Regular Decision" value={university.regularAcceptanceRate} />
                <InfoItem label="International Students" value={university.internationalAcceptanceRate} />
              </div>
            </InfoSection>

            {/* Testing */}
            <InfoSection title="Test Scores & Requirements">
              <div className="info-grid">
                <InfoItem label="SAT Math (25th-75th)" value={university.satMath} />
                <InfoItem label="SAT R/W (25th-75th)" value={university.satRW} />
                <InfoItem label="ACT (25th-75th)" value={university.act} />
                <InfoItem label="% Submitting SAT" value={university.percentSubmittingSAT} />
                <InfoItem label="% Submitting ACT" value={university.percentSubmittingACT} />
                <InfoItem label="Demonstrated Interest" value={university.demonstratedInterest} />
              </div>
            </InfoSection>

            {/* Costs & Aid */}
            <InfoSection title="Cost & Financial Aid">
              <div className="info-grid">
                <InfoItem 
                  label="Cost of Attendance" 
                  value={university.costOfAttendance}
                  icon={<DollarSign className="w-3.5 h-3.5" />}
                />
                <InfoItem label="% Need Met" value={university.percentNeedMet} />
                <InfoItem label="Avg Need-Based Grant" value={university.avgNeedBasedGrant} />
                <InfoItem label="% Receiving Merit Aid" value={university.percentMeritAid} />
                <InfoItem label="Avg Merit Award" value={university.avgMeritAward} />
              </div>
              {university.notableScholarships && university.notableScholarships !== '-' && (
                <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                  <div className="text-xs text-accent tracking-wider uppercase mb-2 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" />
                    Notable Scholarships
                  </div>
                  <p className="text-sm text-foreground">{university.notableScholarships}</p>
                </div>
              )}
            </InfoSection>

            {/* Outcomes */}
            <InfoSection title="Outcomes & ROI">
              <div className="info-grid">
                <InfoItem label="4-Year Graduation Rate" value={university.graduationRate4Year} />
                <InfoItem label="6-Year Graduation Rate" value={university.graduationRate6Year} />
                <InfoItem label="Median Earnings (6 Years)" value={university.medianEarnings6Years} />
                <InfoItem label="Median Earnings (10 Years)" value={university.medianEarnings10Years} />
                <InfoItem label="20-Year Net ROI" value={university.netROI20Years} />
                <InfoItem label="CS Grad Median Salary" value={university.csMedianSalary} />
              </div>
            </InfoSection>

            {/* Campus Life */}
            <InfoSection title="Campus & Demographics">
              <div className="info-grid">
                <InfoItem label="Total Enrollment" value={university.totalEnrollment} />
                <InfoItem label="% On-Campus" value={university.percentOnCampus} />
                <InfoItem label="Housing Requirement" value={university.housingRequirement} />
                <InfoItem label="% Female" value={university.percentFemale} />
                <InfoItem label="% Male" value={university.percentMale} />
                <InfoItem label="% International" value={university.percentInternational} />
                <InfoItem label="% African-American" value={university.percentAfricanAmerican} />
                <InfoItem label="% Asian" value={university.percentAsian} />
                <InfoItem label="% Hispanic" value={university.percentHispanic} />
                <InfoItem label="% White" value={university.percentWhite} />
              </div>
            </InfoSection>

            {/* Climate */}
            <InfoSection title="Climate">
              <div className="info-grid">
                <InfoItem 
                  label="January Avg" 
                  value={university.avgJanTemp}
                  icon={<Thermometer className="w-3.5 h-3.5" />}
                />
                <InfoItem 
                  label="April Avg" 
                  value={university.avgAprilTemp}
                  icon={<Thermometer className="w-3.5 h-3.5" />}
                />
                <InfoItem 
                  label="July Avg" 
                  value={university.avgJulyTemp}
                  icon={<Thermometer className="w-3.5 h-3.5" />}
                />
                <InfoItem 
                  label="October Avg" 
                  value={university.avgOctTemp}
                  icon={<Thermometer className="w-3.5 h-3.5" />}
                />
                <InfoItem 
                  label="Sunny Days/Year" 
                  value={university.sunnyDays}
                  icon={<Sun className="w-3.5 h-3.5" />}
                />
                <InfoItem 
                  label="Days w/ Precipitation" 
                  value={university.daysWithPrecipitation}
                  icon={<Cloud className="w-3.5 h-3.5" />}
                />
              </div>
            </InfoSection>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
