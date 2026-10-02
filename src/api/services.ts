import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// ایجاد یک نمونه Axios برای تزریق خودکار هدر x-user-id
export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('user_id');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

// ۱. لاگین تلگرام
export const loginApi = async (initData: string, referralCode?: string) => {
  const res = await api.post('/auth/login', { initData, referralCode });
  if (res.data?.user?.id) {
    localStorage.setItem('user_id', res.data.user.id);
  }
  return res.data?.user;
};

// ۲. دریافت اطلاعات کامل پروفایل
export const getProfileApi = async () => {
  const res = await api.get('/users/profile');
  return res.data?.profile;
};

// ۳. دریافت آمار رفرال و لیست دعوت‌شده‌ها
export const getReferralStatsApi = async () => {
  const res = await api.get('/referral/stats');
  return res.data?.stats;
};

// ۴. دریافت شرط‌های من
export const getMyBetsApi = async () => {
  const res = await api.get('/bets/my');
  return res.data?.bets || [];
};

// ۵. ثبت شرط جدید
export const placeBetApi = async (roundId: string, option: 'HIGH' | 'LOW', amount: number) => {
  const res = await api.post('/bets', { roundId, option, amount });
  return res.data?.bet;
};