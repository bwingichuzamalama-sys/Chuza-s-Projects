import React, { useState } from 'react';
import {
  Smile,
  Meh,
  Frown,
  Plus,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { SymptomLog, AppSettings, MaternalProfile } from '../types';

interface SymptomJournalProps {
  symptoms: SymptomLog[];
  onAddSymptom: (log: Omit<SymptomLog, 'id'>) => void;
  settings: AppSettings;
  maternalProfile: MaternalProfile;
}

const COMMON_SYMPTOMS = [
  'Morning Sickness / Nausea',
  'Mild Fatigue / Tiredness',
  'Headache',
  'Mild Backache (Pregnancy)',
  'Pelvic Discomfort',
  'Heartburn / Acid Indigestion',
  'Mild Skin Rash',
  'Sleep Disturbance',
  'Good Energy & Appetite',
  'Baby Active with Strong Kicks',
];

export const SymptomJournal: React.FC<SymptomJournalProps> = ({
  symptoms,
  onAddSymptom,
  settings,
  maternalProfile,
}) => {
  const [wellnessScore, setWellnessScore] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Good Energy & Appetite']);
  const [notes, setNotes] = useState('');
  const [isLoggedToday, setIsLoggedToday] = useState(false);

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSymptom({
      date: new Date().toISOString().split('T')[0],
      overallWellness: wellnessScore,
      symptoms: selectedSymptoms,
      notes,
      sharedWithDoctor: false,
    });
    setNotes('');
    setIsLoggedToday(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wide uppercase">
          <span>Daily Well-being &amp; Adverse Reaction Monitoring</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
          {settings.isDiscreetMode ? 'Daily Wellness Journal' : 'Symptom & Well-being Tracker'}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Log daily feelings, side effects, and maternal wellness to share with your Sister or Doctor during ANC visits.
        </p>
      </div>

      {/* Clinical Guidance Box for Pregnant Mothers */}
      {maternalProfile.isPregnant && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 space-y-1">
            <span className="font-semibold block">
              Clinical Advice: Managing Morning Sickness or Vomiting with TLD
            </span>
            <p className="leading-relaxed">
              If you experience morning sickness or vomiting within <strong>less than 1 hour</strong> after taking your TLD tablet, wait until your stomach settles with a sip of ginger tea or water, and take another tablet. If vomiting occurs <strong>more than 1 hour</strong> after taking TLD, the medication has already been safely absorbed into your bloodstream—do not take an extra dose.
            </p>
          </div>
        </div>
      )}

      {/* Log Daily Check-in Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">
          How are you feeling today?
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Wellness Scale (1 to 5) */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-2">
              Overall Energy &amp; Well-being Rating:
            </label>
            <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-md">
              {[
                { score: 1 as const, label: 'Very Low', icon: Frown },
                { score: 2 as const, label: 'Struggling', icon: Frown },
                { score: 3 as const, label: 'Fair', icon: Meh },
                { score: 4 as const, label: 'Good', icon: Smile },
                { score: 5 as const, label: 'Thriving', icon: Smile },
              ].map((item) => (
                <button
                  type="button"
                  key={item.score}
                  onClick={() => setWellnessScore(item.score)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    wellnessScore === item.score
                      ? 'border-teal-700 bg-teal-50 text-teal-900 font-bold'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <item.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{item.score}</span>
                  <span className="text-[10px] hidden sm:block">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Symptoms Tagger */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-2">
              Select any symptoms or observations today:
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {COMMON_SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    type="button"
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-teal-700 bg-teal-800 text-white font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Journal Notes */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Personal Notes or Observations for Sister / Doctor:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Felt nausea after taking lunch, took dinner at 19:30 before TLD dose..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900"
            />
          </div>

          <div className="flex items-center justify-between">
            {isLoggedToday ? (
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Today&apos;s check-in recorded!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs transition-colors"
            >
              Save Daily Journal
            </button>
          </div>
        </form>
      </div>

      {/* Symptom History */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Recent Wellness Records
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {symptoms.length} logs
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {symptoms.map((log) => (
            <div key={log.id} className="p-6 transition-colors hover:bg-slate-50/50">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800 tabular-nums">{log.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>Energy Score: {log.overallWellness} / 5</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {log.symptoms.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {log.notes && (
                    <p className="text-xs text-slate-600 mt-2 italic">
                      &ldquo;{log.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="text-xs text-slate-400 shrink-0">
                  Logged in local file
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
