import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
  Plus,
  AlertCircle,
  FileCheck,
  Phone,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Appointment, ZambianHealthFacility, AppSettings, MaternalProfile } from '../types';
import { ZAMBIAN_FACILITIES } from '../data/zambiaHealthData';

interface AppointmentBookingProps {
  appointments: Appointment[];
  onAddAppointment: (apt: Omit<Appointment, 'id'>) => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  settings: AppSettings;
  maternalProfile: MaternalProfile;
  initialBookingContext?: { department: string; purpose: string } | null;
  onClearBookingContext?: () => void;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  appointments,
  onAddAppointment,
  onUpdateStatus,
  settings,
  maternalProfile,
  initialBookingContext,
  onClearBookingContext,
}) => {
  const [isBookModalOpen, setIsBookModalOpen] = useState(!!initialBookingContext);
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string>('All');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'Upcoming' | 'Completed' | 'All'>(
    'Upcoming'
  );

  // Booking Form State
  const [facilityId, setFacilityId] = useState<string>('uth-lusaka');
  const [department, setDepartment] = useState<Appointment['department']>(
    (initialBookingContext?.department as Appointment['department']) || 'Antenatal Care (ANC) & PMTCT'
  );
  const [providerName, setProviderName] = useState<string>('Duty Clinician / Midwife In-Charge');
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState<string>('08:30');
  const [purpose, setPurpose] = useState<string>(
    initialBookingContext?.purpose || '34-Week PMTCT Pre-Delivery Viral Load Check & ANC 5 Consultation'
  );
  const [userNotes, setUserNotes] = useState<string>('');

  const selectedFacility = ZAMBIAN_FACILITIES.find((f) => f.id === facilityId) || ZAMBIAN_FACILITIES[0];

  const filteredFacilities = ZAMBIAN_FACILITIES.filter((f) => {
    if (selectedProvinceFilter === 'All') return true;
    return f.province === selectedProvinceFilter;
  });

  const filteredAppointments = appointments.filter((a) => {
    if (selectedStatusTab === 'All') return true;
    return a.status === selectedStatusTab;
  });

  const upcomingCount = appointments.filter((a) => a.status === 'Upcoming').length;

  const handleCreateBooking = () => {
    // Generate tailored preparation notes based on department
    const prepNotes: string[] = [
      'Bring physical SmartCare Electronic Health Record Card',
    ];

    if (department.includes('Antenatal') || department.includes('Maternal')) {
      prepNotes.push('Bring your green Antenatal Care (ANC) Record Book');
      prepNotes.push('Take your normal morning prenatal iron with breakfast');
      prepNotes.push('Note down any fetal movement or pelvic sensations');
    } else if (department.includes('Phlebotomy') || purpose.includes('Viral Load')) {
      prepNotes.push('Drink plenty of water before arrival for smooth blood draw');
      prepNotes.push('Fasting is NOT required for viral load / CD4 tests');
    } else if (department.includes('Pharmacy')) {
      prepNotes.push('Bring current pill bottle for reconciliation');
      prepNotes.push('Ask for 3-Month or 6-Month Multi-Month Dispensing (MMD)');
    } else if (department.includes('Under-5')) {
      prepNotes.push('Bring baby Under-5 Child Health Passport Card');
      prepNotes.push('Bring baby receiving blanket and extra cloth');
    }

    onAddAppointment({
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      province: selectedFacility.province,
      department,
      providerName: providerName || 'Sister / Clinician On Duty',
      date,
      time,
      status: 'Upcoming',
      purpose,
      preparationNotes: prepNotes,
      smartCareCardRequired: true,
      userNotes,
    });

    setIsBookModalOpen(false);
    if (onClearBookingContext) onClearBookingContext();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wide uppercase">
            <span>Republic of Zambia Public Health Network</span>
            <span aria-hidden="true">·</span>
            <span>SmartCare Fast-Track Appointments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Clinic Visits &amp; Appointment Booking
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Book visits at UTH, First Level Hospitals, and District Health Centres across Zambia. Fast-track pharmacy refills and PMTCT antenatal checkups.
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book New Clinic Visit</span>
        </button>
      </div>

      {/* Appointment Status Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          {(['Upcoming', 'Completed', 'All'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatusTab(tab)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                selectedStatusTab === tab
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'Upcoming' ? `Upcoming (${upcomingCount})` : tab}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 hidden sm:block font-medium">
          Always bring your physical SmartCare Card to public health facilities.
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-semibold text-slate-900">
              No appointments found in this category
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Schedule your next ANC visit, routine viral load blood draw, or Multi-Month Dispensing (MMD) pharmacy refill.
            </p>
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="mt-2 px-3.5 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white border border-slate-200 rounded-xl p-6 transition-colors hover:border-slate-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  {/* Metadata Row */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{apt.department}</span>
                    <span aria-hidden="true">·</span>
                    <span>{apt.province} Province</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold ${
                        apt.status === 'Upcoming'
                          ? 'text-teal-800'
                          : apt.status === 'Completed'
                          ? 'text-slate-500'
                          : 'text-rose-700'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{apt.purpose}</h3>

                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">{apt.facilityName}</span>
                  </div>

                  {apt.providerName && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Attending: {apt.providerName}</span>
                    </div>
                  )}

                  {/* Preparation Checklist */}
                  {apt.preparationNotes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
                        What to Bring &amp; Preparation:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                        {apt.preparationNotes.map((note, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {apt.userNotes && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                      <span className="font-semibold text-slate-700">Personal Notes: </span>
                      {apt.userNotes}
                    </div>
                  )}
                </div>

                {/* Right: Date/Time Badge & Actions */}
                <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center min-w-[140px]">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-teal-700" />
                      <span>Date</span>
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-0.5 tabular-nums">
                      {apt.date}
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5 tabular-nums">
                      {apt.time} hrs
                    </div>
                  </div>

                  {apt.status === 'Upcoming' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateStatus(apt.id, 'Completed')}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => onUpdateStatus(apt.id, 'Cancelled')}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-700 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Zambian Health Facilities Directory Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Verified Public Health Facilities in Zambia
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Providing free Antiretroviral Therapy (ART), PMTCT Option B+, and SmartCare electronic records.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filter Province:</span>
            <select
              value={selectedProvinceFilter}
              onChange={(e) => setSelectedProvinceFilter(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded-lg bg-white text-slate-800"
            >
              <option value="All">All Provinces</option>
              <option value="Lusaka">Lusaka</option>
              <option value="Copperbelt">Copperbelt</option>
              <option value="Southern">Southern</option>
              <option value="Central">Central</option>
              <option value="Eastern">Eastern</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2 hover:border-teal-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-sm truncate">
                  {fac.name}
                </span>
              </div>
              <div className="text-slate-500">
                {fac.district} · {fac.province} Province
              </div>
              <div className="flex items-center gap-2 text-teal-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>SmartCare &amp; PMTCT Centre</span>
              </div>
              <div className="text-slate-600 text-[11px]">
                {fac.openingHours}
              </div>
              {fac.contactPhone && (
                <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[11px] pt-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <a href={`tel:${fac.contactPhone}`} className="hover:underline">
                    {fac.contactPhone}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              Schedule Clinic Visit
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select your health facility, clinic wing, and reason for visit.
            </p>

            <div className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Healthcare Facility
                </label>
                <select
                  value={facilityId}
                  onChange={(e) => setFacilityId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                >
                  {ZAMBIAN_FACILITIES.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.province})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Clinic Department / Wing
                </label>
                <select
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value as Appointment['department'])
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                >
                  <option value="Antenatal Care (ANC) & PMTCT">
                    Antenatal Care (ANC) &amp; PMTCT Wing
                  </option>
                  <option value="ART Clinic & SmartCare">
                    ART Clinic &amp; SmartCare Fast-Track
                  </option>
                  <option value="Viral Load Phlebotomy Lab">
                    Viral Load Phlebotomy / Laboratory
                  </option>
                  <option value="Pharmacy & Multi-Month Dispensing">
                    Pharmacy &amp; Multi-Month Dispensing (MMD)
                  </option>
                  <option value="Maternal & Child Health (MCH)">
                    Maternal &amp; Child Health (MCH)
                  </option>
                  <option value="Under-5 EID Clinic">
                    Under-5 Early Infant Diagnosis (EID) Clinic
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Purpose / Reason for Visit
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. 34-Week PMTCT Viral Load or 3-Month TLD Refill"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Attending Clinician / Midwife (Optional)
                </label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="e.g. Sister M. Banda"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Questions for Sister/Doctor or Personal Notes
                </label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  rows={2}
                  placeholder="Any symptoms, pill side effects, or delivery questions..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsBookModalOpen(false);
                  if (onClearBookingContext) onClearBookingContext();
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateBooking}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
