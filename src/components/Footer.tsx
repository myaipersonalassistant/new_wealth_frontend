import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  /** Compact mode for secondary pages */
  compact?: boolean;
}

const Footer: React.FC<FooterProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 bottom-0 left-0 w-full z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-slate-900">
                <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm sm:text-base">Build Wealth Through Property</span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm text-center">
            &copy; 2026 Build Wealth Through Property. All rights reserved. This is not financial advice.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link to="/" className="text-slate-500 hover:text-amber-400 text-xs sm:text-sm transition-colors">Home</Link>
            <Link to="/blog" className="text-slate-500 hover:text-amber-400 text-xs sm:text-sm transition-colors">Blog</Link>
            <Link to="/privacy" className="text-slate-500 hover:text-amber-400 text-xs sm:text-sm transition-colors">Privacy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-amber-400 text-xs sm:text-sm transition-colors">Terms</Link>
            <Link to="/refund" className="text-slate-500 hover:text-amber-400 text-xs sm:text-sm transition-colors">Refund</Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-slate-900">
                  <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Build Wealth Through Property</span>
            </div>
            <p className="text-slate-400 mb-6 text-sm sm:text-base">
              Building wealth through property with patience, discipline, and understanding.
            </p>
            <div className="flex gap-4">
              {[
                { name: 'twitter', url: '#twitter' },
                { name: 'linkedin', url: '#linkedin' },
                { name: 'facebook', url: '#facebook' },
                { name: 'instagram', url: 'https://www.instagram.com/buildwealththroughproperty/' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                  rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-10 h-10 bg-slate-800 hover:bg-amber-500 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {social.name === 'twitter' && <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />}
                    {social.name === 'linkedin' && <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />}
                    {social.name === 'facebook' && <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />}
                    {social.name === 'instagram' && <path d="M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 11a3 3 0 110-6 3 3 0 010 6zm4.5-7a1 1 0 110-2 1 1 0 010 2z" />}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">The Book</Link></li>
              <li><Link to="/course" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Beginner Course</Link></li>
              <li><Link to="/masterclass" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">Masterclass</Link></li>
              <li><Link to="/seminar" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Property Seminar</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">My Learning Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">Resources</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/start" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">Free Starter Pack</Link></li>
              <li><Link to="/calculator" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">Investment Calculator</Link></li>
              <li><Link to="/blog" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">Blog</Link></li>
              <li><Link to="/foundation" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">Foundation Edition</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/privacy" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/refund" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs sm:text-sm">
            &copy; 2026 Build Wealth Through Property. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs sm:text-sm text-center md:text-right">
            This is not financial advice. All investments carry risk. Seek professional guidance before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
