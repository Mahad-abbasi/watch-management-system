import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Watch } from 'lucide-react';
import NotificationBell from './NotificationBell'; // ✅ Import

export default function Navbar() {
  const [isHudOpen, setIsHudOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

const handleSearch = async (e) => {
  if (e) e.preventDefault(); 

  const searchTerm = document.getElementById("search-input").value;
  
  try {
    const response = await fetch(`http://localhost:8080/api/watches/search?query=${encodeURIComponent(searchTerm)}`);
    
    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    console.log("Search Results:", data);
    
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const h = time.getHours(), m = time.getMinutes(), s = time.getSeconds();
  const hourDeg = (h % 12) * 30 + m * 0.5;
  const minuteDeg = m * 6 + s * 0.1;
  const secondDeg = s * 6;
  const fmtTime = () => time.toLocaleTimeString('en-US',{ hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const fmtAMPM = () => time.toLocaleTimeString('en-US',{ hour12:true }).split(' ')[1];
  const ticks = [0,30,60,90,120,150,180,210,240,270,300,330];

  return (
    <header className="h-20 w-full flex items-center justify-between px-8 relative z-50"
      style={{ background:'#000000', borderBottom:'1px solid rgba(241,241,241,0.07)', boxShadow:'0 1px 0 rgba(41,121,255,0.08)' }}
    >
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent 0%, rgba(41,121,255,0.4) 40%, rgba(41,121,255,0.6) 50%, rgba(41,121,255,0.4) 60%, transparent 100%)' }}/>

      <form onSubmit={handleSearch} className="relative w-96">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'rgba(176,176,176,0.35)' }}/>
        <input type="text" placeholder="Scan catalog, track serial numbers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg pl-9 pr-4 py-2.5 text-xs font-mono outline-none transition-all duration-200"
          style={{ background:'rgba(241,241,241,0.04)', border:'1px solid rgba(241,241,241,0.08)', color:'rgba(241,241,241,0.7)' }}
          onFocus={e=>{ e.target.style.border='1px solid rgba(41,121,255,0.4)'; e.target.style.background='rgba(41,121,255,0.05)'; }}
          onBlur={e=>{ e.target.style.border='1px solid rgba(241,241,241,0.08)'; e.target.style.background='rgba(241,241,241,0.04)'; }}
        />
      </form>

      <div className="flex items-center gap-3">
        <button onClick={()=>setIsHudOpen(!isHudOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono tracking-wider transition-all duration-200"
          style={isHudOpen ? { background:'rgba(41,121,255,0.12)', border:'1px solid rgba(41,121,255,0.4)', color:'#2979FF' } : { background:'rgba(241,241,241,0.04)', border:'1px solid rgba(241,241,241,0.08)', color:'rgba(176,176,176,0.6)' }}
        >
          <Watch size={13} /> <span>Realtime</span>
        </button>

        {/* ✅ Replaced old Bell button with NotificationBell component */}
        <NotificationBell />

        <button onClick={handleLogout} className="h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{ background:'rgba(241,241,241,0.04)', border:'1px solid rgba(241,241,241,0.08)', color:'rgba(176,176,176,0.5)' }}
        >
          <LogOut size={14}/>
        </button>
      </div>

      {isHudOpen && (
        <div className="absolute right-8 w-64 rounded-xl p-6 flex flex-col items-center" style={{ top:'5.5rem', background:'#0a0a0a', border:'1px solid rgba(41,121,255,0.2)' }}>
          <div className="w-32 h-32 rounded-full relative flex items-center justify-center mb-5"
            style={{ background:'#000', border:'1px solid rgba(41,121,255,0.2)', boxShadow:'inset 0 0 30px rgba(0,0,0,0.9), 0 0 20px rgba(41,121,255,0.05)' }}
          >
            {ticks.map((deg,i) => (
              <div key={deg} style={{ position:'absolute', top:'4px', left:'50%', width:i%3===0?'2px':'1px', height:i%3===0?'6px':'4px', background:i%3===0?'rgba(41,121,255,0.7)':'rgba(241,241,241,0.12)', transformOrigin:`50% 56px`, transform:`translateX(-50%) rotate(${deg}deg)`, borderRadius:'1px' }}/>
            ))}
            <div style={{ position:'absolute', width:'2px', height:'28px', background:'#F1F1F1', bottom:'50%', left:'50%', transformOrigin:'bottom center', transform:`translateX(-50%) rotate(${hourDeg}deg)`, borderRadius:'2px 2px 0 0', opacity:0.8 }}/>
            <div style={{ position:'absolute', width:'1.5px', height:'38px', background:'#F1F1F1', bottom:'50%', left:'50%', transformOrigin:'bottom center', transform:`translateX(-50%) rotate(${minuteDeg}deg)`, borderRadius:'2px 2px 0 0' }}/>
            <div style={{ position:'absolute', width:'1px', height:'44px', background:'#2979FF', bottom:'50%', left:'50%', transformOrigin:'bottom center', transform:`translateX(-50%) rotate(${secondDeg}deg)`, transition:'transform 0.1s linear', boxShadow:'0 0 6px rgba(41,121,255,0.8)' }}/>
            <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#2979FF', boxShadow:'0 0 10px rgba(41,121,255,1)', zIndex:40, position:'relative' }}/>
          </div>
        </div>
      )}
    </header>
  );
}