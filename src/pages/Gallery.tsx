import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/animations';

import heroBg from '@/assets/hero-bg.jpg';
import cappuccino from '@/assets/menu/cappuccino.jpg';
import sandwich from '@/assets/menu/sandwich.jpg';
import maggi from '@/assets/menu/maggi.jpg';
import friedRice from '@/assets/menu/fried-rice.jpg';
import noodles from '@/assets/menu/noodles.jpg';
import starters from '@/assets/menu/starters.jpg';
import rolls from '@/assets/menu/rolls.jpg';
import iceCream from '@/assets/menu/ice-cream.jpg';
import coldCoffee from '@/assets/menu/cold-coffee.jpg';

const galleryImages = [
  { src: heroBg, alt: 'Coffee Nivasa Café Interior', category: 'Ambience' },
  { src: cappuccino, alt: 'Classic Cappuccino with Latte Art', category: 'Beverages' },
  { src: sandwich, alt: 'Grilled Cheese Sandwich', category: 'Food' },
  { src: maggi, alt: 'Masala Maggi', category: 'Food' },
  { src: friedRice, alt: 'Veg Fried Rice', category: 'Food' },
  { src: noodles, alt: 'Hakka Noodles', category: 'Food' },
  { src: starters, alt: 'Crispy Chicken Starters', category: 'Food' },
  { src: rolls, alt: 'Chicken Kathi Roll', category: 'Food' },
  { src: iceCream, alt: 'Ice Cream Sundae', category: 'Desserts' },
  { src: coldCoffee, alt: 'Cold Coffee Frappe', category: 'Beverages' },
];

const categories = ['All', 'Food', 'Beverages', 'Desserts', 'Ambience'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const handlePrevious = () => {
    if (selectedImage === null) return;
    const currentIndex = filteredImages.findIndex((_, i) => galleryImages.indexOf(filteredImages[i]) === selectedImage);
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    setSelectedImage(galleryImages.indexOf(filteredImages[newIndex]));
  };

  const handleNext = () => {
    if (selectedImage === null) return;
    const currentIndex = filteredImages.findIndex((_, i) => galleryImages.indexOf(filteredImages[i]) === selectedImage);
    const newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(galleryImages.indexOf(filteredImages[newIndex]));
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gold/5 blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
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
              <Camera className="w-4 h-4" />
              Explore
            </motion.span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Gallery
            </h1>
            <p className="text-muted-foreground">
              A glimpse into the Coffee Nivasa experience – our food, drinks, and cozy ambience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-2 flex-wrap">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-medium transition-all',
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image) => {
                const originalIndex = galleryImages.indexOf(image);
                return (
                  <motion.button
                    key={originalIndex}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedImage(originalIndex)}
                    className="group aspect-square rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-shadow duration-300 relative"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-white text-xs font-medium">{image.alt}</span>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-gold transition-colors rounded-full bg-white/10 backdrop-blur-sm"
              onClick={() => setSelectedImage(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-gold transition-colors rounded-full bg-white/10 backdrop-blur-sm"
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.img
              key={selectedImage}
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />

            <motion.button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-gold transition-colors rounded-full bg-white/10 backdrop-blur-sm"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-white font-medium text-sm">{galleryImages[selectedImage].alt}</p>
              <p className="text-white/60 text-xs">{galleryImages[selectedImage].category}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instagram CTA */}
      <section className="py-12 bg-secondary/50">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">Follow us for more delicious updates</p>
          <motion.a
            href="https://instagram.com/coffeenivasa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📸 @coffeenivasa on Instagram
          </motion.a>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Gallery;
