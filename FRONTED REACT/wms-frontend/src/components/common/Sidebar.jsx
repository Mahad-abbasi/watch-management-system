import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Watch, Users, ShoppingCart, Wrench, CreditCard, Layers } from 'lucide-react';

const navigation = [
  { name: 'Dashboard',     path: '/dashboard',    icon: LayoutDashboard },
  { name: 'Inventory',     path: '/inventory',    icon: Watch },
  { name: 'Customer CRM',  path: '/customer-crm', icon: Users },
  { name: 'Orders & Sales',path: '/orders-sales', icon: ShoppingCart },
  { name: 'Repair Center', path: '/repair-center',icon: Wrench },
  { name: 'Payments',      path: '/payments',     icon: CreditCard },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen flex flex-col justify-between relative z-30 select-none"
      style={{
        background: '#000000',
        borderRight: '1px solid rgba(241,241,241,0.07)',
        boxShadow: '1px 0 0 rgba(41,121,255,0.05)',
      }}
    >
      {/* Top blue accent line */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:'1px',
        background:'linear-gradient(90deg, transparent, rgba(41,121,255,0.6), transparent)',
      }}/>

      <div>
        {/* Brand */}
        <div className="h-20 flex items-center px-6 gap-3"
          style={{ borderBottom:'1px solid rgba(241,241,241,0.06)' }}
        >
          <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background:'#2979FF',
              boxShadow:'0 0 20px rgba(41,121,255,0.3)',
            }}
          >
            <Layers className="text-white" size={18}/>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-[0.08em] block"
              style={{
                fontFamily:"'Cormorant Garamond', serif",
                background:'linear-gradient(135deg, #F1F1F1 0%, #2979FF 60%, #F1F1F1 100%)',
                backgroundSize:'200% auto',
                WebkitBackgroundClip:'text', backgroundClip:'text',
                WebkitTextFillColor:'transparent',
                animation:'blueShimmer 6s linear infinite',
              }}
            >Time Sphere</span>
            <span className="block text-[9px] font-mono tracking-widest mt-0.5"
              style={{ color:'rgba(176,176,176,0.5)' }}
            >WATCH MANAGEMENT SYSTEM.</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} className="block">
                {({ isActive }) => (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg font-mono relative overflow-hidden group transition-all duration-200"
                    style={isActive ? {
                      background:'rgba(41,121,255,0.1)',
                      border:'1px solid rgba(41,121,255,0.25)',
                      color:'#2979FF',
                    } : {
                      background:'transparent',
                      border:'1px solid transparent',
                      color:'rgba(176,176,176,0.55)',
                    }}
                  >
                    {isActive && (
                      <div style={{
                        position:'absolute', left:0, top:'15%',
                        height:'70%', width:'2px',
                        background:'#2979FF',
                        borderRadius:'0 2px 2px 0',
                        boxShadow:'0 0 8px rgba(41,121,255,0.6)',
                      }}/>
                    )}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"
                      style={{ background:'rgba(241,241,241,0.03)' }}
                    />
                    <Icon size={16} style={{
                      color: isActive ? '#2979FF' : 'rgba(176,176,176,0.4)',
                      flexShrink:0, position:'relative', zIndex:1,
                    }}/>
                    <span style={{ position:'relative', zIndex:1, fontSize:'11px', letterSpacing:'0.06em' }}>
                      {item.name}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 text-center" style={{ borderTop:'1px solid rgba(241,241,241,0.05)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
          <div style={{
            width:'5px', height:'5px', borderRadius:'50%',
            background:'#2979FF', boxShadow:'0 0 8px rgba(41,121,255,0.8)',
            animation:'pulseRing 2s ease-out infinite',
          }}/>
          <span style={{ fontSize:'9px', fontFamily:'monospace', letterSpacing:'0.15em', color:'rgba(176,176,176,0.25)' }}>
            SYSTEM CORE v1.0.0
          </span>
        </div>
      </div>
    </aside>
  );
}