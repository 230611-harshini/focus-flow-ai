import { AnimatedScene3D } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const inspirationalQuotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  },
  {
    text: "Your focus determines your reality.",
    author: "Qui-Gon Jinn"
  },
  {
    text: "Do the hard jobs first. The easy jobs will take care of themselves.",
    author: "Dale Carnegie"
  },
  {
    text: "It is not enough to be busy; so are the ants. The question is: What are we busy about?",
    author: "Henry David Thoreau"
  }
];

export function SplineHero() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full h-[500px] bg-background/50 relative overflow-hidden border-border/50">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="hsl(var(--primary))"
      />
      
      <div className="flex h-full flex-col md:flex-row">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
            Master Your Focus, Amplify Your Results
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg">
            Transform the way you work with AI-powered task management, focus timers, ambient sounds, and real-time insights that help you achieve more with less stress.
          </p>

          {/* Rotating Quotes */}
          <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 max-w-lg">
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-sm italic text-foreground/90">
                    "{inspirationalQuotes[currentQuote].text}"
                  </p>
                  <p className="text-xs text-primary mt-2 font-medium">
                    — {inspirationalQuotes[currentQuote].author}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Quote indicators */}
          <div className="flex gap-1.5 mt-4">
            {inspirationalQuotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuote(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentQuote 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right content - 3D Scene */}
        <div className="flex-1 relative">
          <AnimatedScene3D className="w-full h-full" />
        </div>
      </div>
    </Card>
  );
}
