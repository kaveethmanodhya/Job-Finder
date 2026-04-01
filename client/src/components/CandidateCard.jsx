import React from 'react';
import { CheckCircle2, MapPin } from 'lucide-react';

const CandidateCard = ({ name, jobTitle, location, skills, profileSource, profileUrl, imageUrl }) => {
  // Get initials for fallback
  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="relative group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden">
      {/* Decorative gradient blob inside the card */}
      <div className="absolute -inset-2 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 z-0"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          {imageUrl ? (
            <div className="w-16 h-16 rounded-full overflow-hidden border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300">
              <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 flex justify-center items-center shadow-inner group-hover:border-purple-400/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                {getInitials(name)}
              </span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white drop-shadow-md">{name}</h3>
                {profileSource === 'Verified' && (
                  <CheckCircle2 className="w-5 h-5 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                )}
              </div>
              <p className="text-gray-300 font-medium mt-1">{jobTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-400 mt-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="bg-white/10 text-blue-300 text-xs px-3 py-1.5 rounded-full border border-white/5 shadow-sm backdrop-blur-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-6 pt-4 border-t border-white/10">
        <a
          href={profileUrl}
          className="inline-block w-full text-center bg-transparent border border-blue-500/50 text-blue-300 font-medium px-4 py-2.5 rounded-xl hover:bg-blue-500/20 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300"
        >
          View Profile
        </a>
      </div>
    </div>
  );
};

export default CandidateCard;
