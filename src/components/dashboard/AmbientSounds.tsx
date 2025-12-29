import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, CloudRain, Wind, Coffee, Waves, TreePine, Music2 } from "lucide-react";

const sounds = [
  { id: "rain", icon: CloudRain, label: "Rain", color: "from-blue-500 to-cyan-500" },
  { id: "wind", icon: Wind, label: "Wind", color: "from-gray-400 to-slate-500" },
  { id: "cafe", icon: Coffee, label: "Café", color: "from-amber-500 to-orange-500" },
  { id: "waves", icon: Waves, label: "Ocean", color: "from-cyan-500 to-blue-600" },
  { id: "forest", icon: TreePine, label: "Forest", color: "from-green-500 to-emerald-600" },
  { id: "lofi", icon: Music2, label: "Lo-Fi", color: "from-purple-500 to-pink-500" },
];

export const AmbientSounds = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);

  const toggleSound = (soundId: string) => {
    setActiveSound(activeSound === soundId ? null : soundId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            {activeSound ? (
              <Volume2 className="w-5 h-5 text-purple-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">Ambient Sounds</h3>
            <p className="text-xs text-muted-foreground">
              {activeSound ? sounds.find(s => s.id === activeSound)?.label : "Select a sound"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {sounds.map((sound) => {
          const Icon = sound.icon;
          const isActive = activeSound === sound.id;
          
          return (
            <motion.button
              key={sound.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSound(sound.id)}
              className={`relative p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-1.5 ${
                isActive 
                  ? `bg-gradient-to-br ${sound.color} border-transparent text-white shadow-lg` 
                  : "bg-muted/50 border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{sound.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sound-indicator"
                  className="absolute inset-0 rounded-xl border-2 border-white/50"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeSound && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-3 border-t border-border/50"
          >
            <div className="flex items-center gap-3">
              <VolumeX className="w-4 h-4 text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
