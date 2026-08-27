"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, Briefcase } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      title: "Create your Profile / Post a Job",
      description: "Candidates build a verified profile with real credentials. Companies post open roles with exact requirements. We handle the heavy lifting of matching the signals.",
      icon: <UserPlus className="w-6 h-6 text-emerald-400" />,
      align: "left",
    },
    {
      id: 2,
      title: "Signal-Matched Search",
      description: "Our hybrid intelligence doesn't just search internally. We scrape real-time public signals from LinkedIn and GitHub to put the absolute best talent in front of you, instantly.",
      icon: <Search className="w-6 h-6 text-emerald-400" />,
      align: "right",
    },
    {
      id: 3,
      title: "Get Hired / Find Talent",
      description: "Stop wasting time on mismatched interviews. Verity ensures both sides already know it's a fit before you even get in the room. Fast, verified, and trusted.",
      icon: <Briefcase className="w-6 h-6 text-emerald-400" />,
      align: "left",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#08050f] text-white overflow-x-hidden pt-28 pb-32">
      {/* Background Glows */}
      <div className="pointer-events-none fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-900/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-emerald-400/70 mb-4 font-mono">The Process</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Verity</span> works.
          </h1>
          <p className="text-[#8B93A7] max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            We read what a role needs and who is ready for it — then put them in the same room, fast.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 -translate-x-1/2" />

          <div className="space-y-24 md:space-y-32">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={step.id} className="relative flex items-center md:justify-center w-full">
                  
                  {/* Content Container (Left or Right on Desktop) */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`
                      w-full md:w-1/2 flex flex-col pl-20 pr-4 md:px-12 
                      ${isEven ? "md:items-end md:text-right" : "md:items-start md:text-left ml-auto"}
                    `}
                  >
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 transition-colors duration-300 w-full max-w-md shadow-[0_8px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                      <p className="text-emerald-400 font-mono text-[10px] tracking-widest uppercase mb-3">
                        Phase 0{step.id}
                      </p>
                      <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-[#8B93A7] text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Center Node / Icon */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                    className="absolute left-8 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#08050f] border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] z-10"
                  >
                    {step.icon}
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
