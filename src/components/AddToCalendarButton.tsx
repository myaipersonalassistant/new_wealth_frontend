import React, { useState, useRef, useEffect } from 'react';

const EVENT_TITLE = 'Build Wealth Through Property: 7 Reasons Why — Live Seminar';
const EVENT_LOCATION = 'Europa Hotel, Great Victoria St, Belfast BT2 7AP';
const EVENT_START = '20260314T140000Z';
const EVENT_END = '20260314T170000Z';
const EVENT_DESCRIPTION = `Join author Christopher Ifonlaja for an intensive, interactive seminar based on his book "Build Wealth Through Property: 7 Reasons Why".

Discover the 7 powerful reasons why property investment is the cornerstone of lasting wealth — and learn how to take action.

What's included:
• All 7 reasons covered in depth with real examples
• Interactive Q&A sessions
• Networking with like-minded investors

Date: Saturday, 14 March 2026
Time: 2:00 PM – 5:00 PM GMT
Venue: Europa Hotel, Great Victoria St, Belfast BT2 7AP

Learn more: ${typeof window !== 'undefined' ? window.location.origin : ''}/seminar`;

const SEMINAR_URL = typeof window !== 'undefined' ? `${window.location.origin}/seminar` : '/seminar';

interface AddToCalendarButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({ variant = 'secondary', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateGoogleCalendarUrl = () => {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: EVENT_TITLE,
      dates: `${EVENT_START}/${EVENT_END}`,
      details: EVENT_DESCRIPTION + `\n\nMore info: ${SEMINAR_URL}`,
      location: EVENT_LOCATION,
      sf: 'true',
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateIcsContent = () => {
    const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const uid = `seminar-bwtp-20260314@buildwealththroughproperty.com`;
    const escapedDesc = EVENT_DESCRIPTION.replace(/\n/g, '\\n').replace(/,/g, '\\,');
    const escapedLocation = EVENT_LOCATION.replace(/,/g, '\\,');

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Build Wealth Through Property//Seminar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${EVENT_START}`,
      `DTEND:${EVENT_END}`,
      `SUMMARY:${EVENT_TITLE}`,
      `DESCRIPTION:${escapedDesc}`,
      `LOCATION:${escapedLocation}`,
      `URL:${SEMINAR_URL}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Build Wealth Through Property seminar starts in 1 hour',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Build Wealth Through Property seminar is tomorrow',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  };

  const downloadIcsFile = () => {
    const icsContent = generateIcsContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'build-wealth-through-property-seminar.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const generateOutlookUrl = () => {
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: EVENT_TITLE,
      startdt: '2026-03-14T14:00:00Z',
      enddt: '2026-03-14T17:00:00Z',
      body: EVENT_DESCRIPTION + `\n\nMore info: ${SEMINAR_URL}`,
      location: EVENT_LOCATION,
    });
    return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
  };

  const handleGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(), '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleOutlookCalendar = () => {
    window.open(generateOutlookUrl(), '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleAppleCalendar = () => {
    downloadIcsFile();
  };

  const baseButtonStyles = {
    primary: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold border-0',
    secondary: 'bg-slate-700/50 hover:bg-slate-700/80 text-white font-semibold border border-slate-600/50 hover:border-slate-500/50',
    outline: 'bg-transparent hover:bg-amber-500/10 text-amber-400 hover:text-amber-300 font-semibold border border-amber-500/30 hover:border-amber-500/50',
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${baseButtonStyles[variant]} py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm w-full`}
      >
        {/* Calendar Plus Icon */}
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Add to Calendar</span>
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[240px] bg-slate-800 border border-slate-700/80 rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-slate-700/50">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Choose your calendar</p>
          </div>

          {/* Google Calendar */}
          <button
            onClick={handleGoogleCalendar}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-left group"
          >
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 transition-colors">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
                <path d="M18.316 5.684H5.684v12.632h12.632V5.684z" fill="#fff"/>
                <path d="M18.316 24L24 18.316V5.684L18.316 0H5.684L0 5.684v12.632L5.684 24h12.632z" fill="#4285F4" fillOpacity="0"/>
                <rect x="3" y="3" width="18" height="18" rx="2" fill="#4285F4" fillOpacity="0.15"/>
                <path d="M8.5 12.5l2 2 5-5" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="#4285F4" strokeWidth="1.5" fill="none"/>
                <path d="M8 2v4M16 2v4M4 9h16" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-medium group-hover:text-amber-400 transition-colors">Google Calendar</p>
              <p className="text-slate-500 text-xs">Opens in a new tab</p>
            </div>
            <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 ml-auto flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>

          {/* Apple Calendar */}
          <button
            onClick={handleAppleCalendar}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-left group"
          >
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 transition-colors">
              <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-medium group-hover:text-amber-400 transition-colors">Apple Calendar</p>
              <p className="text-slate-500 text-xs">Downloads .ics file</p>
            </div>
            <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 ml-auto flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          {/* Outlook Calendar */}
          <button
            onClick={handleOutlookCalendar}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-left group"
          >
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="#0078D4" strokeWidth="1.5" fill="none"/>
                <path d="M8 2v4M16 2v4M4 9h16" stroke="#0078D4" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="7" y="11" width="4" height="3" rx="0.5" fill="#0078D4" fillOpacity="0.3" stroke="#0078D4" strokeWidth="0.75"/>
                <rect x="13" y="11" width="4" height="3" rx="0.5" fill="#0078D4" fillOpacity="0.15" stroke="#0078D4" strokeWidth="0.75"/>
                <rect x="7" y="15.5" width="4" height="3" rx="0.5" fill="#0078D4" fillOpacity="0.15" stroke="#0078D4" strokeWidth="0.75"/>
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-medium group-hover:text-amber-400 transition-colors">Outlook Calendar</p>
              <p className="text-slate-500 text-xs">Opens in a new tab</p>
            </div>
            <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 ml-auto flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>

          {/* Download .ics for any calendar */}
          <div className="border-t border-slate-700/50">
            <button
              onClick={downloadIcsFile}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-left group"
            >
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 transition-colors">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium group-hover:text-amber-400 transition-colors">Download .ics File</p>
                <p className="text-slate-500 text-xs">Works with any calendar app</p>
              </div>
              <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 ml-auto flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCalendarButton;
