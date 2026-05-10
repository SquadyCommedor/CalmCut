#!/usr/bin/env python3
"""
=======================================================
  simulador.py — Substituto local do ESP32/Wokwi
=======================================================

  Usa isto se não quiseres correr o Wokwi.
  Envia dados para o bridge.py directamente.

  Uso:
    1. python bridge.py
    2. python simulador.py
    3. npm run dev
=======================================================
"""

import asyncio
import json
import random
import time
import websockets

BRIDGE_URL    = "ws://localhost:8765/esp32"
SEND_INTERVAL = 2.0
RECONNECT_WAIT = 3.0

sim_stress   = 30.0
sim_hr       = 75.0
sim_eda      = 1.0
stress_delta = 0.5

def read_sensors() -> dict:
    global sim_stress, sim_hr, sim_eda, stress_delta
    sim_stress += stress_delta + (random.randint(-10, 10) / 10.0)
    if sim_stress >= 85.0 or sim_stress <= 10.0:
        stress_delta *= -1
    sim_stress = max(5.0, min(95.0, sim_stress))
    target_hr = 60.0 + (sim_stress * 0.5) + random.randint(-5, 5)
    sim_hr = sim_hr * 0.8 + target_hr * 0.2
    target_eda = 0.3 + (sim_stress / 100.0) * 3.5 + (random.randint(-20, 20) / 100.0)
    sim_eda = sim_eda * 0.7 + target_eda * 0.3
    return {
        "heart_rate":   round(sim_hr),
        "eda":          round(sim_eda, 2),
        "stress_index": round(sim_stress),
        "timestamp":    int(time.time() * 1000),
    }

async def run():
    print("=" * 50)
    print("  Simulador ESP32 — Modo Local")
    print("=" * 50)
    while True:
        try:
            async with websockets.connect(BRIDGE_URL) as ws:
                print("✅ Ligado ao bridge!")
                await ws.send(json.dumps({"type": "hello", "device": "simulador_local"}))
                while True:
                    data = read_sensors()
                    await ws.send(json.dumps(data))
                    print(f"  → HR: {data['heart_rate']} BPM | EDA: {data['eda']:.2f} μS | Stress: {data['stress_index']}%")
                    await asyncio.sleep(SEND_INTERVAL)
        except (websockets.exceptions.ConnectionRefusedError, OSError):
            print(f"⚠️  Bridge não encontrado. A tentar em {RECONNECT_WAIT}s...")
            await asyncio.sleep(RECONNECT_WAIT)
        except websockets.exceptions.ConnectionClosed:
            print("⚠️  Bridge desligou. A reconectar...")
            await asyncio.sleep(RECONNECT_WAIT)

if __name__ == "__main__":
    try:
        asyncio.run(run())
    except KeyboardInterrupt:
        print("\nSimulador parado.")
