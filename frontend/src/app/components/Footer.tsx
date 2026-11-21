import { BrandMark } from './BrandMark';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-lab-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:px-6">
        <BrandMark />
        <p className="text-sm text-lab-muted">
          Helping people verify the photos they see online.
        </p>
        <p className="text-sm text-lab-muted">
          © {year} DeepFake Image Detection
        </p>
      </div>
    </footer>
  );
}
