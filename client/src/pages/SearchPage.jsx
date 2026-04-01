import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import CandidateCard from '../components/CandidateCard';

const SearchPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/candidates');
        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setError('Lost connection to the Mainframe. Unable to fetch candidates.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);
  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/40 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-900/30 rounded-full mix-blend-screen filter blur-[120px] opacity-50 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[20rem] bg-cyan-900/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header / Search Area */}
        <div className="mb-12 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-8 text-center drop-shadow-sm">
            Find the right talent. <span className="text-blue-400">Faster.</span>
          </h1>
          <div className="w-full max-w-4xl">
            <SearchBar />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          {/* Left Sidebar - Advanced Filters */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] sticky top-24">
              <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2">Filters</h2>
              
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Profile Type</h3>
                <div className="space-y-3">
                  <label className="flex items-center group cursor-pointer">
                    <div className="w-5 h-5 rounded border border-white/20 flex flex-shrink-0 justify-center items-center mr-3 focus-within:ring-2 focus-within:ring-blue-500/50 bg-white/5 group-hover:bg-white/10 transition-colors">
                      <input type="checkbox" className="opacity-0 absolute" defaultChecked />
                      <svg className="fill-current hidden w-3 h-3 text-blue-400 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">Verified Candidates</span>
                  </label>
                  <label className="flex items-center group cursor-pointer">
                     <div className="w-5 h-5 rounded border border-white/20 flex flex-shrink-0 justify-center items-center mr-3 focus-within:ring-2 focus-within:ring-blue-500/50 bg-white/5 group-hover:bg-white/10 transition-colors">
                      <input type="checkbox" className="opacity-0 absolute" defaultChecked />
                      <svg className="fill-current hidden w-3 h-3 text-blue-400 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">Public Profiles</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Experience Level</h3>
                <div className="space-y-3">
                  {['Entry Level', 'Mid Level', 'Senior Level'].map(level => (
                    <label key={level} className="flex items-center group cursor-pointer">
                      <div className="w-5 h-5 rounded border border-white/20 flex flex-shrink-0 justify-center items-center mr-3 focus-within:ring-2 focus-within:ring-blue-500/50 bg-white/5 group-hover:bg-white/10 transition-colors">
                        <input type="checkbox" className="opacity-0 absolute" />
                        <svg className="fill-current hidden w-3 h-3 text-blue-400 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Candidate Results Grid */}
          <div className="w-full lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-200">
                {isLoading ? (
                  <span className="text-blue-400 animate-pulse font-mono">Syncing Data Grid...</span>
                ) : error ? (
                  <span className="text-red-400">System Offline</span>
                ) : (
                  <><span className="text-blue-400">{candidates.length}</span> Candidates Found</>
                )}
              </h2>
            </div>
            
            {isLoading ? (
              <div className="w-full flex justify-center items-center py-20">
                <div className="flex flex-col items-center">
                   <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                   <p className="text-blue-400 animate-pulse font-mono tracking-widest uppercase">Syncing Data Grid...</p>
                </div>
              </div>
            ) : error ? (
              <div className="w-full bg-red-900/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(239,68,68,0.2)] mt-8">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-400 mb-2">Connection Severed</h3>
                <p className="text-red-200/70">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate._id}
                    name={candidate.name}
                    jobTitle={candidate.jobTitle}
                    location={candidate.location}
                    skills={candidate.skills}
                    profileSource={candidate.profileSource}
                    profileUrl={candidate.profileUrl}
                    imageUrl={candidate.imageUrl}
                    totalYearsExperience={candidate.totalYearsExperience}
                    experienceLevel={candidate.experienceLevel}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Small inline CSS to make custom checkboxes work simply */}
      <style dangerouslySetInnerHTML={{__html: `
        input:checked + svg { display: block; }
      `}} />
    </div>
  );
};

export default SearchPage;
