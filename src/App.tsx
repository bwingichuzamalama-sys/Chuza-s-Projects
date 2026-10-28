/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { MedicationHub } from './components/MedicationHub';
import { MaternalPMTCTSuite } from './components/MaternalPMTCTSuite';
import { LabTracker } from './components/LabTracker';
import { AppointmentBooking } from './components/AppointmentBooking';
import { SymptomJournal } from './components/SymptomJournal';
import { GuidanceAndSupport } from './components/GuidanceAndSupport';
import { PinSecurityModal } from './components/PinSecurityModal';
import {
  Medication,
  DoseLog,
  LabResult,
  MaternalProfile,
  PMTCTMilestone,
  Appointment,
  SymptomLog,
  AppSettings,
} from './types';
import {
  getMedications,
  saveMedications,
  getDoseLogs,
  logDose,
  calculateAdherenceStats,
  getLabResults,
  saveLabResults,
  getMaternalProfile,
  saveMaternalProfile,
  getPMTCTMilestones,
  savePMTCTMilestones,
  getAppointments,
  saveAppointments,
  getSymptoms,
  saveSymptoms,
  getSettings,
  saveSettings,
} from './utils/storage';
import { Lock, HeartPulse, Baby, ShieldCheck, PhoneCall } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'schedule' | 'pmtct' | 'labs' | 'appointments' | 'symptoms' | 'guidance'
  >('schedule');

  // Application State
  const [medications, setMedications] = useState<Medication[]>(getMedications);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>(getDoseLogs);
  const [labResults, setLabResults] = useState<LabResult[]>(getLabResults);
  const [maternalProfile, setMaternalProfile] = useState<MaternalProfile>(getMaternalProfile);
  const [pmtctMilestones, setPmtctMilestones] = useState<PMTCTMilestone[]>(getPMTCTMilestones);
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments);
  const [symptoms, setSymptoms] = useState<SymptomLog[]>(getSymptoms);
  const [settings, setSettings] = useState<AppSettings>(getSettings);

  // Security & Pin Lock
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isLockedByPin, setIsLockedByPin] = useState(false);
  const [unlockPinInput, setUnlockPinInput] = useState('');
  const [unlockError, setUnlockError] = useState(false);

  // Context passing for booking visits from other tabs
  const [bookingContext, setBookingContext] = useState<{
    department: string;
    purpose: string;
  } | null>(null);

  // Initialize PIN lock if enabled
  useEffect(() => {
    if (settings.isPinLocked && settings.pinCode) {
      setIsLockedByPin(true);
    }
  }, []);

  // Handlers
  const handleLogDose = (
    medicationId: string,
    date: string,
    time: string,
    status: 'taken_on_time' | 'taken_late' | 'skipped' | 'pending',
    reason?: DoseLog['skippedReason']
  ) => {
    const updated = logDose(medicationId, date, time, status, reason);
    setDoseLogs([...updated]);
    setMedications([...getMedications()]);
  };

  const handleAddMedication = (newMed: Omit<Medication, 'id'>) => {
    const medWithId: Medication = {
      ...newMed,
      id: `med-${Date.now()}`,
    };
    const updated = [...medications, medWithId];
    setMedications(updated);
    saveMedications(updated);
  };

  const handleUpdatePillCount = (medicationId: string, count: number) => {
    const updated = medications.map((m) =>
      m.id === medicationId ? { ...m, pillsRemaining: count } : m
    );
    setMedications(updated);
    saveMedications(updated);
  };

  const handleAddLabResult = (newLab: Omit<LabResult, 'id'>) => {
    const labWithId: LabResult = {
      ...newLab,
      id: `lab-${Date.now()}`,
    };
    const updated = [labWithId, ...labResults];
    setLabResults(updated);
    saveLabResults(updated);
  };

  const handleDeleteLabResult = (id: string) => {
    const updated = labResults.filter((l) => l.id !== id);
    setLabResults(updated);
    saveLabResults(updated);
  };

  const handleTogglePMTCTMilestone = (id: string) => {
    const updated = pmtctMilestones.map((m) => {
      if (m.id === id) {
        const nextState = !m.isCompleted;
        return {
          ...m,
          isCompleted: nextState,
          completedDate: nextState ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return m;
    });
    setPmtctMilestones(updated);
    savePMTCTMilestones(updated);
  };

  const handleUpdateMaternalProfile = (updated: MaternalProfile) => {
    setMaternalProfile(updated);
    saveMaternalProfile(updated);
  };

  const handleAddAppointment = (apt: Omit<Appointment, 'id'>) => {
    const aptWithId: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
    };
    const updated = [aptWithId, ...appointments];
    setAppointments(updated);
    saveAppointments(updated);
  };

  const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, status } : a));
    setAppointments(updated);
    saveAppointments(updated);
  };

  const handleAddSymptom = (sym: Omit<SymptomLog, 'id'>) => {
    const symWithId: SymptomLog = {
      ...sym,
      id: `sym-${Date.now()}`,
    };
    const updated = [symWithId, ...symptoms];
    setSymptoms(updated);
    saveSymptoms(updated);
  };

  const handleToggleDiscreetMode = () => {
    const updated = { ...settings, isDiscreetMode: !settings.isDiscreetMode };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleUpdateSettings = (updated: AppSettings) => {
    setSettings(updated);
    saveSettings(updated);
  };

  const handleRouteToBooking = (department: string, purpose: string) => {
    setBookingContext({ department, purpose });
    setActiveTab('appointments');
  };

  // Calculate adherence statistics
  const adherenceStats = calculateAdherenceStats(30);

  // If app is currently locked by 4-digit PIN
  if (isLockedByPin && settings.pinCode) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 bg-teal-50 border border-teal-200 text-teal-800 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">Patient Screen Lock</h2>
          <p className="text-xs text-slate-500">
            Enter your 4-digit PIN to access your personal health records.
          </p>

          <div className="py-2">
            <input
              type="password"
              maxLength={4}
              autoFocus
              value={unlockPinInput}
              onChange={(e) => {
                setUnlockError(false);
                const val = e.target.value.replace(/\D/g, '');
                setUnlockPinInput(val);
                if (val.length === 4) {
                  if (val === settings.pinCode) {
                    setIsLockedByPin(false);
                    setUnlockPinInput('');
                  } else {
                    setUnlockError(true);
                  }
                }
              }}
              placeholder="••••"
              className={`w-40 text-center tracking-widest text-2xl font-mono px-3 py-2 border rounded-xl focus:outline-none ${
                unlockError ? 'border-rose-500 bg-rose-50 text-rose-900' : 'border-slate-300'
              }`}
            />
            {unlockError && (
              <p className="text-xs text-rose-600 mt-2 font-medium">
                Incorrect PIN. Please try again.
              </p>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            For medical emergencies in Zambia, call toll-free <strong>990</strong> or <strong>112</strong> without entering PIN.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* Top Bar Contract (1-line Brand wordmark — 4-5 text nav links — 1 primary action) */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        settings={settings}
        onToggleDiscreet={handleToggleDiscreetMode}
        maternalProfile={maternalProfile}
        onOpenPinModal={() => setIsPinModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'schedule' && (
          <MedicationHub
            medications={medications}
            doseLogs={doseLogs}
            onLogDose={handleLogDose}
            onAddMedication={handleAddMedication}
            onUpdatePillCount={handleUpdatePillCount}
            onBookRefillAppointment={(medName) =>
              handleRouteToBooking(
                'Pharmacy & Multi-Month Dispensing',
                `Multi-Month Dispensing (MMD) Refill for ${medName}`
              )
            }
            settings={settings}
            maternalProfile={maternalProfile}
          />
        )}

        {activeTab === 'pmtct' && (
          <MaternalPMTCTSuite
            profile={maternalProfile}
            milestones={pmtctMilestones}
            onToggleMilestone={handleTogglePMTCTMilestone}
            onUpdateProfile={handleUpdateMaternalProfile}
            onBookAppointment={handleRouteToBooking}
            settings={settings}
          />
        )}

        {activeTab === 'labs' && (
          <LabTracker
            labResults={labResults}
            onAddLabResult={handleAddLabResult}
            onDeleteLabResult={handleDeleteLabResult}
            settings={settings}
            maternalProfile={maternalProfile}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentBooking
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            onUpdateStatus={handleUpdateAppointmentStatus}
            settings={settings}
            maternalProfile={maternalProfile}
            initialBookingContext={bookingContext}
            onClearBookingContext={() => setBookingContext(null)}
          />
        )}

        {activeTab === 'symptoms' && (
          <SymptomJournal
            symptoms={symptoms}
            onAddSymptom={handleAddSymptom}
            settings={settings}
            maternalProfile={maternalProfile}
          />
        )}

        {activeTab === 'guidance' && (
          <GuidanceAndSupport
            settings={settings}
            maternalProfile={maternalProfile}
            medications={medications}
            labResults={labResults}
            appointments={appointments}
            adherenceRate={adherenceStats.percentage}
          />
        )}
      </main>

      {/* PIN Security Modal */}
      <PinSecurityModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Subtle, Dignified Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              {settings.isDiscreetMode ? 'Bumi DailyHabit' : 'Bumi · Zambia'}
            </span>
            <span aria-hidden="true">·</span>
            <span>Supporting Healthy Families &amp; An HIV-Free Generation</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              National Health Helpline: <strong className="text-emerald-700 font-semibold">Toll-Free 990</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Local &amp; Private Storage Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
