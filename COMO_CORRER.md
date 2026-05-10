# Como correr o projecto localmente

## Pré-requisitos

- Python 3.9+
- Node.js 18+
- VS Code com extensão **Wokwi** (wokwi.wokwi-vscode)
- **Arduino CLI** instalado

---

## 1. Instalar Arduino CLI

**Windows:**
```
winget install ArduinoSA.ArduinoCLI
```

**Mac:**
```
brew install arduino-cli
```

---

## 2. Instalar suporte ESP32 + bibliotecas

```bash
arduino-cli core update-index --additional-urls https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json

arduino-cli core install esp32:esp32 --additional-urls https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json

arduino-cli lib install "WebSockets"
arduino-cli lib install "ArduinoJson"
```

---

## 3. Compilar o sketch ESP32

Na pasta raiz do projecto:

```bash
arduino-cli compile \
  --fqbn esp32:esp32:esp32 \
  --output-dir esp32_sensores/build \
  esp32_sensores/esp32_sensores.ino
```

Isto gera os ficheiros em `esp32_sensores/build/`.

---

## 4. Correr tudo

Abre **3 terminais**:

**Terminal 1 — Bridge:**
```bash
pip install websockets
python bridge.py
```

**Terminal 2 — Wokwi (VS Code):**
- Abre a pasta no VS Code
- Abre o ficheiro `diagram.json`
- Carrega em **F1** → "Wokwi: Start Simulator"

**Terminal 3 — React:**
```bash
npm install
npm run dev
```

---

## Alternativa sem Wokwi

Se não quiseres usar o Wokwi, usa o simulador Python:

**Terminal 2 (alternativo):**
```bash
python simulador.py
```

Comporta-se exactamente como o ESP32 — envia os mesmos dados para o bridge.
