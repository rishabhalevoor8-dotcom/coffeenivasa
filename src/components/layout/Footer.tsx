import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Clock, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display text-xl font-bold">Coffee Nivasa</span>
                <p className="text-xs text-primary-foreground/70">Café & Restaurant</p>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Where every sip feels like home. Experience the warmth of authentic coffee and delicious food in the heart of Bangalore.
            </p>
          </div>

          {/* Quick Links */}
          <div>
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
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-gold" />
                <span className="text-sm text-primary-foreground/80">
                  1, 9th Cross Road, Chinnapanahalli Main Rd, Doddanekundi Extension, Bengaluru 560037
                </span>
              </li>
              <li>
                <a
                  href="tel:9663025408"
                  className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <Phone className="w-5 h-5 flex-shrink-0 text-gold" />
                  +91 96630 25408
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-gold" />
                <span className="text-sm text-primary-foreground/80">
                  Open All Days<br />
                  10:00 AM - 11:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Social & Map */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Follow Us</h4>
            <a
              href="https://instagram.com/coffeenivasa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="text-sm font-medium">@coffeenivasa</span>
            </a>
            <div className="mt-4">
              <a
                href="https://maps.app.goo.gl/example"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Get Directions on Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Coffee Nivasa. All rights reserved. Made with ❤️ in Bangalore
          </p>
        </div>
      </div>
    </footer>
  );
}
