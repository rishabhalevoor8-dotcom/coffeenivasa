import { Phone, MessageCircle, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const trustIndicators = [
  { text: 'Veg & Non-Veg', icon: '🍽️' },
  { text: 'Open All Days', icon: '📅' },
  { text: 'Dine-in', icon: '🪑' },
  { text: 'Takeaway', icon: '📦' },
  { text: 'Delivery', icon: '🛵' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Coffee Nivasa Café Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 pt-32 text-center">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
            <span className="text-gold text-lg">☕</span>
            <span className="text-sm font-medium text-primary-foreground/90">Premium Café Experience</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground leading-tight">
            Coffee Nivasa –{' '}
            <span className="text-gradient-gold">Where Every Sip Feels Like Home</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-xl mx-auto">
            Café & Restaurant in Doddanekundi, Bangalore
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button variant="gold" size="lg" asChild>
              <a href="tel:9663025408">
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </Button>
            <Button variant="whatsapp" size="lg" asChild>
              <a
                href="https://wa.me/919663025408?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Coffee%20Nivasa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" fill="currentColor" />
                WhatsApp
              </a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a
                href="https://maps.google.com/?q=Coffee+Nivasa,+Doddanekundi,+Bangalore"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="w-5 h-5" />
                Get Directions
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-3 pt-8">
            {trustIndicators.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-sm text-primary-foreground/90"
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary-foreground/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
