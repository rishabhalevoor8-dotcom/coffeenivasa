import { useState } from 'react';
import { X } from 'lucide-react';
import logo from '@/assets/rrcreatorlab-logo.png';

export function PromoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <a
      href="https://rrcreatorlab.in"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-3 left-1/2 -translate-x-1/2 w-[90%] max-w-[900px] bg-white/90 dark:bg-card/90 backdrop-blur-xl px-4 py-2.5 rounded-full flex items-center justify-between gap-3 shadow-lg z-[9999] no-underline transition-all duration-300 hover:scale-[1.01] hover:-translate-x-1/2"
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
