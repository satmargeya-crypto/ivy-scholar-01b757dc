import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Search, Globe, DollarSign, FileText, Calendar } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useUniversities } from '@/hooks/useUniversities';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { universities, loading } = useUniversities();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/universities?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/universities');
    }
  };

  const features = [
    {
      icon: Calendar,
      title: 'Deadline Intelligence',
      description: 'Never miss an application deadline with our comprehensive timeline filters.',
    },
    {
      icon: DollarSign,
      title: 'Aid & Affordability',
      description: 'Find universities with strong financial aid for international students.',
    },
    {
      icon: FileText,
      title: 'Essay Insights',
      description: 'Discover which schools have no supplement essays to streamline your process.',
    },
    {
      icon: Globe,
      title: 'International Focus',
      description: 'Curated data specifically designed for students applying from abroad.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
          
          <div className="container mx-auto px-4 relative">
            <div className="py-24 md:py-32 lg:py-40 max-w-4xl mx-auto text-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-8 animate-fade-up">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-sm font-medium text-accent tracking-wide">
                  {loading ? 'Loading...' : `${universities.length} Universities`}
                </span>
              </div>

              {/* Headline */}
              <h1 className="heading-display text-foreground mb-6 animate-fade-up text-balance" style={{ animationDelay: '0.1s' }}>
                Smart College Research for{' '}
                <span className="text-accent">International Students</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
                Navigate the U.S. college admissions landscape with precision. 
                Curated data on deadlines, costs, and financial aid — all in one elegant platform.
              </p>

              {/* Search */}
              <form 
                onSubmit={handleSearch} 
                className="relative max-w-2xl mx-auto mb-8 animate-fade-up"
                style={{ animationDelay: '0.3s' }}
              >
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by university name, city, or state..."
                  className="search-premium pl-14 pr-32"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Quick links */}
              <div className="flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                <Link
                  to="/universities?filter=aid"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Strong Financial Aid →
                </Link>
                <span className="text-border">|</span>
                <Link
                  to="/universities?filter=free"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Free Scoir Applications →
                </Link>
                <span className="text-border">|</span>
                <Link
                  to="/universities?filter=noessays"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  No Supplement Essays →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="divider-elegant container mx-auto max-w-4xl" />

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-section text-foreground mb-4">
                Research Made Elegant
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to make informed decisions about your college applications,
                presented with the clarity and sophistication you deserve.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="p-6 rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-section text-foreground mb-4">
              Begin Your Journey
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Explore our comprehensive database of universities and find the perfect fit
              for your academic aspirations.
            </p>
            <Link
              to="/universities"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Universities
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}