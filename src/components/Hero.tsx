import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RobotAnimation } from "./RobotAnimation";
import { ContactModal } from "./ContactModal";
import { Link } from "react-router-dom";
export const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(230_60%_55%/0.15),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" style={{
      animationDelay: '-3s'
    }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)] opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-up">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">IT & Marketing Solutions</span>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-up" style={{
            animationDelay: '0.1s'
          }}>
              Transform Your Business with{" "}
              <span className="text-gradient">Digital Excellence</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 animate-fade-up" style={{
            animationDelay: '0.2s'
          }}>
              Transform your business with expert e-commerce solutions, mobile app development, web design, and digital marketing services. Serving Chennai, Coimbatore, Madurai & worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-up" style={{
            animationDelay: '0.3s'
          }}>
              <ContactModal>
                <Button variant="hero" size="xl">
                  Start Your Project
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </ContactModal>
              <Link to="/portfolio">
                <Button variant="heroOutline" size="xl">
                  View Our Work
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 animate-fade-up" style={{
            animationDelay: '0.4s'
          }}>
              {[{
              value: "150+",
              label: "Projects"
            }, {
              value: "50+",
              label: "Clients"
            }, {
              value: "5+",
              label: "Years"
            }, {
              value: "24/7",
              label: "Support"
            }].map((stat, index) => <div key={index} className="text-center lg:text-left">
                  <div className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>)}
            </div>
          </div>

          {/* Right Content - Robot Animation */}
          <div className="order-1 lg:order-2 animate-fade-up" style={{
          animationDelay: '0.2s'
        }}>
            <RobotAnimation />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      
    </section>;
};