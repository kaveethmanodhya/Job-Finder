import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';

// Realistic Dummy Data specifically generated for the Job Vacancy feature
const dummyJobs = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "Stripe",
    location: "San Francisco, CA",
    type: "Full-Time",
    isRemote: true,
    tags: ["Figma", "UX/UI", "Prototyping", "Design Systems"]
  },
  {
    id: 2,
    title: "Lead AI Systems Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    type: "Full-Time",
    isRemote: false,
    tags: ["Python", "PyTorch", "C++", "CUDA"]
  },
  {
    id: 3,
    title: "Backend Node.js Developer",
    company: "Airbnb",
    location: "London, UK",
    type: "Contract",
    isRemote: true,
    tags: ["Node.js", "Express", "MongoDB", "GraphQL"]
  },
  {
    id: 4,
    title: "Frontend React Architect",
    company: "Vercel",
    location: "New York, NY",
    type: "Full-Time",
    isRemote: true,
    tags: ["React", "Next.js", "Tailwind CSS", "TypeScript"]
  }
];

const JobSearchPage = () => {
  // Currently utilizing dummy jobs for mapping UI functionality
  const [jobs] = useState(dummyJobs);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-900/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header / Search Area */}
        <div className="mb-12 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-8 text-center drop-shadow-sm">
            Discover your next <span className="text-purple-400">Career.</span>
          </h1>
          <div className="w-full max-w-4xl">
            {/* Reusing existing futuristic SearchBar */}
            <SearchBar />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] sticky top-24">
              <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2">Job Filters</h2>
              
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Job Title</h3>
                <div className="space-y-3">
                  {['Software Engineer', 'Product Manager', 'Data Scientist', 'Designer'].map((role) => (
                    <label key={role} className="flex items-center group cursor-pointer">
                      <div className="w-5 h-5 rounded border border-white/20 flex flex-shrink-0 justify-center items-center mr-3 focus-within:ring-2 focus-within:ring-purple-500/50 bg-white/5 group-hover:bg-white/10 transition-colors">
                        <input type="checkbox" className="opacity-0 absolute" />
                        <svg className="fill-current hidden w-3 h-3 text-purple-400 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Environment</h3>
                <div className="space-y-3">
                  {['Remote', 'On-site', 'Hybrid'].map(env => (
                    <label key={env} className="flex items-center group cursor-pointer">
                      <div className="w-5 h-5 rounded border border-white/20 flex flex-shrink-0 justify-center items-center mr-3 focus-within:ring-2 focus-within:ring-purple-500/50 bg-white/5 group-hover:bg-white/10 transition-colors">
                        <input type="checkbox" className="opacity-0 absolute" />
                        <svg className="fill-current hidden w-3 h-3 text-purple-400 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{env}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Jobs Grid */}
          <div className="w-full lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-200">
                <span className="text-purple-400">{jobs.length}</span> Vacancies Found
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  type={job.type}
                  isRemote={job.isRemote}
                  tags={job.tags}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Inline styles for dummy checkboxes */}
      <style dangerouslySetInnerHTML={{__html: `
        input:checked + svg { display: block; }
      `}} />
    </div>
  );
};

export default JobSearchPage;
