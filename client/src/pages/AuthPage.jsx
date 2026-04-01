import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 pt-24 pb-12 overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/30 rounded-full mix-blend-screen filter blur-[120px] opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-900/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <h2 className="text-3xl font-bold text-center mb-2">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {isLogin ? 'Log in to your TalentMatch account' : 'Join TalentMatch today'}
        </p>

        {/* OAuth Buttons */}
        <div className="space-y-4 mb-8">
          <button className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all rounded-xl py-3 px-4 shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            <span className="text-sm font-semibold text-gray-200">Continue with Google</span>
          </button>
          
          <button className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all rounded-xl py-3 px-4 shadow-sm hover:shadow-[0_0_15px_rgba(14,118,168,0.3)]">
            <svg className="text-blue-500 w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span className="text-sm font-semibold text-gray-200">Continue with LinkedIn</span>
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#0b1121] px-2 text-gray-500 rounded-lg">Or continue securely</span>
          </div>
        </div>

        {/* Manual Form */}
        <form className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
              </div>
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-sans"
              />
            </div>
          )}

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
            </div>
            <input 
              type="email" 
              placeholder="Email Profile" 
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-sans"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
            </div>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-sans"
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold py-3 mt-4 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-white hover:text-blue-400 font-semibold transition-colors focus:outline-none"
          >
            {isLogin ? 'Register freely' : 'Log in safely'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
