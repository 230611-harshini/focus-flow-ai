import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Target, Coffee, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type TimerMode = "focus" | "short-break" | "long-break";

const timerModes: { id: TimerMode; label: string; duration: number; icon: React.ElementType; color: string }[] = [
  { id: "focus", label: "Focus", duration: 25 * 60, icon: Brain, color: "from-primary to-secondary" },
  { id: "short-break", label: "Short Break", duration: 5 * 60, icon: Coffee, color: "from-green-500 to-emerald-500" },
  { id: "long-break", label: "Long Break", duration: 15 * 60, icon: Zap, color: "from-purple-500 to-pink-500" },
];

interface EnhancedTimerProps {
  focusMode: boolean;
  onFocusModeChange: (value: boolean) => void;
  onSessionComplete: () => void;
  onFocusMinuteAdd?: () => void;
}

export const EnhancedTimer = ({ focusMode, onFocusModeChange, onSessionComplete, onFocusMinuteAdd }: EnhancedTimerProps) => {
  const { toast } = useToast();
  const [mode, setMode] = useState<TimerMode>("focus");
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const currentMode = timerModes.find(m => m.id === mode)!;
  const progress = ((currentMode.duration - time) / currentMode.duration) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
        
        // Track focus minutes in real-time
        if (mode === "focus") {
          setSecondsElapsed(prev => {
            const newSeconds = prev + 1;
            // Add a minute every 60 seconds
            if (newSeconds >= 60) {
              onFocusMinuteAdd?.();
              return 0;
            }
            return newSeconds;
          });
        }
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      setSecondsElapsed(0);
      if (mode === "focus") {
        setSessions(prev => prev + 1);
        onSessionComplete();
        toast({
          title: "🎉 Focus session complete!",
          description: "Great work! Take a well-deserved break.",
        });
        // Auto-switch to break
        const nextMode = sessions > 0 && (sessions + 1) % 4 === 0 ? "long-break" : "short-break";
        setMode(nextMode);
        setTime(timerModes.find(m => m.id === nextMode)!.duration);
      } else {
        toast({
          title: "☕ Break's over!",
          description: "Ready to focus again?",
        });
        setMode("focus");
        setTime(timerModes.find(m => m.id === "focus")!.duration);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, time, mode, sessions, toast, onSessionComplete, onFocusMinuteAdd]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTime(timerModes.find(m => m.id === newMode)!.duration);
    setIsRunning(false);
  };

  const reset = () => {
    setTime(currentMode.duration);
    setIsRunning(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentMode.color} opacity-5 transition-all duration-500`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentMode.color} flex items-center justify-center`}>
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">Focus Mode</h2>
              <p className="text-xs text-muted-foreground">{sessions} sessions today</p>
            </div>
          </div>
          <button
            onClick={() => onFocusModeChange(!focusMode)}
            className={`w-12 h-6 rounded-full transition-colors ${
              focusMode ? "bg-primary" : "bg-muted"
            }`}
          >
            <div className={`w-5 h-5 bg-foreground rounded-full transition-transform ${
              focusMode ? "translate-x-6" : "translate-x-0.5"
            }`} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-6">
          {timerModes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => switchMode(m.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  mode === m.id
                    ? `bg-gradient-to-r ${m.color} text-white shadow-lg`
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {focusMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Timer Display */}
              <div className="relative flex items-center justify-center py-8">
                {/* Progress Ring */}
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="url(#timer-gradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={553}
                      strokeDashoffset={553 - (553 * progress) / 100}
                      initial={false}
                      animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
                      transition={{ duration: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div 
                      className="text-4xl font-heading font-bold gradient-text"
                      key={time}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                    >
                      {formatTime(time)}
                    </motion.div>
                    <p className="text-sm text-muted-foreground capitalize mt-1">{mode.replace("-", " ")}</p>
                  </div>

                  {isRunning && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-40 h-40 rounded-full border-4 border-primary/20 animate-ping" />
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="glass"
                  size="icon"
                  onClick={reset}
                  className="w-12 h-12"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button
                  variant="glow"
                  size="lg"
                  onClick={() => setIsRunning(!isRunning)}
                  className="px-10 h-14"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
