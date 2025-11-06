import React, { useState, useEffect } from 'react';

interface TweetCardProps {
  tweetText: string;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);


const TweetCard: React.FC<TweetCardProps> = ({ tweetText }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(tweetText);
    setIsCopied(true);
  };
  
  // Replace hashtags with styled links for better visual representation
  const formattedText = tweetText.replace(/(#\w+)/g, '<span class="text-sky-400">$1</span>');

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col justify-between shadow-lg transition-transform duration-300 hover:scale-105 hover:border-sky-500">
      <p 
        className="text-slate-200 mb-4 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
      <button
        onClick={handleCopy}
        className={`mt-auto self-end px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
          isCopied
            ? 'bg-green-600 text-white'
            : 'bg-slate-700 text-slate-300 hover:bg-sky-600 hover:text-white'
        }`}
      >
        {isCopied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
        {isCopied ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  );
};

export default TweetCard;
