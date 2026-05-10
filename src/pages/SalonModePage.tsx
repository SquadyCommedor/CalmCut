import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Square,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Award,
  Clock,
  TrendingUp,
  Save,
  Wind,
  Volume2,
  Timer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useBitalino } from '../hooks/useBitalino';
import { useTimer } from '../hooks/useTimer';
import BreathingExercise from '../components/BreathingExercise';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface SalonStep {
  id: number;
  emoji: string;
  title: string;
  description: string;
  defaultDuration: number;
  sensoryNote: string;
  copingStrategy: string;
}

const TIME_PRESETS = [
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
  { label: '15 min', value: 900 },
];

// Steps aligned with the story scenes
const salonSteps: SalonStep[] = [
  {
    id: 1,
    emoji: '✂️',
    title: 'Chegar ao Salão',
    description: 'Chegámos! O salão tem luzes brilhantes. Respira fundo: 1... 2... 3... Está bem!',
    defaultDuration: 180,
    sensoryNote: 'Cheiros novos, sons de secadores ao longe',
    copingStrategy: 'Respiro fundo 3 vezes como na história',
  },
  {
    id: 2,
    emoji: '💺',
    title: 'A Cadeira Mágica',
    description: 'A cadeira sobe e desce como um elevador! Up! Down! É divertido!',
    defaultDuration: 120,
    sensoryNote: 'Movimento da cadeira pode ser uma surpresa',
    copingStrategy: 'Peço ajuda se sentir medo de altura',
  },
  {
    id: 3,
    emoji: '🦸',
    title: 'A Capa de Super-Herói',
    description: 'O cabeleireiro põe a capa! É como uma capa de super-herói. Macia e quentinha!',
    defaultDuration: 60,
    sensoryNote: 'O tecido pode ser um pouco diferente',
    copingStrategy: 'Digo se o tecido coçar ou incomodar',
  },
  {
    id: 4,
    emoji: '💧',
    title: 'Lavar o Cabelo',
    description: 'Água morna na cabeça! Fecho os olhos e imagino que estou na praia. Relaxante!',
    defaultDuration: 300,
    sensoryNote: 'Água na cara pode incomodar',
    copingStrategy: 'Peço uma toalha para a cara',
  },
  {
    id: 5,
    emoji: '✂️',
    title: 'Snip Snip!',
    description: 'A tesoura faz "snip snip"! Sou muito corajoso/a. Não dói nada!',
    defaultDuration: 600,
    sensoryNote: 'Som da tesoura perto dos ouvidos',
    copingStrategy: 'Posso pedir uma pausa a qualquer momento!',
  },
  {
    id: 6,
    emoji: '💨',
    title: 'O Secador',
    description: 'O secador sopra ar quente! É como vento no verão. Quase acabou!',
    defaultDuration: 300,
    sensoryNote: 'Som do secador é mais alto',
    copingStrategy: 'Tapo os ouvidos ou peço pausa',
  },
  {
    id: 7,
    emoji: '🏆',
    title: 'O Resultado!',
    description: 'Uau! Olho no espelho e dou um grande sorriso. Consegui! Sou um campeão/ã!',
    defaultDuration: 120,
    sensoryNote: 'Celebrar a conquista!',
    copingStrategy: 'Peço foto para mostrar!',
  },
];

// ─── Duration Picker ──────────────────────────────────────────────────────────

interface DurationPickerProps {
  value: number;
  onChange: (seconds: number) => void;
  disabled?: boolean;
}

function DurationPicker({ value, onChange, disabled }: DurationPickerProps) {
  const [inputMinutes, setInputMinutes] = useState(String(Math.floor(value / 60)));
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputMinutes(String(Math.floor(value / 60)));
  }, [value]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleMinutesChange = (raw: string) => {
    setInputMinutes(raw);
    const mins = parseInt(raw, 10);
    if (!isNaN(mins) && mins >= 0) onChange(Math.max(10, mins * 60));
  };

  const handlePreset = (seconds: number) => {
    onChange(seconds);
    setInputMinutes(String(Math.floor(seconds / 60)));
    setIsOpen(false);
  };

  const displayMins = Math.floor(value / 60);
  const displaySecs = value % 60;

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(o => !o)}
        whileTap={!disabled ? { scale: 0.97 } : {}}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 font-comic font-bold text-sm transition-all
          ${disabled
            ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
            : 'bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100 cursor-pointer'
          }`}
      >
        <Timer size={14} />
        <span>
          {displayMins > 0 && `${displayMins}min`}
          {displaySecs > 0 && ` ${displaySecs}s`}
          {displayMins === 0 && displaySecs === 0 && '—'}
        </span>
        {!disabled && (isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
      </motion.button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-kid-lg border-2 border-sky-100 p-4 w-64"
          >
            <p className="font-comic font-bold text-xs text-text-light mb-3">Escolhe o tempo:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {TIME_PRESETS.map(p => (
                <motion.button
                  key={p.value}
                  type="button"
                  onClick={() => handlePreset(p.value)}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-xl font-comic font-bold text-sm transition-all
                    ${value === p.value
                      ? 'bg-sky-400 text-white shadow-sm'
                      : 'bg-sky-50 text-sky-600 hover:bg-sky-100 border-2 border-sky-100'
                    }`}
                >
                  {p.label}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={60}
                value={inputMinutes}
                onChange={e => handleMinutesChange(e.target.value)}
                className="flex-1 px-3 py-2 bg-sky-50 rounded-xl border-2 border-sky-100 font-comic font-bold text-center text-sky-700 outline-none focus:border-sky-300 text-sm"
              />
              <span className="font-comic font-bold text-text-light text-sm">minutos</span>
            </div>
            <motion.button
              type="button"
              onClick={() => setIsOpen(false)}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-3 py-2 bg-mint-400 text-white rounded-xl font-comic font-bold text-sm"
            >
              Confirmar ✓
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SalonModePage() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { seconds, isRunning, start, pause, stop, reset } = useTimer();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showBreathing, setShowBreathing] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [stressReadings, setStressReadings] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [pausesCount, setPausesCount] = useState(0);
  const [notes, setNotes] = useState('');
  const [stepDurations, setStepDurations] = useState<Record<number, number>>(
    Object.fromEntries(salonSteps.map(s => [s.id, s.defaultDuration]))
  );
  const [stepSecondsLeft, setStepSecondsLeft] = useState<number>(salonSteps[0].defaultDuration);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { reading, isConnected, connect, disconnect } = useBitalino(profile?.id);

  const step = salonSteps[currentStep];
  const progress = (completedSteps.length / salonSteps.length) * 100;

  // Reset step countdown when step or durations change
  useEffect(() => {
    setStepSecondsLeft(stepDurations[step.id]);
  }, [currentStep, step.id, stepDurations]);

  // Step countdown ticker
  useEffect(() => {
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    if (!isSessionActive || showBreathing || !isRunning) return;

    stepTimerRef.current = setInterval(() => {
      setStepSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(stepTimerRef.current!);
          toast('⏱️ Tempo desta etapa esgotado!', { duration: 3000 });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (stepTimerRef.current) clearInterval(stepTimerRef.current); };
  }, [isRunning, isSessionActive, currentStep, showBreathing]);

  useEffect(() => {
    if (reading) setStressReadings(prev => [...prev, reading.stressIndex]);
  }, [reading]);

  const startSession = () => {
    setIsSessionActive(true);
    start();
    connect();
    toast.success('Vamos começar! Estou contigo! 💙');
  };

  const endSession = async () => {
    stop();
    disconnect();
    setIsSessionActive(false);
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);

    if (stressReadings.length > 0) {
      const maxStress = Math.max(...stressReadings);
      const avgStress = Math.round(stressReadings.reduce((a, b) => a + b, 0) / stressReadings.length);
      try {
        await supabase.from('visit_logs').insert({
          child_id: user?.id,
          date: new Date().toISOString(),
          duration: seconds,
          max_stress: maxStress,
          avg_stress: avgStress,
          pauses: pausesCount,
          completed: completedSteps.length === salonSteps.length,
          notes: notes || undefined,
        });
        toast.success('Visita guardada!');
      } catch (e) {
        console.error('Erro:', e);
      }
    }
    setShowSummary(true);
  };

  const completeStep = () => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
      toast.success(`${step.emoji} ${step.title} concluído!`, { icon: '✅' });
    }
    if (currentStep < salonSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endSession();
    }
  };

  const updateStepDuration = (stepId: number, secs: number) => {
    setStepDurations(prev => ({ ...prev, [stepId]: secs }));
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const maxStress = stressReadings.length > 0 ? Math.max(...stressReadings) : 0;
  const avgStress = stressReadings.length > 0
    ? Math.round(stressReadings.reduce((a, b) => a + b, 0) / stressReadings.length)
    : 0;

  const getStressColor = (level: number) => {
    if (level < 30) return { bg: 'bg-mint-400', text: 'text-mint-500', label: 'Muito Calmo' };
    if (level < 50) return { bg: 'bg-sky-400', text: 'text-sky-500', label: 'Calmo' };
    if (level < 70) return { bg: 'bg-peach-400', text: 'text-peach-500', label: 'Ansioso' };
    return { bg: 'bg-coral-400', text: 'text-coral-500', label: 'Muito Ansioso' };
  };

  const stressInfo = getStressColor(reading?.stressIndex ?? 0);
  const stepTimerPct = stepSecondsLeft / Math.max(stepDurations[step.id], 1);
  const stepTimerColor = stepTimerPct > 0.5 ? 'text-mint-500' : stepTimerPct > 0.2 ? 'text-peach-500' : 'text-coral-500';

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b-2 border-sky-100">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <motion.button
            onClick={() => navigate('/child')}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 text-text-light hover:text-sky-500"
          >
            <ArrowLeft size={24} />
            <span className="font-comic font-bold hidden sm:inline">Voltar</span>
          </motion.button>

          <h1 className="font-comic font-bold text-lg text-text">✂️ No Salão</h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-sky-50 rounded-xl px-3 py-2 border-2 border-sky-100">
              <Clock size={18} className="text-sky-400" />
              <span className="font-mono font-bold text-lg">{formatTime(seconds)}</span>
            </div>
            {isSessionActive ? (
              <motion.button onClick={endSession} whileTap={{ scale: 0.9 }}
                className="px-4 py-2 bg-coral-400 text-white font-comic font-bold rounded-xl flex items-center gap-1.5 shadow-kid">
                <Square size={16} />
                Terminar
              </motion.button>
            ) : (
              <motion.button onClick={startSession} whileTap={{ scale: 0.9 }}
                className="px-4 py-2 bg-mint-400 text-white font-comic font-bold rounded-xl flex items-center gap-1.5 shadow-kid">
                <Play size={16} />
                Começar
              </motion.button>
            )}
          </div>
        </div>

        <div className="px-4 pb-3 max-w-4xl mx-auto">
          <div className="h-3 bg-sky-50 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-sky-400 to-lavender-400 rounded-full"
              initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">

        {/* Stress Monitor */}
        {isSessionActive && (
          <div className="bg-white rounded-3xl p-6 shadow-kid border-2 border-sky-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${stressInfo.bg} flex items-center justify-center shadow-sm`}>
                  <Heart size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-comic font-bold text-lg text-text">Como me sinto</h3>
                  <p className="text-xs text-text-light font-comic">A minha pulseira diz...</p>
                </div>
              </div>
              {!isConnected ? (
                <motion.button onClick={connect} whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-sky-400 text-white font-comic font-bold rounded-xl shadow-kid">
                  Ligar Pulseira
                </motion.button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="w-3 h-3 bg-mint-400 rounded-full" />
                  <span className="text-xs text-mint-500 font-comic font-bold">Ligada</span>
                </div>
              )}
            </div>

            {reading && (
              <div className="space-y-4">
                <div className="text-center">
                  <span className={`text-4xl font-comic font-black ${stressInfo.text}`}>{reading.stressIndex}%</span>
                  <p className={`text-sm font-comic font-bold ${stressInfo.text}`}>{stressInfo.label}</p>
                </div>
                <div className="h-4 bg-sky-50 rounded-full overflow-hidden">
                  <motion.div className={`h-full rounded-full ${stressInfo.bg}`}
                    initial={{ width: 0 }} animate={{ width: `${reading.stressIndex}%` }} transition={{ duration: 0.5 }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-sky-50 rounded-2xl p-3 flex items-center gap-3">
                    <Heart size={18} className="text-coral-400" />
                    <div>
                      <p className="text-xs text-text-light font-comic">Coração</p>
                      <p className="font-comic font-bold text-text">{reading.heartRate} bpm</p>
                    </div>
                  </div>
                  <div className="bg-sky-50 rounded-2xl p-3 flex items-center gap-3">
                    <Volume2 size={18} className="text-lavender-400" />
                    <div>
                      <p className="text-xs text-text-light font-comic">Suar</p>
                      <p className="font-comic font-bold text-text">{reading.eda.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current Step Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-6 shadow-kid border-2 border-sky-50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl text-3xl flex items-center justify-center ${
                  completedSteps.includes(step.id) ? 'bg-mint-100' : 'bg-sky-100'
                }`}>
                  {completedSteps.includes(step.id)
                    ? <CheckCircle2 size={28} className="text-mint-400" />
                    : <span>{step.emoji}</span>}
                </div>
                <div>
                  <span className="text-xs font-comic font-bold text-sky-400 bg-sky-50 px-2 py-1 rounded-full">
                    Passo {step.id} de {salonSteps.length}
                  </span>
                  <h2 className="font-comic font-bold text-xl text-text mt-1">{step.title}</h2>
                </div>
              </div>

              {/* Step countdown + time picker */}
              <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                {isSessionActive && (
                  <span className={`font-mono font-black text-xl ${stepTimerColor}`}>
                    {formatTime(stepSecondsLeft)}
                  </span>
                )}
                <DurationPicker
                  value={stepDurations[step.id]}
                  onChange={v => updateStepDuration(step.id, v)}
                  disabled={isSessionActive}
                />
              </div>
            </div>

            <p className="text-lg text-text font-comic mb-4">{step.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-peach-50 rounded-2xl p-4 border-2 border-peach-100">
                <div className="flex items-start gap-2">
                  <Volume2 size={16} className="text-peach-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-comic font-bold text-peach-500 mb-1">Posso sentir:</p>
                    <p className="text-sm text-text font-comic">{step.sensoryNote}</p>
                  </div>
                </div>
              </div>
              <div className="bg-mint-50 rounded-2xl p-4 border-2 border-mint-100">
                <div className="flex items-start gap-2">
                  <Wind size={16} className="text-mint-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-comic font-bold text-mint-500 mb-1">Se precisar:</p>
                    <p className="text-sm text-text font-comic">{step.copingStrategy}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step progress bar */}
            {isSessionActive && (
              <div className="mb-4">
                <div className="h-2.5 bg-sky-50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      stepTimerPct > 0.5 ? 'bg-mint-400' : stepTimerPct > 0.2 ? 'bg-peach-400' : 'bg-coral-400'
                    }`}
                    animate={{ width: `${stepTimerPct * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <motion.button
                onClick={completeStep}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-4 bg-mint-400 text-white rounded-2xl font-comic font-bold text-lg flex items-center justify-center gap-2 shadow-kid hover:bg-mint-500 transition-colors"
              >
                <CheckCircle2 size={22} />
                {currentStep === salonSteps.length - 1 ? 'Acabei! 🏆' : 'Próximo Passo →'}
              </motion.button>

              {isRunning && (
                <motion.button
                  onClick={() => { pause(); setShowBreathing(true); setPausesCount(c => c + 1); }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-4 bg-sky-50 rounded-2xl font-comic font-bold text-sky-400 flex items-center gap-2 border-2 border-sky-100"
                >
                  <Pause size={22} />
                  <span className="hidden sm:inline">Pausa</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Steps Timeline */}
        <div className="bg-white rounded-3xl p-5 shadow-kid border-2 border-sky-50">
          <h3 className="font-comic font-bold text-lg text-text mb-4">A Minha Aventura</h3>
          <div className="space-y-2">
            {salonSteps.map((s, i) => (
              <div
                key={s.id}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  currentStep === i
                    ? 'bg-sky-50 ring-2 ring-sky-200'
                    : completedSteps.includes(s.id)
                    ? 'bg-mint-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <motion.button
                  onClick={() => setCurrentStep(i)}
                  className="flex items-center gap-3 flex-1 text-left"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-comic font-bold text-lg ${
                    completedSteps.includes(s.id)
                      ? 'bg-mint-400 text-white'
                      : currentStep === i
                      ? 'bg-sky-400 text-white'
                      : 'bg-sky-50 text-text-light'
                  }`}>
                    {completedSteps.includes(s.id) ? <CheckCircle2 size={18} /> : s.emoji}
                  </div>
                  <div className="flex-1">
                    <p className={`font-comic font-bold text-sm ${
                      completedSteps.includes(s.id) ? 'text-mint-600' : 'text-text'
                    }`}>
                      {s.title}
                    </p>
                  </div>
                  {currentStep === i && !completedSteps.includes(s.id) && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-2.5 h-2.5 bg-sky-400 rounded-full"
                    />
                  )}
                </motion.button>

                {/* Per-step duration picker (hidden during active session) */}
                {!isSessionActive && (
                  <DurationPicker
                    value={stepDurations[s.id]}
                    onChange={v => updateStepDuration(s.id, v)}
                    disabled={false}
                  />
                )}
              </div>
            ))}
          </div>

          {!isSessionActive && (
            <p className="text-xs text-text-light font-comic mt-3 text-center">
              💡 Podes ajustar o tempo de cada passo antes de começar!
            </p>
          )}
        </div>

        {/* Notes */}
        {isSessionActive && (
          <div className="bg-white rounded-3xl p-5 shadow-kid border-2 border-sky-50">
            <h3 className="font-comic font-bold text-lg text-text mb-3 flex items-center gap-2">
              <Save size={18} className="text-sky-400" />
              Como me senti
            </h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Escreve como te sentiste..."
              className="w-full p-4 bg-sky-50 rounded-2xl border-2 border-transparent focus:border-sky-200 outline-none resize-none text-base font-comic min-h-[100px]"
            />
          </div>
        )}
      </div>

      {/* Breathing Exercise */}
      <BreathingExercise
        isOpen={showBreathing}
        onClose={() => {
          setShowBreathing(false);
          if (isSessionActive) start();
        }}
        duration={60}
      />

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border-4 border-sky-100"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-sky-400 to-mint-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-kid-lg"
              >
                <Award size={48} className="text-white" />
              </motion.div>

              <h2 className="font-comic font-bold text-2xl text-text mb-2">Consegui! 🏆</h2>
              <p className="text-text-light mb-6 font-comic">
                {completedSteps.length === salonSteps.length
                  ? 'Fiz tudo! Sou um campeão/ã!'
                  : 'Bom trabalho! Na próxima faço mais!'}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-sky-50 rounded-2xl p-4 text-center">
                  <Clock size={24} className="mx-auto mb-2 text-sky-400" />
                  <p className="font-comic font-black text-xl text-text">{formatTime(seconds)}</p>
                  <p className="text-xs text-text-light font-comic">Tempo</p>
                </div>
                <div className="bg-mint-50 rounded-2xl p-4 text-center">
                  <TrendingUp size={24} className="mx-auto mb-2 text-mint-400" />
                  <p className="font-comic font-black text-xl text-text">{avgStress}%</p>
                  <p className="text-xs text-text-light font-comic">Stress Médio</p>
                </div>
                <div className="bg-peach-50 rounded-2xl p-4 text-center">
                  <AlertTriangle size={24} className="mx-auto mb-2 text-peach-400" />
                  <p className="font-comic font-black text-xl text-text">{maxStress}%</p>
                  <p className="text-xs text-text-light font-comic">Stress Máx</p>
                </div>
                <div className="bg-lavender-50 rounded-2xl p-4 text-center">
                  <Pause size={24} className="mx-auto mb-2 text-lavender-400" />
                  <p className="font-comic font-black text-xl text-text">{pausesCount}</p>
                  <p className="text-xs text-text-light font-comic">Pausas</p>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => {
                    setShowSummary(false);
                    reset();
                    setCompletedSteps([]);
                    setCurrentStep(0);
                    setStressReadings([]);
                    setPausesCount(0);
                    setNotes('');
                    setStepDurations(Object.fromEntries(salonSteps.map(s => [s.id, s.defaultDuration])));
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-sky-50 rounded-2xl font-comic font-bold text-text border-2 border-sky-100"
                >
                  Nova Sessão
                </motion.button>
                <motion.button
                  onClick={() => navigate('/child')}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-sky-400 text-white rounded-2xl font-comic font-bold shadow-kid"
                >
                  Início
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
