import { useEffect, useState } from "react";
import { 
  Globe, 
  Smartphone, 
  Receipt, 
  Video, 
  TrendingUp, 
  Palette,
  LucideIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number | null;
  is_active: boolean | null;
}

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Smartphone,
  Receipt,
  Video,
  TrendingUp,
  Palette,
};

export const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="py-24 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(230_60%_55%/0.1),transparent_60%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-4 mb-6">
            Everything You Need to <span className="text-gradient">Succeed Online</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We offer comprehensive digital solutions tailored to your business needs, from development to marketing.
          </p>
        </div>

        {/* Services Grid - iOS 26 Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Globe;
            return (
              <div
                key={service.id}
                className="group relative p-6 md:p-8 rounded-[24px] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]
                  bg-black/30 dark:bg-black/40
                  backdrop-blur-2xl backdrop-saturate-150
                  border border-white/10
                  shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]
                  hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)]
                  hover:border-white/20
                  card-glossy-shine"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {/* Icon */}
                <div className="relative w-14 h-14 rounded-2xl bg-primary/30 backdrop-blur-sm flex items-center justify-center mb-5 group-hover:bg-primary/40 transition-all duration-300 border border-primary/30">
                  <IconComponent className="w-7 h-7 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
                </div>
                
                {/* Content */}
                <h3 className="relative font-heading text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="relative text-muted-foreground leading-relaxed text-sm md:text-base">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
