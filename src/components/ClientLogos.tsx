// Import logos
import techventuresLogo from "@/assets/logos/techventures-logo.png";
import globalretailLogo from "@/assets/logos/globalretail-logo.png";
import startuplabsLogo from "@/assets/logos/startuplabs-logo.png";
import mediawaveLogo from "@/assets/logos/mediawave-logo.png";
import financehubLogo from "@/assets/logos/financehub-logo.png";
import cloudsyncLogo from "@/assets/logos/cloudsync-logo.png";
import dataflowLogo from "@/assets/logos/dataflow-logo.png";
import nexgenLogo from "@/assets/logos/nexgen-logo.png";
import quantumaiLogo from "@/assets/logos/quantumai-logo.png";
import ecosmartLogo from "@/assets/logos/ecosmart-logo.png";

const clients = [
  { name: "TechVentures", logo: techventuresLogo },
  { name: "GlobalRetail", logo: globalretailLogo },
  { name: "StartUp Labs", logo: startuplabsLogo },
  { name: "MediaWave", logo: mediawaveLogo },
  { name: "FinanceHub", logo: financehubLogo },
  { name: "CloudSync", logo: cloudsyncLogo },
  { name: "DataFlow", logo: dataflowLogo },
  { name: "NexGen", logo: nexgenLogo },
  { name: "Quantum AI", logo: quantumaiLogo },
  { name: "EcoSmart", logo: ecosmartLogo },
];

export const ClientLogos = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(230_60%_55%/0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-muted-foreground text-sm md:text-base">
            Trusted by innovative companies across industries
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Marquee Track */}
          <div className="overflow-hidden">
            <div className="flex animate-marquee hover:[animation-play-state:paused]">
              {/* First set of logos */}
              {clients.map((client, index) => (
                <div
                  key={`first-${client.name}-${index}`}
                  className="flex-shrink-0 mx-8 md:mx-12"
                >
                  <img 
                    src={client.logo} 
                    alt={`${client.name} logo`}
                    className="h-12 md:h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {clients.map((client, index) => (
                <div
                  key={`second-${client.name}-${index}`}
                  className="flex-shrink-0 mx-8 md:mx-12"
                >
                  <img 
                    src={client.logo} 
                    alt={`${client.name} logo`}
                    className="h-12 md:h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
