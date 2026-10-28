import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldCheck,
  Heart,
  BookOpen,
  Sparkles,
  HelpCircle,
  FileDown,
  Printer,
  ChevronDown,
  ChevronUp,
  Apple,
  ExternalLink,
  Users,
} from 'lucide-react';
import { AppSettings, MaternalProfile, Medication, LabResult, Appointment } from '../types';
import { ZAMBIA_HELPLINES } from '../data/zambiaHealthData';

interface GuidanceAndSupportProps {
  settings: AppSettings;
  maternalProfile: MaternalProfile;
  medications: Medication[];
  labResults: LabResult[];
  appointments: Appointment[];
  adherenceRate: number;
}

export const GuidanceAndSupport: React.FC<GuidanceAndSupportProps> = ({
  settings,
  maternalProfile,
  medications,
  labResults,
  appointments,
  adherenceRate,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const faqs = [
    {
      q: 'Why is TLD the preferred first-line regimen across Zambia?',
      a: 'TLD (Tenofovir Disoproxil 300mg + Lamivudine 300mg + Dolutegravir 50mg) combines three potent antiretrovirals into a single small tablet taken once daily. Dolutegravir has a very high genetic barrier to resistance, meaning the virus finds it almost impossible to mutate against it even if an occasional dose is delayed. It also suppresses viral load much faster than older efavirenz-based combinations.',
    },
    {
      q: 'What should I do if I forgot or missed my evening TLD dose?',
      a: 'If you usually take TLD at 20:00 and remember the same night or next morning within 12 hours, take it immediately! If it has been more than 12 hours (e.g. it is already afternoon the next day), skip the missed tablet and take your regular dose at 20:00. NEVER take two tablets at once to make up for a missed dose.',
    },
    {
      q: 'Why must pregnant women separate Prenatal Iron/Calcium from TLD?',
      a: 'Dolutegravir belongs to a class called integrase strand transfer inhibitors (INSTIs). Polyvalent cations (like iron, calcium, magnesium, aluminum in antacids) chemically bind to dolutegravir in the stomach, forming an unabsorbable compound that passes straight through without entering your bloodstream. By taking Iron in the morning (08:00) and TLD in the evening (20:00), you avoid this interaction completely.',
    },
    {
      q: 'Is it really safe to exclusively breastfeed my baby in Zambia?',
      a: 'YES, absolutely! The Republic of Zambia Ministry of Health guidelines strongly recommend exclusive breastfeeding for the first 6 months when the mother is virally suppressed on TLD. Breast milk provides vital antibodies against severe pneumonia and diarrhea. When your viral load is undetectable (<50 or <20 copies/mL), HIV is NOT transmitted through breast milk. However, avoid mixed feeding (giving porridge, cow milk, or water before 6 months) as that damages the infant intestinal barrier.',
    },
    {
      q: 'What is Multi-Month Dispensing (MMD) in Zambia?',
      a: 'Multi-Month Dispensing (MMD) is a Ministry of Health policy designed to make life easier for stable clients. Instead of traveling to the clinic every month, your pharmacist will dispense 3 months (90 tablets) or 6 months (180 tablets) of ART at once. This saves you transport money, clinic waiting time, and ensures you always have supply at home.',
    },
  ];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wide uppercase">
            <span>Republic of Zambia Support Network</span>
            <span aria-hidden="true">·</span>
            <span>24/7 Free Helplines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Clinical Guidance &amp; Emergency Helplines
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            National hotlines, clinical advice for Zambian patients, local nutrition, and exportable medical summary.
          </p>
        </div>

        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Generate Clinical Summary Slip</span>
        </button>
      </div>

      {/* Zambia National Toll-Free Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ZAMBIA_HELPLINES.map((helpline, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-3 hover:border-teal-600 transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-sm">
                  {helpline.badge}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {helpline.available}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{helpline.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {helpline.description}
              </p>
            </div>

            <a
              href={`tel:${helpline.number.split('/')[0].trim()}`}
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-lg transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Toll-Free {helpline.number}</span>
            </a>
          </div>
        ))}
      </div>

      {/* Zambian Local Nutrition for High CD4 & Healthy Pregnancy */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wide">
          <Apple className="w-4 h-4 text-teal-600" />
          <span>Local Zambian Nutrition Guide</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          Nourishing Your Immune System with Zambian Superfoods
        </h2>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          Good nutrition strengthens your gut barrier, accelerates CD4 lymphocyte rebuilding, and fuels healthy fetal birth weight. Incorporate these affordable, nutrient-dense local foods daily:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-2">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <span className="font-bold text-slate-900 block text-sm">
              Kapenta (Dried or Fresh Lake Fish)
            </span>
            <p className="text-slate-600 leading-relaxed">
              Rich in complete proteins, omega-3 fatty acids, and calcium from small edible bones. Supports baby brain growth and maternal bone strength.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <span className="font-bold text-slate-900 block text-sm">
              Chibwabwa &amp; Kalembula (Leafy Greens)
            </span>
            <p className="text-slate-600 leading-relaxed">
              Pumpkin leaves and sweet potato greens packed with dietary iron, folate, and vitamin A. Cook with crushed groundnuts (nshawa) to enhance nutrient absorption.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <span className="font-bold text-slate-900 block text-sm">
              Groundnuts (Nshawa) &amp; Beans (Nyemba)
            </span>
            <p className="text-slate-600 leading-relaxed">
              Provides plant protein, essential zinc, and healthy fats. Vital for sustaining weight gain during pregnancy and maintaining steady energy.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Clinical Questions Accordion */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wide">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>Clinical Education &amp; FAQ</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          Answers to Common Questions on HIV &amp; PMTCT in Zambia
        </h2>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm hover:text-teal-800"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-600 leading-relaxed mt-2.5 pt-2 border-t border-slate-50">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Summary Modal for Doctor / Midwife Visit */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
            {/* Printable Slip Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  Republic of Zambia · Patient Health Summary
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Bumi Clinical Passport Slip
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Generated {new Date().toLocaleDateString()} for Clinical Consultation
                </div>
              </div>

              <div className="text-right text-xs font-mono text-slate-700">
                <div>SmartCare: SC-LUS-94281-Z</div>
                <div>Patient: {settings.userName || 'Thandiwe'}</div>
              </div>
            </div>

            {/* Maternal Status if pregnant */}
            {maternalProfile.isPregnant && (
              <div className="my-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                <span className="font-bold text-rose-900 uppercase tracking-wide">
                  Maternal PMTCT Active Status:
                </span>
                <div className="text-slate-800">
                  Gestational Age: <strong>Week {maternalProfile.currentWeek || 33}</strong> · EDD: <strong>{maternalProfile.dueDate}</strong> · Facility: <strong>{maternalProfile.assignedClinic}</strong>
                </div>
                <div className="text-slate-600">
                  Infant Feeding Plan: {maternalProfile.infantFeedingChoice}
                </div>
              </div>
            )}

            {/* Key Biomarkers */}
            <div className="my-4 grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                <span className="text-slate-500 block">30-Day Adherence</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {adherenceRate}%
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Optimal Suppressed</span>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                <span className="text-slate-500 block">Latest CD4 Count</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {labResults[0]?.cd4Count || 680} cells
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Normal Range (&gt;500)
                </span>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                <span className="text-slate-500 block">Latest Viral Load</span>
                <span className="text-xl font-bold text-teal-900 tabular-nums">
                  &lt;20 copies
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">
                  U=U Suppressed
                </span>
              </div>
            </div>

            {/* Active Prescriptions Table */}
            <div className="my-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Current Active Medications &amp; Dispensing
              </h4>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-2 font-semibold">Medication</th>
                    <th className="p-2 font-semibold">Dosage / Time</th>
                    <th className="p-2 font-semibold">Dispensing Model</th>
                    <th className="p-2 font-semibold text-right">Pills Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {medications.map((m) => (
                    <tr key={m.id}>
                      <td className="p-2 font-medium">{m.name}</td>
                      <td className="p-2">{m.dosage} @ {m.scheduledTimes.join(', ')}</td>
                      <td className="p-2">{m.dispensingModel}</td>
                      <td className="p-2 text-right font-mono tabular-nums">{m.pillsRemaining}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrintReport}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
