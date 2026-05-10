import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface BitalinoReading {
  heartRate: number;
  eda: number;
  stressIndex: number;
  timestamp: number;
}

interface UseBitalinoReturn {
  isConnected: boolean;
  isSimulating: boolean;
  reading: BitalinoReading | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  error: string | null;
}

// ─── Configuração ─────────────────────────────────────────────────────────────

// URL do bridge.py — muda conforme o ambiente:
//   Desenvolvimento local:  ws://localhost:8765/react
//   Wokwi + ngrok:          ws://0.tcp.ngrok.io:XXXXX/react
const BRIDGE_URL =
  import.meta.env.VITE_BRIDGE_WS_URL ?? 'ws://localhost:8765/react';

const SEND_INTERVAL_MS   = 2000; // intervalo de leitura (ms)
const WS_RECONNECT_MS    = 3000; // tempo até tentar reconectar
const WS_MAX_RETRIES     = 5;    // tentativas antes de cair para simulação

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBitalino(childId?: string): UseBitalinoReturn {
  const [isConnected, setIsConnected]   = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [reading, setReading]           = useState<BitalinoReading | null>(null);
  const [error, setError]               = useState<string | null>(null);

  const wsRef          = useRef<WebSocket | null>(null);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retriesRef     = useRef(0);
  const reconnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef     = useRef(true);

  // ── Guardar leitura na BD ──────────────────────────────────────────────────
  const saveReading = useCallback(async (r: BitalinoReading) => {
    if (!childId) return;
    try {
      await supabase.from('bitalino_readings').insert({
        child_id:     childId,
        timestamp:    r.timestamp,
        heart_rate:   r.heartRate,
        eda:          r.eda,
        stress_index: r.stressIndex,
      });
    } catch (e) {
      console.error('[useBitalino] Erro ao guardar leitura:', e);
    }
  }, [childId]);

  // ── Simulação interna (fallback sem hardware) ──────────────────────────────
  const generateSimReading = (): BitalinoReading => {
    const baseStress = Math.random() * 100;
    return {
      heartRate:   Math.floor(60 + Math.random() * 40 + (baseStress > 70 ? 20 : 0)),
      eda:         parseFloat((0.5 + Math.random() * 2).toFixed(2)),
      stressIndex: Math.floor(baseStress),
      timestamp:   Date.now(),
    };
  };

  const startSimulation = useCallback(() => {
    if (simIntervalRef.current) return;
    setIsSimulating(true);
    simIntervalRef.current = setInterval(() => {
      const r = generateSimReading();
      setReading(r);
      saveReading(r);
    }, SEND_INTERVAL_MS);
  }, [saveReading]);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
  }, []);

  // ── WebSocket ao bridge ESP32 ──────────────────────────────────────────────
  const connectWS = useCallback(() => {
    // Limpar ligação anterior
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    let ws: WebSocket;
    try {
      ws = new WebSocket(BRIDGE_URL);
    } catch {
      console.warn('[useBitalino] WebSocket não suportado ou URL inválida.');
      startSimulation();
      return;
    }

    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      retriesRef.current = 0;
      setIsConnected(true);
      setIsSimulating(false);
      setError(null);
      stopSimulation();
      console.info('[useBitalino] Ligado ao bridge ESP32:', BRIDGE_URL);
    };

    ws.onmessage = (event) => {
      if (!mountedRef.current) return;
      try {
        const data = JSON.parse(event.data) as BitalinoReading;
        // Validar campos esperados
        if (
          typeof data.heartRate   === 'number' &&
          typeof data.eda         === 'number' &&
          typeof data.stressIndex === 'number'
        ) {
          const r: BitalinoReading = {
            heartRate:   data.heartRate,
            eda:         data.eda,
            stressIndex: data.stressIndex,
            timestamp:   data.timestamp ?? Date.now(),
          };
          setReading(r);
          saveReading(r);
        }
      } catch {
        console.warn('[useBitalino] Mensagem inválida do bridge:', event.data);
      }
    };

    ws.onerror = () => {
      console.warn('[useBitalino] Erro WebSocket');
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      setIsConnected(false);
      wsRef.current = null;

      retriesRef.current += 1;
      if (retriesRef.current <= WS_MAX_RETRIES) {
        console.info(`[useBitalino] Reconectar em ${WS_RECONNECT_MS}ms (tentativa ${retriesRef.current}/${WS_MAX_RETRIES})`);
        reconnTimerRef.current = setTimeout(connectWS, WS_RECONNECT_MS);
      } else {
        console.warn('[useBitalino] Bridge inacessível. A usar simulação interna.');
        setError('Bridge ESP32 inacessível. A usar simulação interna.');
        startSimulation();
      }
    };
  }, [saveReading, startSimulation, stopSimulation]);

  // ── API pública ────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    setError(null);
    retriesRef.current = 0;
    connectWS();
  }, [connectWS]);

  const disconnect = useCallback(() => {
    // Cancelar reconexão agendada
    if (reconnTimerRef.current) {
      clearTimeout(reconnTimerRef.current);
      reconnTimerRef.current = null;
    }
    // Fechar WebSocket
    if (wsRef.current) {
      wsRef.current.onclose = null; // evitar reconexão automática
      wsRef.current.close();
      wsRef.current = null;
    }
    stopSimulation();
    setIsConnected(false);
    setReading(null);
  }, [stopSimulation]);

  // ── Cleanup ao desmontar ───────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isSimulating,
    reading,
    connect,
    disconnect,
    startSimulation,
    stopSimulation,
    error,
  };
}
