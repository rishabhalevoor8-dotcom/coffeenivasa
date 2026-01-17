import { MapPin, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LocationSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-3">
            Find Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Visit Coffee Nivasa
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We're conveniently located in Doddanekundi, Bangalore. Come say hi!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-card h-80 lg:h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0001!2d77.7001!3d12.9751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCoffee%20Nivasa!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Coffee Nivasa Location"
            />
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            {/* Address */}
            <div className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Our Address</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Coffee Nivasa<br />
                    1, 9th Cross Road, Chinnapanahalli Main Rd<br />
                    Doddanekundi Extension<br />
                    Bengaluru, Karnataka 560037
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Opening Hours</h4>
                  <p className="text-muted-foreground text-sm">
                    <span className="font-medium text-foreground">All Days:</span> 10:00 AM – 11:00 PM
                  </p>
                  <p className="text-sm text-accent font-medium mt-1">Open Today!</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">Contact</h4>
                  <span className="text-lg font-bold text-primary">
                    +91 96630 25408
                  </span>
                </div>
              </div>
            </div>

            {/* Directions Button */}
            <Button variant="gold" size="lg" className="w-full" asChild>
              <a
                href="https://maps.google.com/?q=Coffee+Nivasa,+Doddanekundi,+Bangalore"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="w-5 h-5" />
                Get Directions on Google Maps
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
