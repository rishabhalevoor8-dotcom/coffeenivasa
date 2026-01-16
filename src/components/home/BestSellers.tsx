import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import cappuccino from '@/assets/menu/cappuccino.jpg';
import sandwich from '@/assets/menu/sandwich.jpg';
import maggi from '@/assets/menu/maggi.jpg';
import friedRice from '@/assets/menu/fried-rice.jpg';
import iceCream from '@/assets/menu/ice-cream.jpg';
import coldCoffee from '@/assets/menu/cold-coffee.jpg';

const bestSellers = [
  {
    name: 'Masala Tea',
    price: '₹25',
    image: cappuccino,
    isVeg: true,
    tag: 'Bestseller',
  },
  {
    name: 'Veg Cheese Sandwich',
    price: '₹65',
    image: sandwich,
    isVeg: true,
    tag: 'Popular',
  },
  {
    name: 'Paneer Maggi',
    price: '₹60',
    image: maggi,
    isVeg: true,
    tag: 'Quick Bite',
  },
  {
    name: 'Veg Fried Rice',
    price: '₹79',
    image: friedRice,
    isVeg: true,
    tag: 'Chef Special',
  },
  {
    name: 'Chocolate Milkshake',
    price: '₹80',
    image: coldCoffee,
    isVeg: true,
    tag: 'Summer Favorite',
  },
  {
    name: 'Hot Chocolate Fudge',
    price: '₹95',
    image: iceCream,
    isVeg: true,
    tag: 'Sweet Delight',
  },
];

export function BestSellers() {
  return (
    <section className="py-16 md:py-24 bg-gradient-warm">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-3">
            Our Favorites
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Best Sellers
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover our most loved dishes, crafted with passion and served with love
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map((item, index) => (
            <div
              key={item.name}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Tag */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gold text-gold-foreground text-xs font-semibold">
                  {item.tag}
                </div>
                {/* Veg Indicator */}
                <div className="absolute top-3 right-3 w-5 h-5 rounded border-2 border-accent bg-background flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {item.name}
                  </h3>
                  <span className="text-lg font-bold text-gold">{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button variant="default" size="lg" asChild>
            <Link to="/menu">
              View Full Menu
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
