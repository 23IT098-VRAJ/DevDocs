/**
 * Background Effects Component
 * Adds grid pattern, floating code snippets, and animated particles
 */

interface BackgroundEffectsProps {
  showGrid?: boolean;
  showFloatingCode?: boolean;
  showParticles?: boolean;
  opacity?: 'low' | 'medium' | 'high';
}

export function BackgroundEffects({ 
  showGrid = true, 
  showFloatingCode = true, 
  showParticles = true,
  opacity = 'medium'
}: BackgroundEffectsProps) {
  const opacityMap = {
    low: 10,
    medium: 30,
    high: 50
  };

  return (
    <>
      {/* Animated Background Grid */}
      {showGrid && (
        <div className={`absolute inset-0 bg-grid opacity-${opacityMap[opacity]}`}></div>
      )}
      
      {/* Floating Code Snippets */}
      {showFloatingCode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-code" style={{top: '10%', left: '5%', animationDelay: '0s'}}>const search = () =&gt; {'{}'}</div>
          <div className="floating-code" style={{top: '20%', right: '8%', animationDelay: '2s'}}>function findSolution()</div>
          <div className="floating-code" style={{top: '60%', left: '10%', animationDelay: '4s'}}>async/await</div>
          <div className="floating-code" style={{bottom: '15%', right: '15%', animationDelay: '6s'}}>import React from 'react'</div>
          <div className="floating-code" style={{top: '40%', right: '20%', animationDelay: '8s'}}>SELECT * FROM</div>
          <div className="floating-code" style={{bottom: '30%', left: '15%', animationDelay: '10s'}}>&lt;Component /&gt;</div>
        </div>
      )}
      
      {/* Animated Particles */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle" style={{top: '20%', left: '15%'}}></div>
          <div className="particle" style={{top: '40%', right: '25%'}}></div>
          <div className="particle" style={{bottom: '30%', left: '30%'}}></div>
          <div className="particle" style={{top: '70%', right: '40%'}}></div>
          <div className="particle" style={{top: '50%', left: '50%'}}></div>
        </div>
      )}
    </>
  );
}
