import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import zouisLogo from "@/assets/zouis-logo.png";
import { ContactModal } from "./ContactModal";

const mainNavLinks = [
  { href: "/", label: "Home", isHash: false },
  { href: "/about", label: "About Us", isHash: false },
  { href: "/services", label: "Services", isHash: false },
  { href: "/portfolio", label: "Portfolio", isHash: false },
];

const moreNavLinks = [
  { href: "/blog", label: "Blog", isHash: false },
  { href: "/location", label: "Find Us", isHash: false },
  { href: "/certificate-verification", label: "Certificate", isHash: false },
  { href: "/careers", label: "Careers", isHash: false },
];

const allNavLinks = [...mainNavLinks, ...moreNavLinks];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const moreMenuTimeout = useRef<NodeJS.Timeout | null>(null);

  const isActive = (href: string, isHash: boolean) => {
    if (isHash) {
      return location.pathname === "/" && location.hash === href.replace("/", "");
    }
    return location.pathname === href;
  };

  const handleMoreMouseEnter = () => {
    if (moreMenuTimeout.current) {
      clearTimeout(moreMenuTimeout.current);
    }
    setIsMoreOpen(true);
  };

  const handleMoreMouseLeave = () => {
    moreMenuTimeout.current = setTimeout(() => {
      setIsMoreOpen(false);
    }, 200);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (moreMenuTimeout.current) {
        clearTimeout(moreMenuTimeout.current);
      }
    };
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div 
        className={`
          rounded-2xl border transition-all duration-500
          bg-black/20 dark:bg-black/30
          backdrop-blur-2xl backdrop-saturate-150
          border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]
          ${scrolled 
            ? 'shadow-[0_8px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]' 
            : ''
          }
        `}
      >
        <div className="px-4 md:px-6">
          <div className="hidden lg:flex items-center justify-between h-14 md:h-16">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <img 
                src={zouisLogo} 
                alt="Zouis Corp Logo" 
                className="h-8 w-8 md:h-10 md:w-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              />
              <span className="font-heading font-bold text-base md:text-xl text-foreground">
                Zouis <span className="text-primary">Corp</span>
              </span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="flex items-center gap-3 xl:gap-4">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative transition-colors duration-300 font-medium text-xs xl:text-sm py-2 group whitespace-nowrap ${
                    isActive(link.href, link.isHash) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                    isActive(link.href, link.isHash) ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              ))}

                {/* More Dropdown - Hover & Click */}
              <div 
                className="relative"
                onMouseEnter={handleMoreMouseEnter}
                onMouseLeave={handleMoreMouseLeave}
              >
                <button 
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className={`relative transition-colors duration-300 font-medium text-xs xl:text-sm py-2 whitespace-nowrap flex items-center gap-1 ${
                    isMoreOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  More
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${isMoreOpen ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </button>

                {/* Dropdown Menu */}
                {isMoreOpen && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl animate-fade-up z-50">
                    <div className="py-3 px-1">
                      {moreNavLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setIsMoreOpen(false)}
                          className={`block px-4 py-3 text-xs xl:text-sm font-medium transition-all duration-200 rounded-lg mx-1 ${
                            isActive(link.href, link.isHash) 
                              ? "text-primary bg-primary/15 border border-primary/30" 
                              : "text-gray-300 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Get Started - Right */}
            <ContactModal>
              <Button variant="hero" size="default" className="flex-shrink-0">
                Get Started
              </Button>
            </ContactModal>
          </div>

          {/* Mobile/Tablet Header */}
          <div className="lg:hidden flex items-center justify-between h-14 md:h-16">
            {/* Mobile Menu Button */}
            <button
              className="p-2 text-foreground hover:text-primary transition-colors duration-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src={zouisLogo} 
                alt="Zouis Corp Logo" 
                className="h-8 w-8 md:h-10 md:w-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              />
              <span className="font-heading font-bold text-base md:text-xl text-foreground">
                Zouis <span className="text-primary">Corp</span>
              </span>
            </Link>

            {/* Mobile Get Started Button */}
            <ContactModal>
              <Button variant="hero" size="sm" className="text-xs px-3 py-1.5 h-auto">
                Get Started
              </Button>
            </ContactModal>
          </div>

          {/* Mobile/Tablet Navigation */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-white/10 animate-fade-up">
              <div className="flex flex-col gap-2">
                {allNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`transition-all duration-300 font-medium py-3 px-4 rounded-2xl ${
                      isActive(link.href, link.isHash) 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
