import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import SplashScreen from './components/SplashScreen';
import './App.css'; // Import the CSS file so the styles apply

// ... imports

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onComplete={() => setSplashDone(true)} />;
  }

  return (
    <AuthProvider>
      <Router>
        {/* Parent wrapper for stacking context */}
        <div className="app-shell">
          
          {/* Background Layers */}
          <div className="bg-canvas">
            <div className="bg-orb bg-orb-1"/>
            <div className="bg-orb bg-orb-2"/>
            <div className="bg-orb bg-orb-3"/>
          </div>
          <div className="bg-grid"/>
          <div className="bg-noise"/>
          <div className="bg-vignette"/>

          {/* App shell */}
          <div className="flex h-screen w-screen overflow-hidden relative z-10">
            <Sidebar/>
            <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
              <Navbar/>
              <main className="flex-1 overflow-y-auto p-8 relative">
                <AppRoutes/>
              </main>
              <Footer/>
            </div>
          </div>
          
        </div>
      </Router>
    </AuthProvider>
  );
}