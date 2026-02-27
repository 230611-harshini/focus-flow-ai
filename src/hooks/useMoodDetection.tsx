import { useState, useRef, useCallback, useEffect } from "react";

export type Mood = "focused" | "neutral" | "distracted" | "tired" | "stressed";

interface MoodInfo {
  mood: Mood;
  emoji: string;
  label: string;
  color: string;
  suggestion?: string;
}

const moodMap: Record<Mood, MoodInfo> = {
  focused: {
    mood: "focused",
    emoji: "🎯",
    label: "Focused",
    color: "text-green-500",
  },
  neutral: {
    mood: "neutral",
    emoji: "😊",
    label: "Neutral",
    color: "text-blue-400",
  },
  distracted: {
    mood: "distracted",
    emoji: "😐",
    label: "Distracted",
    color: "text-yellow-500",
    suggestion: "Try closing unnecessary tabs and silencing notifications.",
  },
  tired: {
    mood: "tired",
    emoji: "😴",
    label: "Tired",
    color: "text-orange-500",
    suggestion: "You seem tired. Consider a 2-minute breathing exercise or a short break.",
  },
  stressed: {
    mood: "stressed",
    emoji: "😟",
    label: "Stressed",
    color: "text-red-400",
    suggestion: "Take a deep breath. A 5-minute break could help you reset.",
  },
};

interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
}

// Eye Aspect Ratio — low values indicate closed/droopy eyes (tiredness)
function computeEAR(landmarks: LandmarkPoint[]): number {
  // Using MediaPipe face mesh indices for left eye
  // Upper lid: 159, 145 | Outer: 33, Inner: 133 | Lower: 153, 144
  const p1 = landmarks[159]; // upper
  const p2 = landmarks[145]; // upper
  const p3 = landmarks[33];  // outer corner
  const p4 = landmarks[133]; // inner corner
  const p5 = landmarks[153]; // lower
  const p6 = landmarks[144]; // lower

  if (!p1 || !p2 || !p3 || !p4 || !p5 || !p6) return 0.3;

  const verticalDist1 = Math.sqrt((p1.x - p5.x) ** 2 + (p1.y - p5.y) ** 2);
  const verticalDist2 = Math.sqrt((p2.x - p6.x) ** 2 + (p2.y - p6.y) ** 2);
  const horizontalDist = Math.sqrt((p3.x - p4.x) ** 2 + (p3.y - p4.y) ** 2);

  if (horizontalDist === 0) return 0.3;
  return (verticalDist1 + verticalDist2) / (2 * horizontalDist);
}

// Mouth Aspect Ratio — high values may indicate yawning
function computeMAR(landmarks: LandmarkPoint[]): number {
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];
  const leftCorner = landmarks[61];
  const rightCorner = landmarks[291];

  if (!upperLip || !lowerLip || !leftCorner || !rightCorner) return 0;

  const verticalDist = Math.sqrt((upperLip.x - lowerLip.x) ** 2 + (upperLip.y - lowerLip.y) ** 2);
  const horizontalDist = Math.sqrt((leftCorner.x - rightCorner.x) ** 2 + (leftCorner.y - rightCorner.y) ** 2);

  if (horizontalDist === 0) return 0;
  return verticalDist / horizontalDist;
}

// Brow height ratio — low values indicate furrowed brows (stress)
function computeBrowHeight(landmarks: LandmarkPoint[]): number {
  const leftBrow = landmarks[70];  // left eyebrow
  const leftEye = landmarks[159];  // left upper eyelid
  const noseBridge = landmarks[6]; // nose bridge for normalization

  if (!leftBrow || !leftEye || !noseBridge) return 0.15;

  const browToEye = Math.sqrt((leftBrow.x - leftEye.x) ** 2 + (leftBrow.y - leftEye.y) ** 2);
  const noseToEye = Math.sqrt((noseBridge.x - leftEye.x) ** 2 + (noseBridge.y - leftEye.y) ** 2);

  if (noseToEye === 0) return 0.15;
  return browToEye / noseToEye;
}

// Head stability — large movements suggest distraction
function computeHeadStability(
  currentNose: LandmarkPoint,
  previousNose: LandmarkPoint | null
): number {
  if (!previousNose) return 0;
  return Math.sqrt(
    (currentNose.x - previousNose.x) ** 2 + (currentNose.y - previousNose.y) ** 2
  );
}

function classifyMood(
  ear: number,
  mar: number,
  browHeight: number,
  headMovement: number,
  recentMoods: Mood[]
): Mood {
  // Tiredness: low EAR (droopy eyes) or high MAR (yawning)
  if (ear < 0.18 || mar > 0.5) return "tired";

  // Stress: furrowed brows (low brow height)
  if (browHeight < 0.08) return "stressed";

  // Distraction: high head movement
  if (headMovement > 15) return "distracted";

  // Count recent tired/stressed occurrences for trend detection
  const recentTired = recentMoods.filter(m => m === "tired").length;
  const recentStressed = recentMoods.filter(m => m === "stressed").length;
  if (recentTired >= 3) return "tired";
  if (recentStressed >= 3) return "stressed";

  // Focused: stable head, open eyes, relaxed brows
  if (headMovement < 3 && ear > 0.22 && browHeight > 0.12) return "focused";

  return "neutral";
}

interface UseMoodDetectionOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  onMoodChange?: (mood: Mood, info: MoodInfo) => void;
}

export const useMoodDetection = ({ videoRef, isActive, onMoodChange }: UseMoodDetectionOptions) => {
  const [currentMood, setCurrentMood] = useState<Mood>("neutral");
  const [moodHistory, setMoodHistory] = useState<Mood[]>([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const detectorRef = useRef<any>(null);
  const animFrameRef = useRef<number>(0);
  const previousNoseRef = useRef<LandmarkPoint | null>(null);
  const recentMoodsRef = useRef<Mood[]>([]);
  const lastMoodChangeRef = useRef<number>(Date.now());

  const startDetection = useCallback(async () => {
    try {
      const faceLandmarks = await import("@tensorflow-models/face-landmarks-detection");
      const detector = await faceLandmarks.createDetector(
        faceLandmarks.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: "tfjs",
          maxFaces: 1,
          refineLandmarks: true,
        }
      );
      detectorRef.current = detector;
      setIsModelLoaded(true);

      const detect = async () => {
        if (!detectorRef.current || !videoRef.current || videoRef.current.readyState < 2) {
          animFrameRef.current = requestAnimationFrame(detect);
          return;
        }

        try {
          const faces = await detectorRef.current.estimateFaces(videoRef.current);
          if (faces.length > 0 && faces[0].keypoints) {
            const landmarks = faces[0].keypoints as LandmarkPoint[];

            const ear = computeEAR(landmarks);
            const mar = computeMAR(landmarks);
            const browHeight = computeBrowHeight(landmarks);
            const noseTip = landmarks[1]; // nose tip
            const headMovement = computeHeadStability(noseTip, previousNoseRef.current);
            previousNoseRef.current = noseTip;

            const mood = classifyMood(ear, mar, browHeight, headMovement, recentMoodsRef.current);

            // Smooth mood transitions (only change after sustained detection)
            recentMoodsRef.current.push(mood);
            if (recentMoodsRef.current.length > 10) {
              recentMoodsRef.current.shift();
            }

            // Find most common mood in recent window
            const moodCounts = recentMoodsRef.current.reduce((acc, m) => {
              acc[m] = (acc[m] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            const dominantMood = Object.entries(moodCounts).sort(
              (a, b) => b[1] - a[1]
            )[0]?.[0] as Mood || "neutral";

            // Only update if mood is stable (>= 5 occurrences) and enough time passed
            const now = Date.now();
            if (
              dominantMood !== currentMood &&
              (moodCounts[dominantMood] || 0) >= 5 &&
              now - lastMoodChangeRef.current > 3000
            ) {
              lastMoodChangeRef.current = now;
              setCurrentMood(dominantMood);
              setMoodHistory(prev => [...prev.slice(-29), dominantMood]);
              onMoodChange?.(dominantMood, moodMap[dominantMood]);
            }
          }
        } catch {
          // silently continue
        }

        animFrameRef.current = requestAnimationFrame(detect);
      };

      detect();
    } catch (err) {
      console.error("Mood detection error:", err);
    }
  }, [videoRef, onMoodChange, currentMood]);

  const stopDetection = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (detectorRef.current) {
      detectorRef.current.dispose?.();
      detectorRef.current = null;
    }
    setIsModelLoaded(false);
    previousNoseRef.current = null;
    recentMoodsRef.current = [];
  }, []);

  useEffect(() => {
    if (isActive) {
      startDetection();
    } else {
      stopDetection();
    }
    return () => stopDetection();
  }, [isActive, startDetection, stopDetection]);

  const moodInfo = moodMap[currentMood];

  return {
    currentMood,
    moodInfo,
    moodHistory,
    isModelLoaded,
    moodMap,
  };
};
