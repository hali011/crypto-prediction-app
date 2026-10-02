import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { io } from 'socket.io-client';
import './i18n';

// Components & Pages
import { PriceChart } from './components/PriceChart';
import { BottomNav, type TabType } from './components/BottomNav';
import { ReferralModal } from './components/ReferralModal';
import { ReferralPage } from './components/ReferralPage';
import { HistoryPage } from './components/HistoryPage';
import { ProfilePage } from './components/ProfilePage';
import {getProfileApi, getMyBetsApi, getReferralStatsApi} from './api/services';
import { Wallet, Globe, ArrowUpRight, ArrowDownRight, Lock } from 'lucide-react';

import type { fromTheme } from 'tailwind-merge';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

export default function App() {
  const { t, i18n } = useTranslation();
  
  // وضعیت‌های اپلیکیشن
  const [activeTab, setActiveTab] = useState<TabType>('trade');
  const [user, setUser] = useState<any>(null);
  const [showRefModal, setShowRefModal] = useState(false);
  const [refError, setRefError] = useState('');

  // وضعیت‌های ترید
  const [price, setPrice] = useState<number>(65000);
  const [amount, setAmount] = useState<string>('10');
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [poolHigh, setPoolHigh] = useState<number>(1200);
  const [poolLow, setPoolLow] = useState<number>(800);

  // لیست شرط‌ها
  const [userBets, setUserBets] = useState<any[]>([]);


  // تابع بارگذاری کل اطلاعات کاربر از بک‌اند
const loadUserData = async () => {
  try {
    const profile = await getProfileApi();
    if (profile) setUser(profile);

    const bets = await getMyBetsApi();
    setUserBets(bets);

    const refStats = await getReferralStatsApi();
    if (refStats && profile) {
      setUser((prev: any) => ({
        ...prev,
        referralCode: refStats.referralCode,
        referralLink: refStats.referralLink,
        referralsCount: refStats.totalReferralsCount,
        referralEarnings: refStats.totalEarned,
      }));
    }

    console.log(bets);
    console.log(refStats);
  } catch (err) {
    console.error("Error loading user data from backend:", err);
  }
};

// فراخوانی موقع لاگین اولیه و تغییر تب‌ها
useEffect(() => {
    loadUserData();
}, [activeTab]);


  // لاگین اولیه با Telegram InitData
  const handleLogin = async (referralCodeInput?: string) => {
    try {
      const tgInitData = (window as any).Telegram?.WebApp?.initData || 'demo_data';
      
      const res = await axios.post(`${API_URL}/auth/login`, {
        initData: tgInitData,
        referralCode: referralCodeInput
      });

      setUser(res.data.user);
      setShowRefModal(false);
    } catch (err: any) {
      if (err.response?.data?.error === 'REFERRAL_CODE_REQUIRED' || err.response?.data?.error === 'INVALID_REFERRAL_CODE') {
        setShowRefModal(true);
        setRefError(err.response?.data?.message || 'Referral code required');
      }
    }
  };

  // اتصال به وب‌سوکت بک‌اند برای دریافت قیمت زنده و وضعیت Round
  useEffect(() => {
    handleLogin();

    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.on('price_update', (data: { price: number }) => {
      if (data?.price) setPrice(data.price);
    });

    socket.on('round_update', (data: { timeLeft: number; isLocked: boolean; poolHigh: number; poolLow: number }) => {
      setTimeLeft(data.timeLeft);
      setIsLocked(data.isLocked);
      setPoolHigh(data.poolHigh);
      setPoolLow(data.poolLow);
    });

    // تایمر زنده (جهت روانی چارت حتی در نبود وب‌سوکت)
    const interval = setInterval(() => {
      setPrice(prev => parseFloat((prev + (Math.random() - 0.49) * 2.5).toFixed(2)));
      setTimeLeft(prev => {
        if (prev <= 1) return 300;
        if (prev <= 30) setIsLocked(true);
        else setIsLocked(false);
        return prev - 1;
      });
    }, 1000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(nextLang);
    document.dir = nextLang === 'fa' ? 'rtl' : 'ltr';
  };

  // ثبت شرط‌بندی جدید
  const handlePlaceBet = async (direction: 'HIGH' | 'LOW') => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    try {
      const betAmount = parseFloat(amount);
      const res = await axios.post(`${API_URL}/bets`, {
        userId: user?.id || 'demo_user',
        amount: betAmount,
        direction
      });

      // اضافه کردن به لیست شرط‌های فرانت
      const newBet = res.data?.bet || {
        id: Date.now().toString(),
        amount: betAmount,
        direction,
        status: 'PENDING',
        roundId: '502'
      };

      setUserBets(prev => [newBet, ...prev]);
      if (user) {
        setUser({ ...user, balance: (parseFloat(user.balance) - betAmount).toString() });
      }
    } catch (err: any) {
      console.log('Betting error:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 flex flex-col justify-between max-w-md mx-auto p-4 relative font-sans selection:bg-blue-500">
      
      {/* 1. Header (ثابت بالای صفحه) */}
      <header className="flex justify-between items-center bg-[#161b22] border border-[#30363d] p-3 rounded-2xl mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-xl flex items-center justify-center font-bold">
            ₿
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none text-white">{t('appName')}</h1>
            <span className="text-[11px] text-gray-400">BTC/USDT 5m</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleLanguage} 
            className="px-2.5 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs font-semibold flex items-center gap-1 hover:text-white transition"
          >
            <Globe className="w-3.5 h-3.5" />
            {i18n.language.toUpperCase()}
          </button>
          <div className="bg-[#0d1117] px-3 py-1.5 rounded-xl border border-[#30363d] flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Wallet className="w-3.5 h-3.5 text-blue-400" />
            ${user ? parseFloat(user.balance).toFixed(2) : '1000.00'}
          </div>
        </div>
      </header>

      {/* 2. dynamic content based on active tab */}
      <main className="flex-1">
        {activeTab === 'trade' && (
          <div className="flex flex-col gap-4 pb-20">
            {/* کارت قیمت و تایمر */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-2xl">
                <span className="text-xs text-gray-400 block mb-1">Live Price</span>
                <span className="text-lg font-extrabold text-blue-400">${price.toFixed(2)}</span>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-2xl text-right">
                <span className="text-xs text-gray-400 block mb-1">Next Round In</span>
                <span className={`text-lg font-extrabold ${isLocked ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* چارت قیمت */}
            <div className="bg-[#161b22] border border-[#30363d] p-2 rounded-2xl overflow-hidden">
              <PriceChart currentPrice={price} />
            </div>

            {/* وضعیت Pool */}
            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-2xl flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-400">HIGH Pool: ${poolHigh}</span>
                <span className="text-rose-400">LOW Pool: ${poolLow}</span>
              </div>
              <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden flex">
                <div style={{ width: `${(poolHigh / (poolHigh + poolLow)) * 100}%` }} className="bg-emerald-500 h-full transition-all duration-300" />
                <div style={{ width: `${(poolLow / (poolHigh + poolLow)) * 100}%` }} className="bg-rose-500 h-full transition-all duration-300" />
              </div>
            </div>

            {/* اینپوت مبلغ و دکمه‌های شرط‌بندی */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isLocked}
                  placeholder="Bet Amount ($)"
                  className="w-full bg-[#161b22] border border-[#30363d] focus:border-blue-500 rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none disabled:opacity-50 transition"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-400">USDT</span>
              </div>

              {isLocked ? (
                <div className="bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl flex items-center justify-center gap-2 text-rose-400 text-xs font-bold">
                  <Lock className="w-4 h-4" />
                  {t('lockWarning')}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handlePlaceBet('HIGH')}
                    className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 transition"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                    {t('high')}
                  </button>
                  <button 
                    onClick={() => handlePlaceBet('LOW')}
                    className="bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-950/30 transition"
                  >
                    <ArrowDownRight className="w-5 h-5" />
                    {t('low')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'referral' && <ReferralPage user={user} />}
        {activeTab === 'history' && <HistoryPage bets={userBets} />}
        {activeTab === 'profile' && <ProfilePage user={user} toggleLanguage={toggleLanguage} />}
      </main>

      {/* 3. منوی ثابت پایین (Bottom Navigation) */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 4. مودال دریافت کد معرف */}
      <ReferralModal
        isOpen={showRefModal}
        onSubmit={(code) => handleLogin(code)}
        error={refError}
      />
    </div>
  );
}