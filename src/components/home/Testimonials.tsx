import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    rating: 5,
    text: 'The best coffee in Doddanekundi! The ambience is so cozy and the staff is incredibly friendly. My go-to place for weekend brunches.',
    avatar: '👩',
  },
  {
    name: 'Rahul Menon',
    rating: 5,
    text: 'Amazing food and coffee. The Masala Maggi is addictive! Highly recommend this café for anyone looking for authentic flavors.',
    avatar: '👨',
  },
  {
    name: 'Sneha Reddy',
    rating: 5,
    text: 'Love the vibe here! Perfect place to catch up with friends or work remotely. The cold coffee is absolutely divine.',
    avatar: '👩‍💼',
  },
];

export function Testimonials() {
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
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300 relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-gold/20" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/80 text-sm leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <span className="font-semibold text-foreground">{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Google Rating Badge */}
        <div className="text-center mt-10">
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
