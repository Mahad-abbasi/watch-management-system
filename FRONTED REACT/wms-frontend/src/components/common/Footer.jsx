import React from 'react';

export default function Footer() {
  return (
    <footer className="h-10 w-full px-8 flex items-center justify-between relative"
      style={{ background:'#000000', borderTop:'1px solid rgba(241,241,241,0.06)' }}
    >
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(41,121,255,0.25),transparent)' }}/>
      <span style={{ fontSize:'9px', fontFamily:'monospace', letterSpacing:'0.15em', color:'rgba(176,176,176,0.2)' }}>
        © 2026 WATCH MANAGEMENT SYSTEM.
      </span>
      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
        <div style={{ width:'4px', height:'4px', borderRadius:'50%', background:'#2979FF', boxShadow:'0 0 8px rgba(41,121,255,0.8)', animation:'pulseRing 2s ease-out infinite' }}/>
        <span style={{ fontSize:'9px', fontFamily:'monospace', letterSpacing:'0.15em', color:'rgba(41,121,255,0.3)' }}>
          SECURE DATALINK CORE CONNECTED
        </span>
      </div>
    </footer>
  );
}