import { Layout } from '@/components/layout/Layout';
import { Heart, Leaf, Users, Shield, Coffee, ChefHat } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Passion for Coffee',
    description: 'We believe great coffee is an art form. Each cup is carefully crafted to deliver the perfect balance of flavor and aroma.',
  },
  {
    icon: Leaf,
    title: 'Fresh & Quality',
    description: 'We source only the finest ingredients, ensuring freshness and quality in every dish and beverage we serve.',
  },
  {
    icon: Shield,
    title: 'Hygiene First',
    description: 'Your health is our priority. We maintain the highest standards of cleanliness and food safety.',
  },
  {
    icon: Users,
    title: 'Community Spirit',
    description: 'More than a café, we\'re a gathering place for friends, families, and the local community.',
  },
  {
    icon: Coffee,
    title: 'Authentic Flavors',
    description: 'From traditional Indian favorites to international classics, we celebrate authentic taste.',
  },
  {
    icon: ChefHat,
    title: 'Skilled Team',
    description: 'Our dedicated team brings years of experience and genuine love for hospitality.',
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-3">
              About Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Story
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Coffee Nivasa was born from a simple yet profound love for coffee and the joy of bringing people together.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
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
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-accent/10 flex items-center justify-center shadow-card">
                  <span className="text-9xl">☕</span>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-gold/20 flex items-center justify-center shadow-card">
                  <span className="text-5xl">🍕</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-3">
              What We Stand For
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Our Values
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Come Visit Us Today!
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Experience the warmth of Coffee Nivasa. We're open all days from 10 AM to 11 PM.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:9663025408"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-gold-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              📞 Call Now
            </a>
            <a
              href="https://maps.google.com/?q=Coffee+Nivasa,+Doddanekundi,+Bangalore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-foreground/10 text-primary-foreground font-semibold hover:bg-primary-foreground/20 transition-colors"
            >
              📍 Get Directions
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
