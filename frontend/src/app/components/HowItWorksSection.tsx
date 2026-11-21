import { motion, useReducedMotion } from 'motion/react';

const steps = [
  {
    title: 'Upload a photo',
    description:
      "Choose a clear image of a person's face (JPG or PNG).",
  },
  {
    title: 'We analyze it',
    description:
      'The image is examined for signs that it was edited or created digitally.',
  },
  {
    title: 'See your result',
    description:
      'You get a clear verdict: authentic or manipulated, with a confidence score.',
  },
];

export function HowItWorksSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
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
          04
        </p>
        <h2
          id="how-it-works-heading"
          className="font-display text-3xl tracking-tight text-lab-text sm:text-4xl"
        >
          How It Works
        </h2>

        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-0">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative border-t border-lab-border pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8 first:md:border-l-0 first:md:pl-0"
            >
              {index < steps.length - 1 && (
                <span
                  className="pointer-events-none absolute right-0 top-2 hidden h-px w-full translate-x-1/2 bg-lab-border md:block"
                  aria-hidden="true"
                />
              )}
              <p className="font-mono text-[11px] tracking-[0.2em] text-lab-accent">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 text-lg font-medium text-lab-text">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-lab-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
}
