import { motion } from "framer-motion";
import { CheckCircle2, Clock, Target, Zap } from "lucide-react";

interface QuickStatsProps {
  completed: number;
  pending: number;
  focusMinutes: number;
  productivity: number;
}

export const QuickStats = ({ completed, pending, focusMinutes, productivity }: QuickStatsProps) => {
  const stats = [
    { 
      icon: CheckCircle2, 
      label: "Completed", 
      value: completed, 
      color: "text-green-400",
      bg: "bg-green-500/10"
    },
    { 
      icon: Clock, 
      label: "Pending", 
      value: pending, 
      color: "text-yellow-400",
      bg: "bg-yellow-500/10"
    },
    { 
      icon: Zap, 
      label: "Focus Time", 
      value: `${focusMinutes}m`, 
      color: "text-primary",
      bg: "bg-primary/10"
    },
    { 
      icon: Target, 
      label: "Score", 
      value: `${productivity}%`, 
      color: "text-accent",
      bg: "bg-accent/10"
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4 text-center"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={`text-xl font-heading font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
};
