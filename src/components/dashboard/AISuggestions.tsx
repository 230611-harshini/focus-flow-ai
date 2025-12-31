import { motion } from "framer-motion";
import { Sparkles, Target, Bell, Lightbulb } from "lucide-react";

const aiSuggestions = [
  { text: "Break down high-priority tasks into smaller subtasks", icon: Target },
  { text: "Schedule focus time for demanding tasks in the morning", icon: Sparkles },
  { text: "Set reminders 15 minutes before important deadlines", icon: Bell },
  { text: "Use the Pomodoro technique for better concentration", icon: Lightbulb },
];

export const AISuggestions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold">AI Suggestions</h2>
          <p className="text-xs text-muted-foreground">Smart tips for productivity</p>
        </div>
      </div>

      <div className="space-y-3">
        {aiSuggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4, scale: 1.01 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-accent/30 hover:bg-muted/70 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center shrink-0 group-hover:from-accent/30 group-hover:to-primary/30 transition-colors">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground leading-relaxed">
                  {suggestion.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
