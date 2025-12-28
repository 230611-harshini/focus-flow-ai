'use client';

import { motion, AnimatePresence } from "framer-motion";
import { X, Play, CheckCircle2, Sparkles, Target, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoVideoModal = ({ isOpen, onClose }: DemoVideoModalProps) => {
  const demoSteps = [
    { icon: Sparkles, title: "Create Tasks", description: "Add tasks with AI suggestions" },
    { icon: Target, title: "Focus Mode", description: "Deep work with Pomodoro timer" },
    { icon: Calendar, title: "Smart Schedule", description: "Auto-organize your day" },
    { icon: BarChart3, title: "Track Progress", description: "Visualize your productivity" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl glass-card p-6 sm:p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
                >
                  <Play className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Interactive Demo</span>
                </motion.div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
                  See FocusFlow in Action
                </h2>
                <p className="text-muted-foreground">
                  Watch how FocusFlow transforms your productivity
                </p>
              </div>

              {/* Animated Demo Screen */}
              <div className="relative rounded-2xl overflow-hidden bg-card border border-border mb-8">
                <div className="aspect-video relative">
                  {/* Mock App Interface Animation */}
                  <div className="absolute inset-0 p-4 sm:p-6">
                    {/* Mock Header */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center justify-between mb-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-20 bg-muted rounded-lg" />
                        <div className="h-8 w-8 bg-primary/20 rounded-lg" />
                      </div>
                    </motion.div>

                    {/* Mock Task List */}
                    <div className="space-y-3">
                      {[0, 1, 2, 3].map((index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.15 }}
                          className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1 + index * 0.2, type: "spring" }}
                          >
                            <CheckCircle2 
                              className={`w-5 h-5 ${index < 2 ? 'text-green-500' : 'text-muted-foreground/30'}`} 
                            />
                          </motion.div>
                          <div className="flex-1">
                            <div className={`h-4 rounded ${index < 2 ? 'w-3/4 bg-muted' : 'w-1/2 bg-muted'}`} />
                            <div className="h-3 w-1/3 bg-muted/50 rounded mt-2" />
                          </div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 + index * 0.1 }}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              index === 0 ? 'bg-red-500/20 text-red-400' :
                              index === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-muted text-muted-foreground'
                            }`}
                          >
                            {index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'}
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Floating AI Suggestion */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 2, type: "spring" }}
                      className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-72 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">AI Suggestion</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Focus on "Project Review" first - it's your highest priority!
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Animated cursor */}
                  <motion.div
                    className="absolute w-6 h-6 pointer-events-none z-20"
                    initial={{ x: 100, y: 100, opacity: 0 }}
                    animate={{
                      x: [100, 200, 300, 250, 150],
                      y: [100, 150, 120, 200, 180],
                      opacity: [0, 1, 1, 1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-lg">
                      <path
                        fill="hsl(var(--primary))"
                        d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .69-.58.33-.91L6.35 2.85a.5.5 0 0 0-.85.36Z"
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Feature Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {demoSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-center p-4 rounded-xl bg-muted/30 border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-3">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center mt-8"
              >
                <Button variant="hero" size="lg" onClick={onClose}>
                  Try It Now - Free
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoVideoModal;
