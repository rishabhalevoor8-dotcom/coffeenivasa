import { Layout } from '@/components/layout/Layout';
import { Heart, Leaf, Users, Shield, Coffee, ChefHat, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations';
import cafeStorefront from '@/assets/cafe-storefront.jpg';
import cappuccino from '@/assets/menu/cappuccino.jpg';

const values = [
  { icon: Heart, title: 'Passion for Coffee', description: 'We believe great coffee is an art form. Each cup is carefully crafted to deliver the perfect balance of flavor and aroma.' },
  { icon: Leaf, title: 'Fresh & Quality', description: 'We source only the finest ingredients, ensuring freshness and quality in every dish and beverage we serve.' },
  { icon: Shield, title: 'Hygiene First', description: 'Your health is our priority. We maintain the highest standards of cleanliness and food safety.' },
  { icon: Users, title: 'Community Spirit', description: "More than a café, we're a gathering place for friends, families, and the local community." },
  { icon: Coffee, title: 'Authentic Flavors', description: 'From traditional Indian favorites to international classics, we celebrate authentic taste.' },
  { icon: ChefHat, title: 'Skilled Team', description: 'Our dedicated team brings years of experience and genuine love for hospitality.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gold/5 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
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
              <Coffee className="w-4 h-4" />
              About Us
            </motion.span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Story
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Coffee Nivasa was born from a simple yet profound love for coffee and the joy of bringing people together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="left">
                <div className="space-y-6">
                  <h2 className="font-display text-3xl font-bold text-foreground">
                    Where Every Sip Feels Like Home
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    In 2020, amidst the bustling streets of Doddanekundi, Bangalore, Coffee Nivasa opened its doors with a vision – to create a space where the rich aroma of freshly brewed coffee mingles with the warmth of home-cooked food.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    What started as a small café has grown into a beloved neighborhood spot, where students find their study corner, professionals take coffee breaks, and families create memories over weekend brunches.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Our menu is a reflection of our diverse Bangalore community – from the comforting bowl of Masala Maggi to artisanal coffee creations, we celebrate flavors that bring smiles.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.2}>
                <div className="relative">
                  <motion.div
                    className="rounded-2xl overflow-hidden shadow-card"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <img src={cafeStorefront} alt="Coffee Nivasa Café" className="w-full h-80 object-cover" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-6 -right-6 w-36 h-36 rounded-2xl overflow-hidden shadow-card border-4 border-background"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05, rotate: 3 }}
                  >
                    <img src={cappuccino} alt="Coffee" className="w-full h-full object-cover" />
                  </motion.div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-secondary/50 overflow-hidden">
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-12">
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold font-medium text-sm uppercase tracking-wider mb-3"
              whileHover={{ scale: 1.05 }}
            >
              What We Stand For
            </motion.span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Our Values
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <motion.div
                  className="bg-card rounded-2xl p-6 shadow-card h-full border border-border/50"
                  whileHover={{ y: -8, boxShadow: 'var(--shadow-hover)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <value.icon className="w-7 h-7 text-accent" />
                  </motion.div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Come Visit Us Today!
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
              Experience the warmth of Coffee Nivasa. We're open all days from 10 AM to 11 PM.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="gold" size="lg" asChild>
                  <Link to="/menu">
                    View Our Menu
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="heroOutline" size="lg" asChild>
                  <a
                    href="https://maps.google.com/?q=Coffee+Nivasa,+Doddanekundi,+Bangalore"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📍 Get Directions
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
