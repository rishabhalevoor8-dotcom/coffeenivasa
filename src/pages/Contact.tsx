import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Instagram, ShoppingBag, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations';

const Contact = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold font-medium text-sm uppercase tracking-wider mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MessageCircle className="w-4 h-4" />
              Get in Touch
            </motion.span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground">
              We'd love to hear from you! Visit us or place an order directly through our app.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Map */}
            <ScrollReveal direction="left">
              <motion.div
                className="rounded-2xl overflow-hidden shadow-card h-80 lg:h-full min-h-[400px]"
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
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
              </motion.div>
            </ScrollReveal>

            {/* Contact Info */}
            <StaggerContainer className="space-y-5" staggerDelay={0.1}>
              <StaggerItem>
                <motion.div
                  className="bg-card rounded-xl p-6 shadow-card border border-border/50"
                  whileHover={{ x: 8, boxShadow: 'var(--shadow-hover)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <MapPin className="w-6 h-6 text-accent" />
                    </motion.div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">Our Address</h3>
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
                        className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold/80 font-medium mt-3 transition-colors"
                      >
                        Get Directions →
                      </a>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <motion.div
                  className="bg-card rounded-xl p-6 shadow-card border border-border/50"
                  whileHover={{ x: 8, boxShadow: 'var(--shadow-hover)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Phone className="w-6 h-6 text-primary" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">Contact</h3>
                      <a href="tel:+919663025408" className="text-lg font-bold text-primary hover:text-primary/80 transition-colors">
                        +91 96630 25408
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">For inquiries and reservations</p>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <motion.div
                  className="bg-card rounded-xl p-6 shadow-card border border-border/50"
                  whileHover={{ x: 8, boxShadow: 'var(--shadow-hover)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Clock className="w-6 h-6 text-gold" />
                    </motion.div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">Opening Hours</h3>
                      <div className="space-y-1 text-muted-foreground">
                        <p><span className="font-medium text-foreground">Monday - Sunday:</span> 10:00 AM – 11:00 PM</p>
                        <motion.p
                          className="text-accent font-medium"
                          animate={{ scale: [1, 1.03, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Open All Days!
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="gold" size="lg" className="w-full" asChild>
                      <Link to="/order">
                        <ShoppingBag className="w-5 h-5" />
                        Order Now
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <a href="https://instagram.com/coffeenivasa" target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-5 h-5" />
                        Follow Us
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>
        <motion.div
          className="container mx-auto px-4 text-center relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Order?
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            Visit our café and place your order directly through our self-ordering system.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="gold" size="lg" asChild>
              <Link to="/order">
                <ShoppingBag className="w-5 h-5" />
                Start Your Order
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Contact;
