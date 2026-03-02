import { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 1,
    context: "Ordering coffee at a busy cafe.",
    targetSentence: ["I", "would", "like", "a", "large", "latte", "please"],
    timeLimit: 45,
    spawnRate: 1200,
    intrusionRate: 5000,
  },
  {
    id: 2,
    context: "Checking out a book at the library.",
    targetSentence: ["I", "would", "like", "to", "check", "this", "book", "out"],
    timeLimit: 40,
    spawnRate: 1000,
    intrusionRate: 4000,
  },
  {
    id: 3,
    context: "Meeting a new neighbor in the hallway.",
    targetSentence: ["It", "is", "nice", "to", "finally", "meet", "you"],
    timeLimit: 35,
    spawnRate: 800,
    intrusionRate: 3000,
  },
  {
    id: 4,
    context: "Explaining a project to your boss.",
    targetSentence: ["The", "report", "will", "be", "ready", "by", "tomorrow", "morning"],
    timeLimit: 30,
    spawnRate: 700,
    intrusionRate: 2500,
  }
];

export const INTRUSIVE_THOUGHTS = [
  "Did I lock the door?",
  "They think I'm weird.",
  "What is that noise?",
  "I forgot to breathe.",
  "My hands are shaking.",
  "Is it too loud in here?",
  "Everyone is watching.",
  "I should just leave.",
  "Why am I here?",
  "The lights are too bright."
];
