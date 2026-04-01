import React from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-transparent border border-white/10 rounded-xl leading-5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
            placeholder="Job Title, Keywords, or Company"
          />
        </div>
        
        <div className="md:w-1/3 w-full relative group">
           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-transparent border border-white/10 rounded-xl leading-5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
            placeholder="Location"
          />
        </div>

        <button className="w-full md:w-auto bg-blue-600/80 text-white px-8 py-3 rounded-xl font-medium border border-blue-500/50 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
