import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Instagram, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-3">
              Get in Touch
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground">
              We'd love to hear from you! Visit us or place an order directly through our app.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-card h-80 lg:h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0001!2d77.7001!3d12.9751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCoffee%20Nivasa%2C%20Doddanekundi!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Coffee Nivasa Location"
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Address Card */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Our Address
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Coffee Nivasa<br />
                      1, 9th Cross Road, Chinnapanahalli Main Rd<br />
                      Doddanekundi Extension<br />
                      Bengaluru, Karnataka 560037
                    </p>
                    <a
                      href="https://maps.google.com/?q=Coffee+Nivasa,+Doddanekundi,+Bangalore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold/80 font-medium mt-3"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Contact
                    </h3>
                    <p className="text-lg font-bold text-primary">
                      +91 96630 25408
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      For inquiries and reservations
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Opening Hours
                    </h3>
                    <div className="space-y-1 text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">Monday - Sunday:</span>{' '}
                        10:00 AM – 11:00 PM
                      </p>
                      <p className="text-accent font-medium">Open All Days!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Button variant="gold" size="lg" className="w-full" asChild>
                  <Link to="/order">
                    <ShoppingBag className="w-5 h-5" />
                    Order Now
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <a
                    href="https://instagram.com/coffeenivasa"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-5 h-5" />
                    Follow on Instagram
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Order?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Visit our café and place your order directly through our self-ordering system.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="gold" size="lg" asChild>
              <Link to="/order">
                <ShoppingBag className="w-5 h-5" />
                Start Your Order
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
