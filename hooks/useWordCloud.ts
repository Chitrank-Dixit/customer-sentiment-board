
import { useEffect, useState } from 'react';
import type { WordCloudWord } from '../types';

declare const d3: any;

// Fix: Define the ComputedWord interface to include layout properties from d3-cloud.
// This resolves the "Cannot find namespace 'd3'" error and subsequent property access errors.
interface ComputedWord extends WordCloudWord {
  x: number;
  y: number;
  rotate: number;
  size: number;
}

const useWordCloud = (words: WordCloudWord[], width: number, height: number): ComputedWord[] => {
  const [computedWords, setComputedWords] = useState<ComputedWord[]>([]);

  useEffect(() => {
    if (!words || words.length === 0 || width === 0 || height === 0) {
        setComputedWords([]);
        return;
    }

    // d3-cloud is sensitive to being called with the same array instance
    const wordsCopy = words.map(w => ({ ...w }));

    const maxFreq = Math.max(...wordsCopy.map(w => w.value), 1);
    
    // Scale font size based on frequency
    const fontSizeScale = d3.scaleLinear()
        .domain([0, maxFreq])
        .range([12, Math.min(60, width / 5)]); // Min 12px, Max 60px or 1/5 of width
        
    const layout = d3.layout.cloud()
      .size([width, height])
      .words(wordsCopy)
      .padding(5)
      .rotate(() => (~~(Math.random() * 6) - 3) * 30) // Random rotation
      .font("Impact")
      .fontSize((d: WordCloudWord) => fontSizeScale(d.value))
      .on("end", (newWords: ComputedWord[]) => {
        setComputedWords(newWords);
      });

    layout.start();

    return () => {
      layout.stop();
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(words), width, height]); // Deep compare words array

  return computedWords;
};

export default useWordCloud;
