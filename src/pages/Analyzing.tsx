import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Brain, TrendingUp } from 'lucide-react';
import { ANALYSIS_STEPS, generateMockAnalysis } from '../utils/analysis/mockEngine';
import { useStore } from '../store/appStore';

const analyzeMessages = [
  "Parsing transaction metadata...",
  "Detecting salary consistency patterns...",
  "Analyzing discretionary spending behaviour...",
  "Evaluating underwriting confidence score...",
  "Running shadow risk simulation...",
  "Mapping EMI stress signals...",
  "Generating financial identity profile...",
];

export function AnalyzingPage() {
  const navigate = useNavigate();
  const { setCurrentAnalysis, addToHistory, uploadedFiles, clearFiles } = useStore();
  const [completedSteps, setCompletedSteps] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(analyzeMessages[0]);

  useEffect(() => {
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % analyzeMessages.length;
      setCurrentMessage(analyzeMessages[messageIndex]);
    }, 1500);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    // Simulate progress through steps
    let currentStep = 0;
    const stepDurations = ANALYSIS_STEPS.map(s => s.duration);

    const progressInterval = setInterval(() => {
      setCompletedSteps(prev => Math.min(prev + 1, ANALYSIS_STEPS.length));
      currentStep++;

      if (currentStep >= ANALYSIS_STEPS.length) {
        clearInterval(progressInterval);

        // Generate mock analysis
        const fileName = uploadedFiles[0]?.name || 'statement.pdf';
        const analysis = generateMockAnalysis(fileName);
        setCurrentAnalysis(analysis);
        addToHistory(analysis);
        clearFiles();

        // Redirect to report
        setTimeout(() => {
          navigate(`/report/${analysis.id}`);
        }, 500);
      }
    }, 1200);

    return () => clearInterval(progressInterval);
  }, []);

  const progress = (completedSteps / ANALYSIS_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* AI Brain Animation */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex justify-center mb-16"
        >
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-transparent blur-2xl animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-12 h-12 text-orange-500" />
            </div>
            {/* Orbiting particles */}
            {[0, 120, 240].map((angle) => (
              <motion.div
                key={angle}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div
                  className="absolute w-2 h-2 bg-orange-500 rounded-full top-0 left-1/2 -translate-x-1/2"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-60px)`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main text */}
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
          Analyzing Your Financial Profile
        </h2>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-lg text-gray-400 text-center mb-12 h-6"
        >
          {currentMessage}
        </motion.p>

        {/* Progress bar with steps */}
        <div className="space-y-8 mb-12">
          {ANALYSIS_STEPS.map((step, index) => {
            const isCompleted = index < completedSteps;
            const isActive = index === completedSteps;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      boxShadow: isActive
                        ? '0 0 20px rgba(255, 127, 14, 0.5)'
                        : '0 0 0px rgba(255, 127, 14, 0)',
                    }}
                    className="w-8 h-8 rounded-full border-2 border-orange-500/30 flex items-center justify-center flex-shrink-0"
                  >
                    {isCompleted ? (
                      <div className="w-4 h-4 rounded-full bg-orange-500" />
                    ) : isActive ? (
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-4 h-4 rounded-full bg-orange-500/50"
                      />
                    ) : null}
                  </motion.div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-white mb-1">{step.step}</p>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                        animate={{
                          width: isCompleted ? '100%' : isActive ? '60%' : '0%',
                        }}
                        transition={{ duration: step.duration / 1000 }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 flex-shrink-0">
                    {isCompleted ? '✓' : isActive ? '...' : ''}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Overall progress */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">Overall Progress</span>
            <span className="text-sm font-semibold text-orange-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-gray-500 text-sm mt-12">
          🔒 Your data is encrypted and will be deleted after analysis
        </p>
      </div>
    </div>
  );
}

export default AnalyzingPage;
