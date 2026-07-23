import React, { useState, useEffect } from 'react';

// Pass user={{ name: 'John Doe', role: 'Senior Operator' }} as prop
// Falls back to generic welcome if no user provided
export default function SplashScreen({ onComplete, user }) {
  const [phase, setPhase] = useState('intro');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'),   700);
    const t2 = setTimeout(() => setPhase('greeting'), 1800);
    const t3 = setTimeout(() => setPhase('exit'),     4500);
    const t4 = setTimeout(() => onComplete?.(),       5300);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  const s = time.getSeconds();
  const m = time.getMinutes();
  const h = time.getHours();
  const secDeg  = s * 6;
  const minDeg  = m * 6 + s * 0.1;
  const hourDeg = (h % 12) * 30 + m * 0.5;

  const greeting = () => {
    if (h < 5)  return 'Good Night';
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    if (h < 21) return 'Good Evening';
    return 'Good Night';
  };

  const displayName = user?.name  || null;
  const displayRole = user?.role  || 'Watch Management System';

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const isExit = phase === 'exit';
  const shown  = phase === 'greeting' || phase === 'exit';

  const styles = {
    root: {
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#05050a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      fontFamily: "'Rajdhani', sans-serif",
      opacity: isExit ? 0 : 1,
      transition: isExit ? 'opacity 0.8s ease-in' : 'none',
    },
    ringOuter: {
      position: 'absolute', width: '520px', height: '520px',
      borderRadius: '50%', border: '1px solid rgba(212,175,55,0.07)',
      top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      animation: 'tsRotate 30s linear infinite',
    },
    ringInner: {
      position: 'absolute', width: '380px', height: '380px',
      borderRadius: '50%', border: '1px solid rgba(212,175,55,0.05)',
      top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      animation: 'tsRotate 20s linear infinite reverse',
    },
    barTop: {
      position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
      background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.6),transparent)',
      transform: phase === 'intro' ? 'scaleX(0)' : 'scaleX(1)',
      transition: 'transform 1s ease 0.3s',
    },
    barBot: {
      position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
      background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.6),transparent)',
      transform: phase === 'intro' ? 'scaleX(0)' : 'scaleX(1)',
      transition: 'transform 1s ease 0.3s',
    },
    watchWrap: {
      opacity: phase === 'intro' ? 0 : 1,
      transform: phase === 'intro' ? 'scale(0.75) translateY(30px)' : 'scale(1) translateY(0)',
      transition: 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.34,1.4,0.64,1)',
      position: 'relative', zIndex: 2,
    },
    outerRing: {
      width: '200px', height: '200px', borderRadius: '50%',
      position: 'relative', margin: '0 auto',
    },
    bezel: {
      position: 'absolute', inset: 0, borderRadius: '50%',
      background: 'conic-gradient(from 0deg,#1a1508,#2e2510,#1a1508,#2e2510,#1a1508)',
      border: '1px solid rgba(212,175,55,0.35)',
      boxShadow: '0 0 40px rgba(212,175,55,0.08),inset 0 0 20px rgba(0,0,0,0.6)',
    },
    face: {
      position: 'absolute', inset: '14px', borderRadius: '50%',
      background: 'radial-gradient(circle at 38% 32%,#16140e 0%,#06060a 100%)',
      border: '1px solid rgba(212,175,55,0.12)',
      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9)', overflow: 'hidden',
    },
    jewel: {
      position: 'absolute', width: '10px', height: '10px', borderRadius: '50%',
      background: 'radial-gradient(circle,#fff6aa,#D4AF37)',
      boxShadow: '0 0 12px rgba(212,175,55,1)',
      top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 10,
    },
    crown: {
      position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)',
      width: '10px', height: '20px',
      background: 'linear-gradient(90deg,#b8921f,#d4af37,#8a6d10)',
      borderRadius: '0 4px 4px 0', border: '1px solid rgba(212,175,55,0.4)',
    },
    txtBlock: {
      marginTop: '40px', textAlign: 'center', position: 'relative', zIndex: 2,
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease',
    },
  };

  const hand = (rotate, width, height, bg, extra = {}) => ({
    position: 'absolute', width, height,
    background: bg, bottom: '50%', left: '50%',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${rotate}deg)`,
    borderRadius: '3px 3px 0 0', ...extra,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=Rajdhani:wght@300;400;500&display=swap');
        @keyframes tsRotate { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes tsShimmer { to { background-position: 200% center; } }
        @keyframes tsPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      <div style={styles.root}>
        {/* Rings */}
        <div style={styles.ringOuter} />
        <div style={styles.ringInner} />

        {/* Bars */}
        <div style={styles.barTop} />
        <div style={styles.barBot} />

        {/* Corner accents */}
        {[
          { top:'16px', left:'16px' },
          { top:'16px', right:'16px', transform:'scaleX(-1)' },
          { bottom:'16px', left:'16px', transform:'scaleY(-1)' },
          { bottom:'16px', right:'16px', transform:'scale(-1)' },
        ].map((pos, i) => (
          <div key={i} style={{
            position:'absolute', width:'20px', height:'20px',
            opacity: phase === 'intro' ? 0 : 1,
            transition: 'opacity 0.5s ease 0.8s',
            ...pos,
          }}>
            <div style={{ position:'absolute', width:'100%', height:'1px', top:0, left:0, background:'rgba(212,175,55,0.5)' }} />
            <div style={{ position:'absolute', width:'1px', height:'100%', top:0, left:0, background:'rgba(212,175,55,0.5)' }} />
          </div>
        ))}

        {/* Watch */}
        <div style={styles.watchWrap}>
          <div style={styles.outerRing}>
            <div style={styles.bezel} />

            {/* Ticks */}
            {Array.from({ length: 60 }, (_, i) => (
              <div key={i} style={{
                position:'absolute', left:'50%', top:'3px',
                width: i % 5 === 0 ? '2px' : '1px',
                height: i % 5 === 0 ? '8px' : '4px',
                background: i % 5 === 0 ? 'rgba(212,175,55,0.7)' : 'rgba(212,175,55,0.2)',
                transformOrigin: '50% 97px',
                transform: `translateX(-50%) rotate(${i * 6}deg)`,
                borderRadius: '1px',
              }} />
            ))}

            <div style={styles.face}>
              {/* Hour markers */}
              {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
                <div key={deg} style={{
                  position:'absolute', left:'50%', top:'5px',
                  width: i % 3 === 0 ? '3px' : '1.5px',
                  height: i % 3 === 0 ? '10px' : '5px',
                  background: i % 3 === 0 ? 'linear-gradient(180deg,#f0e8d0,#D4AF37)' : 'rgba(212,175,55,0.4)',
                  transformOrigin: '50% 72px',
                  transform: `translateX(-50%) rotate(${deg}deg)`,
                  borderRadius: '2px',
                }} />
              ))}

              {/* Hour hand */}
              <div style={hand(hourDeg, '3px', '44px', 'linear-gradient(180deg,#f0e8d0,rgba(180,170,140,0.5))', { boxShadow: '0 0 4px rgba(240,232,208,0.2)' })} />
              {/* Minute hand */}
              <div style={hand(minDeg, '2px', '56px', 'linear-gradient(180deg,#fff,rgba(200,200,200,0.4))')} />
              {/* Second hand */}
              <div style={hand(secDeg, '1.5px', '64px', '#D4AF37', {
                boxShadow: '0 0 5px rgba(212,175,55,0.7)',
                transition: 'transform 0.12s cubic-bezier(0.4,2.08,0.55,0.44)',
              })} />
              {/* Tail */}
              <div style={{
                position:'absolute', width:'2px', height:'15px',
                background:'#D4AF37', top:'50%', left:'50%',
                transformOrigin:'50% 0%',
                transform:`translateX(-50%) rotate(${secDeg}deg)`,
                transition:'transform 0.12s cubic-bezier(0.4,2.08,0.55,0.44)',
              }} />

              <div style={styles.jewel} />

              <div style={{ position:'absolute', top:'26%', left:'50%', transform:'translateX(-50%)', textAlign:'center' }}>
                <div style={{ fontSize:'7px', letterSpacing:'.3em', color:'rgba(212,175,55,0.65)', fontFamily:"'Cormorant Garamond',serif", fontWeight:600, whiteSpace:'nowrap' }}>
                  TIME SPHERE
                </div>
              </div>
              <div style={{ position:'absolute', bottom:'23%', left:'50%', transform:'translateX(-50%)', fontSize:'6px', letterSpacing:'.25em', color:'rgba(212,175,55,0.28)', fontFamily:"'Rajdhani',sans-serif", whiteSpace:'nowrap' }}>
                TOURBILLON · GMT
              </div>
            </div>

            <div style={styles.crown} />
          </div>
        </div>

        {/* Text */}
        <div style={styles.txtBlock}>
          <div style={{ fontSize:'10px', letterSpacing:'.4em', color:'rgba(212,175,55,0.4)', fontFamily:"'Rajdhani',sans-serif", textTransform:'uppercase', marginBottom:'6px' }}>
            {timeStr} · {dateStr}
          </div>
          <div style={{ fontSize:'12px', letterSpacing:'.4em', color:'rgba(212,175,55,0.55)', fontFamily:"'Rajdhani',sans-serif", textTransform:'uppercase', marginBottom:'4px' }}>
            {greeting()},
          </div>
          <div style={{
            fontSize: displayName ? '36px' : '28px',
            fontWeight: 300, letterSpacing:'.12em',
            fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic',
            background:'linear-gradient(135deg,#f0e8d0 0%,#D4AF37 45%,#ffe8a0 70%,#f0e8d0 100%)',
            backgroundSize:'200% auto',
            WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent',
            animation:'tsShimmer 4s linear infinite', lineHeight:1.1,
          }}>
            {displayName || 'Welcome'}
          </div>
          <div style={{ marginTop:'6px', fontSize:'10px', letterSpacing:'.35em', color:'rgba(212,175,55,0.3)', fontFamily:"'Rajdhani',sans-serif", textTransform:'uppercase' }}>
            {displayRole}
          </div>

          <div style={{ margin:'18px auto 0', width:'120px', height:'1px', background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)', position:'relative' }}>
            {[{left:'-2px'},{right:'-2px'}].map((pos,i)=>(
              <div key={i} style={{ position:'absolute', top:'-2px', width:'5px', height:'5px', borderRadius:'50%', background:'#D4AF37', boxShadow:'0 0 6px #D4AF37', ...pos }} />
            ))}
          </div>

          {/* Status row */}
          <div style={{ marginTop:'16px', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
            <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#D4AF37', boxShadow:'0 0 6px #D4AF37', animation:'tsPulse 2s infinite' }} />
            <span style={{ fontSize:'9px', letterSpacing:'.3em', color:'rgba(212,175,55,0.3)', fontFamily:"'Rajdhani',sans-serif", textTransform:'uppercase' }}>
              System online · All modules ready
            </span>
          </div>
        </div>

        {/* Skip */}
        <button
          onClick={() => onComplete?.()}
          style={{
            position:'absolute', bottom:'24px', right:'24px',
            background:'none', border:'none', cursor:'pointer',
            fontSize:'9px', letterSpacing:'.3em',
            color:'rgba(212,175,55,0.2)', fontFamily:"'Rajdhani',sans-serif", textTransform:'uppercase',
            opacity: shown ? 1 : 0, transition:'opacity 0.5s ease, color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'rgba(212,175,55,0.6)'}
          onMouseLeave={e => e.target.style.color = 'rgba(212,175,55,0.2)'}
        >
          Enter →
        </button>
      </div>
    </>
  );
}