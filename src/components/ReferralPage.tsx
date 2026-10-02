import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Users, Gift, Check } from 'lucide-react';

interface ReferralPageProps {
  user: any;
}

export const ReferralPage: React.FC<ReferralPageProps> = ({ user }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode || 'YOUR_CODE';
  const referralLink = `https://t.me/CryptooPredictionBot?start=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* بنر اصلی دعوت */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-5 rounded-2xl flex flex-col gap-2">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-1">
          <Gift className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Invite Friends & Earn 5%</h2>
        <p className="text-xs text-gray-300 leading-relaxed">
          {t('referralBonusInfo')}
        </p>
      </div>

      {/* آمار دعوت‌ها */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl flex flex-col">
          <span className="text-xs text-gray-400 mb-1">Invited Friends</span>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xl font-bold text-white">{user?.referralsCount || 0}</span>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl flex flex-col">
          <span className="text-xs text-gray-400 mb-1">Total Earned</span>
          <span className="text-xl font-bold text-emerald-400">
            ${user?.referralEarnings ? parseFloat(user.referralEarnings).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>

      {/* کد و لینک دعوت */}
      <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-2xl flex flex-col gap-3">
        <div>
          <span className="text-xs text-gray-400 block mb-1">Your Referral Code</span>
          <div className="bg-[#0d1117] border border-[#21262d] py-2 px-4 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-amber-400">
            {referralCode}
          </div>
        </div>

        <div>
          <span className="text-xs text-gray-400 block mb-1">Referral Link</span>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-1 transition active:scale-95 shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : t('copy')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};