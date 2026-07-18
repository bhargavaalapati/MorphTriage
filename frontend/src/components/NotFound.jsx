const NotFound = () => (
  <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white flex-col font-sans">
    <h1 className="text-9xl font-black text-blue-600 mb-2 drop-shadow-2xl">404</h1>
    <p className="text-xl tracking-widest uppercase text-gray-400 font-bold mb-8">Sector Not Found</p>
    <a 
      href="/" 
      className="px-8 py-3 border-2 border-blue-600 text-blue-500 font-bold tracking-widest uppercase rounded-full hover:bg-blue-600 hover:text-white transition-colors"
    >
      Return to Hub
    </a>
  </div>
);

export default NotFound