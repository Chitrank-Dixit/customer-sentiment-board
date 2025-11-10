
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[500px] flex flex-col justify-center items-center bg-slate-800 rounded-lg p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      <h3 className="text-xl font-semibold text-slate-300 mt-6">Analyzing Reviews...</h3>
      <p className="text-slate-400 mt-2">This may take a moment. The AI is working its magic!</p>
    </div>
  );
};

export default Loader;
