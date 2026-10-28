import {
  Medication,
  DoseLog,
  LabResult,
  MaternalProfile,
  PMTCTMilestone,
  Appointment,
  SymptomLog,
  AppSettings,
} from '../types';
import {
  INITIAL_MEDICATIONS,
  INITIAL_LAB_RESULTS,
  INITIAL_MATERNAL_PROFILE,
  ZAMBIA_PMTCT_MILESTONES,
  INITIAL_APPOINTMENTS,
  INITIAL_SYMPTOMS,
  INITIAL_SETTINGS,
} from '../data/zambiaHealthData';

const STORAGE_KEYS = {
  MEDS: 'auracare_medications_zm_v1',
  DOSES: 'auracare_doses_zm_v1',
  LABS: 'auracare_labs_zm_v1',
  MATERNAL: 'auracare_maternal_zm_v1',
  PMTCT: 'auracare_pmtct_zm_v1',
  APPOINTMENTS: 'auracare_appointments_zm_v1',
  SYMPTOMS: 'auracare_symptoms_zm_v1',
  SETTINGS: 'auracare_settings_zm_v1',
};

// Generate realistic past 30 days of dose history if empty
function generateInitialDoseHistory(meds: Medication[]): DoseLog[] {
  const logs: DoseLog[] = [];
  const today = new Date();
  
  // Create logs for past 28 days
  for (let i = 28; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    meds.forEach((med) => {
      med.scheduledTimes.forEach((time) => {
        // High adherence simulation: 96% adherence
        const rand = Math.random();
        let status: 'taken_on_time' | 'taken_late' | 'skipped' = 'taken_on_time';
        let skippedReason: DoseLog['skippedReason'] = undefined;

        if (i === 0) {
          // Today: keep pending or taken depending on hour
          const currentHour = today.getHours();
          const scheduledHour = parseInt(time.split(':')[0], 10);
          if (scheduledHour > currentHour) {
            status = 'taken_on_time'; // Default to on-track or pending
          } else {
            status = 'taken_on_time';
          }
        } else if (rand > 0.96) {
          status = 'skipped';
          skippedReason = 'Forgot / busy';
        } else if (rand > 0.90) {
          status = 'taken_late';
        }

        logs.push({
          id: `dose-${med.id}-${dateStr}-${time}`,
          medicationId: med.id,
          medicationName: med.name,
          scheduledTime: `${dateStr}T${time}:00`,
          status,
          actualTakenTime: status !== 'skipped' ? `${dateStr}T${time}:00` : undefined,
          skippedReason,
          date: dateStr,
        });
      });
    });
  }
  return logs;
}

export function getMedications(): Medication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load medications from storage', e);
  }
  localStorage.setItem(STORAGE_KEYS.MEDS, JSON.stringify(INITIAL_MEDICATIONS));
  return INITIAL_MEDICATIONS;
}

export function saveMedications(meds: Medication[]): void {
  localStorage.setItem(STORAGE_KEYS.MEDS, JSON.stringify(meds));
}

export function getDoseLogs(): DoseLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOSES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load doses', e);
  }
  const meds = getMedications();
  const initialLogs = generateInitialDoseHistory(meds);
  localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(initialLogs));
  return initialLogs;
}

export function saveDoseLogs(logs: DoseLog[]): void {
  localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(logs));
}

export function logDose(
  medicationId: string,
  date: string,
  time: string,
  status: 'taken_on_time' | 'taken_late' | 'skipped' | 'pending',
  skippedReason?: DoseLog['skippedReason']
): DoseLog[] {
  const logs = getDoseLogs();
  const meds = getMedications();
  const med = meds.find((m) => m.id === medicationId);
  const medName = med ? med.name : 'Medication';

  const scheduledTimeStr = `${date}T${time}:00`;
  const existingIndex = logs.findIndex(
    (l) => l.medicationId === medicationId && l.date === date && l.scheduledTime.includes(time)
  );

  const newLog: DoseLog = {
    id: existingIndex >= 0 ? logs[existingIndex].id : `dose-${medicationId}-${date}-${time}-${Date.now()}`,
    medicationId,
    medicationName: medName,
    scheduledTime: scheduledTimeStr,
    status,
    actualTakenTime: status !== 'skipped' ? new Date().toISOString() : undefined,
    skippedReason,
    date,
  };

  let updatedLogs: DoseLog[];
  if (existingIndex >= 0) {
    updatedLogs = [...logs];
    updatedLogs[existingIndex] = newLog;
  } else {
    updatedLogs = [newLog, ...logs];
  }

  saveDoseLogs(updatedLogs);

  // If taken, decrease pills remaining if not previously taken
  if (med && status !== 'skipped') {
    const updatedMeds = meds.map((m) => {
      if (m.id === medicationId && m.pillsRemaining > 0) {
        return { ...m, pillsRemaining: m.pillsRemaining - 1 };
      }
      return m;
    });
    saveMedications(updatedMeds);
  }

  return updatedLogs;
}

export function calculateAdherenceStats(days: number = 30) {
  const logs = getDoseLogs();
  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  const recentLogs = logs.filter((l) => l.date >= cutoffStr);
  const totalScheduled = recentLogs.length;
  const takenCount = recentLogs.filter(
    (l) => l.status === 'taken_on_time' || l.status === 'taken_late'
  ).length;

  const percentage = totalScheduled > 0 ? Math.round((takenCount / totalScheduled) * 1000) / 10 : 100;

  // Calculate current streak
  let streakDays = 0;
  const uniqueDates = Array.from(new Set(logs.map((l) => l.date))).sort().reverse();
  for (const d of uniqueDates) {
    const dayLogs = logs.filter((l) => l.date === d);
    const allTaken = dayLogs.every((l) => l.status === 'taken_on_time' || l.status === 'taken_late');
    if (allTaken && dayLogs.length > 0) {
      streakDays++;
    } else {
      break;
    }
  }

  return {
    percentage,
    takenCount,
    totalScheduled,
    streakDays,
    isOptimal: percentage >= 95.0, // Clinical gold standard for viral suppression & preventing mutations
  };
}

export function getLabResults(): LabResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LABS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load labs', e);
  }
  localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(INITIAL_LAB_RESULTS));
  return INITIAL_LAB_RESULTS;
}

export function saveLabResults(labs: LabResult[]): void {
  localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(labs));
}

export function getMaternalProfile(): MaternalProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MATERNAL);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load maternal profile', e);
  }
  localStorage.setItem(STORAGE_KEYS.MATERNAL, JSON.stringify(INITIAL_MATERNAL_PROFILE));
  return INITIAL_MATERNAL_PROFILE;
}

export function saveMaternalProfile(profile: MaternalProfile): void {
  localStorage.setItem(STORAGE_KEYS.MATERNAL, JSON.stringify(profile));
}

export function getPMTCTMilestones(): PMTCTMilestone[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PMTCT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load PMTCT milestones', e);
  }
  localStorage.setItem(STORAGE_KEYS.PMTCT, JSON.stringify(ZAMBIA_PMTCT_MILESTONES));
  return ZAMBIA_PMTCT_MILESTONES;
}

export function savePMTCTMilestones(milestones: PMTCTMilestone[]): void {
  localStorage.setItem(STORAGE_KEYS.PMTCT, JSON.stringify(milestones));
}

export function getAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load appointments', e);
  }
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
  return INITIAL_APPOINTMENTS;
}

export function saveAppointments(apts: Appointment[]): void {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(apts));
}

export function getSymptoms(): SymptomLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SYMPTOMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load symptoms', e);
  }
  localStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(INITIAL_SYMPTOMS));
  return INITIAL_SYMPTOMS;
}

export function saveSymptoms(syms: SymptomLog[]): void {
  localStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(syms));
}

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  return INITIAL_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}
