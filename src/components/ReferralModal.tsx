import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ReferralModalProps {
  isOpen: boolean;
  onSubmit: (code: string) => void;
  error?: string;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onSubmit, error }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-2 text-white">{t('enterReferral')}</h2>
        <p className="text-sm text-gray-400 mb-6">{t('referralRequired')}</p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. A1B2C3"
          className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 text-center text-lg uppercase tracking-widest text-white mb-4 focus:outline-none focus:border-brand-accent"
        />

        {error && <p className="text-brand-red text-xs mb-4">{error}</p>}

        <button
          onClick={() => onSubmit(code)}
          disabled={!code.trim()}
          className="w-full bg-brand-accent hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
        >
          {t('submit')}
        </button>
      </div>
    </div>
  );
};