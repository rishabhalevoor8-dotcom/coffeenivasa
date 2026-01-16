import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import all images
import cappuccino from '@/assets/menu/cappuccino.jpg';
import sandwich from '@/assets/menu/sandwich.jpg';
import maggi from '@/assets/menu/maggi.jpg';
import friedRice from '@/assets/menu/fried-rice.jpg';
import noodles from '@/assets/menu/noodles.jpg';
import starters from '@/assets/menu/starters.jpg';
import rolls from '@/assets/menu/rolls.jpg';
import iceCream from '@/assets/menu/ice-cream.jpg';
import coldCoffee from '@/assets/menu/cold-coffee.jpg';
import vegClubSandwich from '@/assets/menu/veg-club-sandwich.jpg';
import paneerTikkaSandwich from '@/assets/menu/paneer-tikka-sandwich.jpg';
import cheeseMaggi from '@/assets/menu/cheese-maggi.jpg';
import schezwanRice from '@/assets/menu/schezwan-rice.jpg';
import paneer65 from '@/assets/menu/paneer-65.jpg';
import gobiManchurian from '@/assets/menu/gobi-manchurian.jpg';
import paneerRoll from '@/assets/menu/paneer-roll.jpg';
import hotChocolate from '@/assets/menu/hot-chocolate.jpg';
import masalaChai from '@/assets/menu/masala-chai.jpg';
import brownieIcecream from '@/assets/menu/brownie-icecream.jpg';

interface MenuItem {
  name: string;
  price: string;
  isVeg: boolean;
  description?: string;
  image: string;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
  icon: string;
}

const menuCategories: MenuCategory[] = [
  {
    name: 'Sandwiches',
    icon: '🥪',
    items: [
      { name: 'Grilled Cheese Sandwich', price: '₹120', isVeg: true, image: sandwich },
      { name: 'Veg Club Sandwich', price: '₹140', isVeg: true, image: vegClubSandwich },
      { name: 'Paneer Tikka Sandwich', price: '₹150', isVeg: true, image: paneerTikkaSandwich },
      { name: 'Corn & Cheese Sandwich', price: '₹130', isVeg: true, image: sandwich },
      { name: 'Chicken Grilled Sandwich', price: '₹160', isVeg: false, image: paneerTikkaSandwich },
      { name: 'Egg Cheese Sandwich', price: '₹130', isVeg: false, image: vegClubSandwich },
    ],
  },
  {
    name: 'Maggi',
    icon: '🍜',
    items: [
      { name: 'Classic Maggi', price: '₹60', isVeg: true, image: maggi },
      { name: 'Masala Maggi', price: '₹80', isVeg: true, image: maggi },
      { name: 'Cheese Maggi', price: '₹100', isVeg: true, image: cheeseMaggi },
      { name: 'Vegetable Maggi', price: '₹90', isVeg: true, image: maggi },
      { name: 'Egg Maggi', price: '₹100', isVeg: false, image: cheeseMaggi },
      { name: 'Chicken Maggi', price: '₹120', isVeg: false, image: maggi },
    ],
  },
  {
    name: 'Fried Rice',
    icon: '🍚',
    items: [
      { name: 'Veg Fried Rice', price: '₹150', isVeg: true, image: friedRice },
      { name: 'Schezwan Fried Rice', price: '₹160', isVeg: true, image: schezwanRice },
      { name: 'Mushroom Fried Rice', price: '₹170', isVeg: true, image: friedRice },
      { name: 'Paneer Fried Rice', price: '₹180', isVeg: true, image: schezwanRice },
      { name: 'Egg Fried Rice', price: '₹160', isVeg: false, image: friedRice },
      { name: 'Chicken Fried Rice', price: '₹190', isVeg: false, image: schezwanRice },
    ],
  },
  {
    name: 'Noodles',
    icon: '🍝',
    items: [
      { name: 'Veg Hakka Noodles', price: '₹140', isVeg: true, image: noodles },
      { name: 'Schezwan Noodles', price: '₹150', isVeg: true, image: noodles },
      { name: 'Chilli Garlic Noodles', price: '₹160', isVeg: true, image: noodles },
      { name: 'Egg Noodles', price: '₹150', isVeg: false, image: noodles },
      { name: 'Chicken Noodles', price: '₹180', isVeg: false, image: noodles },
    ],
  },
  {
    name: 'Starters',
    icon: '🍗',
    items: [
      { name: 'Paneer 65', price: '₹200', isVeg: true, image: paneer65 },
      { name: 'Gobi Manchurian', price: '₹180', isVeg: true, image: gobiManchurian },
      { name: 'Veg Spring Rolls', price: '₹150', isVeg: true, image: paneerRoll },
      { name: 'Chicken 65', price: '₹220', isVeg: false, image: starters },
      { name: 'Chicken Wings', price: '₹250', isVeg: false, image: starters },
      { name: 'Fish Fingers', price: '₹280', isVeg: false, image: starters },
    ],
  },
  {
    name: 'Rolls',
    icon: '🌯',
    items: [
      { name: 'Paneer Roll', price: '₹120', isVeg: true, image: paneerRoll },
      { name: 'Veg Kathi Roll', price: '₹100', isVeg: true, image: paneerRoll },
      { name: 'Cheese Roll', price: '₹110', isVeg: true, image: paneerRoll },
      { name: 'Egg Roll', price: '₹100', isVeg: false, image: rolls },
      { name: 'Chicken Roll', price: '₹140', isVeg: false, image: rolls },
      { name: 'Chicken Tikka Roll', price: '₹160', isVeg: false, image: rolls },
    ],
  },
  {
    name: 'Ice Cream',
    icon: '🍨',
    items: [
      { name: 'Vanilla Scoop', price: '₹60', isVeg: true, image: iceCream },
      { name: 'Chocolate Scoop', price: '₹60', isVeg: true, image: brownieIcecream },
      { name: 'Butterscotch Scoop', price: '₹70', isVeg: true, image: iceCream },
      { name: 'Ice Cream Sundae', price: '₹130', isVeg: true, image: iceCream },
      { name: 'Brownie with Ice Cream', price: '₹180', isVeg: true, image: brownieIcecream },
      { name: 'Falooda', price: '₹150', isVeg: true, image: iceCream },
    ],
  },
  {
    name: 'Beverages',
    icon: '☕',
    items: [
      { name: 'Classic Cappuccino', price: '₹120', isVeg: true, image: cappuccino },
      { name: 'Café Latte', price: '₹130', isVeg: true, image: cappuccino },
      { name: 'Cold Coffee', price: '₹150', isVeg: true, image: coldCoffee },
      { name: 'Hot Chocolate', price: '₹140', isVeg: true, image: hotChocolate },
      { name: 'Fresh Lime Soda', price: '₹70', isVeg: true, image: coldCoffee },
      { name: 'Masala Chai', price: '₹40', isVeg: true, image: masalaChai },
      { name: 'Mango Shake', price: '₹120', isVeg: true, image: coldCoffee },
    ],
  },
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].name);

  const currentCategory = menuCategories.find((cat) => cat.name === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-8 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-3">
              Explore
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Menu
            </h1>
            <p className="text-muted-foreground mb-6">
              From aromatic coffees to delicious meals, discover what makes Coffee Nivasa special
            </p>
            <Button variant="gold" size="lg">
              <Download className="w-5 h-5" />
              Download Menu PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-16 z-30 bg-background border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {menuCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all',
                  activeCategory === category.name
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">{currentCategory?.icon}</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {currentCategory?.name}
              </h2>
            </div>

            {/* Items Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {currentCategory?.items.map((item) => (
                <div
                  key={item.name}
                  className="flex gap-4 p-4 bg-card rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Veg/Non-Veg Indicator */}
                        <div
                          className={cn(
                            'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
                            item.isVeg ? 'border-accent' : 'border-destructive'
                          )}
                        >
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full',
                              item.isVeg ? 'bg-accent' : 'bg-destructive'
                            )}
                          />
                        </div>
                        <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                      </div>
                      <span className="font-bold text-gold text-sm whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-accent flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent" />
              </div>
              <span className="text-muted-foreground">Vegetarian</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-destructive flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-destructive" />
              </div>
              <span className="text-muted-foreground">Non-Vegetarian</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Menu;
