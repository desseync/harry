import React, { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useScrollToTop } from './hooks/useScrollToTop';
import { useIntersectionObserver } from './hooks/useAnimations';
import AutomationBenefits from './pages/AutomationBenefits';
import AIPlatformIntegration from './pages/AIPlatformIntegration';
import FrequencyAI from './pages/FrequencyAI';
import MemberServices from './pages/MemberServices';
import CustomerPage from './pages/CustomerPage';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useScrollToTop();
  useIntersectionObserver();

  React.useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    const updateCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', updateCursor);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.body.removeChild(cursor);
    };
  }, []);

  return (
    <div className="app-container bg-gradient-to-b from-blue-50 to-white">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<FrequencyAI />} />
        <Route path="/automation-benefits" element={<AutomationBenefits />} />
        <Route path="/ai-platform-integration" element={<AIPlatformIntegration />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Authentication Route */}
        <Route path="/member" element={<MemberServices />} />
        
        {/* Protected Routes */}
        <Route
          path="/customer/:id"
          element={
            <ProtectedRoute>
              <CustomerPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route - redirects to home */}
        <Route path="*" element={<FrequencyAI />} />
      </Routes>
    </div>
  );
}

export default App;