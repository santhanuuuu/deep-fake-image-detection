import { useState, useRef } from 'react';
import { HeroSection } from './components/HeroSection';
import { DetectionSection } from './components/DetectionSection';
import { ResultSection } from './components/ResultSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { WhatWeDetectSection } from './components/WhatWeDetectSection';
import { Footer } from './components/Footer';
import { BrandMark } from './components/BrandMark';

export default function App() {
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete' | 'error'>('idle');
  const [result, setResult] = useState<'real' | 'fake' | 'no_face' | null>(null);
  const [confidence, setConfidence] = useState<number>(0);

  const detectionRef = useRef<HTMLDivElement>(null);

  const handleUploadClick = () => {
    detectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalyze = async (file: File) => {
    setAnalysisStatus('analyzing');
    setResult(null);
    setConfidence(0);

    try {
      const formData = new FormData();

      // ✅ IMPORTANT: must match backend
      formData.append("image", file);

      const response = await fetch("https://dip-t7uh.onrender.com/predictImage", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data); // ✅ debug

      // ✅ handle backend error
      if (data.error) {
        console.error("Backend error:", data.error);
        setResult(null);
        setConfidence(0);
        setAnalysisStatus('error');
        return;
      }

      const prediction = String(data.result ?? '').toLowerCase();

      if (prediction === "real") {
        setResult("real");
        setConfidence(data.confidence);
        setAnalysisStatus('complete');
      } else if (prediction === "fake") {
        setResult("fake");
        setConfidence(data.confidence);
        setAnalysisStatus('complete');
      } else if (prediction === "no_face") {
        setResult("no_face");
        setConfidence(0);
        setAnalysisStatus('complete');
      } else {
        console.error("Unexpected response:", data);
        setResult(null);
        setConfidence(0);
        setAnalysisStatus('error');
      }

    } catch (error) {
      console.error("Error connecting to backend:", error);
      setResult(null);
      setConfidence(0);
      setAnalysisStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-lab-bg text-lab-text overflow-x-hidden">
      <header className="sticky top-0 z-50 border-b border-lab-border bg-lab-bg/95">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className="min-w-0 shrink">
            <BrandMark className="[&>span:last-child]:text-xs sm:[&>span:last-child]:text-sm" />
          </a>
          <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6">
            <a
              href="#how-it-works"
              className="hidden text-sm text-lab-muted hover:text-lab-text sm:inline"
            >
              How It Works
            </a>
            <a
              href="#what-we-detect"
              className="hidden text-sm text-lab-muted hover:text-lab-text sm:inline"
            >
              What We Detect
            </a>
            <button
              type="button"
              onClick={handleUploadClick}
              className="bg-lab-accent px-3 py-1.5 text-sm font-medium text-lab-accent-fg transition-colors hover:bg-[#d4b888] sm:px-4"
            >
              Check an Image
            </button>
          </nav>
        </div>
      </header>

      <main id="top">
        <HeroSection onUploadClick={handleUploadClick} />

        <div ref={detectionRef} id="detect">
          <DetectionSection onAnalyze={handleAnalyze} />
        </div>

        <ResultSection
          status={analysisStatus}
          result={result}
          confidence={confidence}
        />

        <HowItWorksSection />
        <WhatWeDetectSection />
      </main>

      <Footer />
    </div>
  );
}
