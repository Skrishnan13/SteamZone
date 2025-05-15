
"use client";

import React, { useRef, useEffect, useCallback } from 'react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 50;
// PLAYER_COLOR, PLATFORM_COLOR, and background color will be resolved from CSS variables
const GRAVITY = 0.6;
const JUMP_STRENGTH = -12;
const PLAYER_SPEED = 5;

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

const PixelPlatformerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef({
    x: 50,
    y: CANVAS_HEIGHT - PLAYER_HEIGHT - 50, // Start on a platform
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    onGround: false,
  });

  const platformsRef = useRef<Platform[]>([
    { x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40 }, // Ground
    { x: 150, y: CANVAS_HEIGHT - 120, width: 150, height: 20 },
    { x: 350, y: CANVAS_HEIGHT - 200, width: 100, height: 20 },
    { x: 50, y: CANVAS_HEIGHT - 280, width: 80, height: 20 },
  ]);

  const keysPressedRef = useRef<{ [key: string]: boolean }>({});

  const resolvedColorsRef = useRef({
    background: 'hsl(224 71% 4%)', // Fallback, should match globals.css
    player: 'hsl(233 64% 50%)',    // Fallback
    platform: 'hsl(215 28% 17%)', // Fallback
  });

  useEffect(() => {
    // Fetch actual CSS variable values on mount
    if (typeof window !== 'undefined') {
      const styles = getComputedStyle(document.documentElement);
      const bgHslValue = styles.getPropertyValue('--background').trim();
      const playerHslValue = styles.getPropertyValue('--primary').trim();
      const platformHslValue = styles.getPropertyValue('--secondary').trim();

      if (bgHslValue) resolvedColorsRef.current.background = `hsl(${bgHslValue})`;
      if (playerHslValue) resolvedColorsRef.current.player = `hsl(${playerHslValue})`;
      if (platformHslValue) resolvedColorsRef.current.platform = `hsl(${platformHslValue})`;
    }
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const player = playerRef.current;
    const platforms = platformsRef.current;

    if (!canvas || !ctx) return;

    // Clear canvas and fill with background color
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = resolvedColorsRef.current.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


    // Apply gravity
    player.velocityY += GRAVITY;
    player.y += player.velocityY;
    player.x += player.velocityX;

    player.onGround = false;

    // Collision with platforms
    for (const platform of platforms) {
      if (
        player.x < platform.x + platform.width &&
        player.x + player.width > platform.x &&
        player.y < platform.y + platform.height &&
        player.y + player.height > platform.y
      ) {
        // Check for collision from top
        if (player.velocityY >= 0 && player.y + player.height - player.velocityY <= platform.y + 1) {
          player.y = platform.y - player.height;
          player.velocityY = 0;
          player.isJumping = false;
          player.onGround = true;
        }
        // Basic side collision (stop movement)
        else if (player.x + player.width > platform.x && player.x < platform.x + platform.width) {
             if (player.velocityX > 0 && player.x + player.width - player.velocityX <= platform.x) {
                player.x = platform.x - player.width;
                player.velocityX = 0;
            } else if (player.velocityX < 0 && player.x - player.velocityX >= platform.x + platform.width) {
                player.x = platform.x + platform.width;
                player.velocityX = 0;
            }
        }
      }
    }
    
    // Collision with canvas boundaries (sides)
    if (player.x < 0) {
      player.x = 0;
      player.velocityX = 0;
    }
    if (player.x + player.width > CANVAS_WIDTH) {
      player.x = CANVAS_WIDTH - player.width;
      player.velocityX = 0;
    }
    // Fall off bottom (reset for simplicity)
    if (player.y > CANVAS_HEIGHT) {
        player.y = CANVAS_HEIGHT - PLAYER_HEIGHT - 50;
        player.x = 50;
        player.velocityY = 0;
        player.isJumping = false;
    }


    // Handle horizontal movement
    player.velocityX = 0;
    if (keysPressedRef.current['ArrowLeft']) {
      player.velocityX = -PLAYER_SPEED;
    }
    if (keysPressedRef.current['ArrowRight']) {
      player.velocityX = PLAYER_SPEED;
    }
    
    // Draw player
    ctx.fillStyle = resolvedColorsRef.current.player;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    ctx.fillStyle = resolvedColorsRef.current.platform;
    platforms.forEach(p => { // Renamed platform to p to avoid conflict with resolvedColorsRef.current.platform
      ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    requestAnimationFrame(gameLoop);
  }, []); // Empty dependency array for useCallback is okay as it reads from refs

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key] = true;
      if (e.key === 'ArrowUp' && !playerRef.current.isJumping && playerRef.current.onGround) {
        playerRef.current.velocityY = JUMP_STRENGTH;
        playerRef.current.isJumping = true;
        playerRef.current.onGround = false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Ensure gameLoop reference is stable for requestAnimationFrame
    const currentLoop = gameLoop;
    const animationFrameId = requestAnimationFrame(currentLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameLoop]); // Rerun if gameLoop reference changes (it shouldn't with useCallback an empty dep array)

  return (
    <div className="flex justify-center items-center p-4 bg-card-foreground/5 rounded-md">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-border shadow-lg rounded"
        style={{ imageRendering: 'pixelated' }} // for a more retro feel if using pixel art later
      />
    </div>
  );
};

export default PixelPlatformerGame;
