import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: "CryptoPredict",
      balance: "Balance",
      enterReferral: "Enter Referral Code",
      referralRequired: "A referral code is required to join.",
      submit: "Submit & Start",
      high: "HIGH",
      low: "LOW",
      betsCount: "Bets",
      lockWarning: "Betting locked for the last 30 seconds!",
      myReferrals: "My Referrals",
      referralLink: "Your Referral Link",
      copy: "Copy",
      totalEarned: "Total Earned from Referrals",
      referralBonusInfo: "Earn 5% from our platform fee on every bet your invited friends place!",
      history: "Bet History",
      win: "WIN",
      loss: "LOSS",
      pending: "PENDING"
    }
  },
  fa: {
    translation: {
      appName: "کریپتو پردیکت",
      balance: "موجودی",
      enterReferral: "ورود کد معرف",
      referralRequired: "ورود کد معرف برای ثبت‌نام الزامی است.",
      submit: "تایید و شروع",
      high: "صعودی (High)",
      low: "نزولی (Low)",
      betsCount: "شرط‌ها",
      lockWarning: "شرط‌بندی در ۳۰ ثانیه آخر قفل است!",
      myReferrals: "دعوت‌شده‌های من",
      referralLink: "لینک اختصاصی شما",
      copy: "کپی لینک",
      totalEarned: "مجموع درآمد از رفرال",
      referralBonusInfo: "از هر شرطی که دوستت بذاره، ۵٪ از کارمزد پلاتفرم مستقیم به تو می‌رسه!",
      history: "تاریخچه شرط‌ها",
      win: "برد",
      loss: "باخت",
      pending: "در جریان"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // زبان پیش‌فرض انگلیسی
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;