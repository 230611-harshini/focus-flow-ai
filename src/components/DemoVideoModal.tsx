'use client';

import { motion, AnimatePresence } from "framer-motion";
import { X, Play, CheckCircle2, Sparkles, Target, Calendar, BarChart3, Flame, Volume2, Moon, Sun, MessageSquare, TrendingUp, Award, Settings, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoVideoModal = ({ isOpen, onClose }: DemoVideoModalProps) => {
  const [activeScene, setActiveScene] = useState(0);

  const scenes = [
    { name: "Dashboard", icon: Target },
    { name: "Insights", icon: BarChart3 },
    { name: "Settings", icon: Settings },
  ];

  const demoSteps = [
    { icon: Flame, title: "Daily Streaks", description: "Track your consistency with calendar view" },
    { icon: Volume2, title: "Ambient Sounds", description: "Focus with rain, lofi, forest sounds" },
    { icon: Brain, title: "AI Assistant", description: "Task-aware productivity chatbot" },
    { icon: TrendingUp, title: "Real Analytics", description: "Charts powered by your data" },
  ];

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setActiveScene((prev) => (prev + 1) % 3);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

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
              <div className="text-center mb-6">
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
                  Discover powerful features across Dashboard, Insights & Settings
                </p>
              </div>

              {/* Scene Tabs */}
              <div className="flex justify-center gap-2 mb-4">
                {scenes.map((scene, index) => (
                  <button
                    key={scene.name}
                    onClick={() => setActiveScene(index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeScene === index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <scene.icon className="w-4 h-4" />
                    {scene.name}
                  </button>
                ))}
              </div>

              {/* Animated Demo Screen */}
              <div className="relative rounded-2xl overflow-hidden bg-card border border-border mb-6">
                <div className="aspect-video relative">
                  <AnimatePresence mode="wait">
                    {/* Dashboard Scene */}
                    {activeScene === 0 && (
                      <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute inset-0 p-4 sm:p-6"
                      >
                        {/* Mock Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
                            <span className="font-medium text-foreground">Dashboard</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 text-sm">
                              <Flame className="w-4 h-4" />
                              <span>7 Day Streak</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Focus Timer */}
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="p-4 rounded-xl bg-muted/50 border border-border/50 text-center"
                          >
                            <div className="w-16 h-16 mx-auto mb-2 rounded-full border-4 border-primary flex items-center justify-center">
                              <span className="text-lg font-bold text-primary">25:00</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Focus Timer</p>
                          </motion.div>

                          {/* Streak Calendar */}
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="p-4 rounded-xl bg-muted/50 border border-border/50"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">This Week</span>
                            </div>
                            <div className="flex gap-1">
                              {[1, 1, 1, 1, 1, 0, 0].map((done, i) => (
                                <div
                                  key={i}
                                  className={`w-6 h-6 rounded ${done ? 'bg-green-500' : 'bg-muted'}`}
                                />
                              ))}
                            </div>
                          </motion.div>

                          {/* Ambient Sounds */}
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="p-4 rounded-xl bg-muted/50 border border-border/50"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Volume2 className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">Ambient Sounds</span>
                            </div>
                            <div className="flex gap-2">
                              {['🌧️', '🎵', '🌲'].map((emoji, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ delay: i * 0.2, repeat: Infinity, duration: 2 }}
                                  className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm"
                                >
                                  {emoji}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </div>

                        {/* AI Chatbot */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-72 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">AI Assistant</p>
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-xs text-muted-foreground mt-1"
                              >
                                You have 3 tasks today. Start with "Design Review" - it's highest priority!
                              </motion.p>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Insights Scene */}
                    {activeScene === 1 && (
                      <motion.div
                        key="insights"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute inset-0 p-4 sm:p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium text-foreground">Insights & Analytics</span>
                          <div className="flex gap-2">
                            {['Overview', 'Trends', 'AI Tips'].map((tab, i) => (
                              <span
                                key={tab}
                                className={`px-3 py-1 rounded-lg text-xs ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                              >
                                {tab}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Chart */}
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="p-4 rounded-xl bg-muted/50 border border-border/50"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">Weekly Activity</span>
                            </div>
                            <div className="flex items-end gap-1 h-20">
                              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${h}%` }}
                                  transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                                  className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t"
                                />
                              ))}
                            </div>
                          </motion.div>

                          {/* Stats */}
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="p-4 rounded-xl bg-muted/50 border border-border/50"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { label: 'Completed', value: '24', color: 'text-green-400' },
                                { label: 'Focus Hours', value: '18h', color: 'text-blue-400' },
                                { label: 'Streak', value: '7 days', color: 'text-orange-400' },
                                { label: 'Score', value: '92%', color: 'text-purple-400' },
                              ].map((stat, i) => (
                                <motion.div
                                  key={stat.label}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 + i * 0.1 }}
                                  className="text-center"
                                >
                                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </div>

                        {/* Achievements */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="mt-4 p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                        >
                          <div className="flex items-center gap-3">
                            <Award className="w-6 h-6 text-yellow-400" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Achievement Unlocked!</p>
                              <p className="text-xs text-muted-foreground">7-Day Streak Master 🔥</p>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Settings Scene */}
                    {activeScene === 2 && (
                      <motion.div
                        key="settings"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute inset-0 p-4 sm:p-6"
                      >
                        <span className="font-medium text-foreground block mb-4">Settings</span>

                        <div className="space-y-4">
                          {/* Profile */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-4 rounded-xl bg-muted/50 border border-border/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                                JD
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">John Doe</p>
                                <p className="text-xs text-muted-foreground">john@example.com</p>
                              </div>
                            </div>
                          </motion.div>

                          {/* Theme Toggle */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-4 rounded-xl bg-muted/50 border border-border/50"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Moon className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">Appearance</span>
                              </div>
                              <div className="flex gap-1">
                                {[
                                  { icon: Sun, label: 'Light' },
                                  { icon: Moon, label: 'Dark' },
                                ].map((mode, i) => (
                                  <motion.div
                                    key={mode.label}
                                    whileHover={{ scale: 1.05 }}
                                    className={`p-2 rounded-lg ${i === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                                  >
                                    <mode.icon className="w-4 h-4" />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>

                          {/* Feedback */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-4 rounded-xl bg-muted/50 border border-border/50"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">Send Feedback</span>
                            </div>
                            <div className="flex gap-1">
                              {['😢', '😐', '😊', '😄', '🤩'].map((emoji, i) => (
                                <motion.div
                                  key={i}
                                  whileHover={{ scale: 1.2 }}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${i === 4 ? 'bg-primary/30 ring-2 ring-primary' : 'bg-muted/50'}`}
                                >
                                  {emoji}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                className="text-center mt-6"
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
