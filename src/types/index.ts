export type RegimenType = 'ART' | 'Prenatal' | 'Infant Prophylaxis' | 'Prophylaxis (PrEP/PEP)' | 'Other';

export interface Medication {
  id: string;
  name: string; // e.g., "TLD (Tenofovir / Lamivudine / Dolutegravir)"
  genericName: string;
  discreetName: string; // e.g., "Daily Multivitamin B-Complex"
  dosage: string;
  frequency: 'Once Daily' | 'Twice Daily' | 'Every 2 Months (Injectable)' | 'As Needed';
  scheduledTimes: string[]; // e.g. ["20:00"]
  category: RegimenType;
  foodRequirement: 'Take with food' | 'Take without food' | 'Take with or without food' | 'Separate from antacids/calcium/iron by 2+ hours';
  pillsRemaining: number;
  totalPillsPerRefill: number; // e.g. 90 pills (3-Month MMD in Zambia) or 180 (6-Month MMD)
  refillThreshold: number; // e.g. 14 days
  dispensingModel: '1-Month Dispensing' | '3-Month MMD (Multi-Month Dispensing)' | '6-Month MMD' | 'Community ART Group (CAG)';
  notes?: string;
  isMaternalSpecific?: boolean;
}

export interface DoseLog {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  status: 'taken_on_time' | 'taken_late' | 'skipped' | 'pending';
  actualTakenTime?: string;
  skippedReason?: 'Nausea / vomiting' | 'Forgot / busy' | 'Travel / away from home' | 'Pills ran out' | 'Side effects' | 'Stigma / privacy concern' | 'Other';
  date: string; // YYYY-MM-DD
}

export interface LabResult {
  id: string;
  date: string; // YYYY-MM-DD
  cd4Count: number; // cells/mm3 (normal > 500)
  cd4Percent?: number;
  viralLoad: number; // copies/mL (undetectable < 50 or TLD target < 20 copies)
  isUndetectable: boolean;
  hemoglobin?: number; // g/dL (normal > 11.0; vital for pregnant women to screen anemia)
  weightKg?: number;
  smartCareFileId?: string; // Zambia national SmartCare EHR identifier
  facilityName: string; // e.g., "University Teaching Hospital (UTH), Lusaka"
  notes?: string;
}

export interface MaternalProfile {
  isPregnant: boolean;
  isBreastfeeding: boolean;
  dueDate?: string; // YYYY-MM-DD
  currentWeek?: number; // 1 - 42
  gravidaPara?: string; // e.g., "G2 P1"
  assignedClinic: string; // e.g., "UTH Women & Newborn Hospital"
  assignedMidwifeOrDoctor?: string;
  smartCareNumber?: string;
  infantFeedingChoice: 'Exclusive Breastfeeding (EBF) with maternal viral suppression' | 'Safe Exclusive Formula Feeding';
  infantBirthDate?: string;
  infantName?: string;
  infantProphylaxisPlan: 'Nevirapine (NVP) syrup 6 weeks' | 'Enhanced NVP + AZT (High risk)' | 'Completed';
  cotrimoxazoleInitiated: boolean; // Septrin prophylaxis at 6 weeks
  pmtctStage: '1st Trimester' | '2nd Trimester' | '3rd Trimester' | 'Labor & Delivery' | 'Postpartum & Infant Care';
}

export interface PMTCTMilestone {
  id: string;
  title: string;
  weekRange: string;
  trimester: '1st Trimester' | '2nd Trimester' | '3rd Trimester' | 'Postpartum';
  description: string;
  clinicalSignificance: string;
  isCompleted: boolean;
  completedDate?: string;
  category: 'Lab Test' | 'ANC Visit' | 'Infant Care' | 'Medication Review' | 'Nutrition';
  zambiaGuidelineRef: string;
}

export interface ZambianHealthFacility {
  id: string;
  name: string;
  province: 'Lusaka' | 'Copperbelt' | 'Southern' | 'Central' | 'Eastern' | 'Western' | 'Northern' | 'Luapula' | 'North-Western' | 'Muchinga';
  district: string;
  type: 'University Teaching Hospital' | 'General Hospital' | 'First Level Hospital' | 'Urban Health Centre' | 'Rural Health Centre';
  hasPMTCTServices: boolean;
  hasSmartCare: boolean;
  contactPhone?: string;
  openingHours: string;
}

export interface Appointment {
  id: string;
  facilityId: string;
  facilityName: string;
  province: string;
  department: 'ART Clinic & SmartCare' | 'Antenatal Care (ANC) & PMTCT' | 'Maternal & Child Health (MCH)' | 'Viral Load Phlebotomy Lab' | 'Pharmacy & Multi-Month Dispensing' | 'Under-5 EID Clinic';
  providerName?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'Upcoming' | 'Completed' | 'Rescheduled' | 'Cancelled';
  purpose: string;
  preparationNotes: string[];
  smartCareCardRequired: boolean;
  userNotes?: string;
}

export interface SymptomLog {
  id: string;
  date: string; // YYYY-MM-DD
  overallWellness: 1 | 2 | 3 | 4 | 5; // 1-5 scale
  symptoms: string[];
  notes?: string;
  sharedWithDoctor?: boolean;
}

export interface AppSettings {
  isDiscreetMode: boolean; // Camouflages HIV diagnosis and sensitive medication labels
  isPinLocked: boolean;
  pinCode?: string;
  enableNotifications: boolean;
  preferredLanguage: 'English' | 'Bemba' | 'Nyanja' | 'Tonga';
  userName: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}
