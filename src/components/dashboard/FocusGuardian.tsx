import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Shield, Camera, AlertTriangle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FocusGuardianProps {
  isTimerRunning: boolean;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
}

export const FocusGuardian = ({ isTimerRunning, onPauseTimer, onResumeTimer }: FocusGuardianProps) => {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [nudgePlayed, setNudgePlayed] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("full_name").eq("user_id", user.id).single();
        if (data?.full_name) setUserName(data.full_name.split(" ")[0]);
      }
    };
    fetchName();
  }, []);

  const playNudge = useCallback(() => {
    if (nudgePlayed) return;
    setNudgePlayed(true);
    const utterance = new SpeechSynthesisUtterance(`Hey ${userName}, stay focused. You've got this.`);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.7;
    speechSynthesis.speak(utterance);
    setTimeout(() => setNudgePlayed(false), 30000); // cooldown
  }, [nudgePlayed, userName]);

  const handleFaceDisappeared = useCallback(() => {
    if (isTimerRunning) {
      onPauseTimer();
      playNudge();
      toast({
        title: "👀 Focus paused",
        description: "We noticed you stepped away. Timer paused automatically.",
      });
    }
  }, [isTimerRunning, onPauseTimer, playNudge, toast]);

  const handleFaceReappeared = useCallback(() => {
    onResumeTimer();
    toast({
      title: "🎯 Welcome back!",
      description: "Timer resumed. Keep up the great work!",
    });
  }, [onResumeTimer, toast]);

  const { status, isFacePresent, absenceSeconds, videoRef, startCamera, stopCamera } =
    useFaceDetection({
      onFaceDisappeared: handleFaceDisappeared,
      onFaceReappeared: handleFaceReappeared,
      absenceThresholdMs: 10000,
    });

  const handleEnable = () => {
    setShowPrivacyNotice(true);
  };

  const handleAcceptPrivacy = async () => {
    setShowPrivacyNotice(false);
    setEnabled(true);
    await startCamera();
  };

  const handleDisable = () => {
    setEnabled(false);
    stopCamera();
  };

  const statusConfig = {
    idle: { color: "text-muted-foreground", bg: "bg-muted/50", label: "Off" },
    loading: { color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Starting..." },
    active: { color: "text-green-500", bg: "bg-green-500/10", label: "Monitoring" },
    "no-face": { color: "text-red-500", bg: "bg-red-500/10", label: "Away" },
    error: { color: "text-destructive", bg: "bg-destructive/10", label: "Error" },
  };

  const currentStatus = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold">AI Focus Guardian™</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${currentStatus.color} ${status === "active" ? "animate-pulse" : ""}`}
                style={{ backgroundColor: "currentColor" }}
              />
              <span className={`text-xs ${currentStatus.color}`}>{currentStatus.label}</span>
            </div>
          </div>
        </div>

        {enabled ? (
          <Button variant="ghost" size="sm" onClick={handleDisable} className="text-xs">
            <EyeOff className="w-3.5 h-3.5 mr-1" />
            Disable
          </Button>
        ) : (
          <Button variant="glass" size="sm" onClick={handleEnable} className="text-xs">
            <Eye className="w-3.5 h-3.5 mr-1" />
            Enable
          </Button>
        )}
      </div>

      {/* Privacy Notice Modal */}
      <AnimatePresence>
        {showPrivacyNotice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-20 bg-card/95 backdrop-blur-xl p-5 flex flex-col justify-center rounded-2xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-primary" />
              <h4 className="font-heading font-semibold text-sm">Privacy First</h4>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                All processing happens locally in your browser
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                No video, images, or biometric data is stored
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                No data is transmitted to any server
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Camera access can be revoked anytime
              </li>
            </ul>
            <div className="flex gap-2">
              <Button variant="glass" size="sm" onClick={() => setShowPrivacyNotice(false)} className="flex-1 text-xs">
                Cancel
              </Button>
              <Button variant="glow" size="sm" onClick={handleAcceptPrivacy} className="flex-1 text-xs">
                <Camera className="w-3.5 h-3.5 mr-1" />
                Allow Camera
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Preview / Distracted Overlay */}
      <div className={`${enabled && status !== "error" ? "mb-3 rounded-xl overflow-hidden border border-border/50 relative" : "hidden"}`}>
        <video
          ref={videoRef}
          className={`w-full h-auto rounded-xl ${!isFacePresent && enabled ? "hidden" : ""}`}
          muted
          playsInline
          width={320}
          height={240}
          style={{ transform: "scaleX(-1)" }}
        />
        {!isFacePresent && enabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full aspect-video bg-destructive/10 rounded-xl flex flex-col items-center justify-center gap-3"
          >
            <AlertTriangle className="w-10 h-10 text-destructive animate-pulse" />
            <p className="text-sm font-semibold text-destructive">{userName} is distracted</p>
            <p className="text-xs text-muted-foreground">Camera paused • Come back to resume</p>
          </motion.div>
        )}
        {isFacePresent && status === "active" && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-green-500/80 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live
          </div>
        )}
      </div>

      {/* Status Display */}
      {enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-3"
        >
          {/* Face Detection Status */}
          <div className={`flex items-center gap-3 p-3 rounded-xl ${currentStatus.bg} transition-colors`}>
            {isFacePresent ? (
              <>
                <Eye className={`w-4 h-4 ${currentStatus.color}`} />
                <span className="text-xs font-medium">Presence detected — session active</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <div className="flex-1">
                  <span className="text-xs font-medium text-red-500">No presence detected</span>
                  <p className="text-xs text-muted-foreground">
                    Away for {absenceSeconds}s — timer paused
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Nudge indicator */}
          {!isFacePresent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Voice nudge sent: "Hey, stay focused. You've got this."</span>
            </motion.div>
          )}

          {/* Loading state */}
          {status === "loading" && (
            <div className="flex items-center justify-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full"
              />
              <span className="text-xs text-muted-foreground ml-3">Loading AI model...</span>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="p-3 rounded-xl bg-destructive/10 text-xs text-destructive">
              Camera access denied. Please allow camera permissions and try again.
            </div>
          )}
        </motion.div>
      )}

      {/* Inactive description */}
      {!enabled && (
        <p className="text-xs text-muted-foreground">
          Enable AI-powered attention monitoring to auto-pause your timer when you step away and get gentle nudges to stay focused.
        </p>
      )}
    </motion.div>
  );
};
