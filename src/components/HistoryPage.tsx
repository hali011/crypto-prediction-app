import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

interface HistoryPageProps {
  bets: any[];
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ bets }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 pb-20">
      <h2 className="text-base font-bold text-white mb-1">{t('history')}</h2>

      {bets.length === 0 ? (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 text-center text-gray-400 text-sm">
          No bets placed yet.
        </div>
      ) : (
        bets.map((bet, index) => {
          const isHigh = bet.direction === 'HIGH';
          const isWin = bet.status === 'WON';
          const isPending = bet.status === 'PENDING';

          return (
            <div
              key={bet.id || index}
              className="bg-[#161b22] border border-[#30363d] p-3.5 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    isHigh
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {isHigh ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">${bet.amount} USDT</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                      isHigh ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {bet.direction}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">Round #{bet.roundId || '502'}</span>
                </div>
              </div>

              <div className="text-right">
                {isPending ? (
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 animate-spin" /> {t('pending')}
                  </span>
                ) : isWin ? (
                  <span className="text-xs font-bold text-emerald-400">
                    +${bet.payout ? parseFloat(bet.payout).toFixed(2) : (bet.amount * 1.9).toFixed(2)} {t('win')}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-400">
                    -${bet.amount} {t('loss')}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};