import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, RefreshCw } from "lucide-react";

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Small steps every day lead to big changes.", author: "Unknown" },
  { text: "Your focus determines your reality.", author: "George Lucas" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Success is the sum of small efforts repeated daily.", author: "Robert Collier" },
];

export const MotivationalQuote = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  const nextQuote = () => {
    setIsRotating(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
      setIsRotating(false);
    }, 300);
  };

  const quote = quotes[quoteIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      <div className="absolute top-3 right-3 opacity-5">
        <Quote className="w-24 h-24" />
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center shrink-0">
          <Quote className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-foreground">Daily Inspiration</h3>
          <p className="text-xs text-muted-foreground">Stay motivated</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextQuote}
          className="ml-auto p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${isRotating ? "animate-spin" : ""}`} />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-foreground leading-relaxed italic mb-2">
            "{quote.text}"
          </p>
          <p className="text-xs text-muted-foreground">— {quote.author}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
