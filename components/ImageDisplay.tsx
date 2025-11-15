import React from 'react';

interface GameCardProps {
  category: string;
  text: string;
  categoryColorClass: string;
}

const GameCard: React.FC<GameCardProps> = ({ category, text, categoryColorClass }) => {
  const categoryTextColorClass = categoryColorClass.replace('border-', 'text-');
  const isGuessWho = category === 'Hádej, kdo jsem?';
  
  const aspectClass = isGuessWho ? 'aspect-video' : 'aspect-square';
  const rotationClass = isGuessWho ? 'rotate-180' : '';
  const paddingClass = isGuessWho ? 'p-8' : 'p-6';

  return (
    <div className={`w-full ${aspectClass} bg-gray-800 rounded-2xl flex flex-col items-center justify-center ${paddingClass} shadow-2xl border-4 ${categoryColorClass} transition-all duration-500 ${rotationClass}`}>
      <p className={`text-xl font-bold uppercase tracking-wider mb-4 ${categoryTextColorClass}`}>{category}</p>
      <p className="text-3xl sm:text-4xl font-semibold text-center text-white">
        {text}
      </p>
      {isGuessWho && (
        <p className="text-lg text-gray-300 mt-6 text-center animate-pulse">
          (Přilož si telefon na čelo!)
        </p>
      )}
    </div>
  );
};

export default GameCard;