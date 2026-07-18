# 🚨 MorphTriage: AI-Powered Cognitive Triage System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=Twilio&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

MorphTriage is a dynamic, GenAI-integrated assistive layer designed for disaster zones. During a crisis, cognitive load skyrockets and cellular bandwidth degrades. MorphTriage mutates its UI based on the user's linguistic panic levels, gracefully degrades to edge-processing during network collapses, and automatically routes translated, actionable intel to first responders via SMS.

## ⚡ The Problem vs. The Solution

- **The Problem:** Traditional emergency apps are cluttered. In a crisis, users lack the cognitive capacity to navigate complex menus, and language barriers delay dispatch.

- **The Solution:** An adaptive UI that uses LLMs (Gemini 1.5) to parse frantic, multilingual voice/text input. It subtracts interface noise, extracts vital coordinates, and bridges the gap between chaotic bystander reports and structured command-center intel.

## 🏗️ Core Architecture & Features

- **Cognitive UI Mutation:** The React/Vite frontend dynamically shifts between 'Subtractive Panic Mode' and 'Detailed Proxy Mode' based on the backend's AI sentiment analysis.

- **Automated SMS Dispatch:** Integrates the Twilio REST API to route highly-compressed UCS-2 SMS alerts (complete with interactive Leaflet/Google Maps links and casualty counts) to dispatchers.

- **Edge-Fallback Protocol:** Simulates cellular collapse by caching intel locally via LocalStorage and Edge Approximations until the network is restored.

- **Zero-Latency Caching:** Utilizes Redis for sub-millisecond retrieval of identical emergency prompts, protecting API rate limits.

- **Surveillance Integration:** Secure, unsigned Cloudinary integrations for uploading real-time disaster imagery.

## 🚀 Tech Stack

- **Frontend (Vercel):** React, Vite, TailwindCSS, React-Joyride, React-Leaflet.
- **Backend (Render/Docker):** Python, FastAPI, Uvicorn, Google Generative AI (Gemini), Twilio.
- **Database & Cache:** MongoDB Atlas, Redis.

## 🛠️ Local Setup

You can run MorphTriage locally using either standard terminal commands or Docker Compose.

**1. Clone & Configure**
Clone the repository and set up your environment variables:

```
git clone https://github.com/bhargavaalapati/MorphTriage
cd MorphTriage
```

**2. Create a .env file inside the /backend directory and add your keys:**

```
GEMINI_API_KEY="your_google_key"
MONGODB_URI="your_mongo_cluster_uri"
TWILIO_ACCOUNT_SID="your_twilio_sid"
TWILIO_AUTH_TOKEN="your_twilio_token"
TWILIO_PHONE_NUMBER="+............"
YOUR_VERIFIED_PHONE="+............" # Or your personal verified number
```

**3. Option A: Run via Docker (Recommended)**

Since the docker-compose.yml is located in the root directory and the Dockerfile is in /backend, you can spin up the entire backend environment with a single command from the root folder:

```
docker-compose up --build
(Note: To run the frontend alongside it, open a new terminal, navigate to /frontend, run npm install, and npm run dev).
```

**4. Option B: Standard Local Run
If you prefer running natively without Docker:**

**Backend:**

```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**

```
cd frontend
# Ensure API endpoints in App.jsx and DynamicWrapper.jsx point to localhost:8000
npm install
npm run dev
```
