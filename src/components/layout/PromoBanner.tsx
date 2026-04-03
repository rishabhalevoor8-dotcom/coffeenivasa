import { useState } from 'react';
import { X } from 'lucide-react';
import logo from '@/assets/rrcreatorlab-logo.png';

interface PromoBannerProps {
  inline?: boolean;
}

export function PromoBanner({ inline }: PromoBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  if (inline) {
    return (
      <a
        href="https://rrcreatorlab.in"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-2.5 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] no-underline transition-all duration-300 hover:scale-[1.02] max-w-[85vw] md:max-w-[500px]"
      >
        <img
          src={logo}
          alt="RR Creator Lab"
          className="w-7 h-7 rounded-full object-cover"
        />
        <span className="flex-1 text-sm text-foreground">
          This website is designed by <b>RR Creator Lab</b>. Click to get your own 🚀
        </span>
        <span className="bg-gradient-to-r from-[hsl(249,97%,68%)] to-[hsl(271,91%,65%)] text-white px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap font-medium">
          ✨ Get Yours
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setVisible(false);
          }}
          className="text-muted-foreground hover:text-foreground text-base cursor-pointer bg-transparent border-none p-1"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </a>
    );
  }

  // Fixed position fallback (not used currently)
  return (
    <a
      href="https://rrcreatorlab.in"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-6 left-3 w-auto max-w-[85vw] md:max-w-[500px] bg-white/95 dark:bg-card/95 backdrop-blur-xl px-3 py-2 md:px-4 md:py-2.5 rounded-full flex items-center gap-2 md:gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-[9999] no-underline transition-all duration-300 hover:scale-[1.02]"
    >
      <img
        src={logo}
        alt="RR Creator Lab"
        className="w-7 h-7 rounded-full object-cover"
      />
      <span className="flex-1 text-sm text-foreground">
        This website is designed by <b>RR Creator Lab</b>. Click to get your own 🚀
      </span>
      <span className="bg-gradient-to-r from-[hsl(249,97%,68%)] to-[hsl(271,91%,65%)] text-white px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap font-medium">
        ✨ Get Yours
      </span>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setVisible(false);
        }}
        className="text-muted-foreground hover:text-foreground text-base cursor-pointer bg-transparent border-none p-1"
        aria-label="Close banner"
      >
        <X className="w-4 h-4" />
      </button>
    </a>
  );
}
