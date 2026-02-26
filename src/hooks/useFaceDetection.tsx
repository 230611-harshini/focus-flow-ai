import { useState, useEffect, useRef, useCallback } from "react";

type GuardianStatus = "idle" | "loading" | "active" | "no-face" | "error";

interface UseFaceDetectionOptions {
  onFaceDisappeared?: () => void;
  onFaceReappeared?: () => void;
  absenceThresholdMs?: number;
}

export const useFaceDetection = ({
  onFaceDisappeared,
  onFaceReappeared,
  absenceThresholdMs = 15000,
}: UseFaceDetectionOptions = {}) => {
  const [status, setStatus] = useState<GuardianStatus>("idle");
  const [isFacePresent, setIsFacePresent] = useState(true);
  const [absenceSeconds, setAbsenceSeconds] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const detectorRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastFaceTimeRef = useRef<number>(Date.now());
  const faceGoneNotifiedRef = useRef(false);
  const absenceIntervalRef = useRef<NodeJS.Timeout>();

  const startCamera = useCallback(async () => {
    try {
      setStatus("loading");

      // Import TensorFlow.js and face detection
      const tf = await import("@tensorflow/tfjs");
      await tf.setBackend("webgl");
      await tf.ready();

      const faceDetection = await import("@tensorflow-models/face-detection");
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detector = await faceDetection.createDetector(model, {
        runtime: "tfjs",
        maxFaces: 1,
      });
      detectorRef.current = detector;

      // Request camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
      });
      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus("active");
      lastFaceTimeRef.current = Date.now();
      faceGoneNotifiedRef.current = false;

      // Start detection loop
      detectLoop();

      // Start absence counter
      absenceIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - lastFaceTimeRef.current;
        if (!faceGoneNotifiedRef.current) {
          setAbsenceSeconds(0);
        } else {
          setAbsenceSeconds(Math.floor(elapsed / 1000));
        }
      }, 1000);
    } catch (err: any) {
      console.error("Focus Guardian error:", err);
      if (err.name === "NotAllowedError") {
        setStatus("error");
      } else {
        setStatus("error");
      }
    }
  }, []);

  const detectLoop = useCallback(async () => {
    if (!detectorRef.current || !videoRef.current) return;

    try {
      const faces = await detectorRef.current.estimateFaces(videoRef.current);
      const faceDetected = faces.length > 0;

      if (faceDetected) {
        lastFaceTimeRef.current = Date.now();
        if (faceGoneNotifiedRef.current) {
          faceGoneNotifiedRef.current = false;
          setIsFacePresent(true);
          setAbsenceSeconds(0);
          setStatus("active");
          onFaceReappeared?.();
        }
      } else {
        const elapsed = Date.now() - lastFaceTimeRef.current;
        if (elapsed >= absenceThresholdMs && !faceGoneNotifiedRef.current) {
          faceGoneNotifiedRef.current = true;
          setIsFacePresent(false);
          setStatus("no-face");
          onFaceDisappeared?.();
        }
      }
    } catch {
      // silently continue
    }

    animFrameRef.current = requestAnimationFrame(detectLoop);
  }, [absenceThresholdMs, onFaceDisappeared, onFaceReappeared]);

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (absenceIntervalRef.current) {
      clearInterval(absenceIntervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (detectorRef.current) {
      detectorRef.current.dispose?.();
      detectorRef.current = null;
    }
    setStatus("idle");
    setIsFacePresent(true);
    setAbsenceSeconds(0);
    setHasPermission(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    status,
    isFacePresent,
    absenceSeconds,
    hasPermission,
    videoRef,
    startCamera,
    stopCamera,
  };
};
