//import React from 'react';

export default function DynamicWrapper({ uiData, reset }) {
  const { ui_state, emergency_category, extracted_location } = uiData;
  const { render_mode, primary_color, text_size, action_directive, visible_elements } = ui_state;

  // STATE 1: THE VICTIM (High Panic, Subtractive UI)
  if (render_mode === 'CRITICAL_SUBTRACTIVE') {
    return (
      <div className={`min-h-screen w-screen ${primary_color} flex flex-col items-center justify-center p-6 text-white transition-all duration-700`}>
        <h1 className={`${text_size} font-black text-center uppercase tracking-wider animate-pulse mb-12 leading-tight`}>
          {action_directive}
        </h1>

        {visible_elements.includes('SOS_BUTTON') && (
          <button className="px-10 py-8 bg-white text-black font-extrabold text-3xl rounded-3xl shadow-2xl uppercase active:scale-95 transition-transform w-full max-w-md">
            Confirm Rescue Sent
          </button>
        )}
        
        <button onClick={reset} className="mt-16 text-sm opacity-60 underline tracking-widest uppercase">End Simulation</button>
      </div>
    );
  }

  // STATE 2: THE PROXY OBSERVER (Low Panic, Additive Dashboard)
  return (
    <div className="min-h-screen w-screen bg-gray-50 text-gray-900 flex flex-col transition-all duration-700">
      {/* Dynamic Header */}
      <div className={`${primary_color} text-white p-6 shadow-md`}>
        <h2 className="text-2xl font-bold uppercase tracking-wide">Proxy Intel Dashboard</h2>
        <p className="text-sm opacity-90 mt-1">Focus: {emergency_category} | Location: {extracted_location}</p>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6 max-w-3xl mx-auto w-full mt-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">AI Directive</h3>
           <p className={`${text_size} font-bold text-gray-900`}>{action_directive}</p>
        </div>

        {visible_elements.includes('MAP_PIN') && (
          <div className="h-56 bg-gray-200 rounded-xl border-2 border-dashed border-gray-400 flex items-center justify-center">
            <span className="text-gray-500 font-bold">Interactive Map Component Placeholder</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visible_elements.includes('CASUALTY_SLIDER') && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-4">Estimate Stranded Individuals:</label>
                <input type="range" min="0" max="100" className="w-full accent-blue-600" />
            </div>
            )}

            {visible_elements.includes('PHOTO_UPLOAD') && (
            <button className="w-full py-8 border-2 border-dashed border-blue-500 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                + Upload Surveillance Media
            </button>
            )}
        </div>
      </div>
      
      <div className="p-6 text-center">
         <button onClick={reset} className="text-sm text-gray-500 underline font-semibold">End Simulation</button>
      </div>
    </div>
  );
}