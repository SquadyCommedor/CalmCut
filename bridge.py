#!/usr/bin/env python3
"""
Bridge ESP32 → React — produção (Railway)
WSS suportado automaticamente pelo Railway via proxy TLS.
"""

import asyncio
import json
import logging
import os
import websockets
from websockets.server import WebSocketServerProtocol
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("bridge")

esp32_clients: set[WebSocketServerProtocol] = set()
react_clients: set[WebSocketServerProtocol] = set()
last_reading: dict | None = None


def compute_stress(heart_rate: int, eda: float) -> int:
    hr_norm  = max(0, min(100, (heart_rate - 50) / 70 * 100))
    eda_norm = max(0, min(100, eda / 4.0 * 100))
    return int(hr_norm * 0.4 + eda_norm * 0.6)


async def handle_esp32(ws: WebSocketServerProtocol):
    global last_reading
    esp32_clients.add(ws)
    log.info(f"ESP32 ligado: {ws.remote_address}")
    try:
        async for message in ws:
            try:
                data = json.loads(message)
                if data.get("type") == "hello":
                    log.info(f"ESP32 identificado: {data.get('device', '?')}")
                    continue
                heart_rate   = int(data.get("heart_rate", 70))
                eda          = float(data.get("eda", 1.0))
                stress_index = int(data.get("stress_index", compute_stress(heart_rate, eda)))
                timestamp    = int(data.get("timestamp", int(datetime.now().timestamp() * 1000)))
                reading = {
                    "heartRate":   heart_rate,
                    "eda":         round(eda, 2),
                    "stressIndex": stress_index,
                    "timestamp":   timestamp,
                }
                last_reading = reading
                payload = json.dumps(reading)
                log.info(f"→ HR:{heart_rate} EDA:{eda:.2f} Stress:{stress_index}%")
                dead = set()
                for client in react_clients:
                    try:
                        await client.send(payload)
                    except websockets.exceptions.ConnectionClosed:
                        dead.add(client)
                react_clients -= dead
            except (json.JSONDecodeError, KeyError, ValueError) as e:
                log.warning(f"Mensagem inválida: {e}")
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        esp32_clients.discard(ws)
        log.info("ESP32 desligado")


async def handle_react(ws: WebSocketServerProtocol):
    react_clients.add(ws)
    log.info(f"React ligado (total: {len(react_clients)})")
    if last_reading:
        await ws.send(json.dumps(last_reading))
    try:
        async for _ in ws:
            pass
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        react_clients.discard(ws)
        log.info(f"React desligado (total: {len(react_clients)})")


async def router(ws: WebSocketServerProtocol):
    path = ws.request.path if hasattr(ws, 'request') else getattr(ws, 'path', '/')
    if path == "/esp32":
        await handle_esp32(ws)
    elif path == "/react":
        await handle_react(ws)
    else:
        await ws.close(1008, "Path inválido. Use /esp32 ou /react")


async def main():
    # Railway injeta a PORT automaticamente
    port = int(os.environ.get("PORT", 8765))
    host = "0.0.0.0"

    log.info("=" * 50)
    log.info("  Bridge ESP32 → React (Railway)")
    log.info(f"  A escutar em {host}:{port}")
    log.info("=" * 50)

    async with websockets.serve(router, host, port):
        await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        log.info("Servidor parado.")
