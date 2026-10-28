import React, { useState } from 'react';
import {
  Baby,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  ShieldCheck,
  AlertTriangle,
  FileText,
  MapPin,
  Sparkles,
  ChevronRight,
  Info,
  Edit3,
} from 'lucide-react';
import { MaternalProfile, PMTCTMilestone, AppSettings } from '../types';

interface MaternalPMTCTSuiteProps {
  profile: MaternalProfile;
  milestones: PMTCTMilestone[];
  onToggleMilestone: (id: string) => void;
  onUpdateProfile: (updated: MaternalProfile) => void;
  onBookAppointment: (department: string, purpose: string) => void;
  settings: AppSettings;
}

export const MaternalPMTCTSuite: React.FC<MaternalPMTCTSuiteProps> = ({
  profile,
  milestones,
  onToggleMilestone,
  onUpdateProfile,
  onBookAppointment,
  settings,
}) => {
  const [selectedTrimesterTab, setSelectedTrimesterTab] = useState<
    'All' | '1st Trimester' | '2nd Trimester' | '3rd Trimester' | 'Postpartum'
  >('3rd Trimester');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Form state for profile editing
  const [editWeek, setEditWeek] = useState(profile.currentWeek || 33);
  const [editDueDate, setEditDueDate] = useState(profile.dueDate || '2026-12-14');
  const [editClinic, setEditClinic] = useState(profile.assignedClinic);
  const [editFeedingChoice, setEditFeedingChoice] = useState(profile.infantFeedingChoice);
  const [editGravida, setEditGravida] = useState(profile.gravidaPara || 'G2 P1');

  const filteredMilestones = milestones.filter((m) => {
    if (selectedTrimesterTab === 'All') return true;
    return m.trimester === selectedTrimesterTab;
  });

  const completedCount = milestones.filter((m) => m.isCompleted).length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  // Calculate days remaining to due date
  const today = new Date();
  const due = profile.dueDate ? new Date(profile.dueDate) : new Date();
  const daysUntilDue = Math.max(0, Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24)));

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wide uppercase">
            <span>Republic of Zambia · PMTCT National Protocol</span>
            <span aria-hidden="true">·</span>
            <span>Elimination of Mother-to-Child Transmission (eMTCT)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1 flex items-center gap-2">
            <span>Maternal &amp; PMTCT Clinical Suite</span>
            <Baby className="w-6 h-6 text-rose-600 inline-block" />
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Complete antenatal and postnatal care roadmap for mothers living with HIV in Zambia. With adherence to TLD and viral suppression, your baby will be born 100% HIV-free.
          </p>
        </div>

        <button
          onClick={() => setIsEditProfileOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto shadow-xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Update Pregnancy Profile</span>
        </button>
      </div>

      {/* Maternal Hero Banner: Gestational Progress & Due Date */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-rose-200">
              <span className="font-semibold text-white uppercase tracking-wider">
                {profile.pmtctStage}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">Due {profile.dueDate}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.assignedClinic}</span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Week {profile.currentWeek || 33} of 40
            </div>

            <p className="text-xs sm:text-sm text-rose-100 max-w-xl leading-relaxed">
              You are in the vital 3rd trimester! Your baby is actively developing strong lungs, practicing breathing movements, and receiving maternal antibodies.
            </p>
          </div>

          {/* Quick Metrics in Hero */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold tabular-nums">{daysUntilDue}</div>
              <div className="text-[11px] text-rose-200 mt-0.5">Days to Delivery</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold tabular-nums">{completedCount}/{milestones.length}</div>
              <div className="text-[11px] text-rose-200 mt-0.5">PMTCT Steps Done</div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400 tabular-nums">&lt;0.5%</div>
              <div className="text-[11px] text-rose-200 mt-0.5">Transmission Risk</div>
            </div>
          </div>
        </div>

        {/* 40-Week Gestational Timeline Bar */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <div className="flex justify-between text-xs text-rose-200 mb-1.5 font-medium">
            <span>Trimester 1 (Wks 1-12)</span>
            <span>Trimester 2 (Wks 13-27)</span>
            <span className="text-white font-bold">Trimester 3 (Wks 28-40)</span>
            <span>Delivery</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, ((profile.currentWeek || 33) / 40) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Critical 3rd Trimester Clinical Window Callout */}
      {(profile.currentWeek || 33) >= 32 && (profile.currentWeek || 33) <= 36 && (
        <div className="bg-white border-2 border-rose-600 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                Action Required · 32-36 Week PMTCT Window
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Pre-Delivery Maternal Viral Load Blood Draw
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Zambia National PMTCT protocol requires every pregnant mother living with HIV to have a viral load test between 32 and 36 weeks. A confirmed undetectable result (&lt;50 copies/mL) provides 100% peace of mind, ensures your maternity team prepares for a gentle vaginal birth, and confirms standard 6-week infant Nevirapine syrup.
            </p>
          </div>

          <button
            onClick={() =>
              onBookAppointment(
                'Antenatal Care (ANC) & PMTCT',
                '34-Week PMTCT Pre-Delivery Viral Load Check & ANC 5 Consultation'
              )
            }
            className="px-4 py-2.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors whitespace-nowrap shadow-xs shrink-0"
          >
            Schedule 34-Wk Lab Visit
          </button>
        </div>
      )}

      {/* Interactive Milestone Tabs & Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Tab Controls */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Zambia National PMTCT Milestone Roadmap
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{completedCount} of {milestones.length} milestones confirmed</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{progressPercent}% complete</span>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs font-medium">
            {(['All', '1st Trimester', '2nd Trimester', '3rd Trimester', 'Postpartum'] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTrimesterTab(tab)}
                  className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                    selectedTrimesterTab === tab
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>

        {/* Milestone List */}
        <div className="divide-y divide-slate-100">
          {filteredMilestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`p-6 transition-colors ${
                milestone.isCompleted ? 'bg-slate-50/40' : 'bg-white hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 max-w-3xl">
                  <button
                    onClick={() => onToggleMilestone(milestone.id)}
                    className="mt-0.5 shrink-0 focus:outline-none"
                    aria-label={`Toggle ${milestone.title}`}
                  >
                    {milestone.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-teal-600 transition-colors" />
                    )}
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{milestone.weekRange}</span>
                      <span aria-hidden="true">·</span>
                      <span>{milestone.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{milestone.trimester}</span>
                    </div>

                    <h3
                      className={`text-base font-semibold ${
                        milestone.isCompleted ? 'text-slate-600 line-through' : 'text-slate-900'
                      }`}
                    >
                      {milestone.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {milestone.description}
                    </p>

                    <div className="text-xs text-teal-900 bg-teal-50/60 p-2.5 rounded-md border border-teal-100/60 mt-2">
                      <span className="font-semibold text-teal-800">Clinical Purpose: </span>
                      {milestone.clinicalSignificance}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1">
                      Protocol: {milestone.zambiaGuidelineRef}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  <button
                    onClick={() => onToggleMilestone(milestone.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                      milestone.isCompleted
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {milestone.isCompleted ? 'Completed' : 'Mark Done'}
                  </button>

                  {!milestone.isCompleted && milestone.category.includes('Visit') && (
                    <button
                      onClick={() =>
                        onBookAppointment(
                          'Antenatal Care (ANC) & PMTCT',
                          `Appointment for: ${milestone.title}`
                        )
                      }
                      className="text-xs text-teal-800 hover:text-teal-900 underline font-medium"
                    >
                      Book Clinic Visit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Infant Feeding & Prophylaxis Deep-Dive Guide (Zambia National Guidance) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: Infant Feeding Protocol */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wide">
            <Heart className="w-4 h-4 text-teal-600" />
            <span>Zambia MoH Infant Feeding Guidance</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Exclusive Breastfeeding (EBF) with Maternal ART
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            In Zambia, mothers with undetectable viral loads are strongly advised to practice <strong>Exclusive Breastfeeding for the first 6 months</strong> of life:
          </p>
          <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
            <li>
              <strong>No Mixed Feeding:</strong> Do NOT give water, glucose, tea, cow&apos;s milk, or porridge before 6 months. Mixed feeding scratches the infant&apos;s sensitive gut lining and increases transmission risk!
            </li>
            <li>
              <strong>Breast Milk Only:</strong> Exclusive breast milk provides optimal nutrition, antibodies against pneumonia and diarrhea, and zero HIV transmission risk when maternal viral load is suppressed.
            </li>
            <li>
              <strong>Complementary Feeding at 6 Months:</strong> Introduce solid foods (porridge, eggs, mashed vegetables) after 6 months while continuing breastfeeding up to 24 months.
            </li>
          </ul>
        </div>

        {/* Box 2: Infant Prophylaxis & Early Infant Diagnosis (EID) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span>Infant Prophylaxis &amp; Testing Timeline</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            The Infant Shield: Nevirapine &amp; PCR Testing
          </h3>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-semibold block text-slate-900">
                1. Infant Nevirapine (NVP) Syrup (Day 0 - Week 6)
              </span>
              <span>
                Give daily by oral syringe starting within 4 hours of birth. Protects during the initial newborn phase.
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-semibold block text-slate-900">
                2. 6-Week DNA-PCR Test &amp; Cotrimoxazole (Septrin)
              </span>
              <span>
                Dried Blood Spot (DBS) taken from baby&apos;s heel at Under-5 clinic. Start daily Cotrimoxazole syrup to protect against common childhood infections.
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-semibold block text-slate-900">
                3. Final Clearance at 18 Months
              </span>
              <span>
                Rapid antibody test 6 weeks after breastfeeding cessation. Child is celebrated and graduated HIV-free!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Maternity Hospital Bag Checklist for Zambia */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-base font-bold text-slate-900">
          Zambian Maternity Ward Hospital Bag Checklist
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Prepare these essential items at 34-36 weeks so you are ready whenever labor begins.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 text-xs">
          {[
            'Physical SmartCare Card & Under-5/Antenatal Card',
            'Current TLD pill bottle (take dose as normal during labor!)',
            '3 clean chitenje wraps / receiving blankets',
            '2 sets of warm newborn clothes & baby caps',
            'Maternity sanitary pads & clean underwear',
            'Baby basin, mild soap, and cotton wool',
            'Flask with warm drinking water / oral rehydration',
            'Emergency contact list & taxi fare / transport arrangement',
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Update Pregnancy &amp; PMTCT Profile
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Keep your gestational age and delivery hospital accurate.
            </p>

            <div className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Current Gestational Week (1 - 42)
                </label>
                <input
                  type="number"
                  min="1"
                  max="42"
                  value={editWeek}
                  onChange={(e) => setEditWeek(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg tabular-nums text-slate-900"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Expected Delivery Date (EDD)
                </label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Delivery Hospital / Health Centre
                </label>
                <input
                  type="text"
                  value={editClinic}
                  onChange={(e) => setEditClinic(e.target.value)}
                  placeholder="e.g. UTH Women & Newborn Hospital"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Obstetric History (Gravida / Para)
                </label>
                <input
                  type="text"
                  value={editGravida}
                  onChange={(e) => setEditGravida(e.target.value)}
                  placeholder="e.g. G2 P1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Infant Feeding Choice
                </label>
                <select
                  value={editFeedingChoice}
                  onChange={(e) =>
                    setEditFeedingChoice(
                      e.target.value as MaternalProfile['infantFeedingChoice']
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                >
                  <option value="Exclusive Breastfeeding (EBF) with maternal viral suppression">
                    Exclusive Breastfeeding (EBF) with maternal viral suppression (MoH Standard)
                  </option>
                  <option value="Safe Exclusive Formula Feeding">
                    Safe Exclusive Formula Feeding (if AFASS criteria met)
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  let stage: MaternalProfile['pmtctStage'] = '1st Trimester';
                  if (editWeek > 27) stage = '3rd Trimester';
                  else if (editWeek > 12) stage = '2nd Trimester';

                  onUpdateProfile({
                    ...profile,
                    currentWeek: editWeek,
                    dueDate: editDueDate,
                    assignedClinic: editClinic,
                    gravidaPara: editGravida,
                    infantFeedingChoice: editFeedingChoice,
                    pmtctStage: stage,
                  });
                  setIsEditProfileOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
