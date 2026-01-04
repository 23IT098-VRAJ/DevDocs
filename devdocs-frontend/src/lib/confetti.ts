/**
 * Success Animation Utilities
 * Confetti and celebration effects for user achievements
 */

import confetti from 'canvas-confetti';

/**
 * Trigger confetti explosion
 * Used when users successfully save solutions
 */
export function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/**
 * Trigger side cannons confetti
 * More dramatic celebration for major achievements
 */
export function triggerSideCannons() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Left side
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });

    // Right side
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

/**
 * Trigger emoji confetti with custom emojis
 */
export function triggerEmojiConfetti(emojis: string[] = ['🎉', '✨', '🎊', '🌟']) {
  const scalar = 2;
  const emoji = confetti.shapeFromText({ text: emojis[Math.floor(Math.random() * emojis.length)], scalar });

  confetti({
    shapes: [emoji],
    scalar,
    particleCount: 50,
    spread: 100,
    startVelocity: 30,
    origin: { y: 0.6 },
    zIndex: 9999,
  });
}

/**
 * Trigger realistic confetti
 * More subtle, realistic physics
 */
export function triggerRealisticConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#3b82f6', '#8b5cf6', '#06b6d4'],
  });

  fire(0.2, {
    spread: 60,
    colors: ['#3b82f6', '#8b5cf6', '#06b6d4'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#3b82f6', '#8b5cf6', '#06b6d4'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#3b82f6', '#8b5cf6', '#06b6d4'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#3b82f6', '#8b5cf6', '#06b6d4'],
  });
}
