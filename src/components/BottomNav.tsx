import React from 'react';
import { TrendingUp, Users, History, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type TabType = 'trade' | 'referral' | 'history' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'referral', label: 'Friends', icon: Users },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#161b22]/95 backdrop-blur-md border-t border-[#30363d] px-4 py-2 z-40 max-w-md mx-auto">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-400 font-bold scale-105'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};