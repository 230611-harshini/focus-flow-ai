import { motion } from 'framer-motion'

interface AnimatedScene3DProps {
  className?: string
}

export function AnimatedScene3D({ className }: AnimatedScene3DProps) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
      {/* Animated floating orbs */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-primary/60 to-primary/20 blur-sm"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-secondary/60 to-secondary/20 blur-sm"
        style={{ top: '20%', right: '25%' }}
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-accent/60 to-accent/20 blur-sm"
        style={{ bottom: '30%', left: '20%' }}
        animate={{
          y: [-15, 15, -15],
          x: [15, -15, 15],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Central 3D-like cube */}
      <div className="relative preserve-3d" style={{ perspective: '1000px' }}>
        <motion.div
          className="relative w-40 h-40"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 15, 0, -15, 0],
          }}
          transition={{
            rotateY: {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            },
            rotateX: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {/* Cube faces */}
          <div 
            className="absolute w-full h-full rounded-2xl bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/30 backdrop-blur-sm"
            style={{ transform: 'translateZ(80px)' }}
          />
          <div 
            className="absolute w-full h-full rounded-2xl bg-gradient-to-br from-secondary/40 to-secondary/10 border border-secondary/30 backdrop-blur-sm"
            style={{ transform: 'rotateY(90deg) translateZ(80px)' }}
          />
          <div 
            className="absolute w-full h-full rounded-2xl bg-gradient-to-br from-accent/40 to-accent/10 border border-accent/30 backdrop-blur-sm"
            style={{ transform: 'rotateY(180deg) translateZ(80px)' }}
          />
          <div 
            className="absolute w-full h-full rounded-2xl bg-gradient-to-br from-primary/40 to-secondary/10 border border-primary/30 backdrop-blur-sm"
            style={{ transform: 'rotateY(-90deg) translateZ(80px)' }}
          />
          <div 
            className="absolute w-full h-full rounded-2xl bg-gradient-to-br from-secondary/40 to-accent/10 border border-secondary/30 backdrop-blur-sm"
            style={{ transform: 'rotateX(90deg) translateZ(80px)' }}
          />
          <div 
            className="absolute w-full h-full rounded-2xl bg-gradient-to-br from-accent/40 to-primary/10 border border-accent/30 backdrop-blur-sm"
            style={{ transform: 'rotateX(-90deg) translateZ(80px)' }}
          />
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/60"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [-30, 30, -30],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Gradient overlay ring */}
      <motion.div
        className="absolute w-64 h-64 rounded-full border-2 border-primary/20"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />
      
      <motion.div
        className="absolute w-48 h-48 rounded-full border border-secondary/20"
        animate={{
          rotate: [360, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          rotate: {
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />
    </div>
  )
}

// Keep backward compatibility
export const SplineScene = AnimatedScene3D
