# 🚀 Project Setup Guide

Follow these steps to get PharmaSight running locally on your machine.

---

## 📋 Prerequisites

Ensure you have the following installed:
- **Python 3.9 or higher**
- **Node.js 18.0 or higher**
- **npm** (comes with Node.js)
- **Git**

---

## 🛠️ Backend Setup (FastAPI)

The backend serves the AI models and processes data via a REST API.

1. **Clone the project & Navigate to directory**:
   ```powershell
   cd "PharmaSight - AI Powered Drug Shortage Prediction"
   ```

2. **Create a Virtual Environment**:
   ```powershell
   python -m venv .venv
   ```

3. **Activate the Virtual Environment**:
   - **Windows (PowerShell)**: `.venv\Scripts\Activate.ps1`
   - **Windows (CMD)**: `.venv\Scripts\activate.bat`
   - **Unix/macOS**: `source .venv/bin/activate`

4. **Install Dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```

5. **Start the API Server**:
   ```powershell
   python src/serving/app.py
   ```
   > [!TIP]
   > The backend will be available at `http://127.0.0.1:8000`.

---

## 🎨 Frontend Setup (Next.js)

The frontend is a modern dashboard built with Next.js 15.

1. **Install Node.js Dependencies**:
   ```powershell
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to a new file named `.env.local`:
   ```powershell
   copy .env.example .env.local
   ```
   *By default, it points to the local backend at `http://localhost:8000`.*

3. **Start the Development Server**:
   ```powershell
   npm run dev
   ```

4. **Access the Dashboard**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚦 Troubleshooting

### 1. Port Conflicts
- Backend uses **8000**.
- Frontend uses **3000**.
If these ports are occupied, the applications might fail to start.

### 2. Missing Model Checkpoints
If you see a warning about missing `.ckpt` files in the console, the backend will still run but may fall back to statistical forecasting instead of real AI inference.

### 3. CSV Upload Errors
Ensure your CSV follows the format:
- Required columns: `date`, `drug_name`, `daily_dispenses`.
- Optional: `quantity_available` (for high-accuracy risk calculation).

---

> [!IMPORTANT]
> The backend MUST be running for the dashboard to display real-time predictions. If the backend is offline, the site will automatically switch to **Emergency Demo Mode** with mock data.
