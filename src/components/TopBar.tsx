import React from 'react';
import { Eye, EyeOff, Lock, PhoneCall, ShieldCheck, Baby, HeartPulse } from 'lucide-react';
import { AppSettings, MaternalProfile } from '../types';

interface TopBarProps {
  activeTab: 'schedule' | 'pmtct' | 'labs' | 'appointments' | 'symptoms' | 'guidance';
  onSelectTab: (tab: 'schedule' | 'pmtct' | 'labs' | 'appointments' | 'symptoms' | 'guidance') => void;
  settings: AppSettings;
  onToggleDiscreet: () => void;
  maternalProfile: MaternalProfile;
  onOpenPinModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  settings,
  onToggleDiscreet,
  maternalProfile,
  onOpenPinModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single-element Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onSelectTab('schedule')}
              className="flex items-center gap-2 text-left text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-md"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-xs">
                {settings.isDiscreetMode ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <HeartPulse className="w-4 h-4" />
                )}
              </div>
              <span className="text-lg font-bold tracking-tight whitespace-nowrap">
                {settings.isDiscreetMode ? 'Bumi · Routine Log' : 'Bumi · Zambia'}
              </span>
            </button>
            {maternalProfile.isPregnant && !settings.isDiscreetMode && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-rose-700 font-medium">
                <span className="text-slate-300">/</span>
                <Baby className="w-3.5 h-3.5" />
                <span>PMTCT Active</span>
              </span>
            )}
          </div>

          {/* Zone 2: 4-5 Concise Single-Line Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('schedule')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'schedule'
                  ? 'border-teal-700 text-teal-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              {settings.isDiscreetMode ? 'Routine Schedule' : 'ART & Medications'}
            </button>

            <button
              onClick={() => onSelectTab('pmtct')}
              className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'pmtct'
                  ? 'border-rose-600 text-rose-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              <span>{settings.isDiscreetMode ? 'Maternal Care' : 'Maternal & PMTCT'}</span>
              {maternalProfile.isPregnant && (
                <span className="text-xs text-rose-600 font-normal">
                  (Wk {maternalProfile.currentWeek || 33})
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('labs')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'labs'
                  ? 'border-teal-700 text-teal-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              {settings.isDiscreetMode ? 'Biomarker Labs' : 'CD4, Viral Load & U=U'}
            </button>

            <button
              onClick={() => onSelectTab('appointments')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'appointments'
                  ? 'border-teal-700 text-teal-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Book &amp; Clinic Visits
            </button>

            <button
              onClick={() => onSelectTab('symptoms')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'symptoms'
                  ? 'border-teal-700 text-teal-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Wellness Log
            </button>

            <button
              onClick={() => onSelectTab('guidance')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'guidance'
                  ? 'border-teal-700 text-teal-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Zambia 990 &amp; Guides
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (Discreet Camouflage Switcher + Quick Lock) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onToggleDiscreet}
              title={
                settings.isDiscreetMode
                  ? 'Switch back to standard clinical view'
                  : 'Camouflage screen: hides HIV terms & medicine names for privacy'
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                settings.isDiscreetMode
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {settings.isDiscreetMode ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline">Camouflage Active</span>
                  <span className="sm:hidden">Discreet</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Discreet Mode</span>
                  <span className="sm:hidden">Private</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenPinModal}
              title="PIN Security Lock"
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors shrink-0"
              aria-label="Security Settings"
            >
              <Lock className="w-4 h-4" />
            </button>

            <a
              href="tel:990"
              title="Call Zambia Toll-Free National Health Line 990"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>MoH 990 Free</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation Row (Horizontal Scrollable) */}
        <div className="md:hidden flex items-center gap-4 overflow-x-auto py-2.5 border-t border-slate-100 text-xs font-medium no-scrollbar">
          <button
            onClick={() => onSelectTab('schedule')}
            className={`whitespace-nowrap px-2 py-1 rounded-md transition-colors ${
              activeTab === 'schedule' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            {settings.isDiscreetMode ? 'Routine' : 'Meds'}
          </button>
          <button
            onClick={() => onSelectTab('pmtct')}
            className={`whitespace-nowrap px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
              activeTab === 'pmtct' ? 'bg-rose-700 text-white' : 'text-slate-600'
            }`}
          >
            <Baby className="w-3 h-3" />
            <span>Maternal PMTCT</span>
          </button>
          <button
            onClick={() => onSelectTab('labs')}
            className={`whitespace-nowrap px-2 py-1 rounded-md transition-colors ${
              activeTab === 'labs' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            {settings.isDiscreetMode ? 'Labs' : 'CD4 / Viral Load'}
          </button>
          <button
            onClick={() => onSelectTab('appointments')}
            className={`whitespace-nowrap px-2 py-1 rounded-md transition-colors ${
              activeTab === 'appointments' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            Visits
          </button>
          <button
            onClick={() => onSelectTab('symptoms')}
            className={`whitespace-nowrap px-2 py-1 rounded-md transition-colors ${
              activeTab === 'symptoms' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            Wellness
          </button>
          <button
            onClick={() => onSelectTab('guidance')}
            className={`whitespace-nowrap px-2 py-1 rounded-md transition-colors ${
              activeTab === 'guidance' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            Helpline 990
          </button>
        </div>
      </div>
    </header>
  );
};
