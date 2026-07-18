import { useState } from 'react';
import EmergencyMap from './EmergencyMap';
import MediaUpload from './MediaUpload';

export default function DynamicWrapper({ uiData, setUiData, reset, isOffline }) {
  const { ui_state, emergency_category, extracted_location } = uiData;
  const { render_mode, primary_color, text_size, action_directive, visible_elements } = ui_state;

  const [position, setPosition] = useState({ lat: 17.6868, lng: 83.2185 }); 
  const [casualtyCount, setCasualtyCount] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const forceDetailedMode = () => {
    setUiData({
      ...uiData,
      ui_state: { ...ui_state, render_mode: 'ADDITIVE_DASHBOARD', primary_color: 'bg-slate-900', text_size: 'text-base', visible_elements: ['MAP_PIN', 'CASUALTY_SLIDER', 'PHOTO_UPLOAD'] }
    });
  };

  const forceAssistedMode = () => {
    setUiData({
      ...uiData,
      ui_state: { ...ui_state, render_mode: 'CRITICAL_SUBTRACTIVE', primary_color: 'bg-red-700', text_size: 'text-4xl md:text-6xl', visible_elements: ['SOS_BUTTON', 'CALL_AUTHORITIES'] }
    });
  };

  const getEmergencyContacts = () => {
    const cat = emergency_category.toLowerCase();
    if (cat.includes('fire')) return { primary: { num: '101', label: 'Fire Dept' }, sec: { num: '112', label: 'Universal' } };
    if (cat.includes('medical') || cat.includes('health')) return { primary: { num: '108', label: 'Ambulance' }, sec: { num: '112', label: 'Universal' } };
    if (cat.includes('women') || cat.includes('assault')) return { primary: { num: '181', label: 'Women Helpline' }, sec: { num: '1091', label: 'Police' } };
    if (cat.includes('cyber')) return { primary: { num: '1930', label: 'Cyber Fraud' }, sec: { num: '112', label: 'Universal' } };
    return { primary: { num: '112', label: 'Universal SOS (ERSS)' }, sec: { num: '1070', label: 'Disaster Relief' } };
  };
  const contacts = getEmergencyContacts();

  const submitProxyIntel = async () => {
    setIsSubmitting(true);
    try {
      await fetch('https://morphtriage.onrender.com/api/intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 🔴 NEW: Custom fallback text if no photo is uploaded
        body: JSON.stringify({ 
          lat: position.lat, 
          lng: position.lng, 
          casualty_estimate: Number(casualtyCount), 
          image_url: imageUrl || "Visuals unconfirmed. Verified MorphTriage Proxy / Bystander reporting on-site." 
        })
      });
      alert("Intel Submitted to Command Center!");
      reset();
    } catch {
      alert("Offline Mode: Intel cached locally.");
      reset();
    }
  };

  if (render_mode === 'CRITICAL_SUBTRACTIVE') {
    return (
      <div className={`fixed inset-0 ${primary_color} flex flex-col items-center justify-center p-6 text-white z-50`}>
        {isOffline && <div className="absolute top-6 font-bold text-yellow-300 tracking-widest text-sm uppercase px-4 py-1 bg-black/30 rounded-full">Offline Edge Active</div>}
        
        <h1 className={`${text_size} font-black text-center uppercase tracking-tight mb-6 drop-shadow-2xl`}>{action_directive}</h1>
        
        <div className="flex flex-col gap-4 w-full max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <a href={`tel:${contacts.primary.num}`} className="flex flex-col items-center justify-center py-6 bg-white text-black font-black text-3xl rounded-3xl shadow-xl">
                <span>{contacts.primary.num}</span><span className="text-xs uppercase text-gray-500">{contacts.primary.label}</span>
            </a>
            <a href={`tel:${contacts.sec.num}`} className="flex flex-col items-center justify-center py-6 bg-white text-black font-black text-3xl rounded-3xl shadow-xl">
                <span>{contacts.sec.num}</span><span className="text-xs uppercase text-gray-500">{contacts.sec.label}</span>
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-8 flex flex-col items-center gap-4">
          <button onClick={forceDetailedMode} className="text-xs bg-black/20 hover:bg-black/40 px-6 py-3 rounded-full font-bold uppercase tracking-widest transition-colors backdrop-blur-md border border-white/20">
            Switch to Detailed Report Mode
          </button>
          <button onClick={reset} className="text-xs underline font-bold uppercase tracking-[0.2em] opacity-60 hover:opacity-100">Abort Triage</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      <header className={`${primary_color} text-white px-6 py-8 shadow-lg flex flex-col md:flex-row justify-between md:items-center`}>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black uppercase tracking-tight">Proxy Intel Hub</h2>
            {isOffline && <span className="bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">Offline</span>}
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm font-medium opacity-90">
              <span className="bg-white/20 px-3 py-1 rounded-full">{emergency_category}</span>
              <span>Target Area: {extracted_location}</span>
          </div>
        </div>
        <button onClick={reset} className="mt-4 md:mt-0 bg-white/10 hover:bg-white/20 transition-colors px-6 py-3 rounded-xl text-sm font-bold tracking-wider uppercase border border-white/20 backdrop-blur-sm">
          New Report
        </button>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border text-center md:text-left flex justify-between items-center">
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">System Directive</p>
                <p className={`${text_size} font-black`}>{action_directive}</p>
             </div>
             <button onClick={forceAssistedMode} className="hidden md:block text-xs bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold uppercase tracking-widest border border-red-200">
               Force Assisted Mode
             </button>
        </div>

        {visible_elements.includes('MAP_PIN') && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border h-96 flex flex-col">
            <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold">Pinpoint Disaster Epicenter</h3>
               {/* 🔴 NEW: Live Coordinate Feedback */}
               <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded">
                 Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
               </span>
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden z-0">
               <EmergencyMap position={position} setPosition={setPosition} />
            </div>
          </div>
        )}

        {visible_elements.includes('CASUALTY_SLIDER') && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border flex flex-col justify-center">
            <label className="font-bold mb-6">Estimated Casualties/Stranded: <span className="text-blue-600 text-2xl">{casualtyCount}</span></label>
            <input type="range" min="0" max="100" value={casualtyCount} onChange={(e) => setCasualtyCount(e.target.value)} className="w-full accent-blue-600" />
        </div>
        )}

        {visible_elements.includes('PHOTO_UPLOAD') && <div className="md:col-span-2"><MediaUpload setImageUrl={setImageUrl} /></div>}
        
        <div className="md:col-span-2 flex flex-col md:flex-row justify-between items-center gap-4">
            <button onClick={forceAssistedMode} className="md:hidden w-full text-xs bg-red-50 text-red-600 py-4 rounded-xl font-bold uppercase tracking-widest border border-red-200">
               Switch to Assisted Mode
            </button>
            <button onClick={submitProxyIntel} disabled={isSubmitting} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black px-12 py-5 rounded-xl uppercase tracking-widest text-lg ml-auto">
                {isSubmitting ? 'Transmitting...' : 'Submit Intel to Command'}
            </button>
        </div>
      </main>
    </div>
  );
}