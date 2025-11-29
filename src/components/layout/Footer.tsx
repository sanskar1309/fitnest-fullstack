import Link from "next/link";
import { Activity, Heart, Instagram, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  features: [
    { name: "BMI Calculator", href: "/bmi" },
    { name: "BMR Calculator", href: "/bmr" },
    { name: "Nutrition Guide", href: "/nutrition" },
    { name: "AI Meal Planner", href: "/meal-planner" },
  ],
  wellness: [
    { name: "Yoga", href: "/yoga" },
    { name: "Meditation", href: "/meditation" },
  ],
  support: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    // { name: "FAQ", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
];

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Fitnest
              </span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your comprehensive health and fitness companion. Everything you need for a healthier lifestyle in one place.
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for your health journey</span>
            </div>
          </div>

          {/* Features Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Features</h3>
            <ul className="space-y-2">
              {footerLinks.features.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Wellness Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Wellness</h3>
            <ul className="space-y-2">
              {footerLinks.wellness.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Fitnest. All rights reserved.
          </p>
          
          {/* <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {socialLinks.map((social) => (
              <Button
                key={social.name}
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-primary/10"
              >
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              </Button>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
};