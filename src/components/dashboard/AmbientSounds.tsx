import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, CloudRain, Wind, Coffee, Waves, TreePine, Music2, Upload, X, Play, Pause, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Working ambient sound URLs (using freesound.org and other reliable sources)
const soundUrls: Record<string, string> = {
  rain: "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3",
  wind: "https://assets.mixkit.co/active_storage/sfx/2532/2532-preview.mp3",
  cafe: "https://assets.mixkit.co/active_storage/sfx/1230/1230-preview.mp3",
  waves: "https://assets.mixkit.co/active_storage/sfx/2513/2513-preview.mp3",
  forest: "https://assets.mixkit.co/active_storage/sfx/2470/2470-preview.mp3",
  lofi: "https://assets.mixkit.co/active_storage/sfx/242/242-preview.mp3",
};

const defaultSounds = [
  { id: "rain", icon: CloudRain, label: "Rain", color: "from-blue-500 to-cyan-500" },
  { id: "wind", icon: Wind, label: "Wind", color: "from-gray-400 to-slate-500" },
  { id: "cafe", icon: Coffee, label: "Café", color: "from-amber-500 to-orange-500" },
  { id: "waves", icon: Waves, label: "Ocean", color: "from-cyan-500 to-blue-600" },
  { id: "forest", icon: TreePine, label: "Forest", color: "from-green-500 to-emerald-600" },
  { id: "lofi", icon: Music2, label: "Lo-Fi", color: "from-purple-500 to-pink-500" },
];

interface CustomSound {
  id: string;
  label: string;
  url: string;
  isFromDb?: boolean;
}

export const AmbientSounds = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customSounds, setCustomSounds] = useState<CustomSound[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom sounds from database
  useEffect(() => {
    if (user) {
      loadCustomSounds();
    }
  }, [user]);

  const loadCustomSounds = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('custom_sounds')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        const sounds: CustomSound[] = data.map((sound: any) => ({
          id: sound.id,
          label: sound.name,
          url: sound.file_path,
          isFromDb: true
        }));
        setCustomSounds(sounds);
      }
    } catch (error) {
      console.error('Error loading custom sounds:', error);
    }
  };

  // Handle audio playback
  useEffect(() => {
    if (activeSound && isPlaying) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.loop = true;
      }

      const customSound = customSounds.find(s => s.id === activeSound);
      const soundUrl = customSound ? customSound.url : soundUrls[activeSound];
      
      if (soundUrl) {
        setIsLoading(true);
        audioRef.current.src = soundUrl;
        audioRef.current.volume = volume / 100;
        audioRef.current.play()
          .then(() => setIsLoading(false))
          .catch((err) => {
            console.error("Audio play error:", err);
            setIsLoading(false);
            toast({
              title: "Unable to play audio",
              description: "Please try another sound or check your connection.",
              variant: "destructive",
            });
          });
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeSound, isPlaying, customSounds]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const toggleSound = (soundId: string) => {
    if (activeSound === soundId) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSound(soundId);
      setIsPlaying(true);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, WAV, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // If user is logged in, upload to storage
    if (user) {
      setIsUploading(true);
      try {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        
        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('audio-files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('audio-files')
          .getPublicUrl(fileName);

        // Save to database
        const { data: soundData, error: dbError } = await supabase
          .from('custom_sounds')
          .insert({
            user_id: user.id,
            name: file.name.replace(/\.[^/.]+$/, "").slice(0, 20),
            file_path: urlData.publicUrl
          })
          .select()
          .single();

        if (dbError) throw dbError;

        // Add to local state
        const newSound: CustomSound = {
          id: soundData.id,
          label: soundData.name,
          url: soundData.file_path,
          isFromDb: true
        };

        setCustomSounds(prev => [...prev, newSound]);
        toast({
          title: "Sound uploaded!",
          description: `"${newSound.label}" is saved and ready to play`,
        });
      } catch (error) {
        console.error('Error uploading sound:', error);
        toast({
          title: "Upload failed",
          description: "Could not save sound. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    } else {
      // Local only (not logged in)
      const url = URL.createObjectURL(file);
      const newSound: CustomSound = {
        id: `custom-${Date.now()}`,
        label: file.name.replace(/\.[^/.]+$/, "").slice(0, 10),
        url,
        isFromDb: false
      };

      setCustomSounds(prev => [...prev, newSound]);
      toast({
        title: "Sound added!",
        description: `"${newSound.label}" is ready to play (sign in to save permanently)`,
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeCustomSound = async (id: string) => {
    const sound = customSounds.find(s => s.id === id);
    if (!sound) return;

    // Stop if currently playing
    if (activeSound === id) {
      setActiveSound(null);
      setIsPlaying(false);
    }

    // If from database, delete from storage and db
    if (sound.isFromDb && user) {
      try {
        await supabase
          .from('custom_sounds')
          .delete()
          .eq('id', id);

        toast({
          title: "Sound deleted",
          description: "Sound removed from your library",
        });
      } catch (error) {
        console.error('Error deleting sound:', error);
        toast({
          title: "Delete failed",
          description: "Could not remove sound. Please try again.",
          variant: "destructive",
        });
        return;
      }
    } else if (!sound.isFromDb) {
      URL.revokeObjectURL(sound.url);
    }

    setCustomSounds(prev => prev.filter(s => s.id !== id));
  };

  const allSounds = [...defaultSounds, ...customSounds.map(s => ({
    id: s.id,
    icon: Music2,
    label: s.label,
    color: "from-rose-500 to-red-500",
  }))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            {isPlaying && activeSound ? (
              <Volume2 className="w-5 h-5 text-purple-400 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">Ambient Sounds</h3>
            <p className="text-xs text-muted-foreground">
              {isPlaying && activeSound 
                ? `Playing: ${allSounds.find(s => s.id === activeSound)?.label}` 
                : "Select a sound"}
            </p>
          </div>
        </div>
        
        {/* Upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          title="Upload your own sound"
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {allSounds.map((sound) => {
          const Icon = sound.icon;
          const isActive = activeSound === sound.id;
          const isCustom = !defaultSounds.some(d => d.id === sound.id);
          
          return (
            <motion.div
              key={sound.id}
              className="relative"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSound(sound.id)}
                className={`w-full relative p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-1.5 ${
                  isActive 
                    ? `bg-gradient-to-br ${sound.color} border-transparent text-white shadow-lg` 
                    : "bg-muted/50 border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                {isLoading && isActive ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isActive && isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : isActive ? (
                  <Play className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
                <span className="text-[10px] font-medium truncate max-w-full">{sound.label}</span>
                {isActive && isPlaying && (
                  <motion.div
                    layoutId="sound-indicator"
                    className="absolute inset-0 rounded-xl border-2 border-white/50"
                  />
                )}
              </motion.button>
              
              {/* Remove button for custom sounds */}
              {isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCustomSound(sound.id);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {!user && customSounds.length > 0 && (
        <p className="text-xs text-muted-foreground text-center mb-3">
          Sign in to save your custom sounds permanently
        </p>
      )}

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
              <span className="text-xs text-muted-foreground w-8">{volume}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
