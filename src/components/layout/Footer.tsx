import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Clock, Instagram, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-foreground/5"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gold/5"
          animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <motion.div
        className="container mx-auto px-4 py-12 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Coffee className="w-5 h-5" />
              </motion.div>
              <div>
                <span className="font-display text-xl font-bold group-hover:text-gold transition-colors">Coffee Nivasa</span>
                <p className="text-xs text-primary-foreground/70">Café & Restaurant</p>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Where every sip feels like home. Experience the warmth of authentic coffee and delicious food in the heart of Bangalore.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Our Menu', path: '/menu' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link
                      to={link.path}
                      className="text-sm text-primary-foreground/80 hover:text-gold transition-colors inline-flex items-center gap-2"
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-gold opacity-0"
                        whileHover={{ opacity: 1 }}
                      />
                      {link.name}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <motion.li
                className="flex items-start gap-3"
                whileHover={{ x: 3 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-gold" />
                </motion.div>
                <span className="text-sm text-primary-foreground/80">
                  1, 9th Cross Road, Chinnapanahalli Main Rd, Doddanekundi Extension, Bengaluru 560037
                </span>
              </motion.li>
              <motion.li
                className="flex items-center gap-3 text-sm text-primary-foreground/80"
                whileHover={{ x: 3 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                  <Phone className="w-5 h-5 flex-shrink-0 text-gold" />
                </motion.div>
                <a href="tel:+919663025408" className="hover:text-gold transition-colors">
                  +91 96630 25408
                </a>
              </motion.li>
              <motion.li
                className="flex items-start gap-3"
                whileHover={{ x: 3 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                  <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-gold" />
                </motion.div>
                <span className="text-sm text-primary-foreground/80">
                  Open All Days<br />
                  6:00 AM - 12:00 AM (Midnight)
                </span>
              </motion.li>
            </ul>
          </motion.div>

          {/* Social & Map */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display text-lg font-semibold mb-4">Follow Us</h4>
            <motion.a
              href="https://instagram.com/coffeenivasa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-foreground/10 hover:bg-gold/20 transition-all border border-transparent hover:border-gold/30"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.div>
              <span className="text-sm font-medium">@coffeenivasa</span>
            </motion.a>
            <div className="mt-4">
              <motion.a
                href="https://maps.app.goo.gl/example"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold transition-colors"
                whileHover={{ x: 5 }}
              >
                <MapPin className="w-4 h-4" />
                Get Directions on Google Maps
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-primary-foreground/20 mt-8 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-primary-foreground/60 flex items-center justify-center gap-1.5">
            © 2026 Coffee Nivasa. All rights reserved. Made with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 fill-red-400 text-red-400" />
            </motion.span>
            in Bangalore
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
