import React, { useEffect, useRef } from 'react';
import { 
  createChart, 
  AreaSeries, 
  type IChartApi, 
  type ISeriesApi 
} from 'lightweight-charts';

interface PriceChartProps {
  currentPrice: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ currentPrice }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  // مشخص کردن دقیق تایپ سریز برای جلوگیری از ارور ISeriesApi
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // ۱. ساخت چارت طبق IChartApi
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: '#161b22' }, textColor: '#8b949e' },
      grid: { vertLines: { color: '#21262d' }, horzLines: { color: '#21262d' } },
      width: chartContainerRef.current.clientWidth || 300,
      height: 220,
      timeScale: { timeVisible: true, secondsVisible: true },
    });

    // ۲. افزودن AreaSeries بر اساس جدیدترین متد IChartApi
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#58a6ff',
      topColor: 'rgba(88, 166, 255, 0.4)',
      bottomColor: 'rgba(88, 166, 255, 0.0)',
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = areaSeries;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && currentPrice > 0) {
      seriesRef.current.update({
        time: Math.floor(Date.now() / 1000) as any,
        value: currentPrice,
      });
    }
  }, [currentPrice]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-[220px] rounded-xl overflow-hidden border border-gray-800"
    />
  );
};