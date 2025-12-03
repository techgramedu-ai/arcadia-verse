import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const CosmicBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cosmic-cyan/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cosmic-magenta/10 rounded-full blur-[120px]" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cosmic-violet/5 rounded-full blur-[150px]" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--cosmic-cyan) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--cosmic-cyan) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `particleFloat ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
