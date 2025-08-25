'use client';

import { useEffect } from 'react';

export default function HotjarScript() {
  useEffect(() => {
    // Only load in production or staging
    if (typeof window === 'undefined') return;
    
    const isProduction = window.location.hostname.includes('ibam-learn-platform');
    if (!isProduction && !window.location.hostname.includes('localhost')) return;

    // Hotjar Tracking Code for IBAM Learning Platform
    (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj = h.hj || function() {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
      h._hjSettings = {
        hjid: 6502839, // IBAM Learning Platform Hotjar Site ID
        hjsv: 6
      };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');

    // Custom events for key actions
    window.hj = window.hj || function() {
      (window.hj.q = window.hj.q || []).push(arguments);
    };

    // Track page view
    window.hj('event', 'page_view');

    // Track user type
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      window.hj('identify', userEmail.split('@')[0], {
        email: userEmail,
        source: localStorage.getItem('login_source') || 'direct'
      });
    }
  }, []);

  return null;
}

// Helper functions to track custom events
export const trackEvent = (eventName: string, attributes?: any) => {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('event', eventName, attributes);
  }
};

export const trackFunnel = (step: string) => {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('event', `funnel_${step}`);
  }
};

// Declare global window.hj
declare global {
  interface Window {
    hj: any;
  }
}