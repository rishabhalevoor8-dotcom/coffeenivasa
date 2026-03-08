import { motion } from 'framer-motion';
import { Flame, Clock, Percent, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import coldCoffee from '@/assets/menu/cold-coffee.jpg';
import pasta from '@/assets/menu/pasta.jpg';
import brownieIcecream from '@/assets/menu/brownie-icecream.jpg';

const offers = [
  {
    title: 'Combo Meal Deal',
    description: 'Any Sandwich + Cold Coffee at a special price',
    discount: '20% OFF',
    image: coldCoffee,
    badge: 'Most Popular',
    badgeIcon: Flame,
    gradient: 'from-gold/20 via-gold/5 to-transparent',
    borderColor: 'border-gold/30',
  },
  {
    title: 'Pasta Fest',
    description: 'Try our signature pasta with a complimentary drink',
    discount: '₹149 Only',
    image: pasta,
    badge: 'Limited Time',
    badgeIcon: Clock,
    gradient: 'from-accent/20 via-accent/5 to-transparent',
    borderColor: 'border-accent/30',
  },
  {
    title: 'Dessert Special',
    description: 'Brownie Ice Cream Sundae — indulge your sweet tooth',
    discount: 'Buy 1 Get 1',
    image: brownieIcecream,
    badge: 'Weekend Only',
    badgeIcon: Percent,
    gradient: 'from-primary/20 via-primary/5 to-transparent',
    borderColor: 'border-primary/30',
  },
];

export function SpecialOffers() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Subtle decorative dots */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-2 text-destructive font-semibold text-sm uppercase tracking-wider mb-3 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20"
            whileHover={{ scale: 1.05 }}
          >
            <Flame className="w-4 h-4 animate-pulse" />
            <span>Hot Deals</span>
            <Flame className="w-4 h-4 animate-pulse" />
          </motion.div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Today's Special Offers
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Grab these limited-time deals before they're gone
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <StaggerItem key={offer.title}>
              <motion.div
                className={`group relative bg-card rounded-2xl overflow-hidden border ${offer.borderColor} shadow-card h-full`}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Image with gradient overlay */}
                <div className="relative h-44 overflow-hidden">
                  <motion.img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${offer.gradient}`} />

                  {/* Discount badge */}
                  <motion.div
                    className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full text-sm font-bold shadow-lg"
                    initial={{ rotate: -3 }}
                    whileHover={{ rotate: 0, scale: 1.1 }}
                  >
                    {offer.discount}
                  </motion.div>

                  {/* Category badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-foreground">
                    <offer.badgeIcon className="w-3.5 h-3.5" />
                    {offer.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-foreground mb-1.5 group-hover:text-gold transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {offer.description}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal className="text-center mt-10" delay={0.3}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Button variant="gold" size="lg" asChild>
              <Link to="/menu">
                Order Now
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
