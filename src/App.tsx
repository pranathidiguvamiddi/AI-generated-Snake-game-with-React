/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] flex flex-col items-center py-8 px-4 font-digital relative scanlines">
      <div className="static-noise"></div>
      
      <header className="mb-8 text-center z-10 screen-tear w-full border-b-4 border-[#ff00ff] pb-4">
        <h1 
          className="text-4xl md:text-6xl font-arcade text-[#00ffff] glitch-text uppercase tracking-tighter"
          data-text="SYS.SNAKE_PROTOCOL"
        >
          SYS.SNAKE_PROTOCOL
        </h1>
        <p className="text-[#ff00ff] mt-4 font-digital text-3xl tracking-widest uppercase bg-black inline-block px-2">
          [STATUS: ONLINE_]
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full gap-12 z-10">
        <SnakeGame />
        <MusicPlayer />
      </main>
    </div>
  );
}

