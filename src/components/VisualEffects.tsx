import React, { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { AppMode } from '../utils';

interface VisualEffectsProps {
  mode: AppMode;
  enabled: boolean;
}

export const VisualEffects: React.FC<VisualEffectsProps> = ({ mode, enabled }) => {
  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <FloatingShapes mode={mode} />
      <MouseTrail mode={mode} />
    </div>
  );
};

const FloatingShapes = ({ mode }: { mode: AppMode }) => {
  const colors = {
    femboy: "text-pink-200 fill-pink-100",
    mtf: "text-blue-200 fill-pink-100",
    ftm: "text-cyan-200 fill-blue-100",
    enby: "text-purple-200 fill-yellow-100"
  };

  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div 
          key={i}
          className={`absolute opacity-30 animate-float`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
            transform: `scale(${0.5 + Math.random()})`
          }}
        >
           {i % 2 === 0 ? (
             <Heart className={`${colors[mode]} w-24 h-24`} />
           ) : (
             <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm shadow-lg" />
           )}
        </div>
      ))}
    </>
  );
};

const MouseTrail = ({ mode }: { mode: AppMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const particle = document.createElement('div');
      particle.className = `absolute w-3 h-3 rounded-full pointer-events-none transition-transform duration-500 ease-out`;
      
      // Determine color based on mode
      let bg = 'bg-pink-400';
      if (mode === 'mtf') bg = 'bg-blue-400';
      if (mode === 'ftm') bg = 'bg-cyan-500';
      if (mode === 'enby') bg = 'bg-purple-500';

      particle.classList.add(bg);
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      particle.style.transform = `translate(-50%, -50%) scale(1)`;
      particle.style.opacity = '0.6';
      
      containerRef.current.appendChild(particle);

      // Animate out
      requestAnimationFrame(() => {
        particle.style.transform = `translate(-50%, -50%) scale(0) translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`;
        particle.style.opacity = '0';
      });

      setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
      }, 500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mode]);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
};