import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchCount = async () => {
    try {
      const res = await fetch('/api/notifications/count');
      const n = await res.json();
      setCount(n);
    } catch {}
  };

  const fetchAndOpen = async () => {
    try {
      const res = await fetch('/api/notifications/unread');
      const data = await res.json();
      setNotifications(data);
      setOpen(true);
      await fetch('/api/notifications/mark-read', { method: 'POST' });
      setCount(0);
    } catch {}
  };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const typeColor = (type) => {
    if (type === 'LOW_STOCK') return '#f87171';
    if (type === 'LOYALTY')   return '#D4AF37';
    if (type === 'ORDER')     return '#34d399';
    return '#a1a1aa';
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={fetchAndOpen}
        style={{
          position: 'relative', background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
          padding: '8px', cursor: 'pointer', color: '#a1a1aa',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Bell size={18} />
        {count > 0 && (
          <span style={{
            position: 'absolute', top: '-6px', right: '-6px',
            background: '#ef4444', color: '#fff', borderRadius: '999px',
            fontSize: '10px', fontWeight: 700, minWidth: '18px',
            height: '18px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '0 4px',
            fontFamily: 'monospace', border: '2px solid #0c0c0e',
          }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '44px', right: 0, width: '320px',
          background: '#111113', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', zIndex: 999, overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em',
            color: '#D4AF37', textTransform: 'uppercase',
          }}>
            Notifications
          </div>

          {notifications.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(161,150,120,0.4)', fontSize: '12px', fontFamily: 'monospace' }}>
              No new notifications
            </div>
          ) : (
            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {notifications.map((n, i) => (
                <div key={i} style={{
                  padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: typeColor(n.type), marginTop: '5px', flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#e4dcc8', fontFamily: 'monospace' }}>
                      {n.message}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '10px', color: 'rgba(161,150,120,0.4)', fontFamily: 'monospace' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}