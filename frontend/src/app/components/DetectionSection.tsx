import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface DetectionSectionProps {
  onAnalyze: (file: File) => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function DetectionSection({ onAnalyze }: DetectionSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    }
  };

  return (
    <section
      aria-labelledby="detect-heading"
      className="border-b border-lab-border"
    >
      <motion.div
        className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="mb-8 max-w-xl">
          <p className="mb-3 font-mono text-[11px] tracking-[0.2em] uppercase text-lab-muted">
            02
          </p>
          <h2
            id="detect-heading"
            className="font-display text-3xl tracking-tight text-lab-text sm:text-4xl"
          >
            Upload a photo
          </h2>
          <p className="mt-4 text-base leading-relaxed text-lab-muted">
            Choose a clear photo of a person&apos;s face. You can drag and drop
            a file, or browse from your device.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-lab-muted">
            Works best with a clear photo of a person&apos;s face.
          </p>
        </div>

        <div className="max-w-2xl">
          <div
            role="button"
            tabIndex={0}
            aria-label={
              selectedFile
                ? `Selected image ${selectedFile.name}. Activate to replace.`
                : 'Upload a photo. Drag and drop or press Enter to browse.'
            }
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={`relative cursor-pointer border bg-lab-surface p-6 transition-colors sm:p-8 ${
              dragActive
                ? 'border-lab-accent bg-lab-raised'
                : 'border-lab-border hover:border-lab-border-strong'
            }`}
          >
            <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-lab-accent" aria-hidden="true" />
            <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-lab-accent" aria-hidden="true" />
            <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-lab-accent" aria-hidden="true" />
            <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-lab-accent" aria-hidden="true" />

            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleChange}
              tabIndex={-1}
            />

            {previewUrl && selectedFile ? (
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <img
                  src={previewUrl}
                  alt={`Preview of ${selectedFile.name}`}
                  className="max-h-56 w-full object-contain sm:max-w-[220px]"
                />
                <div className="min-w-0 flex-1 space-y-3">
                  <p className="truncate text-sm text-lab-text">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-lab-muted">
                    {formatBytes(selectedFile.size)}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                    }}
                    className="text-sm text-lab-accent underline-offset-4 hover:underline"
                  >
                    Replace
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-4 py-6">
                <Upload className="h-5 w-5 text-lab-muted" aria-hidden="true" />
                <div>
                  <p className="text-base text-lab-text">
                    {dragActive
                      ? 'Release to add your photo'
                      : 'Drop a photo here, or click to browse'}
                  </p>
                  <p className="mt-2 text-sm text-lab-muted">
                    JPG or PNG
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!selectedFile}
              className={`px-6 py-2.5 text-sm font-medium transition-colors ${
                selectedFile
                  ? 'bg-lab-accent text-lab-accent-fg hover:bg-[#d4b888]'
                  : 'cursor-not-allowed border border-lab-border bg-lab-surface text-lab-muted'
              }`}
            >
              Detect
            </button>
            {!selectedFile && (
              <p className="text-sm text-lab-muted">
                Choose a photo to continue
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
