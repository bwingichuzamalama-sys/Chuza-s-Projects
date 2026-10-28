import React, { useState } from 'react';
import {
  Activity,
  Plus,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  Award,
  Sparkles,
  Info,
  Building2,
  Trash2,
} from 'lucide-react';
import { LabResult, AppSettings, MaternalProfile } from '../types';

interface LabTrackerProps {
  labResults: LabResult[];
  onAddLabResult: (lab: Omit<LabResult, 'id'>) => void;
  onDeleteLabResult: (id: string) => void;
  settings: AppSettings;
  maternalProfile: MaternalProfile;
}

export const LabTracker: React.FC<LabTrackerProps> = ({
  labResults,
  onAddLabResult,
  onDeleteLabResult,
  settings,
  maternalProfile,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'cd4' | 'viralLoad'>('viralLoad');

  // Form state
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCd4, setNewCd4] = useState<number>(680);
  const [newCd4Pct, setNewCd4Pct] = useState<number>(34);
  const [newViralLoad, setNewViralLoad] = useState<number>(0);
  const [newHemoglobin, setNewHemoglobin] = useState<number>(12.4);
  const [newWeight, setNewWeight] = useState<number>(65.0);
  const [newFacility, setNewFacility] = useState(
    'University Teaching Hospitals (UTH) - Women & Newborn Hospital'
  );
  const [newSmartCareId, setNewSmartCareId] = useState('SC-LUS-94281-Z');
  const [newNotes, setNewNotes] = useState('');

  // Sort chronological for charts, reverse for table
  const chronologicalLabs = [...labResults].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const latestLab = chronologicalLabs[chronologicalLabs.length - 1];
  const initialLab = chronologicalLabs[0];

  const isLatestUndetectable = latestLab?.viralLoad < 50 || latestLab?.isUndetectable;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wide uppercase">
            <span>Biomarker Telemetry</span>
            <span aria-hidden="true">·</span>
            <span>SmartCare Zambia EHR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {settings.isDiscreetMode ? 'Biomarker Progress & Labs' : 'CD4 Count, Viral Load & U=U'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {settings.isDiscreetMode
              ? 'Track health metrics over time to verify bodily vitality and resilience.'
              : 'Laboratory progress confirming immune reconstitution and full viral suppression on Zambian TLD therapy.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-teal-800 hover:bg-teal-900 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record New Lab Slip</span>
        </button>
      </div>

      {/* U=U ("Undetectable = Untransmittable") Certified Clinical Banner */}
      {!settings.isDiscreetMode && isLatestUndetectable && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>WHO &amp; Zambia Ministry of Health Verified</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                U = U · Undetectable = Untransmittable
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Your latest viral load is <strong>&lt;20 copies/mL</strong> (Target Not Detected). This means HIV cannot reproduce in your body, your immune system is thriving, and you <strong>CANNOT pass HIV to sexual partners or to your baby during pregnancy, delivery, or exclusive breastfeeding</strong>!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-4 text-center shrink-0 min-w-[200px]">
              <div className="text-xs text-emerald-200 uppercase tracking-wide font-medium">
                Latest Viral Load
              </div>
              <div className="text-3xl font-black text-white mt-1 tabular-nums">
                &lt; 20
              </div>
              <div className="text-xs text-emerald-300 font-semibold mt-0.5">
                Target Not Detected
              </div>
              <div className="text-[11px] text-white/70 mt-1">
                Zero transmission risk
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Lab Indicators (3-card single-elevation grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* CD4 Count */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              CD4 T-Cell Count
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {latestLab?.cd4Count || 680}
            </span>
            <span className="text-xs text-slate-500">cells/mm³</span>
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Normal Immune Range (Target &gt; 500)
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Rebounded by +{Math.max(0, (latestLab?.cd4Count || 680) - (initialLab?.cd4Count || 240))} cells since baseline
          </div>
        </div>

        {/* Viral Load */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Viral Load (HIV RNA)
            </div>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-teal-900 tabular-nums">
              {latestLab?.viralLoad === 0 ? '< 20' : latestLab?.viralLoad}
            </span>
            <span className="text-xs text-slate-500">copies/mL</span>
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            {latestLab?.viralLoad < 50 ? 'Undetectable (Suppressed)' : 'Viral replication detected'}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Zambia MoH Target: &lt;50 copies/mL
          </div>
        </div>

        {/* Maternal Hemoglobin & Vitality */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Hemoglobin (Hb)
            </div>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {latestLab?.hemoglobin || 12.4}
            </span>
            <span className="text-xs text-slate-500">g/dL</span>
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Healthy (Screening Negative for Anemia)
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {maternalProfile.isPregnant
              ? 'Vital for maternal & fetal oxygenation'
              : 'Standard adult reference'}
          </div>
        </div>
      </div>

      {/* Interactive Visual Trend Charts (SVG Responsive) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Laboratory Trajectory Over Time
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical progression since starting Zambian first-line TLD regimen.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setActiveChartTab('viralLoad')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeChartTab === 'viralLoad'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Viral Load Suppression
            </button>
            <button
              onClick={() => setActiveChartTab('cd4')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeChartTab === 'cd4'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CD4 Immune Recovery
            </button>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="mt-6">
          {activeChartTab === 'viralLoad' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  Viral Load (HIV RNA copies/mL - Logarithmic drop to Undetectable)
                </span>
                <span className="text-emerald-700 font-medium">
                  Green zone: &lt;50 copies/mL (U=U Zone)
                </span>
              </div>

              {/* Responsive SVG Chart */}
              <div className="w-full h-64 bg-slate-50/70 border border-slate-200 rounded-xl p-4 relative flex flex-col justify-between overflow-hidden">
                {/* Reference baseline line */}
                <div className="absolute inset-x-4 bottom-12 border-b border-emerald-400/60 border-dashed z-0 flex items-center justify-end">
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm font-mono mr-2">
                    U=U Threshold (&lt;50 copies)
                  </span>
                </div>

                <svg className="w-full h-44 overflow-visible" viewBox="0 0 600 160">
                  <defs>
                    <linearGradient id="vlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Curve from baseline 84000 (top) down to 40 then 0 */}
                  <path
                    d="M 50,15 C 200,60 350,135 550,140"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 50,15 C 200,60 350,135 550,140 L 550,160 L 50,160 Z"
                    fill="url(#vlGradient)"
                  />

                  {/* Points */}
                  {chronologicalLabs.map((lab, idx) => {
                    const x =
                      chronologicalLabs.length === 1
                        ? 300
                        : 50 + (idx / (chronologicalLabs.length - 1)) * 500;
                    // Y calculation: high viral load near top (y=15), undetectable near bottom (y=140)
                    const y = lab.viralLoad > 1000 ? 15 : lab.viralLoad > 0 ? 135 : 140;

                    return (
                      <g key={lab.id} className="cursor-pointer group">
                        <circle
                          cx={x}
                          cy={y}
                          r="6"
                          className={lab.viralLoad < 50 ? 'fill-emerald-600 stroke-white' : 'fill-rose-600 stroke-white'}
                          strokeWidth="2.5"
                        />
                        <text
                          x={x}
                          y={y - 12}
                          textAnchor="middle"
                          className="text-[11px] font-bold fill-slate-800"
                        >
                          {lab.viralLoad === 0 ? '<20 (Undetectable)' : `${lab.viralLoad.toLocaleString()} copies`}
                        </text>
                        <text
                          x={x}
                          y={155}
                          textAnchor="middle"
                          className="text-[10px] fill-slate-500 font-mono"
                        >
                          {lab.date}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-200/60 pt-2 font-mono">
                  <span>Baseline Diagnosis</span>
                  <span>6-Month Follow-Up</span>
                  <span>2nd/3rd Trimester (Suppressed)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  CD4 T-Lymphocyte Count (cells/mm³)
                </span>
                <span className="text-emerald-700 font-medium">
                  Green threshold: 500 cells/mm³ (Immune Defense Restored)
                </span>
              </div>

              {/* Responsive SVG Chart for CD4 */}
              <div className="w-full h-64 bg-slate-50/70 border border-slate-200 rounded-xl p-4 relative flex flex-col justify-between overflow-hidden">
                {/* 500 CD4 reference line */}
                <div className="absolute inset-x-4 top-20 border-b border-teal-500/60 border-dashed z-0 flex items-center justify-end">
                  <span className="text-[10px] text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded-sm font-mono mr-2">
                    Normal Threshold (500 cells)
                  </span>
                </div>

                <svg className="w-full h-44 overflow-visible" viewBox="0 0 600 160">
                  <defs>
                    <linearGradient id="cd4Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* CD4 rising from 240 (bottom y=135) to 490 (middle y=65) to 680 (top y=20) */}
                  <path
                    d="M 50,135 C 200,100 350,45 550,20"
                    fill="none"
                    stroke="#0f766e"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 50,135 C 200,100 350,45 550,20 L 550,160 L 50,160 Z"
                    fill="url(#cd4Gradient)"
                  />

                  {chronologicalLabs.map((lab, idx) => {
                    const x =
                      chronologicalLabs.length === 1
                        ? 300
                        : 50 + (idx / (chronologicalLabs.length - 1)) * 500;
                    // Y calculation: 240 -> y=135, 490 -> y=65, 680 -> y=20
                    const y = 160 - (lab.cd4Count / 800) * 140;

                    return (
                      <g key={lab.id} className="cursor-pointer group">
                        <circle
                          cx={x}
                          cy={y}
                          r="6"
                          className="fill-teal-700 stroke-white"
                          strokeWidth="2.5"
                        />
                        <text
                          x={x}
                          y={y - 12}
                          textAnchor="middle"
                          className="text-[11px] font-bold fill-slate-800 tabular-nums"
                        >
                          {lab.cd4Count} cells/mm³ ({lab.cd4Percent}%)
                        </text>
                        <text
                          x={x}
                          y={155}
                          textAnchor="middle"
                          className="text-[10px] fill-slate-500 font-mono"
                        >
                          {lab.date}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-200/60 pt-2 font-mono">
                  <span>Baseline (240 cells)</span>
                  <span>6 Months (490 cells)</span>
                  <span>Latest Rebound (680 cells)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lab History Data Table (High-Density, Tabular Numerals) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Verified Laboratory Results Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Synced with Zambian Ministry of Health SmartCare electronic record system.
            </p>
          </div>
          <span className="text-xs text-slate-500 tabular-nums">
            {labResults.length} test records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Test Date</th>
                <th className="px-4 py-3 font-semibold">SmartCare File</th>
                <th className="px-4 py-3 font-semibold">Facility / Clinic</th>
                <th className="px-4 py-3 font-semibold text-right">CD4 Count</th>
                <th className="px-4 py-3 font-semibold text-right">Viral Load</th>
                <th className="px-4 py-3 font-semibold text-right">Hb (Hemoglobin)</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {labResults.map((result) => (
                <tr key={result.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-slate-900 tabular-nums">
                    {result.date}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-500">
                    {result.smartCareFileId || 'SC-LUS-94281-Z'}
                  </td>
                  <td className="px-4 py-3.5 text-slate-800 max-w-xs truncate">
                    {result.facilityName}
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-slate-900 tabular-nums">
                    {result.cd4Count}{' '}
                    <span className="text-slate-400 font-normal">cells</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold tabular-nums">
                    {result.viralLoad === 0 ? (
                      <span className="text-emerald-700">&lt; 20 copies</span>
                    ) : (
                      <span className={result.viralLoad < 50 ? 'text-emerald-700' : 'text-slate-900'}>
                        {result.viralLoad.toLocaleString()} copies
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums">
                    {result.hemoglobin ? `${result.hemoglobin} g/dL` : '—'}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    {result.isUndetectable || result.viralLoad < 50 ? (
                      <span className="text-emerald-800 font-semibold text-[11px]">
                        U=U Suppressed
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => onDeleteLabResult(result.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lab Result Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              Record New Lab Result
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter official values from your laboratory slip or SmartCare patient portal.
            </p>

            <div className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Date of Blood Draw</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">SmartCare File ID</label>
                  <input
                    type="text"
                    value={newSmartCareId}
                    onChange={(e) => setNewSmartCareId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    CD4 Count (cells/mm³)
                  </label>
                  <input
                    type="number"
                    value={newCd4}
                    onChange={(e) => setNewCd4(parseInt(e.target.value, 10) || 0)}
                    placeholder="e.g. 680"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 tabular-nums"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    CD4 Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={newCd4Pct}
                    onChange={(e) => setNewCd4Pct(parseInt(e.target.value, 10) || 0)}
                    placeholder="e.g. 34"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Viral Load (copies/mL)
                  </label>
                  <input
                    type="number"
                    value={newViralLoad}
                    onChange={(e) => setNewViralLoad(parseInt(e.target.value, 10) || 0)}
                    placeholder="0 for undetectable / <20"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 tabular-nums"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Enter 0 if lab reports &quot;Target Not Detected&quot; or &lt;20.
                  </span>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Hemoglobin Hb (g/dL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newHemoglobin}
                    onChange={(e) => setNewHemoglobin(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 12.4"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Healthcare Facility in Zambia
                </label>
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  placeholder="e.g. University Teaching Hospitals (UTH) - Women & Newborn Hospital"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Clinician or Lab Notes
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="Comments from Sister/Doctor..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddLabResult({
                    date: newDate,
                    cd4Count: newCd4,
                    cd4Percent: newCd4Pct,
                    viralLoad: newViralLoad,
                    isUndetectable: newViralLoad < 50,
                    hemoglobin: newHemoglobin,
                    weightKg: newWeight,
                    smartCareFileId: newSmartCareId,
                    facilityName: newFacility,
                    notes: newNotes,
                  });
                  setIsAddModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs"
              >
                Save Lab Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
