import { useState } from 'react';
import { Star, Quote, Send, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
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
  const queryClient = useQueryClient();

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
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-3">
            Customer Love
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Don't just take our word for it – hear from our happy customers
          </p>
        </div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {displayReviews.map((review) => (
              <div
                key={review.id}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300 relative"
              >
                {/* Quote Icon */}
                <Quote className="absolute top-4 right-4 w-8 h-8 text-gold/20" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
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
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xl">
                    {review.avatar}
                  </div>
                  <span className="font-semibold text-foreground">{review.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write Review Button & Google Rating */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="lg" className="gap-2">
                <Send className="w-4 h-4" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
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
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                          selectedAvatar === avatar
                            ? 'bg-gold/30 ring-2 ring-gold'
                            : 'bg-secondary hover:bg-secondary/80'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating ? 'fill-gold text-gold' : 'text-muted-foreground/30'
                          }`}
                        />
                      </button>
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
            </DialogContent>
          </Dialog>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card shadow-card">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">4.8</strong> rating on Google
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
