interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = '' }: BrandMarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-lab-text ${className}`}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 text-lab-accent"
      >
        <path
          d="M3 1H1v2M15 1h2v2M3 17H1v-2M15 17h2v-2"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
        />
        <circle cx="9" cy="7.5" r="2.25" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M4.5 14.5c1.2-2 2.7-3 4.5-3s3.3 1 4.5 3"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-sm font-medium tracking-tight">
        DeepFake Image Detection
      </span>
    </span>
  );
}
