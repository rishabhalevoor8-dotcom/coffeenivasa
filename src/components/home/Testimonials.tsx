import { useState } from 'react';
import { Star, Quote, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations';
import { TestimonialSkeleton } from '@/components/ui/menu-skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const avatarOptions = ['👤', '👩', '👨', '👩‍💼', '👨‍💻', '👩‍🍳', '👨‍🎓', '💁‍♀️', '🧑', '👧', '👦'];

export function Testimonials() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👤');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data;
    },
  });

  const submitReview = useMutation({
    mutationFn: async (reviewData: { name: string; rating: number; text: string; avatar: string }) => {
      const { error } = await supabase
        .from('reviews')
        .insert([reviewData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Thank you! ❤️',
        description: 'Your review has been submitted and will appear after approval.',
      });
      setIsOpen(false);
      setName('');
      setRating(5);
      setText('');
      setSelectedAvatar('👤');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in your name and review.',
        variant: 'destructive',
      });
      return;
    }
    submitReview.mutate({ name: name.trim(), rating, text: text.trim(), avatar: selectedAvatar });
  };

  // Show at most 6 reviews in the grid
  const displayReviews = reviews.slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-secondary/50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <span className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-3">
            Customer Love
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Don't just take our word for it – hear from our happy customers
          </p>
        </ScrollReveal>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <TestimonialSkeleton />
              </motion.div>
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {displayReviews.map((review) => (
              <StaggerItem key={review.id}>
                <motion.div
                  className="bg-card rounded-2xl p-6 shadow-card relative h-full"
                  whileHover={{ 
                    y: -5, 
                    boxShadow: 'var(--shadow-hover)',
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Quote Icon */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 0.2, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-gold" />
                  </motion.div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star className="w-5 h-5 fill-gold text-gold" />
                      </motion.div>
                    ))}
                    {Array.from({ length: 5 - review.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-muted-foreground/30" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-foreground/80 text-sm leading-relaxed mb-6">
                    "{review.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xl"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      {review.avatar}
                    </motion.div>
                    <span className="font-semibold text-foreground">{review.name}</span>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* Write Review Button & Google Rating */}
        <ScrollReveal className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10" delay={0.2}>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="default" size="lg" className="gap-2">
                  <Send className="w-4 h-4" />
                  Write a Review
                </Button>
              </motion.div>
            </DialogTrigger>
            <AnimatePresence>
              {isOpen && (
                <DialogContent className="sm:max-w-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <DialogHeader>
                      <DialogTitle className="font-display">Share Your Experience</DialogTitle>
                      <DialogDescription>
                        We'd love to hear about your visit to Coffee Nivasa!
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Your Name</label>
                        <Input
                          placeholder="Enter your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          maxLength={50}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Choose Avatar</label>
                        <div className="flex flex-wrap gap-2">
                          {avatarOptions.map((avatar) => (
                            <motion.button
                              key={avatar}
                              type="button"
                              onClick={() => setSelectedAvatar(avatar)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                                selectedAvatar === avatar
                                  ? 'bg-gold/30 ring-2 ring-gold'
                                  : 'bg-secondary hover:bg-secondary/80'
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {avatar}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="p-1"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Star
                                className={`w-8 h-8 transition-colors ${
                                  star <= rating ? 'fill-gold text-gold' : 'text-muted-foreground/30'
                                }`}
                              />
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Your Review</label>
                        <Textarea
                          placeholder="Tell us about your experience..."
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          rows={4}
                          maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground mt-1">{text.length}/500 characters</p>
                      </div>

                      <Button type="submit" className="w-full" disabled={submitReview.isPending}>
                        {submitReview.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Review'
                        )}
                      </Button>
                    </form>
                  </motion.div>
                </DialogContent>
              )}
            </AnimatePresence>
          </Dialog>

          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card shadow-card"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Star className="w-4 h-4 fill-gold text-gold" />
                </motion.div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">4.8</strong> rating on Google
            </span>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
