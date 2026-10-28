import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, KeyRound } from 'lucide-react';
import { AppSettings } from '../types';

interface PinSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

export const PinSecurityModal: React.FC<PinSecurityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mode, setMode] = useState<'status' | 'set_new'>('status');

  if (!isOpen) return null;

  const handleEnablePin = () => {
    if (pinInput.length !== 4) {
      setErrorMsg('PIN must be exactly 4 digits');
      return;
    }
    if (pinInput !== confirmPinInput) {
      setErrorMsg('PIN codes do not match');
      return;
    }
    onUpdateSettings({
      ...settings,
      isPinLocked: true,
      pinCode: pinInput,
    });
    setPinInput('');
    setConfirmPinInput('');
    setErrorMsg('');
    setMode('status');
  };

  const handleDisablePin = () => {
    onUpdateSettings({
      ...settings,
      isPinLocked: false,
      pinCode: '',
    });
    setMode('status');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
          <KeyRound className="w-4 h-4" />
          <span>Patient Privacy &amp; Screen Lock</span>
        </div>
        <h3 className="text-base font-bold text-slate-900 mt-1">
          App Security Settings
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Lock this app with a 4-digit PIN to prevent anyone glancing at your medical data when sharing your device.
        </p>

        {mode === 'status' ? (
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <span className="font-semibold text-slate-800 block">
                Current PIN Lock Status:
              </span>
              <span className={settings.isPinLocked ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                {settings.isPinLocked ? 'PIN Lock Enabled' : 'PIN Lock Disabled (Open Access)'}
              </span>
            </div>

            {settings.isPinLocked ? (
              <button
                type="button"
                onClick={handleDisablePin}
                className="w-full py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
              >
                Disable PIN Lock
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('set_new')}
                className="w-full py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs transition-colors"
              >
                Set 4-Digit Security PIN
              </button>
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-xs">
            {errorMsg && (
              <div className="p-2 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Enter 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full px-3 py-2 text-center text-lg tracking-widest font-mono border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Confirm 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={confirmPinInput}
                onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full px-3 py-2 text-center text-lg tracking-widest font-mono border border-slate-300 rounded-lg"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setMode('status')}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleEnablePin}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg"
              >
                Activate Lock
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
