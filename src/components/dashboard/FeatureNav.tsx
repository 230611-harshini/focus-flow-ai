import { motion } from "framer-motion";
import { Gamepad2, Music, Sparkles, Timer, Flame, LucideIcon } from "lucide-react";

interface FeatureNavProps {
  activeFeature: string;
  onFeatureChange: (feature: string) => void;
}

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
}

const navItems: NavItem[] = [
  { id: "streak", icon: Flame, label: "Streak", color: "from-orange-500 to-red-500" },
  { id: "focus", icon: Timer, label: "Focus", color: "from-primary to-secondary" },
  { id: "sounds", icon: Music, label: "Sounds", color: "from-green-500 to-emerald-500" },
  { id: "games", icon: Gamepad2, label: "Games", color: "from-purple-500 to-pink-500" },
  { id: "ai", icon: Sparkles, label: "AI Tips", color: "from-accent to-primary" },
];

export const FeatureNav = ({ activeFeature, onFeatureChange }: FeatureNavProps) => {
  return (
    <div className="flex items-center justify-center gap-2 p-2 glass-card rounded-2xl mb-6">
      {navItems.map((item) => {
        const isActive = activeFeature === item.id;
        return (
          <motion.button
            key={item.id}
            onClick={() => onFeatureChange(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeFeature"
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-white" : ""}`} />
            <span className={`text-xs font-medium relative z-10 ${isActive ? "text-white" : ""}`}>
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
