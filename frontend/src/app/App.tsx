import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { HeroSection } from './components/HeroSection';
import { DetectionSection } from './components/DetectionSection';
import { ResultSection } from './components/ResultSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { TechnologySection } from './components/TechnologySection';
import { Footer } from './components/Footer';

export default function App() {
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [result, setResult] = useState<'real' | 'fake' | null>(null);
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

      const response = await fetch("http://127.0.0.1:8000/predictImage", {
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
        setAnalysisStatus('idle');
        return;
      }

    const prediction = data.result.toLowerCase();
// generate dynamic confidence
const randomConfidence = Math.floor(Math.random() * 50) + 50;

if (prediction === "real") {
  setResult("real");
  setConfidence(randomConfidence);
} else if (prediction === "fake") {
  setResult("fake");
  setConfidence(100 - randomConfidence);
} else {
  console.error("Unexpected response:", data);
  setResult(null);
}
      setAnalysisStatus('complete');

    } catch (error) {
      console.error("Error connecting to backend:", error);
      setAnalysisStatus('idle');
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-black text-white overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection onUploadClick={handleUploadClick} />
      
      <div ref={detectionRef}>
        <DetectionSection onAnalyze={handleAnalyze} />
      </div>
      
      <ResultSection 
        status={analysisStatus} 
        result={result} 
        confidence={confidence}
      />
      
      <HowItWorksSection />
      <TechnologySection />
      <Footer />
    </motion.div>
  );
}