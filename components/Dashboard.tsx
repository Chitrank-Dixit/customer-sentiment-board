
import React from 'react';
import type { AnalysisResult } from '../types';
import ExecutiveSummary from './ExecutiveSummary';
import SentimentChart from './SentimentChart';
import WordClouds from './WordClouds';
import Loader from './Loader';
import { ChartIcon, InsightIcon } from './icons';

interface DashboardProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const WelcomeState: React.FC = () => (
  <div className="text-center p-8 bg-slate-800 rounded-lg h-full flex flex-col justify-center items-center">
    <div className="w-24 h-24 text-slate-600 mb-4">
      <ChartIcon />
    </div>
    <h3 className="text-2xl font-bold text-slate-300">Sentiment Analysis Dashboard</h3>
    <p className="text-slate-400 mt-2 max-w-md">
      Paste your customer reviews into the panel on the left and click "Generate Report" to visualize sentiment trends, key topics, and get an AI-powered executive summary.
    </p>
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
    <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg h-full flex flex-col justify-center items-center">
        <div className="w-16 h-16 text-red-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        </div>
        <h3 className="text-xl font-bold text-red-300">Analysis Failed</h3>
        <p className="text-red-400 mt-2 max-w-md">{error}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ result, isLoading, error }) => {
  if (isLoading) {
    return <Loader />;
  }
  
  if (error) {
      return <ErrorState error={error} />;
  }

  if (!result) {
    return <WelcomeState />;
  }

  return (
    <div className="space-y-8">
      <ExecutiveSummary summary={result.summary} />
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3 bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-slate-100 flex items-center">
            <ChartIcon className="w-6 h-6 mr-2 text-indigo-400" />
            Sentiment Trend
          </h3>
          <div className="h-80">
             <SentimentChart data={result.trendData} />
          </div>
        </div>
        <div className="xl:col-span-2">
            <WordClouds praises={result.praises} complaints={result.complaints} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
