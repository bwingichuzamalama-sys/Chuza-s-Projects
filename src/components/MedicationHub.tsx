import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Flame,
  Info,
  CalendarCheck,
  Package,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Medication, DoseLog, AppSettings, MaternalProfile } from '../types';

interface MedicationHubProps {
  medications: Medication[];
  doseLogs: DoseLog[];
  onLogDose: (
    medicationId: string,
    date: string,
    time: string,
    status: 'taken_on_time' | 'taken_late' | 'skipped' | 'pending',
    reason?: DoseLog['skippedReason']
  ) => void;
  onAddMedication: (med: Omit<Medication, 'id'>) => void;
  onUpdatePillCount: (medicationId: string, count: number) => void;
  onBookRefillAppointment: (medicationName: string) => void;
  settings: AppSettings;
  maternalProfile: MaternalProfile;
}

export const MedicationHub: React.FC<MedicationHubProps> = ({
  medications,
  doseLogs,
  onLogDose,
  onAddMedication,
  onUpdatePillCount,
  onBookRefillAppointment,
  settings,
  maternalProfile,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [skipModalDose, setSkipModalDose] = useState<{
    medId: string;
    time: string;
  } | null>(null);
  const [refillModalMed, setRefillModalMed] = useState<Medication | null>(null);
  const [newPillCountInput, setNewPillCountInput] = useState<number>(90);

  // Form state for adding new medication
  const [newMedName, setNewMedName] = useState('TLD (Tenofovir 300mg / Lamivudine 300mg / Dolutegravir 50mg)');
  const [newGenericName, setNewGenericName] = useState('TDF / 3TC / DTG fixed-dose');
  const [newDiscreetName, setNewDiscreetName] = useState('Daily Health Shield Formula');
  const [newDosage, setNewDosage] = useState('1 tablet once daily');
  const [newFrequency, setNewFrequency] = useState<Medication['frequency']>('Once Daily');
  const [newScheduledTime, setNewScheduledTime] = useState('20:00');
  const [newCategory, setNewCategory] = useState<Medication['category']>('ART');
  const [newFoodReq, setNewFoodReq] = useState<Medication['foodRequirement']>(
    'Separate from antacids/calcium/iron by 2+ hours'
  );
  const [newPills, setNewPills] = useState(90);
  const [newDispensing, setNewDispensing] = useState<Medication['dispensingModel']>(
    '3-Month MMD (Multi-Month Dispensing)'
  );
  const [newNotes, setNewNotes] = useState('');

  // 30-Day Adherence Math
  const todayStr = new Date().toISOString().split('T')[0];
  const past30DaysLogs = doseLogs.filter((l) => {
    const diff = (new Date(todayStr).getTime() - new Date(l.date).getTime()) / (1000 * 3600 * 24);
    return diff >= 0 && diff <= 30;
  });
  const totalScheduled30 = past30DaysLogs.length;
  const taken30 = past30DaysLogs.filter(
    (l) => l.status === 'taken_on_time' || l.status === 'taken_late'
  ).length;
  const adherenceRate =
    totalScheduled30 > 0 ? Math.round((taken30 / totalScheduled30) * 1000) / 10 : 100;

  // Streak days
  let streak = 0;
  const uniqueDates = Array.from(new Set(doseLogs.map((l) => l.date))).sort().reverse();
  for (const d of uniqueDates) {
    const dLogs = doseLogs.filter((l) => l.date === d);
    if (dLogs.length > 0 && dLogs.every((l) => l.status === 'taken_on_time' || l.status === 'taken_late')) {
      streak++;
    } else {
      break;
    }
  }

  // Get doses for selected date
  const dayLogs = doseLogs.filter((l) => l.date === selectedDate);

  const getDoseStatus = (medId: string, time: string) => {
    const match = dayLogs.find((l) => l.medicationId === medId && l.scheduledTime.includes(time));
    return match ? match.status : 'pending';
  };

  const getDoseReason = (medId: string, time: string) => {
    const match = dayLogs.find((l) => l.medicationId === medId && l.scheduledTime.includes(time));
    return match?.skippedReason;
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wide uppercase">
            <span>Republic of Zambia MoH Protocol</span>
            <span aria-hidden="true">·</span>
            <span>Test &amp; Treat / Option B+</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {settings.isDiscreetMode ? 'Daily Supplement Routine' : 'Medication Schedule & Adherence'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {settings.isDiscreetMode
              ? 'Maintain consistent timing every day for maximum vitality and wellbeing.'
              : 'Consistent ART adherence keeps viral load undetectable, protects your immune system, and guarantees baby safety.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-teal-800 hover:bg-teal-900 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medication</span>
          </button>
        </div>
      </div>

      {/* KPI & Adherence Summary Strip (Single elevation, unboxed metadata, tabular numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: 30-Day Adherence Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            30-Day Adherence
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {adherenceRate}%
            </span>
            <span
              className={`text-xs font-medium ${
                adherenceRate >= 95 ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {adherenceRate >= 95 ? 'Optimal Target' : 'Needs Focus (Target ≥95%)'}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {taken30} of {totalScheduled30} doses taken on schedule
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                adherenceRate >= 95 ? 'bg-emerald-600' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, adherenceRate)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Adherence Streak */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Current Streak
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {streak}
            </span>
            <span className="text-xs text-slate-500">Days Consecutive</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-700 mt-2 font-medium">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span>High resistance protection</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Viral suppression is maintained steadily
          </div>
        </div>

        {/* Metric 3: Multi-Month Dispensing (MMD) Refill Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Pill Stock &amp; Refill
          </div>
          {(() => {
            const primaryArt = medications.find((m) => m.category === 'ART') || medications[0];
            const pillsLeft = primaryArt ? primaryArt.pillsRemaining : 68;
            const isLow = pillsLeft <= (primaryArt?.refillThreshold || 14);
            return (
              <>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-slate-900 tabular-nums">
                    {pillsLeft}
                  </span>
                  <span className="text-xs text-slate-500">Days of Supply</span>
                </div>
                <div className="text-xs text-slate-600 mt-2 truncate">
                  {settings.isDiscreetMode ? 'Core Bottle' : '3-Month MMD Supply'}
                </div>
                {isLow ? (
                  <button
                    onClick={() => onBookRefillAppointment(primaryArt?.name || 'TLD')}
                    className="mt-2 text-xs font-semibold text-rose-700 hover:text-rose-800 underline block"
                  >
                    Low stock! Book clinic refill
                  </button>
                ) : (
                  <div className="text-xs text-emerald-700 mt-2">
                    Adequate stock (Refill in {pillsLeft - 14} days)
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Metric 4: Maternal Safety & Clinical Protocol */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Maternal / PMTCT Check
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {maternalProfile.isPregnant
                ? `Week ${maternalProfile.currentWeek || 33}`
                : 'General Care'}
            </span>
          </div>
          <div className="text-xs text-rose-700 mt-2 font-medium">
            {maternalProfile.isPregnant
              ? 'Option B+: Lifelong ART Active'
              : 'Routine Viral Monitoring'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {maternalProfile.isPregnant
              ? 'Separate Iron & TLD by 2+ hrs'
              : 'Annual VL check required'}
          </div>
        </div>
      </div>

      {/* Clinical Drug-Nutrient Advisory Note (Crucial for Pregnant Women taking TLD + Iron) */}
      {maternalProfile.isPregnant && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <span className="font-semibold block">
              Zambian Clinical Guidance: Separating Prenatal Minerals from Dolutegravir (TLD)
            </span>
            <p className="leading-relaxed">
              Dolutegravir in your TLD tablet binds with calcium, iron, and multivitamin antacids if taken at the exact same time, preventing the body from absorbing your ART. Take your prenatal{' '}
              <strong>Iron &amp; Folic Acid in the morning (08:00)</strong> with food, and take your{' '}
              <strong>TLD in the evening (20:00)</strong>. This guarantees 100% absorption and zero interaction!
            </p>
          </div>
        </div>
      )}

      {/* Daily Dose Checklist for Selected Date */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {selectedDate === todayStr ? "Today's Schedule" : `Doses for ${selectedDate}`}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{medications.length} active prescriptions</span>
              <span aria-hidden="true">·</span>
              <span>{selectedDate}</span>
            </div>
          </div>

          {selectedDate !== todayStr && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="text-xs font-medium text-teal-800 hover:text-teal-900 underline"
            >
              Back to Today
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {medications.map((med) => {
            const displayName = settings.isDiscreetMode ? med.discreetName : med.name;
            return (
              <div key={med.id} className="p-6 transition-colors hover:bg-slate-50/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Med Details */}
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{med.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{med.frequency}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{med.pillsRemaining} pills left</span>
                    </div>

                    <div className="text-base font-semibold text-slate-900">{displayName}</div>

                    {!settings.isDiscreetMode && (
                      <div className="text-xs text-slate-500 font-mono">
                        {med.genericName} · {med.dosage}
                      </div>
                    )}

                    <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-100 mt-2">
                      <span className="font-medium text-slate-700">Instructions: </span>
                      {med.foodRequirement}. {med.notes}
                    </div>
                  </div>

                  {/* Right: Scheduled Time & Interactive Action */}
                  <div className="space-y-3 shrink-0">
                    {med.scheduledTimes.map((time) => {
                      const status = getDoseStatus(med.id, time);
                      const skipReason = getDoseReason(med.id, time);

                      return (
                        <div
                          key={time}
                          className="flex items-center justify-between sm:justify-end gap-3 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg"
                        >
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 tabular-nums">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>{time}</span>
                          </div>

                          {status === 'taken_on_time' || status === 'taken_late' ? (
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>{status === 'taken_on_time' ? 'Taken on Time' : 'Taken Late'}</span>
                              </span>
                              <button
                                onClick={() => onLogDose(med.id, selectedDate, time, 'pending')}
                                title="Undo log"
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : status === 'skipped' ? (
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-rose-600" />
                                <span>Skipped ({skipReason || 'Recorded'})</span>
                              </span>
                              <button
                                onClick={() => onLogDose(med.id, selectedDate, time, 'pending')}
                                title="Undo log"
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  onLogDose(med.id, selectedDate, time, 'taken_on_time')
                                }
                                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg transition-colors shadow-xs"
                              >
                                Mark as Taken
                              </button>
                              <button
                                onClick={() =>
                                  setSkipModalDose({ medId: med.id, time })
                                }
                                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                              >
                                Skip / Issue
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Stock pill counter quick manage */}
                    <div className="flex items-center justify-end gap-2 text-xs text-slate-500 pt-1">
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      <button
                        onClick={() => {
                          setRefillModalMed(med);
                          setNewPillCountInput(med.pillsRemaining);
                        }}
                        className="hover:text-teal-800 underline"
                      >
                        Adjust bottle count ({med.pillsRemaining} left)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skip Dose Reason Modal */}
      {skipModalDose && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Record Reason for Missed Dose
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Tracking missed dose reasons helps your clinical team support you without judgment.
            </p>

            <div className="space-y-2 mt-4">
              {[
                'Forgot / busy',
                'Nausea / vomiting',
                'Travel / away from home',
                'Pills ran out',
                'Side effects',
                'Stigma / privacy concern',
                'Other',
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    onLogDose(
                      skipModalDose.medId,
                      selectedDate,
                      skipModalDose.time,
                      'skipped',
                      reason as DoseLog['skippedReason']
                    );
                    setSkipModalDose(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center justify-between"
                >
                  <span>{reason}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSkipModalDose(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Pill Count Modal */}
      {refillModalMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Update Pill Inventory
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {refillModalMed.name}
            </p>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Remaining Pills in Bottle
              </label>
              <input
                type="number"
                min="0"
                max="360"
                value={newPillCountInput}
                onChange={(e) => setNewPillCountInput(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-sm font-semibold tabular-nums border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Zambia 3-Month MMD bottles typically contain 90 tablets.
              </span>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setRefillModalMed(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdatePillCount(refillModalMed.id, newPillCountInput);
                  setRefillModalMed(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              Add Medication / Prescription
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add your antiretroviral regimen, prenatal supplements, or infant prophylaxis.
            </p>

            {/* Presets */}
            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-700 block mb-2">
                Quick Zambian Presets:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setNewMedName('TLD (Tenofovir 300mg / Lamivudine 300mg / Dolutegravir 50mg)');
                    setNewGenericName('TDF / 3TC / DTG fixed-dose');
                    setNewDiscreetName('Daily Essential Shield Formula');
                    setNewDosage('1 tablet once daily');
                    setNewCategory('ART');
                    setNewScheduledTime('20:00');
                    setNewFoodReq('Separate from antacids/calcium/iron by 2+ hours');
                    setNewPills(90);
                    setNewDispensing('3-Month MMD (Multi-Month Dispensing)');
                  }}
                  className="p-2 border border-slate-200 rounded-lg hover:border-teal-600 text-left bg-slate-50 font-medium text-slate-800"
                >
                  TLD Adult (1st Line)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewMedName('Cotrimoxazole (Septrin) 960mg (Double Strength)');
                    setNewGenericName('Sulfamethoxazole / Trimethoprim');
                    setNewDiscreetName('Daily Preventive Antibacterial');
                    setNewDosage('1 tablet once daily');
                    setNewCategory('ART');
                    setNewScheduledTime('08:00');
                    setNewFoodReq('Take with food');
                    setNewPills(60);
                    setNewDispensing('3-Month MMD (Multi-Month Dispensing)');
                  }}
                  className="p-2 border border-slate-200 rounded-lg hover:border-teal-600 text-left bg-slate-50 font-medium text-slate-800"
                >
                  Septrin Prophylaxis
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewMedName('Infant Nevirapine (NVP) Syrup 10mg/mL');
                    setNewGenericName('Nevirapine oral suspension');
                    setNewDiscreetName('Infant Daily Health Drops');
                    setNewDosage('1.5 mL daily by oral syringe');
                    setNewCategory('Infant Prophylaxis');
                    setNewScheduledTime('09:00');
                    setNewFoodReq('Take with or without food');
                    setNewPills(42); // 6 weeks
                    setNewDispensing('1-Month Dispensing');
                  }}
                  className="p-2 border border-slate-200 rounded-lg hover:border-teal-600 text-left bg-slate-50 font-medium text-slate-800"
                >
                  Baby Nevirapine Syrup
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewMedName('Prenatal Iron + Folic Acid');
                    setNewGenericName('Ferrous Sulphate 200mg + Folic Acid 0.4mg');
                    setNewDiscreetName('Morning Maternity Mineral');
                    setNewDosage('1 tablet daily');
                    setNewCategory('Prenatal');
                    setNewScheduledTime('08:00');
                    setNewFoodReq('Take with food');
                    setNewPills(30);
                    setNewDispensing('1-Month Dispensing');
                  }}
                  className="p-2 border border-slate-200 rounded-lg hover:border-teal-600 text-left bg-slate-50 font-medium text-slate-800"
                >
                  ANC Iron + Folate
                </button>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Medication Name</label>
                <input
                  type="text"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Generic / Formulation</label>
                  <input
                    type="text"
                    value={newGenericName}
                    onChange={(e) => setNewGenericName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Discreet Camouflage Name</label>
                  <input
                    type="text"
                    value={newDiscreetName}
                    onChange={(e) => setNewDiscreetName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Dosage</label>
                  <input
                    type="text"
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    value={newScheduledTime}
                    onChange={(e) => setNewScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Medication['category'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                  >
                    <option value="ART">ART</option>
                    <option value="Prenatal">Prenatal</option>
                    <option value="Infant Prophylaxis">Infant Prophylaxis</option>
                    <option value="Prophylaxis (PrEP/PEP)">Prophylaxis (PrEP/PEP)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Initial Pill Count</label>
                  <input
                    type="number"
                    value={newPills}
                    onChange={(e) => setNewPills(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 tabular-nums"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Dispensing Model</label>
                  <select
                    value={newDispensing}
                    onChange={(e) =>
                      setNewDispensing(e.target.value as Medication['dispensingModel'])
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                  >
                    <option value="1-Month Dispensing">1-Month Dispensing</option>
                    <option value="3-Month MMD (Multi-Month Dispensing)">3-Month MMD (Zambia Standard)</option>
                    <option value="6-Month MMD">6-Month MMD</option>
                    <option value="Community ART Group (CAG)">Community ART Group (CAG)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Food / Separation Rules</label>
                <select
                  value={newFoodReq}
                  onChange={(e) =>
                    setNewFoodReq(e.target.value as Medication['foodRequirement'])
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                >
                  <option value="Take with food">Take with food</option>
                  <option value="Take without food">Take without food</option>
                  <option value="Take with or without food">Take with or without food</option>
                  <option value="Separate from antacids/calcium/iron by 2+ hours">
                    Separate from antacids/calcium/iron by 2+ hours (TLD Standard)
                  </option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Clinical Notes</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="Doctor/pharmacist instructions..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddMedication({
                    name: newMedName,
                    genericName: newGenericName,
                    discreetName: newDiscreetName,
                    dosage: newDosage,
                    frequency: newFrequency,
                    scheduledTimes: [newScheduledTime],
                    category: newCategory,
                    foodRequirement: newFoodReq,
                    pillsRemaining: newPills,
                    totalPillsPerRefill: newPills,
                    refillThreshold: 14,
                    dispensingModel: newDispensing,
                    notes: newNotes,
                    isMaternalSpecific: newCategory === 'Prenatal',
                  });
                  setIsAddModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs"
              >
                Save Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
