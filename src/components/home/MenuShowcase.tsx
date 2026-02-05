import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

// Import menu images
import sandwichImg from '@/assets/menu/sandwich.jpg';
import burgerImg from '@/assets/menu/burger.jpg';
import pastaImg from '@/assets/menu/pasta.jpg';
import noodlesImg from '@/assets/menu/noodles.jpg';
import friedRiceImg from '@/assets/menu/fried-rice.jpg';
import maggiImg from '@/assets/menu/maggi.jpg';
import rollsImg from '@/assets/menu/rolls.jpg';
import friesImg from '@/assets/menu/fries.jpg';
import springRollsImg from '@/assets/menu/spring-rolls.jpg';
import startersImg from '@/assets/menu/starters.jpg';
import cappuccinoImg from '@/assets/menu/cappuccino.jpg';
import espressoImg from '@/assets/menu/espresso.jpg';
import hotChocolateImg from '@/assets/menu/hot-chocolate.jpg';
import masalaChaiImg from '@/assets/menu/masala-chai.jpg';
import coldCoffeeImg from '@/assets/menu/cold-coffee.jpg';
import milkshakeImg from '@/assets/menu/milkshake.jpg';
import lassiImg from '@/assets/menu/lassi.jpg';
import lemonadeImg from '@/assets/menu/lemonade.jpg';
import mojitoImg from '@/assets/menu/mojito.jpg';
import iceCreamImg from '@/assets/menu/ice-cream.jpg';
import cookiesImg from '@/assets/menu/cookies.jpg';
import brownieIcecreamImg from '@/assets/menu/brownie-icecream.jpg';
import paneerTikkaSandwichImg from '@/assets/menu/paneer-tikka-sandwich.jpg';
import vegClubSandwichImg from '@/assets/menu/veg-club-sandwich.jpg';
import omelette from '@/assets/menu/omelette.jpg';
import manchowSoupImg from '@/assets/menu/manchow-soup.jpg';
import tomatoSoupImg from '@/assets/menu/tomato-soup.jpg';
import hotSourSoupImg from '@/assets/menu/hot-sour-soup.jpg';
import bunMaskaImg from '@/assets/menu/bun-maska.jpg';
import jamBunImg from '@/assets/menu/jam-bun.jpg';
import vegFriedRiceImg from '@/assets/menu/veg-fried-rice.jpg';
import schezwanRiceImg from '@/assets/menu/schezwan-rice.jpg';
import paneerRollImg from '@/assets/menu/paneer-roll.jpg';
import gobiManchurianImg from '@/assets/menu/gobi-manchurian.jpg';
import paneer65Img from '@/assets/menu/paneer-65.jpg';
import orangeJuiceImg from '@/assets/menu/orange-juice.jpg';
import watermelonJuiceImg from '@/assets/menu/watermelon-juice.jpg';
import vanillaIceCreamImg from '@/assets/menu/vanilla-ice-cream.jpg';
import cheeseMaggiImg from '@/assets/menu/cheese-maggi.jpg';

const imageMap: Record<string, string> = {
  sandwich: sandwichImg,
  burger: burgerImg,
  pasta: pastaImg,
  noodles: noodlesImg,
  'fried-rice': friedRiceImg,
  maggi: maggiImg,
  rolls: rollsImg,
  fries: friesImg,
  'spring-rolls': springRollsImg,
  starters: startersImg,
  cappuccino: cappuccinoImg,
  espresso: espressoImg,
  'hot-chocolate': hotChocolateImg,
  'masala-chai': masalaChaiImg,
  'cold-coffee': coldCoffeeImg,
  milkshake: milkshakeImg,
  lassi: lassiImg,
  lemonade: lemonadeImg,
  mojito: mojitoImg,
  'ice-cream': iceCreamImg,
  cookies: cookiesImg,
  'brownie-icecream': brownieIcecreamImg,
  'paneer-tikka-sandwich': paneerTikkaSandwichImg,
  'veg-club-sandwich': vegClubSandwichImg,
  omelette: omelette,
  'manchow-soup': manchowSoupImg,
  'tomato-soup': tomatoSoupImg,
  'hot-sour-soup': hotSourSoupImg,
  'bun-maska': bunMaskaImg,
  'jam-bun': jamBunImg,
  'veg-fried-rice': vegFriedRiceImg,
  'schezwan-rice': schezwanRiceImg,
  'paneer-roll': paneerRollImg,
  'gobi-manchurian': gobiManchurianImg,
  'paneer-65': paneer65Img,
  'orange-juice': orangeJuiceImg,
  'watermelon-juice': watermelonJuiceImg,
  'vanilla-ice-cream': vanillaIceCreamImg,
  'cheese-maggi': cheeseMaggiImg,
};

interface MenuItem {
  id: string;
  name: string;
  image_key: string;
  food_type: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

export function MenuShowcase() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    // First get all categories
    const { data: categories } = await supabase
      .from('menu_categories')
      .select('id, name')
      .order('display_order');

    if (!categories) {
      setLoading(false);
      return;
    }

    // Fetch 2 items from each category to ensure variety
    const allItems: MenuItem[] = [];
    
    for (const category of categories) {
      const { data: categoryItems } = await supabase
        .from('menu_items')
        .select('id, name, image_key, food_type, category_id')
        .eq('category_id', category.id)
        .eq('is_active', true)
        .limit(2);
      
      if (categoryItems) {
        allItems.push(...categoryItems);
      }
    }

    // Shuffle the items for visual variety
    const shuffled = allItems.sort(() => Math.random() - 0.5);
    setItems(shuffled.slice(0, 25));
    setLoading(false);
  };

  const getItemImage = (imageKey: string) => {
    // Check if it's a URL (from storage)
    if (imageKey.startsWith('http')) {
      return imageKey;
    }
    return imageMap[imageKey] || sandwichImg;
  };

  if (loading || items.length === 0) {
    return null;
  }

  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...items, ...items];

  return (
    <section className="py-8 md:py-12 overflow-hidden bg-secondary/30 relative">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-4 left-8 text-4xl opacity-10 pointer-events-none"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        🍔
      </motion.div>
      <motion.div
        className="absolute bottom-4 right-8 text-4xl opacity-10 pointer-events-none"
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        ☕
      </motion.div>

      <div className="container mx-auto px-4 mb-6">
        <motion.h2
          className="font-display text-xl md:text-2xl font-bold text-foreground text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Delicious Menu
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-center text-sm mt-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Hover to pause • Tap to explore
        </motion.p>
      </div>

      <div
        className="relative"
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-secondary/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-secondary/30 to-transparent z-10 pointer-events-none" />

        {/* Scrolling container */}
        <div
          className={cn(
            'flex animate-scroll-left',
            isPaused && 'animation-paused'
          )}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {duplicatedItems.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              className="flex-shrink-0 w-36 md:w-48 mx-2 md:mx-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
              whileHover={{ scale: 1.05, zIndex: 20 }}
            >
              <motion.div
                className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm group relative"
                whileHover={{
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)',
                  borderColor: 'hsl(var(--gold) / 0.3)',
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <motion.img
                    src={getItemImage(item.image_key)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.5 }}
                    loading="lazy"
                  />
                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700"
                  />
                  {/* Food type indicator */}
                  <div
                    className={cn(
                      'absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center backdrop-blur-sm',
                      item.food_type === 'veg' ? 'border-accent bg-card' : 
                      item.food_type === 'egg' ? 'border-gold bg-card' : 'border-destructive bg-card'
                    )}
                  >
                    <div
                      className={cn(
                        'w-2.5 h-2.5 rounded-full',
                        item.food_type === 'veg' ? 'bg-accent' : 
                        item.food_type === 'egg' ? 'bg-gold' : 'bg-destructive'
                      )}
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="p-3 relative">
                  <h3 className="font-display font-semibold text-sm md:text-base text-foreground text-center truncate group-hover:text-gold transition-colors duration-300">
                    {item.name}
                  </h3>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
