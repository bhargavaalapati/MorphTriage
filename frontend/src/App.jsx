import { useState } from 'react';
import DynamicWrapper from './components/DynamicWrapper';

function App() {
  const [input, setInput] = useState('');
  const [uiData, setUiData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTriage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_input: input })
      });
      const resJson = await response.json();
      
      if (resJson.success) {
        setUiData(resJson.data);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Backend connection failed. Is FastAPI running?");
    }
    
    setLoading(false);
  };

  // If the AI has generated a UI state, yield control to the DynamicWrapper
  if (uiData) {
    return <DynamicWrapper uiData={uiData} reset={() => { setUiData(null); setInput(''); }} />;
  }

  // Baseline Peacetime UI
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all">
        <div className="flex items-center space-x-3 mb-6">
            <div className="h-4 w-4 bg-red-600 rounded-full animate-pulse"></div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">MorphTriage Prototype</h1>
        </div>
        
        <p className="text-sm text-gray-500 mb-6 font-medium">
            Enter an unstructured emergency message below to simulate real-time Generative UI mutation.
        </p>

        <textarea
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl p-4 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none font-medium"
          rows="5"
          placeholder="e.g., 'water rising fast cant find my grandpa help near old temple'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        <button
          onClick={handleTriage}
          disabled={loading}
          className="w-full bg-black text-white font-black text-lg py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {loading ? (
            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : 'INITIALIZE TRIAGE ENGINE'}
        </button>
      </div>
    </div>
  );
}

export default App;