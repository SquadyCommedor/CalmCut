# ESP32 → Bridge → React
## Guia de Instalação Completo

---

## Arquitetura

```
┌─────────────────────────────────────┐
│  Wokwi (browser)                    │
│  ESP32 simulado                     │
│  • Potenciómetro 1 → Heart Rate     │
│  • Potenciómetro 2 → EDA/Stress     │
│  Envia JSON cada 2s via WebSocket   │
└──────────────┬──────────────────────┘
               │ ws://SEU_IP:8765/esp32
               ▼
┌─────────────────────────────────────┐
│  bridge.py (Python local)           │
│  Recebe do ESP32, reencaminha       │
│  para todos os clientes React       │
└──────────────┬──────────────────────┘
               │ ws://localhost:8765/react
               ▼
┌─────────────────────────────────────┐
│  React App (useBitalino.ts)         │
│  Mostra dados em tempo real         │
│  Guarda em Supabase                 │
└─────────────────────────────────────┘
```

---

## Passo 1 — Instalar dependências Python

```bash
pip install websockets
```

---

## Passo 2 — Correr o Bridge

```bash
python bridge.py
```

Deves ver:
```
==================================================
  Bridge ESP32 → React
==================================================
  ESP32 liga a:  ws://localhost:8765/esp32
  React liga a:  ws://localhost:8765/react
  ...
```

---

## Passo 3 — Expor o Bridge ao Wokwi (ngrok)

O Wokwi corre na cloud, por isso não consegue ligar a `localhost`.
Precisas de expor a porta 8765 com ngrok:

### Instalar ngrok
- Download: https://ngrok.com/download
- Ou: `brew install ngrok` (macOS) / `choco install ngrok` (Windows)

### Expor a porta
```bash
ngrok tcp 8765
```

Verás algo como:
```
Forwarding  tcp://0.tcp.eu.ngrok.io:12345 -> localhost:8765
```

Copia o host (`0.tcp.eu.ngrok.io`) e a porta (`12345`).

---

## Passo 4 — Configurar o ESP32 no Wokwi

1. Vai a **https://wokwi.com**
2. Clica em **New Project** → **ESP32**
3. Apaga o código de exemplo
4. Cola o conteúdo de `esp32_sensores.ino`
5. Clica no ícone de ficheiros (📁) e adiciona `diagram.json`
6. **Edita as linhas do host/porta** no sketch:

```cpp
// Muda para o endereço do ngrok:
const char* BRIDGE_HOST = "0.tcp.eu.ngrok.io";  // ← ngrok host
const int   BRIDGE_PORT = 12345;                  // ← ngrok port
```

7. Clica **▶ Start Simulation**

No Serial Monitor do Wokwi deves ver:
```
WiFi OK! IP: 192.168.x.x
[WS] Conectado a ws://0.tcp.eu.ngrok.io:12345/esp32
[SEND] {"heart_rate":75,"eda":1.23,"stress_index":42,"timestamp":1234}
```

No terminal do bridge.py deves ver:
```
ESP32 ligado: (...)
→ HR:75 EDA:1.23 Stress:42%
```

---

## Passo 5 — Ligar o React ao Bridge

### Opção A: Variável de ambiente (recomendado)

Cria/edita o ficheiro `.env` no projeto React:
```env
VITE_BRIDGE_WS_URL=ws://localhost:8765/react
```

Reinicia o servidor de desenvolvimento:
```bash
npm run dev
```

### Opção B: Substitui o hook

Copia `useBitalino.ts` para `src/hooks/useBitalino.ts`
(substitui o ficheiro existente).

---

## Passo 6 — Testar

1. Bridge a correr ✅
2. Wokwi a simular ✅
3. React dev server a correr ✅
4. Abre o SalonModePage e clica **Começar**
5. Clica **Ligar Pulseira**

Deves ver os dados a atualizar em tempo real com os valores do Wokwi.
Mexe nos potenciómetros no Wokwi para ver o stress subir/descer!

---

## Modo Simulação (sem Wokwi)

Se o bridge não estiver acessível, o hook cai automaticamente para
simulação interna após 5 tentativas. Funciona exatamente igual ao
comportamento anterior — sem nenhuma alteração no UI.

---

## Para Hardware Real (ESP32 físico)

Quando tiveres o ESP32 físico com sensores:

1. Abre `esp32_sensores.ino` no Arduino IDE
2. Instala as bibliotecas:
   - `WebSockets` by Markus Sattler
   - `ArduinoJson` by Benoit Blanchon
3. Muda as credenciais WiFi:
   ```cpp
   const char* WIFI_SSID     = "O_TEU_WIFI";
   const char* WIFI_PASSWORD = "A_TUA_PASSWORD";
   const char* BRIDGE_HOST   = "192.168.x.x"; // IP do teu PC
   ```
4. Com sensores reais, substitui `readSensors()` por leituras ADC:
   ```cpp
   // Pulse Sensor no pino 34
   int raw = analogRead(PIN_PULSE);
   // EDA/GSR no pino 35
   float edaRaw = analogRead(PIN_EDA) / 4095.0 * 3.3;
   ```
5. Faz upload para o ESP32
6. O bridge.py não muda — funciona igual

---

## Formato JSON (ESP32 → Bridge → React)

```json
{
  "heart_rate": 75,
  "eda": 1.23,
  "stress_index": 42,
  "timestamp": 1234567890123
}
```

O bridge converte para o formato do `useBitalino.ts`:
```json
{
  "heartRate": 75,
  "eda": 1.23,
  "stressIndex": 42,
  "timestamp": 1234567890123
}
```

E a BD guarda com:
```sql
heart_rate   INTEGER
eda          REAL
stress_index INTEGER
timestamp    BIGINT
```
