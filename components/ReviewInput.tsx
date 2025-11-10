
import React from 'react';

interface ReviewInputProps {
  reviewsText: string;
  setReviewsText: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const ReviewInput: React.FC<ReviewInputProps> = ({ reviewsText, setReviewsText, onAnalyze, isLoading }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col h-full sticky top-24">
      <h2 className="text-lg font-semibold mb-4 text-slate-100">Customer Reviews</h2>
      <p className="text-sm text-slate-400 mb-4">
        Paste your raw text reviews below. The more reviews you provide, the more accurate the analysis will be.
      </p>
      <textarea
        className="flex-grow w-full p-3 bg-slate-900 border border-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 resize-none text-sm text-slate-300 min-h-[300px] lg:min-h-0"
        placeholder="e.g., The service was amazing! I loved the product quality..."
        value={reviewsText}
        onChange={(e) => setReviewsText(e.target.value)}
        disabled={isLoading}
      />
      <button
        onClick={onAnalyze}
        disabled={isLoading || !reviewsText.trim()}
        className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Generate Report'
        )}
      </button>
    </div>
  );
};

export default ReviewInput;
