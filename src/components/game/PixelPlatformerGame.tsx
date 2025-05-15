
"use client";

import React, { useRef, useEffect, useCallback } from 'react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 50;
const PLAYER_COLOR = 'hsl(var(--primary))';
const PLATFORM_COLOR = 'hsl(var(--secondary))';
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

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const player = playerRef.current;
    const platforms = platformsRef.current;

    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = 'hsl(var(--background))';
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
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    ctx.fillStyle = PLATFORM_COLOR;
    platforms.forEach(platform => {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    requestAnimationFrame(gameLoop);
  }, []);

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

    const animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameLoop]);

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
