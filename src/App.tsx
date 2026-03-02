/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  MessageCircle, 
  Clock, 
  AlertCircle, 
  X, 
  Check, 
  ArrowRight, 
  RotateCcw,
  Flame,
  User,
  Coffee,
  Heart,
  Utensils,
  Store,
  Wind
} from 'lucide-react';
import { WordFragment, Intrusion, GameState, Level } from './types';
import { LEVELS, INTRUSIVE_THOUGHTS } from './constants';

const STRESS_INCREASE_INTRUSION = 12;
const STRESS_DECREASE_CLEAR = 6;
const STRESS_INCREASE_MISS = 18;
const FRAGMENT_LIFESPAN = 6000; // Longer lifespan so more words stay on screen

const BACKGROUND_NPCS = [
  { id: 1, x: 10, y: 30, thoughts: ["Is it raining?", "I forgot my keys.", "This coffee is cold."] },
  { id: 2, x: 80, y: 35, thoughts: ["Why is he staring?", "I need a haircut.", "Burgers again?"] },
  { id: 3, x: 15, y: 60, thoughts: ["Did I lock the door?", "I'm late for work.", "Where's my phone?"] },
];

const CafeBackground = () => (
  <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
    {/* Hanging Lights */}
    <div className="absolute top-0 left-0 w-full flex justify-around px-4 sm:px-20">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-0.5 h-16 sm:h-24 bg-[#5d4037]" />
          <div className="w-8 h-6 sm:w-12 sm:h-8 bg-amber-100 border-2 border-[#5d4037] rounded-b-full light-glow relative">
            <div className="absolute inset-0 bg-amber-200/20 animate-pulse rounded-b-full" />
          </div>
        </div>
      ))}
    </div>

    {/* Window */}
    <div className="absolute top-24 sm:top-32 left-4 sm:left-10 w-32 h-48 sm:w-48 sm:h-64 cafe-window rounded-xl flex items-center justify-center overflow-hidden hidden md:flex">
      <div className="w-full h-1 sm:h-2 bg-[#5d4037] absolute" />
      <div className="h-full w-1 sm:w-2 bg-[#5d4037] absolute" />
      <Wind className="absolute top-6 right-6 text-white/50 w-6 h-6 sm:w-8 sm:h-8" />
    </div>

    {/* Chalkboard Menu */}
    <div className="absolute top-24 sm:top-32 right-4 sm:right-10 w-32 h-48 sm:w-48 sm:h-64 bg-[#2d2d2d] border-4 sm:border-8 border-[#5d4037] rounded-lg p-2 sm:p-4 shadow-xl -rotate-1 hidden md:block">
      <div className="text-white font-display text-[8px] sm:text-[10px] border-b border-white/20 pb-1 mb-2">CAFE MENU</div>
      <div className="space-y-1 sm:space-y-2">
        <div className="h-0.5 sm:h-1 w-full bg-white/20 rounded" />
        <div className="h-0.5 sm:h-1 w-3/4 bg-white/20 rounded" />
        <div className="h-0.5 sm:h-1 w-full bg-white/20 rounded" />
      </div>
      <div className="mt-2 sm:mt-4 text-[6px] sm:text-[8px] text-yellow-200 font-bold uppercase">Coffee of the Day:</div>
      <div className="text-[5px] sm:text-[7px] text-white italic">"The Jittery Thought Latte"</div>
    </div>

    {/* Background Characters & Chairs */}
    {BACKGROUND_NPCS.map(npc => (
      <div key={npc.id} className="absolute hidden lg:block" style={{ left: `${npc.x}%`, top: `${npc.y}%` }}>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-16 sm:w-32 sm:h-24 bg-[#5d4037] chair-back opacity-80 -z-10 border-t-4 border-x-4 border-[#3e2723]" />
        <BobsCharacter seed={npc.id + 10} stress={0} isNPC={true} />
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border border-[#5d4037] px-3 py-1 rounded-full shadow-sm z-20"
        >
          <p className="text-[8px] font-bold text-[#5d4037] whitespace-nowrap italic">
            {npc.thoughts[Math.floor((Date.now() / 5000) % npc.thoughts.length)]}
          </p>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white border-b border-r border-[#5d4037] rotate-45" />
        </motion.div>
      </div>
    ))}
  </div>
);

const LibraryBackground = () => (
  <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
    {/* Bookshelves */}
    <div className="absolute inset-0 flex justify-around px-10">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="w-48 h-full bg-[#5d4037] border-x-8 border-[#3e2723] relative flex flex-col justify-around py-20">
          {[1, 2, 3, 4, 5].map(j => (
            <div key={j} className="h-4 w-full bg-[#3e2723] flex items-end px-1">
              <div className="flex gap-0.5 h-20 -mb-4">
                {Array.from({ length: 12 }).map((_, k) => (
                  <div 
                    key={k} 
                    className="w-3 rounded-t-sm border border-black/20"
                    style={{ 
                      height: `${40 + Math.random() * 40}px`,
                      backgroundColor: ['#8d6e63', '#a1887f', '#795548', '#5d4037', '#4e342e'][Math.floor(Math.random() * 5)]
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>

    {/* Library Lamp */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-32 bg-[#5d4037]" />
    <div className="absolute top-32 left-1/2 -translate-x-1/2 w-24 h-12 bg-emerald-800 border-2 border-[#5d4037] rounded-full light-glow opacity-80" />

    {/* Quiet Sign */}
    <div className="absolute top-40 right-20 w-32 h-40 bg-white border-4 border-[#5d4037] rounded-lg p-4 shadow-xl rotate-3 flex flex-col items-center justify-center">
      <div className="text-[#5d4037] font-display font-bold text-2xl">SHH!</div>
      <div className="text-[#8d6e63] text-[10px] font-bold uppercase tracking-widest">Quiet Please</div>
    </div>

    {/* Background Characters (Studying) */}
    {BACKGROUND_NPCS.map(npc => (
      <div key={npc.id} className="absolute hidden lg:block" style={{ left: `${npc.x}%`, top: `${npc.y}%` }}>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-24 bg-[#5d4037] chair-back opacity-80 -z-10 border-t-4 border-x-4 border-[#3e2723]" />
        <BobsCharacter seed={npc.id + 20} stress={0} isNPC={true} />
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border border-[#5d4037] px-3 py-1 rounded-full shadow-sm z-20"
        >
          <p className="text-[8px] font-bold text-[#5d4037] whitespace-nowrap italic">
            {["Must study...", "Where is that book?", "So many pages.", "I'm tired."][Math.floor((Date.now() / 5000) % 4)]}
          </p>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white border-b border-r border-[#5d4037] rotate-45" />
        </motion.div>
      </div>
    ))}
  </div>
);

const BobsCharacter = ({ seed, stress, isNPC = false }: { seed: number, stress: number, isNPC?: boolean }) => {
  const hairColors = ['#212121', '#3e2723', '#4e342e', '#1a1a1a'];
  const skinTones = ['#f5d6c6', '#f1c27d', '#e0ac69', '#8d5524'];
  const shirtColors = ['#ffffff', '#f4f4f4', '#e0e0e0', '#d1d1d1'];
  
  const hairColor = hairColors[seed % hairColors.length];
  const skinTone = skinTones[(seed + 1) % skinTones.length];
  const shirtColor = shirtColors[(seed + 2) % shirtColors.length];

  const isStressed = !isNPC && stress > 60;
  const isVeryStressed = !isNPC && stress > 85;

  return (
    <div className={`relative ${isNPC ? 'scale-75 opacity-60' : 'w-40 h-60'} flex flex-col items-center`}>
      {/* Neck */}
      <div className="absolute top-[100px] w-10 h-16 z-0 border-x-4 border-[#212121]" style={{ backgroundColor: skinTone }} />
      
      {/* Head */}
      <div 
        className="relative w-24 h-34 rounded-[50%_50%_40%_40%] border-4 border-[#212121] z-10 overflow-hidden"
        style={{ backgroundColor: skinTone }}
      >
        {/* Hair */}
        <div className="absolute top-0 w-full h-10" style={{ backgroundColor: hairColor }} />
        
        {/* Eyes */}
        <div className="absolute top-14 left-0 w-full flex justify-around px-3">
          <div className="relative w-8 h-8 bg-white border-2 border-[#212121] rounded-full flex items-center justify-center">
            <motion.div 
              animate={{ 
                scale: isVeryStressed ? 1.8 : 1,
                x: isStressed ? (Math.random() - 0.5) * 3 : 0,
                y: isStressed ? (Math.random() - 0.5) * 3 : 0
              }}
              className="w-1.5 h-1.5 bg-[#212121] rounded-full" 
            />
          </div>
          <div className="relative w-8 h-8 bg-white border-2 border-[#212121] rounded-full flex items-center justify-center">
            <motion.div 
              animate={{ 
                scale: isVeryStressed ? 1.8 : 1,
                x: isStressed ? (Math.random() - 0.5) * 3 : 0,
                y: isStressed ? (Math.random() - 0.5) * 3 : 0
              }}
              className="w-1.5 h-1.5 bg-[#212121] rounded-full" 
            />
          </div>
        </div>

        {/* Nose */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-5 h-7 border-r-2 border-b-2 border-[#212121]/40 rounded-br-xl" />

        {/* Mouth */}
        <motion.div 
          animate={{ 
            width: isStressed ? 28 : 14,
            height: isStressed ? 6 : 2,
            borderRadius: isStressed ? '6px' : '0',
            y: isStressed ? 6 : 0,
            rotate: isStressed ? (Math.random() - 0.5) * 5 : 0
          }}
          className="absolute top-28 left-1/2 -translate-x-1/2 bg-[#212121] opacity-90"
        />

        {/* Mustache */}
        {seed % 2 === 0 && (
          <div className="absolute top-[90px] left-1/2 -translate-x-1/2 w-16 h-4 bg-[#212121] rounded-full" />
        )}
      </div>

      {/* Shoulders/Body */}
      <div 
        className="w-38 h-32 rounded-t-[45px] border-4 border-[#212121] -mt-6 z-0 flex flex-col items-center pt-4"
        style={{ backgroundColor: shirtColor }}
      >
        <div className="w-24 h-full bg-white border-x-2 border-[#212121]/20" />
      </div>
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    status: 'menu',
    currentLevelIndex: 0,
    assembledWords: [],
    stress: 0,
    timeLeft: 0,
    score: 0
  });

  const [fragments, setFragments] = useState<WordFragment[]>([]);
  const [intrusions, setIntrusions] = useState<Intrusion[]>([]);
  const [isVibrating, setIsVibrating] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const intrusionRef = useRef<NodeJS.Timeout | null>(null);

  const currentLevel = LEVELS[gameState.currentLevelIndex];

  const startLevel = (index: number) => {
    const level = LEVELS[index];
    setGameState({
      status: 'playing',
      currentLevelIndex: index,
      assembledWords: [],
      stress: 0,
      timeLeft: level.timeLimit,
      score: 0
    });
    setFragments([]);
    setIntrusions([]);
  };

  const spawnFragment = useCallback(() => {
    const targetWords = currentLevel.targetSentence;
    const nextWordIndex = gameState.assembledWords.length;
    
    // Spawn multiple fragments at once
    const numToSpawn = 2 + Math.floor(Math.random() * 2);
    const newFragments: WordFragment[] = [];

    for (let i = 0; i < numToSpawn; i++) {
      const isTarget = Math.random() > 0.4;
      const wordText = isTarget && nextWordIndex < targetWords.length 
        ? targetWords[nextWordIndex + Math.floor(Math.random() * (targetWords.length - nextWordIndex))] 
        : targetWords[Math.floor(Math.random() * targetWords.length)];

      newFragments.push({
        id: Math.random().toString(36).substr(2, 9),
        text: wordText,
        x: 10 + Math.random() * 80,
        y: 20 + Math.random() * 55,
        expiresAt: Date.now() + FRAGMENT_LIFESPAN
      });
    }

    setFragments(prev => [...prev, ...newFragments]);
  }, [currentLevel, gameState.assembledWords]);

  const spawnIntrusion = useCallback(() => {
    const text = INTRUSIVE_THOUGHTS[Math.floor(Math.random() * INTRUSIVE_THOUGHTS.length)];
    const newIntrusion: Intrusion = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      x: 25 + Math.random() * 50,
      y: 20 + Math.random() * 50
    };

    setIntrusions(prev => [...prev, newIntrusion]);
    setGameState(prev => ({ ...prev, stress: Math.min(100, prev.stress + STRESS_INCREASE_INTRUSION) }));
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 300);
  }, []);

  const handleFragmentClick = (fragment: WordFragment) => {
    const targetWord = currentLevel.targetSentence[gameState.assembledWords.length];
    
    if (fragment.text === targetWord) {
      setGameState(prev => {
        const newAssembled = [...prev.assembledWords, fragment.text];
        const isComplete = newAssembled.length === currentLevel.targetSentence.length;
        return {
          ...prev,
          assembledWords: newAssembled,
          score: prev.score + 150,
          status: isComplete ? 'result' : prev.status
        };
      });
    } else {
      setGameState(prev => ({ 
        ...prev, 
        stress: Math.min(100, prev.stress + STRESS_INCREASE_MISS),
        score: Math.max(0, prev.score - 75)
      }));
    }
    setFragments(prev => prev.filter(f => f.id !== fragment.id));
  };

  const clearIntrusion = (id: string) => {
    setIntrusions(prev => prev.filter(i => i.id !== id));
    setGameState(prev => ({ ...prev, stress: Math.max(0, prev.stress - STRESS_DECREASE_CLEAR) }));
  };

  useEffect(() => {
    if (gameState.status === 'playing') {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 0) return { ...prev, status: 'gameover' };
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);

      spawnRef.current = setInterval(spawnFragment, currentLevel.spawnRate);
      intrusionRef.current = setInterval(spawnIntrusion, currentLevel.intrusionRate);

      const cleanupFragments = setInterval(() => {
        setFragments(prev => prev.filter(f => f.expiresAt > Date.now()));
      }, 500);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (spawnRef.current) clearInterval(spawnRef.current);
        if (intrusionRef.current) clearInterval(intrusionRef.current);
        clearInterval(cleanupFragments);
      };
    }
  }, [gameState.status, currentLevel, spawnFragment, spawnIntrusion]);

  useEffect(() => {
    if (gameState.stress >= 100 && gameState.status === 'playing') {
      setGameState(prev => ({ ...prev, status: 'gameover' }));
    }
  }, [gameState.stress, gameState.status]);

  const blurAmount = Math.max(0, (gameState.stress - 60) / 12);

  return (
    <div className={`relative w-full h-screen bg-[#fdf6e3] overflow-hidden flex flex-col ${isVibrating ? 'intrusion-shake' : ''}`}>
      <div className="absolute inset-0 vignette-warm pointer-events-none z-10" />
      
      {/* Background Elements */}
      {gameState.currentLevelIndex === 1 ? <LibraryBackground /> : <CafeBackground />}

      {/* Main Game Area */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto z-20">
        {/* HUD */}
        {gameState.status === 'playing' && (
          <div className="absolute top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-start z-40">
            <div className="flex flex-col gap-2 sm:gap-4">
              <div className="bg-[#fff9f0] border-2 border-[#5d4037] p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg w-48 sm:w-64 paper-texture hand-drawn-border">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8d6e63] flex items-center gap-1 sm:gap-2">
                    <Flame className="w-3 h-3 sm:w-4 sm:h-4" /> Stress
                  </span>
                  <span className={`text-xs sm:text-sm font-bold ${gameState.stress > 75 ? 'text-orange-600 animate-pulse' : 'text-[#5d4037]'}`}>
                    {gameState.stress}%
                  </span>
                </div>
                <div className="h-2 sm:h-3 bg-[#e0d5c1] rounded-full border border-[#5d4037] overflow-hidden">
                  <motion.div 
                    className={`h-full ${gameState.stress > 75 ? 'bg-orange-500' : 'bg-[#8d6e63]'}`}
                    animate={{ width: `${gameState.stress}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-[#fff9f0] border-2 border-[#5d4037] p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-md flex items-center gap-2 sm:gap-3 hand-drawn-border">
                {gameState.currentLevelIndex === 1 ? <Store className="w-3 h-3 sm:w-4 sm:h-4 text-[#8d6e63]" /> : <Coffee className="w-3 h-3 sm:w-4 sm:h-4 text-[#8d6e63]" />}
                <span className="text-[10px] sm:text-sm font-bold text-[#5d4037] truncate max-w-[120px] sm:max-w-none">{currentLevel.context}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 sm:gap-4">
              <div className="bg-[#fff9f0] border-2 border-[#5d4037] p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-3 sm:gap-6 paper-texture hand-drawn-border">
                <div className="text-right">
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[#8d6e63] block">Time</span>
                  <span className={`text-lg sm:text-2xl font-bold ${gameState.timeLeft < 10 ? 'text-orange-600 animate-pulse' : 'text-[#5d4037]'}`}>
                    {gameState.timeLeft}s
                  </span>
                </div>
                <div className="w-px h-6 sm:h-8 bg-[#5d4037]/20" />
                <div className="text-right">
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[#8d6e63] block">Score</span>
                  <span className="text-lg sm:text-2xl font-bold text-[#5d4037]">${gameState.score}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Character */}
        {gameState.status === 'playing' && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-32 sm:bottom-48 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center scale-75 sm:scale-100"
          >
            <div className="relative mb-4">
              <BobsCharacter seed={gameState.currentLevelIndex} stress={gameState.stress} />
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white border-2 border-[#5d4037] px-4 py-2 rounded-full text-xs font-bold text-[#5d4037] shadow-lg whitespace-nowrap z-30">
                Customer #{24 + gameState.currentLevelIndex}
              </div>
            </div>
          </motion.div>
        )}

        {/* Fragments & Intrusions Container */}
        <AnimatePresence>
          {gameState.status === 'playing' && (
            <div className="absolute inset-0 z-20 overflow-hidden">
              {fragments.map(fragment => (
                <motion.button
                  key={fragment.id}
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.5, rotate: 10 }}
                  onClick={() => handleFragmentClick(fragment)}
                  className="absolute px-3 py-1 sm:px-5 sm:py-2 bg-white border-2 border-[#5d4037] rounded-lg text-xs sm:text-sm font-bold text-[#5d4037] shadow-md hover:bg-[#fff9f0] transition-colors fragment-float hand-drawn-border"
                  style={{ left: `${fragment.x}%`, top: `${fragment.y}%` }}
                >
                  {fragment.text}
                </motion.button>
              ))}

              {intrusions.map(intrusion => (
                <motion.div
                  key={intrusion.id}
                  initial={{ opacity: 0, y: 30, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  className="absolute z-50 bg-[#ffecb3] border-2 border-[#5d4037] p-3 sm:p-6 rounded-xl shadow-2xl max-w-[200px] sm:max-w-xs backdrop-blur-sm hand-drawn-border"
                  style={{ left: `${intrusion.x}%`, top: `${intrusion.y}%` }}
                >
                  <div className="flex justify-between items-start gap-2 sm:gap-4 mb-1 sm:mb-2">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-[#5d4037] font-display font-bold italic text-sm sm:text-lg leading-tight">{intrusion.text}</p>
                    <button 
                      onClick={() => clearIntrusion(intrusion.id)}
                      className="p-1 hover:bg-orange-100 rounded-lg transition-colors border border-[#5d4037]"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-[#5d4037]" />
                    </button>
                  </div>
                  <div className="text-[8px] sm:text-[10px] uppercase tracking-widest text-[#8d6e63] font-bold">Unwanted Thought</div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Wooden Counter Top / Desk */}
      <div className="relative w-full h-32 sm:h-48 bg-[#8d6e63] border-t-4 border-[#5d4037] z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] flex items-center justify-around px-4 sm:px-20">
        <div className="relative group hidden sm:block">
          {gameState.currentLevelIndex === 1 ? (
            <Store className="w-8 h-8 sm:w-12 sm:h-12 text-[#fff9f0] drop-shadow-md" />
          ) : (
            <>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-0.5 h-4 bg-white/40 rounded-full steam" style={{ animationDelay: '0s' }} />
                <div className="w-0.5 h-6 bg-white/40 rounded-full steam" style={{ animationDelay: '0.4s' }} />
                <div className="w-0.5 h-4 bg-white/40 rounded-full steam" style={{ animationDelay: '0.8s' }} />
              </div>
              <Coffee className="w-8 h-8 sm:w-12 sm:h-12 text-[#fff9f0] drop-shadow-md" />
            </>
          )}
        </div>
        
        {/* Assembled Sentence Area (The Order Slip) */}
        <div className="w-full max-w-2xl px-2 sm:px-4">
          <div className="bg-[#fff9f0] border-2 border-[#5d4037] p-3 sm:p-6 rounded-xl sm:rounded-3xl min-h-[80px] sm:min-h-[120px] flex flex-wrap gap-1.5 sm:gap-3 items-center justify-center shadow-xl paper-texture hand-drawn-border">
            {currentLevel.targetSentence.map((word, i) => (
              <div 
                key={i}
                className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border-2 transition-all duration-500 font-bold text-[10px] sm:text-sm ${
                  gameState.assembledWords[i] 
                    ? 'bg-[#8d6e63] text-white border-[#5d4037]' 
                    : 'bg-transparent text-[#e0d5c1] border-[#e0d5c1] border-dashed'
                }`}
              >
                {gameState.assembledWords[i] || word.replace(/./g, '?')}
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden sm:block">
          <Utensils className="w-8 h-8 sm:w-10 sm:h-10 text-[#fff9f0] opacity-50" />
        </div>
      </div>

      {/* Screens */}
      <AnimatePresence>
        {gameState.status === 'menu' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#fdf6e3]"
          >
            <div className="max-w-2xl w-full p-12 text-center">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#fff9f0] border-4 border-[#5d4037] mb-8 shadow-xl hand-drawn-border">
                  <Brain className="w-12 h-12 text-[#8d6e63]" />
                </div>
                <h1 className="text-7xl font-display font-bold tracking-tighter mb-4 text-[#5d4037]">FRAGMENTED THOUGHTS</h1>
                <p className="text-[#8d6e63] text-xl font-bold mb-6 leading-relaxed">
                  A cozy but chaotic journey through the mind.
                </p>
                <div className="bg-orange-100 border-2 border-orange-300 p-4 rounded-2xl mb-12 max-w-lg mx-auto">
                  <p className="text-orange-800 font-bold text-sm">
                    Goal: Complete the sentence without getting distracted and before the time runs out!
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-[#fff9f0] border-2 border-[#5d4037] p-8 rounded-3xl text-left shadow-lg hand-drawn-border">
                    <MessageCircle className="w-8 h-8 text-[#8d6e63] mb-4" />
                    <h3 className="text-xl font-bold mb-2">The Order</h3>
                    <p className="text-[#8d6e63] font-bold">Click the floating paper scraps in order to complete your sentence.</p>
                  </div>
                  <div className="bg-[#fff9f0] border-2 border-[#5d4037] p-8 rounded-3xl text-left shadow-lg hand-drawn-border">
                    <AlertCircle className="w-8 h-8 text-orange-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">The Noise</h3>
                    <p className="text-[#8d6e63] font-bold">Clear the scribbled notes before they make you too stressed to think.</p>
                  </div>
                </div>

                <button 
                  onClick={() => startLevel(0)}
                  className="group px-16 py-5 bg-[#8d6e63] text-white text-2xl font-bold rounded-full transition-all hover:scale-110 active:scale-95 flex items-center gap-3 mx-auto shadow-xl border-4 border-[#5d4037]"
                >
                  Start Interaction <ArrowRight className="w-6 h-6" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {(gameState.status === 'result' || gameState.status === 'gameover') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#fdf6e3]/95 backdrop-blur-md"
          >
            <div className="max-w-md w-full p-10 text-center bg-[#fff9f0] border-4 border-[#5d4037] rounded-[40px] shadow-2xl paper-texture hand-drawn-border">
              {gameState.status === 'result' ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div className="w-24 h-24 bg-[#e8f5e9] border-4 border-[#2e7d32] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <Check className="w-12 h-12 text-[#2e7d32]" />
                  </div>
                  <h2 className="text-4xl font-display font-bold mb-4 text-[#5d4037]">Great Interaction!</h2>
                  <p className="text-[#8d6e63] font-bold mb-10">You delivered your thoughts perfectly.</p>
                  
                  <div className="bg-[#fdf6e3] border-2 border-[#5d4037] rounded-3xl p-8 mb-10 grid grid-cols-2 gap-6 shadow-inner">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#8d6e63] block mb-2">Earnings</span>
                      <span className="text-3xl font-bold text-[#5d4037]">${gameState.score}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#8d6e63] block mb-2">Stress</span>
                      <span className="text-3xl font-bold text-[#5d4037]">{gameState.stress}%</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {gameState.currentLevelIndex < LEVELS.length - 1 ? (
                      <button 
                        onClick={() => startLevel(gameState.currentLevelIndex + 1)}
                        className="w-full py-5 bg-[#8d6e63] text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-lg border-2 border-[#5d4037]"
                      >
                        Next Interaction <ArrowRight className="w-6 h-6" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => setGameState(prev => ({ ...prev, status: 'menu' }))}
                        className="w-full py-5 bg-[#8d6e63] text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-lg border-2 border-[#5d4037]"
                      >
                        Back to Menu
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div className="w-24 h-24 bg-orange-100 border-4 border-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <AlertCircle className="w-12 h-12 text-orange-600" />
                  </div>
                  <h2 className="text-4xl font-display font-bold mb-4 text-[#5d4037]">Too Much Noise...</h2>
                  <p className="text-[#8d6e63] font-bold mb-10">
                    {gameState.stress >= 100 
                      ? "The thoughts were too loud to handle." 
                      : "You lost your train of thought."}
                  </p>
                  
                  <button 
                    onClick={() => startLevel(gameState.currentLevelIndex)}
                    className="w-full py-5 bg-[#8d6e63] text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-lg border-2 border-[#5d4037]"
                  >
                    <RotateCcw className="w-6 h-6" /> Try Again
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Decorative Hearts */}
      <div className="absolute bottom-6 right-6 z-40 flex gap-2 opacity-30">
        <Heart className="w-6 h-6 text-orange-400 fill-orange-400" />
        <Heart className="w-6 h-6 text-orange-400 fill-orange-400" />
        <Heart className="w-6 h-6 text-orange-400 fill-orange-400" />
      </div>

      {/* Decorative Coffee Stains */}
      <div className="absolute top-20 right-40 opacity-10 pointer-events-none rotate-12">
        <div className="w-32 h-32 rounded-full border-8 border-[#5d4037]" />
      </div>
      <div className="absolute bottom-60 left-20 opacity-5 pointer-events-none -rotate-12">
        <div className="w-24 h-24 rounded-full border-4 border-[#5d4037]" />
      </div>
    </div>
  );
}
