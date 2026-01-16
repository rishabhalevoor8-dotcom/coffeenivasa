import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    const currentIndex = filteredImages.findIndex((_, i) => {
      const originalIndex = galleryImages.indexOf(filteredImages[i]);
      return originalIndex === selectedImage;
    });
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    setSelectedImage(galleryImages.indexOf(filteredImages[newIndex]));
  };

  const handleNext = () => {
    if (selectedImage === null) return;
    const currentIndex = filteredImages.findIndex((_, i) => {
      const originalIndex = galleryImages.indexOf(filteredImages[i]);
      return originalIndex === selectedImage;
    });
    const newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(galleryImages.indexOf(filteredImages[newIndex]));
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-3">
              Explore
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Gallery
            </h1>
            <p className="text-muted-foreground">
              A glimpse into the Coffee Nivasa experience – our food, drinks, and cozy ambience
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-30 bg-background border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => {
              const originalIndex = galleryImages.indexOf(image);
              return (
                <button
                  key={originalIndex}
                  onClick={() => setSelectedImage(originalIndex)}
                  className="group aspect-square rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 text-background hover:text-gold transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous Button */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-background hover:text-gold transition-colors text-4xl"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
          >
            ‹
          </button>

          {/* Image */}
          <img
            src={galleryImages[selectedImage].src}
            alt={galleryImages[selectedImage].alt}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next Button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-background hover:text-gold transition-colors text-4xl"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            ›
          </button>

          {/* Caption */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="text-background font-medium">{galleryImages[selectedImage].alt}</p>
            <p className="text-background/60 text-sm">{galleryImages[selectedImage].category}</p>
          </div>
        </div>
      )}

      {/* Instagram CTA */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">Follow us for more delicious updates</p>
          <a
            href="https://instagram.com/coffeenivasa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            📸 @coffeenivasa on Instagram
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
