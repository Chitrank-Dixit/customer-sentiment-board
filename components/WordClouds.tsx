
import React from 'react';
import { WordCloudWord } from '../types';
import useWordCloud from '../hooks/useWordCloud';

interface WordCloudsProps {
  praises: WordCloudWord[];
  complaints: WordCloudWord[];
}

const WordCloud: React.FC<{words: WordCloudWord[], color: string}> = ({ words, color }) => {
    const [containerRef, setContainerRef] = React.useState<HTMLDivElement | null>(null);
    const [dims, setDims] = React.useState({ width: 300, height: 300 });

    React.useEffect(() => {
        if (containerRef) {
            const resizeObserver = new ResizeObserver(entries => {
                if (entries && entries.length > 0) {
                    const { width, height } = entries[0].contentRect;
                    setDims({ width, height });
                }
            });
            resizeObserver.observe(containerRef);
            return () => resizeObserver.disconnect();
        }
    }, [containerRef]);

    const computedWords = useWordCloud(words, dims.width, dims.height);

    return (
        <div ref={setContainerRef} className="w-full h-full relative">
            {computedWords.length > 0 ? (
                <div style={{ width: dims.width, height: dims.height, position: 'relative' }}>
                    {computedWords.map((word, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                left: `50%`,
                                top: `50%`,
                                transform: `translate(-50%, -50%) translate(${word.x}px, ${word.y}px) rotate(${word.rotate}deg)`,
                                fontSize: word.size,
                                fontFamily: 'sans-serif',
                                color: color,
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {word.text}
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="flex items-center justify-center h-full text-slate-500">No data</div>
            )}
        </div>
    );
}

const WordClouds: React.FC<WordCloudsProps> = ({ praises, complaints }) => {
  return (
    <div className="space-y-8 h-full flex flex-col">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex-1 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 text-slate-100">Top Praises</h3>
          <div className="flex-grow min-h-[150px]">
            <WordCloud words={praises} color="#22c55e" />
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex-1 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 text-slate-100">Top Complaints</h3>
          <div className="flex-grow min-h-[150px]">
             <WordCloud words={complaints} color="#ef4444" />
          </div>
        </div>
    </div>
  );
};

export default WordClouds;
