export const designTokens = {
  spacing: {
    compact: {
      padding: "py-8 px-4 md:py-10 md:px-6",
      gap: "gap-4",
      spaceY: "space-y-4"
    },
    normal: {
      padding: "py-16 px-6 md:py-20 md:px-12",
      gap: "gap-6",
      spaceY: "space-y-8"
    },
    wide: {
      padding: "py-24 px-8 md:py-32 md:px-16",
      gap: "gap-10",
      spaceY: "space-y-12"
    }
  },
  borderRadius: {
    none: "rounded-none",
    md: "rounded-md",
    xl: "rounded-2xl",
    full: "rounded-full"
  },
  fontFamily: {
    sans: "font-sans",
    mono: "font-mono",
    display: "font-display", // Outfit / Syne
    serif: "font-serif"
  },
  shadow: {
    none: "shadow-none border-white/5",
    sm: "shadow-sm border-white/5",
    lg: "shadow-2xl border-white/10",
    glow: "shadow-[0_0_24px_rgba(212,175,55,0.15)] border-brand-gold/15"
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px"
  }
};
