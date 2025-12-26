import { AnimatedScene3D } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";

export function SplineHero() {
  return (
    <Card className="w-full h-[500px] bg-background/50 relative overflow-hidden border-border/50">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="hsl(var(--primary))"
      />
      
      <div className="flex h-full flex-col md:flex-row">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
            AI / Smart Work Theme
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg">
            AI-powered productivity platform that combines intelligent focus tools with immersive 3D design to help users work with clarity, efficiency, and purpose.
          </p>
        </div>

        {/* Right content - 3D Scene */}
        <div className="flex-1 relative">
          <AnimatedScene3D className="w-full h-full" />
        </div>
      </div>
    </Card>
  );
}
