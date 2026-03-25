import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Careers", path: "/careers" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/#contact" },
  ];

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    setMounted(true);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    
    // Simple search logic - match against quick links
    const matchedLink = quickLinks.find(link => 
      link.name.toLowerCase().includes(query) || 
      link.path.toLowerCase().includes(query)
    );
    
    if (matchedLink) {
      navigate(matchedLink.path);
    } else if (query) {
      // Default to services page with search context
      navigate(`/services`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-2xl mx-auto">
          {/* Animated 404 */}
          <div className={`relative mb-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-[120px] md:text-[180px] font-bold font-heading leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/50 to-primary/20">
              404
            </h1>
            <div className="absolute inset-0 text-[120px] md:text-[180px] font-bold font-heading leading-none text-primary/5 blur-2xl -z-10">
              404
            </div>
          </div>

          {/* Animated floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Content */}
          <div className={`relative z-10 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Search className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-heading font-semibold text-foreground">
                Page Not Found
              </h2>
            </div>
            
            <p className="text-muted-foreground text-lg mb-1">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-muted-foreground/70 text-sm mb-6">
              Try searching or use the quick links below.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className={`mb-6 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Search for a page..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-secondary/50 border-border"
                />
                <Button type="submit" variant="hero" size="default">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Quick Links */}
            <div className={`mb-6 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="text-sm text-muted-foreground mb-3">Quick Links:</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-3 py-1.5 text-sm bg-secondary/50 hover:bg-primary/20 border border-border hover:border-primary/50 rounded-full transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Button asChild variant="hero" size="lg" className="gap-2">
                <Link to="/">
                  <Home className="w-5 h-5" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/services">
                  <ArrowLeft className="w-5 h-5" />
                  View Services
                </Link>
              </Button>
            </div>
          </div>

          {/* Attempted path display */}
          <div className={`mt-8 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-xs text-muted-foreground/50">
              Attempted path: <code className="px-2 py-1 bg-muted rounded text-primary/70">{location.pathname}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
