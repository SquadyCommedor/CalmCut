# Deploy — Guia Completo

## Arquitectura
```
Wokwi (browser) → wss://bridge.up.railway.app/esp32
                              ↓
React (Vercel)  ← wss://bridge.up.railway.app/react
```

---

## 1. Deploy do Bridge no Railway

1. Vai a [railway.app](https://railway.app) e cria conta (gratuito)
2. Clica **"New Project"** → **"Deploy from GitHub repo"**
3. Liga o teu GitHub e faz push da pasta do projecto
4. O Railway detecta o `Procfile` e arranca automaticamente
5. Vai a **Settings → Networking → Generate Domain**
6. Copia o URL — vai ser algo como `bridge-abc123.up.railway.app`

---

## 2. Actualizar o sketch ESP32

No ficheiro `esp32_sensores/esp32_sensores.ino`, linha 17:
```cpp
const char* BRIDGE_HOST = "SEU-BRIDGE.up.railway.app"; // ← mete o teu URL aqui
```

Depois compila de novo com Arduino CLI:
```bash
arduino-cli compile \
  --fqbn esp32:esp32:esp32 \
  --output-dir esp32_sensores/build \
  esp32_sensores/esp32_sensores.ino
```

---

## 3. Deploy do React no Vercel

1. Vai a [vercel.com](https://vercel.com) e liga o GitHub
2. Importa o repositório
3. Em **Environment Variables**, adiciona:
   - `VITE_SUPABASE_URL` → o teu URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` → a tua chave do Supabase
   - `VITE_BRIDGE_WS_URL` → `wss://SEU-BRIDGE.up.railway.app/react`
4. Clica **Deploy**

---

## 4. Abrir o Wokwi

- No VS Code, abre `diagram.json`
- F1 → "Wokwi: Start Simulator"
- O ESP32 liga automaticamente ao bridge no Railway

---

## Ordem na apresentação

1. Abre a app React (URL do Vercel)
2. Abre o Wokwi no VS Code → Start Simulator
3. Na app, carrega **"Ligar"** no Monitor de Stress
4. Mexe nos potenciómetros do Wokwi → os valores mudam na app em tempo real
