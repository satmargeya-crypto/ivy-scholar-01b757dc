export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/favicon.png" 
                alt="Admissions Intelligence" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-serif text-lg font-medium">
                Admissions<span className="text-accent">Intelligence</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Smart college research for international students. 
              Curated data, intelligent insights, premium experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/universities" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browse Universities
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-4">About</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Data aggregated from multiple sources to provide comprehensive 
              university information for prospective students worldwide.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Admissions Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}