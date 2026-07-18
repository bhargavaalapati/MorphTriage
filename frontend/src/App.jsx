import { useState, Suspense, lazy } from 'react';
import TourGuide from './components/TourGuide';

const DynamicWrapper = lazy(() => import('./components/DynamicWrapper'));

function App() {
  const [input, setInput] = useState('');
  const [uiData, setUiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser voice input not supported.");
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (e) => setInput(prev => prev ? `${prev} ${e.results[0][0].transcript}` : e.results[0][0].transcript);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleTriage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    if (isOffline) {
      setTimeout(() => {
        setUiData({
          ui_state: { render_mode: 'CRITICAL_SUBTRACTIVE', primary_color: 'bg-red-700', text_size: 'text-4xl', action_directive: 'OFFLINE MODE: RESCUE LOGGED', visible_elements: ['CALL_AUTHORITIES'] },
          emergency_category: 'Edge Approximation',
          extracted_location: 'GPS Cache'
        });
        setLoading(false);
      }, 150); 
      return;
    }

    try {
      const response = await fetch('https://morphtriage.onrender.com/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_input: input })
      });
      const resJson = await response.json();
      if (resJson.success) setUiData(resJson.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (uiData) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white font-black animate-pulse">LOADING ARCHITECTURE...</div>}>
        <DynamicWrapper uiData={uiData} setUiData={setUiData} isOffline={isOffline} reset={() => { setUiData(null); setInput(''); }} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <TourGuide />

      <div className="max-w-xl w-full bg-[#111827] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="tour-header flex justify-between items-center p-6 border-b border-gray-800 bg-[#1A2234]">
          <h1 className="text-xl font-bold tracking-wide text-white">MorphTriage</h1>
          <button onClick={() => setIsOffline(!isOffline)} className={`tour-toggle text-xs font-bold px-4 py-2 rounded-full border ${isOffline ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
            {isOffline ? 'EDGE OFFLINE' : 'CLOUD ONLINE'}
          </button>
        </div>
        
        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div className="relative tour-input">
            <textarea
              className="w-full bg-[#0B0F19] border border-gray-700 text-gray-100 rounded-2xl p-5 pr-16 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium"
              rows="5"
              placeholder="Describe emergency..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={startVoiceInput} className={`absolute bottom-4 right-4 p-3 rounded-full ${isRecording ? 'bg-red-600 animate-pulse text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>🎙️</button>
          </div>
          
          <button onClick={handleTriage} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-lg py-5 rounded-2xl">
            {loading ? 'PARSING...' : 'INITIALIZE TRIAGE LAYER'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;