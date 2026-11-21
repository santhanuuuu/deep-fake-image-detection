import { motion, useReducedMotion } from 'motion/react';

interface HeroSectionProps {
  onUploadClick: () => void;
}

export function HeroSection({ onUploadClick }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="border-b border-lab-border"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 md:py-24">
        <motion.div
          className="max-w-2xl"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <p className="mb-5 font-mono text-[11px] tracking-[0.2em] uppercase text-lab-muted">
            01
          </p>
          <p className="mb-3 text-sm text-lab-muted">
            DeepFake Image Detection
          </p>
          <h1
            id="hero-heading"
            className="font-display text-[2.75rem] leading-[1.08] tracking-tight text-lab-text sm:text-5xl md:text-6xl"
          >
            Is this photo real?
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-lab-muted sm:text-lg">
            Upload a photo of a person and find out whether it has been
            digitally manipulated or generated.
          </p>
          <div className="mt-10">
            <button
              type="button"
              onClick={onUploadClick}
              className="inline-flex items-center bg-lab-accent px-5 py-2.5 text-sm font-medium text-lab-accent-fg transition-colors hover:bg-[#d4b888] focus-visible:outline-lab-accent"
            >
              Check an Image
            </button>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-lab-muted">
              Free to use. Your image is only used to produce your result.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
