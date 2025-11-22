'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Mail, ChevronDown, ChevronUp } from 'lucide-react';

const Footer = React.memo(() => {
  const currentYear = new Date().getFullYear();
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(['about']));
  const [isMounted, setIsMounted] = useState(false);

  // Hydration fix
  useEffect(() => {
    setIsMounted(true);

    // Restore state from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('footer-accordion-state');
      if (saved) {
        try {
          setOpenSections(new Set(JSON.parse(saved)));
        } catch (e) {
          // Ignore invalid saved state
        }
      }
    }
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('footer-accordion-state', JSON.stringify([...openSections]));
    }
  }, [openSections, isMounted]);

  // Memoized toggle function - allows multiple sections open
  const toggleSection = useCallback((section: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });

    // Haptic feedback on supported devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Desktop: 4-column grid | Mobile: Accordion */}
        <div className="mb-8">

          {/* Desktop Layout - Hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* About Column */}
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-4">About JobAgentPH</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                A job marketplace platform connecting Filipino job seekers with DMW-licensed recruitment agencies for overseas employment opportunities.
              </p>
              <div className="flex items-start mb-2">
                <Mail className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-blue-600" />
                <a
                  href="mailto:contact@jobagentph.com"
                  className="text-sm hover:text-gray-900 transition-colors"
                >
                  contact@jobagentph.com
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/jobs" className="text-sm hover:text-gray-900 transition-colors">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm hover:text-gray-900 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm hover:text-gray-900 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm hover:text-gray-900 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="text-sm hover:text-gray-900 transition-colors">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-sm hover:text-gray-900 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/agency-terms" className="text-sm hover:text-gray-900 transition-colors">
                    Agency Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm hover:text-gray-900 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/zero-fee-policy" className="text-sm hover:text-gray-900 transition-colors">
                    Zero-Fee Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Agencies Column */}
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-4">For Agencies</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth/signup" className="text-sm hover:text-gray-900 transition-colors">
                    Register as Agency
                  </Link>
                </li>
                <li>
                  <Link href="/agency-terms" className="text-sm hover:text-gray-900 transition-colors">
                    Agency Requirements
                  </Link>
                </li>
                <li>
                  <a
                    href="https://dmw.gov.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-gray-900 transition-colors"
                  >
                    Verify DMW License
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Layout - Accordion (visible only on mobile) */}
          <div className="md:hidden space-y-3">

            {/* About Section - Mobile */}
            <div className="border-b border-gray-300">
              <button
                onClick={() => toggleSection('about')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSection('about');
                  }
                }}
                className="w-full flex items-center justify-between py-4 text-left touch-manipulation min-h-[48px]"
                aria-expanded={openSections.has('about')}
                aria-controls="about-content"
                type="button"
              >
                <h3 className="text-gray-900 font-bold text-base" id="about-heading">About JobAgentPH</h3>
                {openSections.has('about') ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" aria-hidden="true" />
                )}
              </button>
              {openSections.has('about') && (
                <div className="pb-4 space-y-3" id="about-content" role="region" aria-labelledby="about-heading">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    A job marketplace platform connecting Filipino job seekers with DMW-licensed recruitment agencies for overseas employment opportunities.
                  </p>
                  <div className="flex items-start">
                    <Mail className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-blue-600" />
                    <a
                      href="mailto:contact@jobagentph.com"
                      className="text-sm hover:text-gray-900 transition-colors"
                    >
                      contact@jobagentph.com
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links - Mobile */}
            <div className="border-b border-gray-300">
              <button
                onClick={() => toggleSection('links')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSection('links');
                  }
                }}
                className="w-full flex items-center justify-between py-4 text-left touch-manipulation min-h-[48px]"
                aria-expanded={openSections.has('links')}
                aria-controls="links-content"
                type="button"
              >
                <h3 className="text-gray-900 font-bold text-base" id="links-heading">Quick Links</h3>
                {openSections.has('links') ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" aria-hidden="true" />
                )}
              </button>
              {openSections.has('links') && (
                <ul className="pb-4 space-y-2" id="links-content" role="region" aria-labelledby="links-heading">
                  <li>
                    <Link href="/jobs" className="text-sm hover:text-gray-900 transition-colors block py-1">
                      Browse Jobs
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-sm hover:text-gray-900 transition-colors block py-1">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm hover:text-gray-900 transition-colors block py-1">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-sm hover:text-gray-900 transition-colors block py-1">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources" className="text-sm hover:text-gray-900 transition-colors block py-1">
                      Resources
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Legal - Mobile */}
            <div className="border-b border-gray-300">
              <button
                onClick={() => toggleSection('legal')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSection('legal');
                  }
                }}
                className="w-full flex items-center justify-between py-4 text-left touch-manipulation min-h-[48px]"
                aria-expanded={openSections.has('legal')}
                aria-controls="legal-content"
                type="button"
              >
                <h3 className="text-gray-900 font-bold text-base" id="legal-heading">Legal</h3>
                {openSections.has('legal') ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" aria-hidden="true" />
                )}
              </button>
              {openSections.has('legal') && (
                <ul className="pb-4 space-y-2" id="legal-content" role="region" aria-labelledby="legal-heading">
                  <li>
                    <Link href="/terms" className="text-sm hover:text-gray-900 transition-colors block py-1">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/agency-terms" className="text-sm hover:text-gray-900 transition-colors block py-1">
                      Agency Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-sm hover:text-gray-900 transition-colors block py-1">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/zero-fee-policy" className="text-sm hover:text-gray-900 transition-colors block py-1">
                      Zero-Fee Policy
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* For Agencies - Mobile */}
            <div className="border-b border-gray-300">
              <button
                onClick={() => toggleSection('agencies')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSection('agencies');
                  }
                }}
                className="w-full flex items-center justify-between py-4 text-left touch-manipulation min-h-[48px]"
                aria-expanded={openSections.has('agencies')}
                aria-controls="agencies-content"
                type="button"
              >
                <h3 className="text-gray-900 font-bold text-base" id="agencies-heading">For Agencies</h3>
                {openSections.has('agencies') ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" aria-hidden="true" />
                )}
              </button>
              {openSections.has('agencies') && (
                <ul className="pb-4 space-y-2" id="agencies-content" role="region" aria-labelledby="agencies-heading">
                  <li>
                    <Link href="/auth/signup" className="text-sm hover:text-gray-900 transition-colors block py-1">
                      Register as Agency
                    </Link>
                  </li>
                  <li>
                    <Link href="/agency-terms" className="text-sm hover:text-gray-900 transition-colors block py-1">
                      Agency Requirements
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://dmw.gov.ph"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-gray-900 transition-colors block py-1"
                    >
                      Verify DMW License
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Platform Disclaimer */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="text-center mb-6">
            <h4 className="text-gray-900 font-semibold mb-2 text-sm">Platform Disclaimer</h4>
            <p className="text-gray-600 text-xs max-w-4xl mx-auto leading-relaxed">
              JobAgentPH is a job marketplace platform, NOT a recruitment agency. We are not engaged in the recruitment, placement, or referral of workers. All recruitment activities are conducted solely by Department of Migrant Workers (DMW) licensed recruitment agencies.
            </p>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
              <p className="text-xs text-gray-500">
                © {currentYear} JobAgentPH.com. All rights reserved.
              </p>
              <p className="text-xs text-gray-500">
                This platform is a job marketplace service only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
