import React from 'react';
import { MapPin, Briefcase, Building } from 'lucide-react';

const JobCard = ({ title, company, location, type, isRemote, tags }) => {
  return (
    <div className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.1)] hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(59,130,246,0.2)] transition-all duration-300">
      
      {/* Header Info */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{title}</h3>
          <div className="flex items-center text-sm text-gray-400 space-x-2">
            <span className="flex items-center"><Building className="w-4 h-4 mr-1"/> {company}</span>
          </div>
        </div>
        <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold border border-blue-500/30">
          {type}
        </div>
      </div>
      
      {/* Location / Remote block */}
      <div className="flex items-center space-x-4 mb-5 text-sm text-gray-300">
        <span className="flex items-center"><MapPin className="w-4 h-4 text-red-400 mr-2" /> {location}</span>
        {isRemote && <span className="flex items-center"><Briefcase className="w-4 h-4 text-emerald-400 mr-2" /> Remote Available</span>}
      </div>
      
      {/* Skills / Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, i) => (
          <span key={i} className="bg-white/10 px-3 py-1 rounded-lg text-xs font-medium text-gray-200 border border-white/10">
            {tag}
          </span>
        ))}
      </div>
      
      {/* Action Button */}
      <div className="mt-auto">
        <button className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
