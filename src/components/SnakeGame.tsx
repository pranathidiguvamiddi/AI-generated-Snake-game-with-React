import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, Keyboard } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const SPEED = 70;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const foodRef = useRef(food);
  foodRef.current = food;

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ') {
      setIsPaused(p => !p);
      return;
    }

    if (gameOver || isPaused) return;

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [gameOver, isPaused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [gameOver, isPaused]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    const newFood = generateFood(INITIAL_SNAKE);
    setFood(newFood);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-md mb-2 px-2 items-end border-b-2 border-[#00ffff] pb-2">
        <div 
          className="text-[#00ffff] font-digital text-4xl glitch-text"
          data-text={`YIELD:${score.toString().padStart(4, '0')}`}
        >
          YIELD:{score.toString().padStart(4, '0')}
        </div>
        <div 
          className="text-[#ff00ff] font-digital text-3xl glitch-text"
          data-text={gameOver ? 'FATAL_ERR' : isPaused ? 'HALT' : 'EXEC'}
        >
          {gameOver ? 'FATAL_ERR' : isPaused ? 'HALT' : 'EXEC'}
        </div>
      </div>

      <div
        className="relative bg-black border-4 border-[#ff00ff] overflow-hidden screen-tear"
        style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20, boxShadow: 'inset 0 0 20px rgba(0,255,255,0.5)' }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none"
             style={{
               backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }}
        />

        {snake.map((segment, index) => {
          const intensity = 1 - (index / snake.length);
          return (
            <div
              key={index}
              className="absolute bg-[#00ffff]"
              style={{
                left: segment.x * 20,
                top: segment.y * 20,
                width: 20,
                height: 20,
                opacity: index === 0 ? 1 : Math.max(0.2, intensity),
                boxShadow: index === 0 ? '0 0 10px #00ffff' : 'none',
                transform: `scale(${index === 0 ? 1 : Math.max(0.5, intensity)})`,
                transition: 'all 0.07s linear',
                zIndex: snake.length - index,
              }}
            />
          );
        })}
        <div
          className="absolute bg-[#ff00ff] shadow-[0_0_15px_#ff00ff]"
          style={{
            left: food.x * 20,
            top: food.y * 20,
            width: 20,
            height: 20,
            animation: 'glitch-anim-1 0.5s infinite linear alternate-reverse'
          }}
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 border-8 border-[#ff00ff]">
            <h2 
              className="text-4xl font-arcade text-[#ff00ff] mb-6 glitch-text"
              data-text="FATAL_ERR"
            >
              FATAL_ERR
            </h2>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-[#00ffff] text-black font-arcade text-xl tracking-widest hover:bg-[#ff00ff] hover:text-white transition-none cursor-pointer border-4 border-black"
            >
              REBOOT
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-8 bg-[#ff00ff] text-black px-4 py-2 font-arcade text-sm">
        <div className="flex items-center gap-3">
          <span>[WASD]: INPUT_VECTOR</span>
        </div>
        <div className="flex items-center gap-3">
          <span>[SPACE]: INTERRUPT</span>
        </div>
      </div>
    </div>
  );
}
