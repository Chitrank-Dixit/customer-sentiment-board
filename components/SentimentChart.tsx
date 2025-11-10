
import React from 'react';
import type { SentimentDataPoint } from '../types';
const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = (window as any).Recharts;

interface SentimentChartProps {
  data: SentimentDataPoint[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const sentimentValue = payload[0].value;
    let sentimentLabel = 'Neutral';
    if (sentimentValue === 1) sentimentLabel = 'Positive';
    if (sentimentValue === -1) sentimentLabel = 'Negative';

    return (
      <div className="bg-slate-700 p-3 rounded-md border border-slate-600 shadow-lg">
        <p className="font-bold text-slate-200">{`${label}`}</p>
        <p className={`text-sm ${
          sentimentValue === 1 ? 'text-green-400' :
          sentimentValue === -1 ? 'text-red-400' :
          'text-yellow-400'
        }`}>{`Sentiment: ${sentimentLabel}`}</p>
      </div>
    );
  }
  return null;
};

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500">No trend data available.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="id" stroke="#94a3b8" tick={{ fontSize: 12 }} />
        <YAxis 
            stroke="#94a3b8" 
            tick={{ fontSize: 12 }} 
            domain={[-1.2, 1.2]} 
            ticks={[-1, 0, 1]}
            tickFormatter={(tick) => {
                if (tick === 1) return 'Positive';
                if (tick === 0) return 'Neutral';
                if (tick === -1) return 'Negative';
                return '';
            }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '14px' }} />
        <Line 
          type="monotone" 
          dataKey="sentiment" 
          stroke="#4f46e5" 
          strokeWidth={2}
          dot={{ r: 4, fill: '#6366f1' }}
          activeDot={{ r: 8, stroke: '#818cf8', strokeWidth: 2 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SentimentChart;
