import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Volume2,
  Star,
  RotateCcw,
  Trophy,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Sounds ────────────────────────────────────────────────────────────────

const MP3_SOUNDS: Record<string, string> = {
  scissors: '/sounds/tesoura.mp3',
  clippers: '/sounds/maquina.mp3',
  water: '/sounds/agua.mp3',
  dryer: '/sounds/secador.mp3',
};

const PLAY_DURATION_S = 15;

// ─── Instruments ───────────────────────────────────────────────────────────

interface Instrument {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  bgColor: string;
}

const instruments: Instrument[] = [
  {
    id: 'scissors',
    name: 'Tesoura',
    emoji: '✂️',
    description: 'Faz "snip snip" para cortar o cabelo',
    color: 'from-red-400 to-rose-500',
    bgColor: 'bg-red-50 border-red-200',
  },
  {
    id: 'dryer',
    name: 'Secador',
    emoji: '💨',
    description: 'Sopra ar quente para secar o cabelo',
    color: 'from-orange-400 to-amber-500',
    bgColor: 'bg-orange-50 border-orange-200',
  },
  {
    id: 'water',
    name: 'Água',
    emoji: '💧',
    description: 'Água para lavar o cabelo',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'clippers',
    name: 'Máquina',
    emoji: '⚡',
    description: 'Máquina elétrica para aparar o cabelo',
    color: 'from-yellow-400 to-orange-400',
    bgColor: 'bg-yellow-50 border-yellow-200',
  },
];

// ─── Utils ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Round {
  correct: Instrument;
  options: Instrument[];
}

function buildRounds(): Round[] {
  return shuffle(instruments).map((correct) => {
    const two = shuffle(
      instruments.filter((i) => i.id !== correct.id)
    ).slice(0, 2);

    return {
      correct,
      options: shuffle([correct, ...two]),
    };
  });
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function SoundMatchGame() {
  const navigate = useNavigate();

  const sourceRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [rounds] = useState<Round[]>(() => buildRounds());

  const roundRef = useRef(rounds[0]);

  const [roundIdx, setRoundIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [stars, setStars] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [shakeId, setShakeId] = useState<string | null>(null);

  const round = rounds[roundIdx];
  const totalRounds = rounds.length;

  roundRef.current = round;

  // ─── Stop sound ──────────────────────────────────────────────────────────

  const stopSound = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.pause();
      sourceRef.current.currentTime = 0;
      sourceRef.current = null;
    }

    setIsPlaying(false);
  }, []);

  // ─── Play sound ──────────────────────────────────────────────────────────

  const playSound = useCallback(() => {
    const currentRound = roundRef.current;

    stopSound();

    const url = MP3_SOUNDS[currentRound?.correct?.id ?? ''];

    if (!url) {
      console.error('Som não encontrado');
      return;
    }

    const audio = new Audio(url);

    audio.volume = 0.85;

    sourceRef.current = audio;

    setIsPlaying(true);

    audio
      .play()
      .then(() => {
        stopTimerRef.current = setTimeout(() => {
          stopSound();
        }, PLAY_DURATION_S * 1000);
      })
      .catch((err) => {
        console.error('Erro ao reproduzir áudio:', err);
        setIsPlaying(false);

        toast.error('Erro ao reproduzir o som');
      });

    audio.onended = () => {
      stopSound();
    };

    audio.onerror = () => {
      console.error('Erro ao carregar áudio');
      stopSound();

      toast.error('Erro ao carregar o áudio');
    };
  }, [stopSound]);

  // ─── Cleanup ─────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, [stopSound]);

  // ─── Handle select ───────────────────────────────────────────────────────

  const handleSelect = useCallback(
    (instrument: Instrument) => {
      if (selected) return;

      stopSound();

      setSelected(instrument.id);

      const correct = instrument.id === round.correct.id;

      const newResults = [...results, correct];

      setResults(newResults);

      if (correct) {
        setStars((s) => s + 1);

        toast.success('Muito bem! 🎉', {
          duration: 1200,
        });
      } else {
        setShakeId(instrument.id);

        setTimeout(() => setShakeId(null), 600);

        toast.error(`Era ${round.correct.name}! 💙`, {
          duration: 1500,
        });
      }

      setTimeout(() => {
        if (roundIdx + 1 >= totalRounds) {
          setFinished(true);
        } else {
          setRoundIdx((r) => r + 1);
          setSelected(null);
        }
      }, 1600);
    },
    [selected, round, results, roundIdx, totalRounds, stopSound]
  );

  // ─── Restart ─────────────────────────────────────────────────────────────

  const handleRestart = () => {
    stopSound();

    setResults([]);
    setSelected(null);
    setRoundIdx(0);
    setStars(0);
    setFinished(false);
  };

  // ─── Finished screen ─────────────────────────────────────────────────────

  if (finished) {
    const pct = Math.round((stars / totalRounds) * 100);

    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-kid-lg border-4 border-sky-100 text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="w-24 h-24 bg-gradient-to-br from-sky-400 to-mint-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-kid-lg"
          >
            <Trophy size={48} className="text-white" />
          </motion.div>

          <h2 className="font-comic font-bold text-2xl text-text mb-2">
            {pct >= 80
              ? 'Fantástico!'
              : pct >= 50
              ? 'Muito Bem!'
              : 'Boa Tentativa!'}
          </h2>

          <p className="text-text-light font-comic mb-6">
            Acertaste {stars} de {totalRounds} sons!
          </p>

          <div className="flex justify-center gap-2 mb-6">
            {results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                {r ? (
                  <CheckCircle2 size={22} className="text-mint-400" />
                ) : (
                  <XCircle size={22} className="text-coral-400" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mb-8">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.5 + i * 0.2,
                  type: 'spring',
                }}
              >
                <Star
                  size={48}
                  className={
                    pct >= [34, 67, 100][i]
                      ? 'text-peach-400 fill-peach-400 drop-shadow-lg'
                      : 'text-gray-200 fill-gray-200'
                  }
                />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <motion.button
              onClick={handleRestart}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 bg-sky-400 text-white rounded-2xl font-comic font-bold text-lg shadow-kid hover:bg-sky-500 flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Jogar Outra Vez
            </motion.button>

            <motion.button
              onClick={() => navigate('/child/home-mode')}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-sky-50 text-text rounded-2xl font-comic font-bold border-2 border-sky-100"
            >
              Voltar ao Menu
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Game screen ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <div className="glass border-b-2 border-sky-100 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={() => navigate('/child/home-mode')}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 text-text-light hover:text-sky-500 font-comic font-bold"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Voltar</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <span className="font-comic font-bold text-sky-500">
              {roundIdx + 1} / {totalRounds}
            </span>

            <div className="flex gap-1">
              {rounds.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i < results.length
                      ? results[i]
                        ? 'bg-mint-400'
                        : 'bg-coral-400'
                      : i === roundIdx
                      ? 'bg-sky-400'
                      : 'bg-sky-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Star
              size={18}
              className="text-peach-400 fill-peach-400"
            />

            <span className="font-comic font-bold text-peach-500">
              {stars}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={roundIdx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35 }}
            >
              {/* Prompt card */}
              <div className="bg-white rounded-3xl p-6 shadow-kid-lg border-4 border-sky-100 mb-6 text-center">
                <p className="font-comic font-bold text-lg text-text-light mb-4">
                  Que instrumento faz este som?
                </p>

                <motion.button
                  onClick={playSound}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    isPlaying
                      ? {
                          scale: [1, 1.08, 1],
                          transition: {
                            duration: 0.4,
                            repeat: Infinity,
                          },
                        }
                      : {}
                  }
                  className={`w-32 h-32 rounded-full mx-auto flex flex-col items-center justify-center gap-2 shadow-kid-lg transition-colors ${
                    isPlaying
                      ? 'bg-gradient-to-br from-sky-400 to-blue-500'
                      : 'bg-gradient-to-br from-sky-300 to-sky-400 hover:from-sky-400 hover:to-blue-500'
                  }`}
                >
                  <Volume2 size={44} className="text-white" />

                  <span className="text-white font-comic font-bold text-sm">
                    {isPlaying ? 'A tocar...' : 'Ouvir'}
                  </span>
                </motion.button>

                <p className="font-comic text-text-light text-sm mt-4">
                  Carrega para ouvir o som de novo 🔊
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-3 gap-3">
                {round.options.map((instrument) => {
                  const isSelected = selected === instrument.id;

                  const isCorrectAnswer =
                    instrument.id === round.correct.id;

                  const showResult = !!selected;

                  let cardStyle = `${instrument.bgColor} border-2`;

                  if (showResult) {
                    if (isCorrectAnswer) {
                      cardStyle =
                        'bg-mint-50 border-4 border-mint-400';
                    } else if (isSelected) {
                      cardStyle =
                        'bg-red-50 border-4 border-red-400';
                    }
                  }

                  return (
                    <motion.button
                      key={instrument.id}
                      onClick={() => handleSelect(instrument)}
                      disabled={!!selected}
                      whileTap={!selected ? { scale: 0.95 } : {}}
                      animate={
                        shakeId === instrument.id
                          ? { x: [-8, 8, -8, 8, 0] }
                          : isSelected && isCorrectAnswer
                          ? { scale: [1, 1.08, 1] }
                          : {}
                      }
                      transition={{ duration: 0.4 }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${cardStyle} ${
                        selected
                          ? 'cursor-default'
                          : 'hover:shadow-kid active:scale-95'
                      }`}
                    >
                      <motion.span
                        className="text-4xl"
                        animate={
                          showResult && isCorrectAnswer
                            ? {
                                rotate: [0, -10, 10, 0],
                                scale: [1, 1.2, 1],
                              }
                            : {}
                        }
                        transition={{ duration: 0.5 }}
                      >
                        {instrument.emoji}
                      </motion.span>

                      <span className="font-comic font-bold text-sm text-text leading-tight text-center">
                        {instrument.name}
                      </span>

                      {showResult && isCorrectAnswer && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <CheckCircle2
                            size={20}
                            className="text-mint-500"
                          />
                        </motion.div>
                      )}

                      {showResult &&
                        isSelected &&
                        !isCorrectAnswer && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <XCircle
                              size={20}
                              className="text-red-400"
                            />
                          </motion.div>
                        )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Description */}
              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="bg-sky-50 rounded-2xl p-4 border-2 border-sky-100 text-center">
                      <span className="text-2xl">
                        {round.correct.emoji}
                      </span>

                      <p className="font-comic text-sm text-text mt-1">
                        <strong>{round.correct.name}:</strong>{' '}
                        {round.correct.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}