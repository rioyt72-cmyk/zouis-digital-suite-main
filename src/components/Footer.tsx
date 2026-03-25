import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import zouisLogo from "@/assets/zouis-logo.png";
const CONTACT_INFO = {
  phone: "+91 6383702551",
  email: "contact@zouiscorp.in"
};
const footerLinks = {
  services: [{
    label: "Website Development",
    href: "#services"
  }, {
    label: "App Development",
    href: "#services"
  }, {
    label: "Billing Software",
    href: "#services"
  }, {
    label: "Content Creation",
    href: "#services"
  }, {
    label: "Digital Marketing",
    href: "#services"
  }, {
    label: "Branding & Design",
    href: "#services"
  }],
  company: [{
    label: "About Us",
    href: "/about"
  }, {
    label: "Our Team",
    href: "/about#team"
  }, {
    label: "Blog",
    href: "/blog"
  }, {
    label: "Careers",
    href: "/careers"
  }, {
    label: "Location",
    href: "/location"
  }],
  support: [{
    label: "Contact Us",
    href: "#contact"
  }, {
    label: `Email: ${CONTACT_INFO.email}`,
    href: `mailto:${CONTACT_INFO.email}`
  }, {
    label: `Phone: ${CONTACT_INFO.phone}`,
    href: `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`
  }]
};
const socialLinks = [{
  icon: Facebook,
  href: "#",
  label: "Facebook"
}, {
  icon: Twitter,
  href: "#",
  label: "Twitter"
}, {
  icon: Instagram,
  href: "#",
  label: "Instagram"
}, {
  icon: Linkedin,
  href: "#",
  label: "LinkedIn"
}, {
  icon: Youtube,
  href: "#",
  label: "YouTube"
}];
export const Footer = () => {
  return <footer className="pt-20 pb-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6">
              <img src={zouisLogo} alt="Zouis Corp" className="h-12 w-12" />
              <span className="font-heading font-bold text-2xl text-foreground">
                Zouis <span className="text-primary">Corp</span>
              </span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Empowering businesses with innovative digital solutions. From websites to marketing, we help you succeed in the digital world.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => <a key={index} href={social.href} aria-label={social.label} className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  <social.icon className="w-5 h-5" />
                </a>)}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
                    {link.label}
                  </a>
                </li>)}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
                    {link.label}
                  </a>
                </li>)}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
                    {link.label}
                  </a>
                </li>)}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border md:flex-row justify-between items-center gap-4 flex flex-col">
          <p className="text-muted-foreground text-sm text-center">
            © {new Date().getFullYear()} Zouis Corporations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};