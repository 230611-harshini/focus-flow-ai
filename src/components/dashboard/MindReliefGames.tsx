import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Gamepad2, Clock, AlertTriangle, X, RotateCcw, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useBrowserNotifications } from '@/hooks/useBrowserNotifications';

interface Game {
  id: string;
  name: string;
  description: string;
  color: string;
}

const games: Game[] = [
  { id: 'bubble', name: 'Bubble Pop', description: 'Pop colorful bubbles to relax', color: 'from-pink-500 to-purple-500' },
  { id: 'breathing', name: 'Breathing Ball', description: 'Follow the ball for calm breathing', color: 'from-cyan-500 to-blue-500' },
  { id: 'color-match', name: 'Color Match', description: 'Quick color matching game', color: 'from-green-500 to-teal-500' },
];

// Bubble Pop Game Component
const BubblePopGame = () => {
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([]);
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (bubbles.length < 12) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        setBubbles(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          size: Math.random() * 30 + 30,
          color: colors[Math.floor(Math.random() * colors.length)]
        }]);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [bubbles.length]);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(prev => prev + 1);
  };

  return (
    <div ref={containerRef} className="relative w-full h-64 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl overflow-hidden">
      <div className="absolute top-2 right-2 bg-background/80 px-3 py-1 rounded-full text-sm font-medium">
        Score: {score}
      </div>
      <AnimatePresence>
        {bubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="absolute cursor-pointer"
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: bubble.size,
              height: bubble.size,
            }}
            onClick={() => popBubble(bubble.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div
              className="w-full h-full rounded-full shadow-lg"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${bubble.color}aa, ${bubble.color})`,
                boxShadow: `0 4px 15px ${bubble.color}40, inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3)`
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      <p className="absolute bottom-2 left-2 text-xs text-muted-foreground">Click bubbles to pop them!</p>
    </div>
  );
};

// Breathing Ball Game Component
const BreathingBallGame = () => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    const phases = [
      { name: 'inhale' as const, duration: 4000 },
      { name: 'hold' as const, duration: 4000 },
      { name: 'exhale' as const, duration: 4000 },
    ];

    let currentPhaseIndex = 0;

    const cyclePhases = () => {
      setPhase(phases[currentPhaseIndex].name);
      
      setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        if (currentPhaseIndex === 0) {
          setCycles(prev => prev + 1);
        }
        cyclePhases();
      }, phases[currentPhaseIndex].duration);
    };

    cyclePhases();
  }, []);

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-2 right-2 bg-background/80 px-3 py-1 rounded-full text-sm font-medium">
        Cycles: {cycles}
      </div>
      <motion.div
        className="rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"
        animate={{
          scale: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1,
          boxShadow: phase === 'inhale' 
            ? '0 0 60px rgba(34, 211, 238, 0.5)' 
            : phase === 'hold'
            ? '0 0 80px rgba(34, 211, 238, 0.7)'
            : '0 0 30px rgba(34, 211, 238, 0.3)'
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
        style={{ width: 80, height: 80 }}
      />
      <motion.p 
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-lg font-medium capitalize"
      >
        {phase === 'inhale' ? 'Breathe In...' : phase === 'hold' ? 'Hold...' : 'Breathe Out...'}
      </motion.p>
      <p className="absolute bottom-2 left-2 text-xs text-muted-foreground">Follow the ball to relax</p>
    </div>
  );
};

// Color Match Game Component
const ColorMatchGame = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFEAA7', '#96CEB4'];
  const [targetColor, setTargetColor] = useState(colors[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const generateRound = useCallback(() => {
    const target = colors[Math.floor(Math.random() * colors.length)];
    const shuffled = [...colors].sort(() => Math.random() - 0.5).slice(0, 4);
    if (!shuffled.includes(target)) {
      shuffled[Math.floor(Math.random() * shuffled.length)] = target;
    }
    setTargetColor(target);
    setOptions(shuffled.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleColorClick = (color: string) => {
    if (color === targetColor) {
      setScore(prev => prev + (1 + streak));
      setStreak(prev => prev + 1);
      toast.success(`+${1 + streak} points!`);
    } else {
      setStreak(0);
      toast.error('Wrong color!');
    }
    generateRound();
  };

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl flex flex-col items-center justify-center p-4">
      <div className="absolute top-2 right-2 flex gap-2">
        <span className="bg-background/80 px-3 py-1 rounded-full text-sm font-medium">
          Score: {score}
        </span>
        <span className="bg-primary/20 px-3 py-1 rounded-full text-sm font-medium">
          Streak: {streak}🔥
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-2">Match this color:</p>
      <div 
        className="w-16 h-16 rounded-xl shadow-lg mb-4"
        style={{ backgroundColor: targetColor }}
      />
      
      <div className="flex gap-3">
        {options.map((color, index) => (
          <motion.button
            key={index}
            className="w-12 h-12 rounded-lg shadow-md hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(color)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          />
        ))}
      </div>
      <p className="absolute bottom-2 left-2 text-xs text-muted-foreground">Tap the matching color!</p>
    </div>
  );
};

export const MindReliefGames = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [timeLimit, setTimeLimit] = useState([5]); // minutes
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { sendBreakEndReminder, permission, requestPermission } = useBrowserNotifications();

  // Request notification permission when game starts
  useEffect(() => {
    if (selectedGame && permission === 'default') {
      requestPermission();
    }
  }, [selectedGame, permission, requestPermission]);

  const startGame = (gameId: string) => {
    setSelectedGame(gameId);
    setTimeRemaining(timeLimit[0] * 60);
    setIsPlaying(true);
    setShowWarning(false);
  };

  const stopGame = () => {
    setSelectedGame(null);
    setTimeRemaining(null);
    setIsPlaying(false);
    setShowWarning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const togglePause = () => {
    setIsPlaying(prev => !prev);
  };

  useEffect(() => {
    if (isPlaying && timeRemaining !== null) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            setShowWarning(true);
            setIsPlaying(false);
            toast.warning("Time's up! Get back to work!", {
              description: "Your break is over. Time to focus on your tasks!",
              duration: 10000,
            });
            // Send browser push notification
            sendBreakEndReminder('games');
            return 0;
          }
          // Show warning at 1 minute remaining
          if (prev === 60) {
            toast.info("1 minute remaining!", {
              description: "Wrap up your game soon.",
            });
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderGame = () => {
    switch (selectedGame) {
      case 'bubble':
        return <BubblePopGame />;
      case 'breathing':
        return <BreathingBallGame />;
      case 'color-match':
        return <ColorMatchGame />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Gamepad2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-sm font-medium">Mind Relief Games</span>
            <p className="text-xs text-muted-foreground">Take a quick break, stay focused</p>
          </div>
        </div>
      </div>

      {/* Time Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <div className="bg-card border border-border rounded-2xl p-6 max-w-sm mx-4 text-center shadow-2xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Time's Up!</h3>
              <p className="text-muted-foreground mb-4">
                Your break is over. It's time to get back to work and complete your tasks!
              </p>
              <Button onClick={stopGame} className="w-full">
                Back to Work
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedGame ? (
        <div>
          {/* Game Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className={`font-mono text-lg font-bold ${timeRemaining && timeRemaining <= 60 ? 'text-red-500' : ''}`}>
                {timeRemaining !== null ? formatTime(timeRemaining) : '0:00'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={togglePause}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={stopGame}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Game Area */}
          {renderGame()}
        </div>
      ) : (
        <>
          {/* Time Limit Setting */}
          <div className="mb-4 p-3 bg-muted/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time Limit
              </span>
              <span className="text-sm font-medium">{timeLimit[0]} min</span>
            </div>
            <Slider
              value={timeLimit}
              onValueChange={setTimeLimit}
              min={1}
              max={15}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Set a time limit to avoid distractions
            </p>
          </div>

          {/* Game Selection */}
          <div className="space-y-2">
            {games.map((game) => (
              <motion.button
                key={game.id}
                className={`w-full p-3 rounded-xl bg-gradient-to-r ${game.color} text-white text-left transition-all hover:scale-[1.02]`}
                onClick={() => startGame(game.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-medium">{game.name}</div>
                <div className="text-xs opacity-80">{game.description}</div>
              </motion.button>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};
