import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS, generateAICodename } from '../utils/aiCodenameGenerator';

/**
 * Codename Quiz Component
 * Fun personality quiz to generate AI-powered elf codename
 */
const CodenameQuiz = ({ onComplete, isHeistTheme }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCodename, setGeneratedCodename] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // If more questions, go to next
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // All questions answered, generate codename
      generateCodename(newAnswers);
    }
  };

  const generateCodename = async (quizAnswers) => {
    setIsGenerating(true);

    try {
      const codename = await generateAICodename(quizAnswers, isHeistTheme);
      
      // Simulate some processing time for drama
      setTimeout(() => {
        setGeneratedCodename(codename);
        setIsGenerating(false);
        setShowResult(true);
      }, 2000);
    } catch (error) {
      console.error('Codename generation failed:', error);
      setGeneratedCodename('Sparkle Snowflake'); // Fallback
      setIsGenerating(false);
      setShowResult(true);
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setShowResult(false);

    try {
      const codename = await generateAICodename(answers, isHeistTheme);
      setTimeout(() => {
        setGeneratedCodename(codename);
        setIsGenerating(false);
        setShowResult(true);
      }, 1500);
    } catch (error) {
      console.error('Regeneration failed:', error);
      setIsGenerating(false);
      setShowResult(true);
    }
  };

  const handleAccept = () => {
    onComplete(generatedCodename);
  };

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="font-mono text-green-400 text-sm leading-relaxed min-h-[400px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {/* Quiz Questions */}
        {!isGenerating && !showResult && (
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-green-500">PROFILE ANALYSIS</span>
                <span className="text-xs text-green-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-green-900/30 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <div className="text-cyan-400 text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">{question.emoji}</span>
                <span>{question.question}</span>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className="w-full text-left p-4 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 hover:border-green-500/50 transition-all duration-200 text-green-300"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{option.label.split(' ')[0]}</span>
                      <span className="flex-1">{option.label.substring(2)}</span>
                      <span className="text-xs text-green-500/60">→</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Generating Animation */}
        {isGenerating && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              className="text-4xl mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              🎄
            </motion.div>
            <div className="text-yellow-400 mb-2">
              &gt; ANALYZING AGENT PROFILE...
            </div>
            <div className="text-green-300 mb-2">
              &gt; CROSS-REFERENCING NORTH POLE DATABASE...
            </div>
            <div className="text-cyan-400">
              &gt; GENERATING UNIQUE CODENAME...
            </div>
            <motion.div
              className="mt-4 flex items-center justify-center gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </motion.div>
          </motion.div>
        )}

        {/* Result Display */}
        {showResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="text-green-400 mb-4">
              ✓ CODENAME ASSIGNED
            </div>
            
            <motion.div
              className="mb-6 p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 rounded-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.05, 1] }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-xs text-cyan-400 mb-2 tracking-wider">YOUR AGENT CODENAME</div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                AGENT {generatedCodename.toUpperCase()}
              </div>
            </motion.div>

            <div className="flex gap-3 justify-center">
              <motion.button
                onClick={handleRegenerate}
                className="px-6 py-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎲 Try Another
              </motion.button>
              
              <motion.button
                onClick={handleAccept}
                className="px-6 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✓ Accept Mission
              </motion.button>
            </div>

            <div className="mt-4 text-xs text-green-500/60">
              Your codename has been recorded in the North Pole archives
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodenameQuiz;
