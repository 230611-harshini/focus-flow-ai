import { motion } from "framer-motion";
import { Flame, Trophy, TrendingUp } from "lucide-react";

interface DailyStreakProps {
  currentStreak: number;
  longestStreak: number;
  tasksCompletedToday: number;
}

export const DailyStreak = ({ currentStreak, longestStreak, tasksCompletedToday }: DailyStreakProps) => {
  const streakDays = Array.from({ length: 7 }, (_, i) => i < currentStreak % 7);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
          <Flame className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-foreground">Daily Streak</h3>
          <p className="text-xs text-muted-foreground">Stay consistent!</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <motion.div 
            className="text-3xl font-heading font-bold text-orange-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {currentStreak}
          </motion.div>
          <p className="text-xs text-muted-foreground">Current</p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="text-center">
          <div className="flex items-center gap-1 justify-center">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xl font-heading font-semibold text-foreground">{longestStreak}</span>
          </div>
          <p className="text-xs text-muted-foreground">Best</p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="text-center">
          <div className="flex items-center gap-1 justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xl font-heading font-semibold text-foreground">{tasksCompletedToday}</span>
          </div>
          <p className="text-xs text-muted-foreground">Today</p>
        </div>
      </div>

      <div className="flex gap-1.5 justify-center">
        {streakDays.map((active, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
              active 
                ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            {["M", "T", "W", "T", "F", "S", "S"][i]}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
