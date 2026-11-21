import { motion, useReducedMotion } from 'motion/react';

const items = [
  {
    title: 'Face swaps',
    description: "A person's face placed onto someone else's photo.",
  },
  {
    title: 'AI-generated faces',
    description: 'Realistic people who do not exist.',
  },
  {
    title: 'Edited or altered faces',
    description: 'Facial features that were changed or retouched heavily.',
  },
  {
    title: 'Digitally created images',
    description:
      'Photos made or modified with image tools instead of a camera.',
  },
];

export function WhatWeDetectSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="what-we-detect"
      aria-labelledby="what-we-detect-heading"
      className="border-b border-lab-border"
    >
      <motion.div
        className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <p className="mb-3 font-mono text-[11px] tracking-[0.2em] uppercase text-lab-muted">
          05
        </p>
        <h2
          id="what-we-detect-heading"
          className="font-display text-3xl tracking-tight text-lab-text sm:text-4xl"
        >
          What We Detect
        </h2>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-10">
          {items.map((item) => (
            <li key={item.title} className="border-t border-lab-border pt-5">
              <h3 className="text-base font-medium text-lab-text">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-lab-muted">
                {item.description}
              </p>
            </li>
          ))}
        </ul>

        <aside className="mt-12 max-w-2xl border border-lab-border bg-lab-surface p-5 sm:p-6">
          <p className="text-sm font-medium text-lab-text">Good to know</p>
          <p className="mt-2 text-sm leading-relaxed text-lab-muted">
            For best results, use a clear, well-lit photo where the face is
            visible. Results are an estimate and should not be treated as legal
            or forensic proof.
          </p>
        </aside>
      </motion.div>
    </section>
  );
}
