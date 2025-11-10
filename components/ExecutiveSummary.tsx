
import React from 'react';
import { InsightIcon } from './icons';

// Basic markdown to HTML renderer
const renderMarkdown = (text: string) => {
    // This is a very basic parser, can be expanded or replaced with a library
    const html = text
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-slate-200">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 text-slate-100">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold mt-8 mb-4 text-white">$1</h1>')
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-6 mb-1">$1</li>')
        .replace(/(\r\n|\n|\r)/gm, '<br>')
        .replace(/(<br><li)/g, '<li') // fix extra space before lists
        .replace(/(<br>){2,}/g, '<br>')


    // Wrap list items in ul
    const listWrappedHtml = html.replace(/(<li.*<\/li>)/gs, '<ul>$1</ul>');

    return { __html: listWrappedHtml };
};


interface ExecutiveSummaryProps {
  summary: string;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ summary }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-slate-100 flex items-center">
        <InsightIcon className="w-6 h-6 mr-2 text-indigo-400" />
        AI Executive Summary
      </h3>
      <div 
        className="text-slate-300 space-y-4 text-sm leading-relaxed prose prose-invert prose-p:text-slate-300 prose-strong:text-slate-100"
        dangerouslySetInnerHTML={renderMarkdown(summary)}
      />
    </div>
  );
};

export default ExecutiveSummary;
