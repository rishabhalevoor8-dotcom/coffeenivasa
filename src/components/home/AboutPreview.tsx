import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Leaf, Users } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every dish prepared with passion and care',
  },
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description: 'Quality ingredients sourced daily',
  },
  {
    icon: Users,
    title: 'Family Friendly',
    description: 'A warm space for everyone',
  },
];

export function AboutPreview() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <span className="inline-block text-gold font-medium text-sm uppercase tracking-wider">
              Our Story
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Welcome to Coffee Nivasa
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Nestled in the heart of Doddanekundi, Bangalore, Coffee Nivasa is more than just a café – it's a haven for coffee lovers and food enthusiasts alike. Our journey began with a simple dream: to create a space where the aroma of freshly brewed coffee meets the warmth of home-cooked meals.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every cup we serve carries the essence of carefully selected beans, and every dish reflects our commitment to authentic flavors and quality ingredients.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/50">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" size="lg" asChild className="mt-4">
              <Link to="/about">
                Learn More About Us
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-48 rounded-2xl bg-accent/20 overflow-hidden shadow-card">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center">
                    <span className="text-6xl">☕</span>
                  </div>
                </div>
                <div className="h-32 rounded-2xl bg-gold/20 overflow-hidden shadow-card">
                  <div className="w-full h-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center">
                    <span className="text-4xl">🍳</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-32 rounded-2xl bg-primary/10 overflow-hidden shadow-card">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-4xl">🥐</span>
                  </div>
                </div>
                <div className="h-48 rounded-2xl bg-secondary overflow-hidden shadow-card">
                  <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                    <span className="text-6xl">🍕</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gold text-gold-foreground px-6 py-3 rounded-full shadow-gold font-semibold text-sm">
              Since 2026 • Bengaluru
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
