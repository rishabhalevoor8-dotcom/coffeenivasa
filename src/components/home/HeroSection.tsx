import { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Phone, UtensilsCrossed, CalendarDays, Armchair, PackageCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import heroBg from '@/assets/hero-bg.jpg';

const trustIndicators = [
  { text: 'Veg & Non-Veg', icon: UtensilsCrossed },
  { text: 'Open All Days', icon: CalendarDays },
  { text: 'Dine-in', icon: Armchair },
  { text: 'Takeaway', icon: PackageCheck },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function HeroSection() {
  const navigate = useNavigate();
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const checkStaff = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);
      if (roles && roles.length > 0) { setIsStaff(true); return; }
      const { data: adminCheck } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', session.user.email || '');
      if (adminCheck && adminCheck.length > 0) setIsStaff(true);
    };
    checkStaff();
  }, []);

  const handleOrderClick = () => {
    if (isStaff) navigate('/order');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
      >
        <img
          src={heroBg}
          alt="Coffee Nivasa Café Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 pt-32 text-center">
        <motion.div
          className="max-w-3xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/30 bg-black/20 backdrop-blur-md text-gold text-sm tracking-widest uppercase font-body">
              Est. 2026 • Premium Café
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
          >
            Coffee Nivasa –{' '}
            <span className="text-gradient-gold italic">Where Every Sip Feels Like Home</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-white/70 max-w-md mx-auto font-body tracking-wide"
          >
            Café & Restaurant in Doddanekundi, Bangalore
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 pt-2">
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
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <a
              href="tel:+919663025408"
              className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call to Order: <span className="font-semibold text-white/80">+91 96630 25408</span></span>
            </a>
          </motion.div>

          {/* Trust Indicators — clean icons, no emojis */}
          <motion.div variants={itemVariants} className="flex justify-center gap-6 sm:gap-8 pt-6 flex-wrap">
            {trustIndicators.map((item, index) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-2 text-white/70 text-xs sm:text-sm whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <item.icon className="w-4 h-4 text-gold" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1.5"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 bg-white/50 rounded-full"
            animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
