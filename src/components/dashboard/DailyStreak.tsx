import { motion } from "framer-motion";
import { Flame, Trophy, TrendingUp, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isToday } from "date-fns";

interface DailyStreakProps {
  currentStreak: number;
  longestStreak: number;
  tasksCompletedToday: number;
  completedDates?: string[];
}

// Helper to compare dates by year, month, day only (ignoring time/timezone)
const isSameDateLocal = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const DailyStreak = ({ currentStreak, longestStreak, tasksCompletedToday, completedDates = [] }: DailyStreakProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const streakDays = Array.from({ length: 7 }, (_, i) => i < currentStreak % 7);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const isDateCompleted = (date: Date) => {
    return completedDates.some(completedDate => {
      const completed = new Date(completedDate);
      return isSameDateLocal(completed, date);
    });
  };

  const getCompletionCount = (date: Date) => {
    return completedDates.filter(completedDate => {
      const completed = new Date(completedDate);
      return isSameDateLocal(completed, date);
    }).length;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">Daily Streak</h3>
            <p className="text-xs text-muted-foreground">Stay consistent!</p>
          </div>
        </div>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className={`p-2 rounded-lg transition-colors ${
            showCalendar ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground hover:bg-muted"
          }`}
        >
          <Calendar className="w-4 h-4" />
        </button>
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

      {/* Week streak indicator */}
      <div className="flex gap-1.5 justify-center mb-4">
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

      {/* Calendar View */}
      {showCalendar && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border pt-4"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-sm">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">
            {day}
          </div>
        ))}
      </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for alignment */}
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {/* Days */}
            {daysInMonth.map((day, i) => {
              const completed = isDateCompleted(day);
              const count = getCompletionCount(day);
              const today = isToday(day);
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium relative transition-all ${
                    completed
                      ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-sm"
                      : today
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                  title={completed ? `${count} task${count > 1 ? 's' : ''} completed` : undefined}
                >
                  {format(day, "d")}
                  {completed && count > 1 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 text-[8px] text-yellow-900 rounded-full flex items-center justify-center font-bold">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-orange-500 to-red-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" />
              <span>Today</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};