import { useState, useEffect } from 'react'

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [SplineComponent, setSplineComponent] = useState<React.ComponentType<{ scene: string; className?: string }> | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('@splinetool/react-spline')
      .then((module) => {
        setSplineComponent(() => module.default)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load Spline:', err)
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !SplineComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm">3D Scene</p>
        </div>
      </div>
    )
  }

  return (
    <SplineComponent
      scene={scene}
      className={className}
    />
  )
}
