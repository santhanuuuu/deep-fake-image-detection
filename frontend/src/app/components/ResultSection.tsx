import { ShieldCheck, ShieldAlert, ScanFace } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface ResultSectionProps {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  result: 'real' | 'fake' | 'no_face' | null;
  confidence?: number;
}

const VERDICT = {
  real: {
    label: 'Likely authentic',
    Icon: ShieldCheck,
    colorClass: 'text-lab-authentic',
    barClass: 'bg-lab-authentic',
    borderClass: 'border-lab-authentic/40',
    note: 'We did not find signs of manipulation in this image.',
    showConfidence: true,
    showEstimateNote: true,
  },
  fake: {
    label: 'Likely manipulated',
    Icon: ShieldAlert,
    colorClass: 'text-lab-manipulated',
    barClass: 'bg-lab-manipulated',
    borderClass: 'border-lab-manipulated/40',
    note: 'This image shows signs of digital manipulation or generation.',
    showConfidence: true,
    showEstimateNote: true,
  },
  no_face: {
    label: 'No face detected',
    Icon: ScanFace,
    colorClass: 'text-lab-muted',
    barClass: 'bg-lab-muted',
    borderClass: 'border-lab-border-strong',
    note: "We can only check photos that show a person's face clearly. Try a clear, well-lit photo of a face. Drawings, artwork and masked characters can't be checked.",
    showConfidence: false,
    showEstimateNote: false,
  },
} as const;

export function ResultSection({ status, result, confidence }: ResultSectionProps) {
  const reduceMotion = useReducedMotion();

  if (status === 'idle') return null;

  const verdict = result ? VERDICT[result] : null;

  return (
    <section
      aria-labelledby="result-heading"
      className="border-b border-lab-border"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <p className="mb-3 font-mono text-[11px] tracking-[0.2em] uppercase text-lab-muted">
          03
        </p>
        <h2
          id="result-heading"
          className="font-display text-3xl tracking-tight text-lab-text sm:text-4xl"
        >
          Your result
        </h2>

        <div
          className="mt-8 max-w-2xl border border-lab-border bg-lab-surface p-5 sm:p-8"
          aria-live="polite"
          aria-atomic="true"
        >
          {status === 'analyzing' && (
            <div className="space-y-5">
              <div className="relative aspect-[16/9] overflow-hidden border border-lab-border bg-lab-bg">
                {!reduceMotion && (
                  <motion.div
                    className="absolute inset-x-0 h-px bg-lab-accent"
                    initial={{ top: '0%' }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{
                      duration: 2.4,
                      ease: 'linear',
                      repeat: Infinity,
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>
              <p className="text-base text-lab-text">
                Analyzing your image...
              </p>
            </div>
          )}

          {status === 'error' && (
            <p className="text-base text-lab-text" role="alert">
              Something went wrong. Please try again.
            </p>
          )}

          {status === 'complete' && verdict && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <div className={`flex items-start gap-4 border-l-2 pl-4 ${verdict.borderClass}`}>
                <verdict.Icon
                  className={`mt-1 h-6 w-6 shrink-0 ${verdict.colorClass}`}
                  aria-hidden="true"
                />
                <div>
                  <p
                    className={`font-display text-3xl tracking-tight sm:text-4xl ${verdict.colorClass}`}
                  >
                    {verdict.label}
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-lab-muted sm:text-base">
                    {verdict.note}
                  </p>
                </div>
              </div>

              {verdict.showConfidence && typeof confidence === 'number' && (
                <div>
                  <div className="mb-2 flex items-baseline justify-between gap-4">
                    <p className="text-sm text-lab-muted">Confidence</p>
                    <p className="font-mono text-sm tabular-nums text-lab-text">
                      {confidence.toFixed(1)}%
                    </p>
                  </div>
                  <div
                    className="h-1.5 w-full bg-lab-raised"
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={confidence}
                    aria-label="Confidence score"
                  >
                    <motion.div
                      className={`h-full ${verdict.barClass}`}
                      initial={reduceMotion ? { width: `${confidence}%` } : { width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )}

              {verdict.showEstimateNote && (
                <p className="text-sm leading-relaxed text-lab-muted">
                  This result is an estimate, not a guarantee.
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
