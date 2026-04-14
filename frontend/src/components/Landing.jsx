import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden font-display flex flex-col">
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <video 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* 50% Black Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Navbar */}
        <nav className="w-full px-5 lg:px-[120px] py-[20px] flex items-center justify-between">
          <div 
            className="text-white font-bold tracking-widest flex items-center justify-center cursor-pointer"
            style={{ width: '187px', height: '25px', fontSize: '20px' }}
            onClick={() => navigate('/login')}
          >
            ALUMNI PORTAL
          </div>

          <div className="hidden md:flex items-center gap-[30px]">
            <button 
              onClick={() => navigate('/register')}
              className="flex items-center gap-[14px] text-white text-[14px] font-medium hover:text-white/80 transition-colors"
            >
              Get Started <ChevronDown className="w-[14px] h-[14px]" strokeWidth={2.5} />
            </button>

            <button 
              onClick={() => {
                toast('Stack: React, Express, MySQL, Web3 Design Context', { 
                  icon: '✨', 
                  duration: 4000,
                  style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } 
                });
              }}
              className="flex items-center gap-[14px] text-white text-[14px] font-medium hover:text-white/80 transition-colors"
            >
              Features <ChevronDown className="w-[14px] h-[14px]" strokeWidth={2.5} />
            </button>

            <button 
              onClick={() => {
                toast('References: React Router, TailwindCSS, Fontshare', { 
                  icon: '📚', 
                  duration: 4000,
                  style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } 
                });
              }}
              className="flex items-center gap-[14px] text-white text-[14px] font-medium hover:text-white/80 transition-colors"
            >
              Resources <ChevronDown className="w-[14px] h-[14px]" strokeWidth={2.5} />
            </button>
          </div>

          <div>
            <button 
              className="pill-outer cursor-pointer transform transition-transform hover:scale-105 active:scale-95"
              onClick={() => navigate('/register')}
            >
              <div className="pill-inner-dark px-[29px] py-[11px]">
                <div className="pill-glow"></div>
                <span className="text-white text-[14px] font-medium relative z-10">Sign Up</span>
              </div>
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <main className="flex-1 w-full flex flex-col items-center pt-[200px] lg:pt-[280px] pb-[102px]">
          <div className="flex flex-col items-center gap-[40px] px-6 text-center w-full max-w-full">
            
            {/* Badge */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-[20px] px-4 py-1.5 backdrop-blur-sm">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <span className="text-[13px] font-medium whitespace-nowrap">
                <span className="text-white/60">Early access available from</span>
                <span className="text-white"> May 1, 2026</span>
              </span>
            </div>

            {/* Heading */}
            <h1 
              className="text-gradient-web3 text-[36px] lg:text-[56px] font-medium leading-[1.28] tracking-tight max-w-[613px]"
            >
              Alumni Network at the Speed of Experience
            </h1>

            {/* Subtitle */}
            <p className="text-white/70 text-[15px] font-normal max-w-[680px] leading-relaxed">
              Powering seamless experiences and real-time connections, Alumni Portal is the base for students who move with purpose, leveraging resilience, speed, and scale to shape the future.
            </p>

            {/* CTA Button */}
            <button 
              className="pill-outer cursor-pointer mt-2 transform transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_30px_rgba(255,255,255,0.2)]"
              onClick={() => navigate('/login')}
            >
              <div className="pill-inner-light px-[29px] py-[11px]">
                <div className="pill-glow" style={{ background: 'radial-gradient(ellipse at top, rgba(0, 0, 0, 0.4) 0%, transparent 70%)' }}></div>
                <span className="text-black text-[14px] font-medium relative z-10">Access Portal</span>
              </div>
            </button>

          </div>
        </main>
      </div>
    </div>
  );
}
