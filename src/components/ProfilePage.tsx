import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, Globe, ShieldCheck, User } from 'lucide-react';

interface ProfilePageProps {
  user: any;
  toggleLanguage: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, toggleLanguage }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* کارت پروفایل کاربر */}
      <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-bold text-xl">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">
            {user?.username || `User #${user?.telegramId || '123456'}`}
          </h2>
          <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Account
          </span>
        </div>
      </div>

      {/* اطلاعات موجودی و کیف پول */}
      <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-2xl flex flex-col gap-3">
        <span className="text-xs text-gray-400 font-medium">Wallet & Balance</span>
        <div className="flex justify-between items-center bg-[#0d1117] p-3 rounded-xl border border-[#21262d]">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-gray-300">{t('balance')}</span>
          </div>
          <span className="text-base font-extrabold text-white">
            ${user ? parseFloat(user.balance).toFixed(2) : '1000.00'} USDT
          </span>
        </div>

        <button className="w-full bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 text-blue-400 font-semibold py-2.5 rounded-xl text-xs transition">
          Connect TON Wallet
        </button>
      </div>

      {/* تنظیمات اپلیکیشن */}
      <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-2xl flex flex-col gap-3">
        <span className="text-xs text-gray-400 font-medium">Settings</span>
        <div className="flex justify-between items-center bg-[#0d1117] p-3 rounded-xl border border-[#21262d]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-200">Language</span>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 bg-[#21262d] border border-[#30363d] text-xs font-bold text-blue-400 rounded-lg hover:text-white transition"
          >
            {i18n.language === 'en' ? 'English (EN)' : 'فارسی (FA)'}
          </button>
        </div>
      </div>
    </div>
  );
};