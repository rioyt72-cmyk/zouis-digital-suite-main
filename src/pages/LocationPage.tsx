import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MapPin, Navigation, Phone, Mail, Clock } from 'lucide-react';

const LocationPage = () => {
  // Google Maps embed URL for Bangalore (you can change coordinates)
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.325183830312!2d78.5841697750541!3d11.60014948860319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bab9d96fec64aef%3A0x1a111e42db856114!2sZouis%20Corporations!5e0!3m2!1sen!2sin!4v1774454175627!5m2!1sen!2sin";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Find Us</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            Our <span className="text-primary">Location</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visit our headquarters or get in touch. We'd love to meet you and discuss how we can help transform your business.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-4 pb-16">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map Container */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm h-[500px]">
                <iframe
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Zouis Corp Location"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Address Card */}
              <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Navigation className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-muted-foreground text-sm">
                      196, 2nd Floor<br />
                      Vinayagapuram, near nayara petrol pump<br />
                      Attur, Tamil Nadu 636141<br />
                      India
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-muted-foreground text-sm">
                      <a href="tel:+916383702551" className="hover:text-primary transition-colors">+91 6383702551</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground text-sm">
                      <a href="mailto:contact@zouiscorp.in" className="hover:text-primary transition-colors">contact@zouiscorp.in</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Business Hours</h3>
                    <p className="text-muted-foreground text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocationPage;
