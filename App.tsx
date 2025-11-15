import React, { useState, useEffect, useCallback } from 'react';
import GameCard from './components/ImageDisplay'; // This is now GameCard
import AdComponent from './components/AdComponent';

type GameMode = 'quick' | 'party' | 'competitive' | 'murderer';

interface Player {
  name: string;
  score: number;
}

interface MurdererPlayer {
    name: string;
    role: 'murderer' | 'detective' | 'civilian';
    status: 'alive' | 'dead';
}

interface CardData {
  category: string;
  text: string;
}

const PartyIcon: React.FC<{ className?: string }> = ({ className = "h-10 w-10 text-yellow-300" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm10 0a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm14 3a1 1 0 01-1 1H4a1 1 0 110-2h12a1 1 0 011 1z" clipRule="evenodd" />
    </svg>
);

const MurdererIcon: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.5 4 C19.9 4 21 5.1 21 6.5 C21 7.9 19.9 9 18.5 9 C17.1 9 16 7.9 16 6.5 C16 5.1 17.1 4 18.5 4 M18.5 2 C16 2 14 4 14 6.5 C14 9 16 11 18.5 11 C21 11 23 9 23 6.5 C23 4 21 2 18.5 2 M11.7 21.5 C12.1 21.5 12.5 21.1 12.5 20.7 C12.5 20.2 12.1 19.8 11.7 19.8 C11.2 19.8 10.8 20.2 10.8 20.7 C10.8 21.1 11.2 21.5 11.7 21.5 M11.7 18.1 C13.2 18.1 14.4 19.3 14.4 20.7 C14.4 22.1 13.2 23.3 11.7 23.3 C10.2 23.3 9 22.1 9 20.7 C9 19.3 10.2 18.1 11.7 18.1 M19 13 L19 13.5 C19 15.1 18.3 16.5 17 17.4 L17 23 L15 23 L15 21 L13.8 21 C12.9 22.3 11.3 23.1 9.5 22.8 C7.7 22.5 6.2 21.2 5.6 19.5 C4.9 17.8 5.4 15.9 6.8 14.6 C8.2 13.3 10.1 12.8 12 13.2 L12 11 L5 11 L5 9 L13 9 L13 10.7 C14 10.1 15.2 9.8 16.5 9.8 C17.2 9.8 17.8 9.9 18.4 10.1 L17 8.7 L18.4 7.3 L22.4 11.3 L21 12.7 L19 10.7 L19 13 Z" />
    </svg>
);


const originalGameCards: CardData[] = [
  { category: 'Kdo z vás nejpravděpodobněji', text: '...by jako první usnul na večírku.' },
  { category: 'Pravda', text: 'Co je nejvíc trapná věc, kterou jsi kdy udělal?' },
  { category: 'Úkol', text: 'Udělej svou nejlepší imitaci jiného hráče.' },
  { category: 'Pravidlo', text: 'Nové pravidlo: Až do dalšího kola smíš mluvit pouze v otázkách.' },
  { category: 'Nikdy jsem', text: '...nelhal, abych se vyhnul problémům.' },
  { category: 'Kdo z vás nejpravděpodobněji', text: '...by vyhrál v loterii a ztratil tiket.' },
  { category: 'Pravda', text: 'Jaké je tajemství, které jsi nikdy nikomu neřekl?' },
  { category: 'Úkol', text: 'Nech skupinu, aby ti napsala status na sociální sítě.' },
  { category: 'Pravidlo', text: 'Nové pravidlo: Všichni tě musí oslovovat "Vaše Veličenstvo" po další 3 kola.' },
  { category: 'Nikdy jsem', text: '...nestalkoval svého ex na sociálních sítích.' },
  { category: 'Kdo z vás nejpravděpodobněji', text: '...by přežil zombie apokalypsu.' },
  { category: 'Pravda', text: 'Jaký je tvůj největší strach?' },
  { category: 'Úkol', text: 'Zpívej vše, co říkáš, po dobu následujících 10 minut.' },
  { category: 'Pravidlo', text: 'Nové pravidlo: Po zbytek hry musíš pít svou nedominantní rukou.' },
  { category: 'Nikdy jsem', text: '...nedal dárek, který jsem sám dostal.' }
];

const guessWhoCards: CardData[] = [
  { category: 'Hádej, kdo jsem?', text: 'Harry Potter' },
  { category: 'Hádej, kdo jsem?', text: 'Spider-Man' },
  { category: 'Hádej, kdo jsem?', text: 'Karel Gott' },
  { category: 'Hádej, kdo jsem?', text: 'Darth Vader' },
  { category: 'Hádej, kdo jsem?', text: 'Jaromír Jágr' },
  { category: 'Hádej, kdo jsem?', text: 'Homer Simpson' },
  { category: 'Hádej, kdo jsem?', text: 'Prezident České republiky' },
  { category: 'Hádej, kdo jsem?', text: 'Krteček' },
  { category: 'Hádej, kdo jsem?', text: 'Terminátor' },
  { category: 'Hádej, kdo jsem?', text: 'Jára Cimrman' }
];

const gameCards = [...originalGameCards, ...guessWhoCards];

const categoryColors: { [key: string]: string } = {
  'Kdo z vás nejpravděpodobněji': 'border-cyan-400',
  'Pravda': 'border-pink-500',
  'Úkol': 'border-yellow-400',
  'Pravidlo': 'border-green-400',
  'Nikdy jsem': 'border-purple-500',
  'Hádej, kdo jsem?': 'border-orange-500'
};

// Fix: Changed generic arrow function to a standard function declaration
// to avoid TSX parsing ambiguity where `<T>` can be misinterpreted as a JSX tag.
// This single change resolves the cascade of parsing errors that followed.
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}


const App: React.FC = () => {
  // FIX: Moved all state and logic inside the App component.
  // React hooks (like useState, useEffect) and the logic that depends on them
  // must be called within a React functional component.
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  
  // Card game state
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [newPlayerName, setNewPlayerName] = useState<string>('');
  const [showScores, setShowScores] = useState<boolean>(false);
  const [deck, setDeck] = useState<CardData[]>([]);
  const [cardCount, setCardCount] = useState<number>(0);
  const [isAdVisible, setIsAdVisible] = useState<boolean>(false);
  const [timerValue, setTimerValue] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Murderer game state
  const [murdererPlayers, setMurdererPlayers] = useState<MurdererPlayer[]>([]);
  const [murdererGameState, setMurdererGameState] = useState<'role-reveal' | 'playing' | 'ended' | null>(null);
  const [roleRevealIndex, setRoleRevealIndex] = useState(0);
  const [isRoleVisible, setIsRoleVisible] = useState(false);
  const [winner, setWinner] = useState<'detective' | 'murderer' | null>(null);
  const [showAccusationModal, setShowAccusationModal] = useState(false);
  const [detectiveHasAccused, setDetectiveHasAccused] = useState<boolean>(false);


  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'quick') {
      const shuffledDeck = shuffleArray(gameCards);
      setCurrentCard(shuffledDeck.shift() || null);
      setDeck(shuffledDeck);
      setIsGameStarted(true);
      setCardCount(1);
    } else if (mode !== 'murderer') {
      setDeck(shuffleArray(gameCards));
    }
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim() && !players.find(p => p.name === newPlayerName.trim())) {
      setPlayers(prev => [...prev, { name: newPlayerName.trim(), score: 0 }]);
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleStartGroupGame = () => {
    if (gameMode === 'murderer') {
        if (players.length < 3) return; // Need at least 3 players
        const shuffledPlayers = shuffleArray(players);
        const assignedRoles: MurdererPlayer[] = shuffledPlayers.map((player, index) => {
            let role: 'murderer' | 'detective' | 'civilian';
            if (index === 0) role = 'murderer';
            else if (index === 1) role = 'detective';
            else role = 'civilian';
            return { name: player.name, role, status: 'alive' };
        });
        setMurdererPlayers(shuffleArray(assignedRoles)); // Shuffle again so roles are not in order
        setMurdererGameState('role-reveal');
        setIsGameStarted(true);
        return;
    }

    if (players.length > 0 && deck.length > 0) {
      const newDeck = [...deck];
      setCurrentCard(newDeck.shift() || null);
      setDeck(newDeck);
      setIsGameStarted(true);
      setCardCount(1);
    }
  };
  
    const drawNextCard = useCallback(() => {
    let newDeck = [...deck];
    if (newDeck.length === 0) {
        newDeck = shuffleArray(gameCards);
    }
    setCurrentCard(newDeck.shift() || null);
    setDeck(newDeck);

    if (gameMode === 'party' || gameMode === 'competitive') {
      setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    }
    setCardCount(c => c + 1);
  }, [deck, gameMode, players.length]);

  const onNextButtonClick = useCallback(() => {
    if (cardCount > 0 && cardCount % 5 === 0) {
      setIsAdVisible(true);
    } else {
      drawNextCard();
    }
  }, [cardCount, drawNextCard]);

  const handleAdClose = () => {
    setIsAdVisible(false);
    drawNextCard();
  };

  
  const handleAwardPoint = () => {
    setPlayers(prev => prev.map((player, index) => 
        index === currentPlayerIndex ? { ...player, score: player.score + 1 } : player
    ));
  };
  
  const resetCardGameState = () => {
    setCurrentCard(null);
    setCurrentPlayerIndex(0);
    setShowScores(false);
    setDeck([]);
    setCardCount(0);
    setIsAdVisible(false);
    setIsTimerRunning(false);
    setTimerValue(60);
  }
  
  const resetMurdererGameState = () => {
    setMurdererPlayers([]);
    setMurdererGameState(null);
    setRoleRevealIndex(0);
    setIsRoleVisible(false);
    setWinner(null);
    setShowAccusationModal(false);
    setDetectiveHasAccused(false);
  }

  const handleEndGame = () => {
    setGameMode(null);
    setIsGameStarted(false);
    setPlayers([]);
    setNewPlayerName('');
    resetCardGameState();
    resetMurdererGameState();
  };
  
  // --- Timer Logic ---
  useEffect(() => {
    const isGuessWhoCard = currentCard?.category === 'Hádej, kdo jsem?';
    
    if (isGuessWhoCard && !isAdVisible) {
        setTimerValue(60);
        setIsTimerRunning(true);
    } else {
        setIsTimerRunning(false);
    }
  }, [currentCard, isAdVisible]);

  useEffect(() => {
    if (!isTimerRunning) return;

    if (timerValue > 0) {
        const timerId = setTimeout(() => {
            setTimerValue(timerValue - 1);
        }, 1000);
        return () => clearTimeout(timerId);
    } else {
        onNextButtonClick();
    }
  }, [isTimerRunning, timerValue, onNextButtonClick]);


  // --- Murderer Game Logic ---
  useEffect(() => {
    // Only run this logic when in the 'playing' state of the murderer mode
    if (murdererGameState !== 'playing') {
      return;
    }

    const alivePlayers = murdererPlayers.filter(p => p.status === 'alive');
    const murderer = murdererPlayers.find(p => p.role === 'murderer');
    
    // Condition 1: Detective wins if the murderer is dead.
    // This is the highest priority check.
    if (murderer && murderer.status === 'dead') {
      setWinner('detective');
      setMurdererGameState('ended');
      return;
    }

    // Condition 2: Murderer wins if they are the only non-detective left alive.
    // This means all civilians have been eliminated.
    const aliveCivilians = alivePlayers.filter(p => p.role === 'civilian');
    if (murderer && murderer.status === 'alive' && aliveCivilians.length === 0) {
      setWinner('murderer');
      setMurdererGameState('ended');
      return;
    }

  }, [murdererPlayers, murdererGameState]);


  const handleRevealNextRole = () => {
    setIsRoleVisible(false);
    if (roleRevealIndex < murdererPlayers.length - 1) {
        setRoleRevealIndex(prev => prev + 1);
    } else {
        setMurdererGameState('playing');
    }
  };
  
  const handlePlayerDied = (playerName: string) => {
    setMurdererPlayers(prev => prev.map(p => p.name === playerName ? {...p, status: 'dead'} : p));
  }

  const handleAccusation = (accusedName: string) => {
    setDetectiveHasAccused(true);
    const accusedPlayer = murdererPlayers.find(p => p.name === accusedName);
    if (accusedPlayer?.role === 'murderer') {
        setWinner('detective');
    } else {
        setWinner('murderer');
    }
    setMurdererGameState('ended');
    setShowAccusationModal(false);
  };
  
  const handlePlayMurdererAgain = () => {
    resetMurdererGameState();
    handleStartGroupGame();
  }

  // --- RENDER FUNCTIONS ---
  const renderModeSelection = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-8">
          <PartyIcon />
      </div>
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 mb-4">
        Party Starter
      </h1>
      <p className="text-lg text-gray-400 mb-12 max-w-md">
        Vyberte si herní mód a rozjeďte párty.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <button onClick={() => handleSelectMode('quick')} className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="font-bold text-xl">Rychlá hra</h3>
            <p className="font-normal text-sm">Rovnou do hry. Žádné nastavování, jen karty.</p>
        </button>
        <button onClick={() => handleSelectMode('party')} className="w-full px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="font-bold text-xl">Párty mód</h3>
            <p className="font-normal text-sm">Přidejte hráče a střídejte se v tazích.</p>
        </button>
        <button onClick={() => handleSelectMode('competitive')} className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="font-bold text-xl">Soutěžní mód</h3>
            <p className="font-normal text-sm">Párty mód s bodováním!</p>
        </button>
        <button onClick={() => handleSelectMode('murderer')} className="w-full px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold text-lg rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center">
            <MurdererIcon className="h-8 w-8 mb-2" />
            <h3 className="font-bold text-xl">Kdo je vrah?</h3>
            <p className="font-normal text-sm">Sociální dedukce, mrkání a lži.</p>
        </button>
      </div>
    </div>
  );
  
  const renderPlayerSetup = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-8">Přidat hráče</h1>
        {gameMode === 'murderer' && <p className="text-gray-400 mb-4 -mt-4">Potřebujete alespoň 3 hráče.</p>}
        <form onSubmit={handleAddPlayer} className="flex w-full max-w-sm mb-6">
            <input 
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Zadejte jméno hráče"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button type="submit" className="px-6 py-3 bg-purple-600 text-white font-bold rounded-r-lg hover:bg-purple-700 transition-colors">Přidat</button>
        </form>
        <div className="w-full max-w-sm mb-8">
            {players.map((player, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg mb-2">
                    <span className="font-semibold">{player.name}</span>
                    <button onClick={() => handleRemovePlayer(index)} className="text-red-500 hover:text-red-40ou font-bold">✕</button>
                </div>
            ))}
        </div>
        
        <button onClick={handleStartGroupGame} className="px-12 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-xl rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={gameMode === 'murderer' ? players.length < 3 : players.length < 1}>
            Spustit hru
        </button>
        
         <button onClick={handleEndGame} className="mt-4 text-gray-400 hover:text-white transition-colors">Zpět na výběr módu</button>
    </div>
  );
  
  const renderMurdererRoleReveal = () => {
    const currentPlayer = murdererPlayers[roleRevealIndex];
    
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
            <div className="w-full max-w-md h-96 bg-gray-800 rounded-2xl flex flex-col items-center justify-center p-8 shadow-2xl border-4 border-gray-600">
                {!isRoleVisible ? (
                    <>
                        <p className="text-2xl text-gray-400 mb-2">Jsi na řadě</p>
                        <p className="text-4xl font-bold mb-8">{currentPlayer.name}</p>
                        <button onClick={() => setIsRoleVisible(true)} className="px-8 py-4 bg-purple-600 text-white font-bold text-xl rounded-full shadow-lg transform hover:scale-105 transition-transform">
                            Ukázat moji roli
                        </button>
                        <p className="text-gray-500 mt-6">Nikomu dalšímu neukazuj obrazovku!</p>
                    </>
                ) : (
                    <>
                        <p className="text-2xl text-gray-400 mb-2">Tvoje role je</p>
                        <p className={`text-5xl font-extrabold mb-8 ${currentPlayer.role === 'murderer' ? 'text-red-500' : currentPlayer.role === 'detective' ? 'text-blue-400' : 'text-green-400'}`}>
                            {currentPlayer.role === 'murderer' ? 'VRAH' : currentPlayer.role === 'detective' ? 'DETEKTIV' : 'OBČAN'}
                        </p>
                        <button onClick={handleRevealNextRole} className="px-8 py-4 bg-gray-600 text-white font-bold text-xl rounded-full shadow-lg transform hover:scale-105 transition-transform">
                            Skrýt a předat dál
                        </button>
                    </>
                )}
            </div>
        </div>
    );
  };
  
  const renderMurdererGame = () => {
    const detective = murdererPlayers.find(p => p.role === 'detective');
    const alivePlayers = murdererPlayers.filter(p => p.status === 'alive');
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start p-4 text-center">
            <h1 className="text-4xl font-bold my-6">Kdo je vrah?</h1>
            <p className="text-lg text-gray-400 max-w-xl mb-2">Vrah zabíjí mrknutím. Zavraždění hráči stisknou tlačítko u svého jména.</p>
            <p className="text-lg text-gray-400 max-w-xl mb-6">Detektiv: <span className="font-bold text-blue-400">{detective?.name}</span>. Detektiv má jeden pokus na odhalení vraha.</p>
            
            <div className="w-full max-w-md bg-gray-800 rounded-xl p-4 space-y-2 mb-6">
                {murdererPlayers.map(player => (
                    <div key={player.name} className={`flex items-center justify-between p-3 rounded-lg ${player.status === 'dead' ? 'bg-gray-900 opacity-50' : 'bg-gray-700'}`}>
                        <div className="flex items-center">
                            <span className={`text-2xl mr-3 ${player.status === 'dead' ? 'grayscale' : ''}`}>
                                {player.role === 'detective' ? '🕵️' : player.status === 'alive' ? '😀' : '💀'}
                            </span>
                            <span className={`text-xl font-semibold ${player.status === 'dead' ? 'line-through' : ''}`}>{player.name}</span>
                        </div>
                        {player.status === 'alive' && player.role !== 'detective' && (
                            <button onClick={() => handlePlayerDied(player.name)} className="px-3 py-1 bg-red-700 text-white text-sm font-bold rounded-full hover:bg-red-600">Zemřel(a) jsem</button>
                        )}
                    </div>
                ))}
            </div>
            
            {detective?.status === 'alive' && !detectiveHasAccused && (
                 <button onClick={() => setShowAccusationModal(true)} className="px-12 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xl rounded-full shadow-lg transform hover:scale-105 transition-transform">
                    Obvinit vraha
                </button>
            )}

            {showAccusationModal && (
                 <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center" onClick={() => setShowAccusationModal(false)}>
                    <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <h2 className="text-3xl font-bold text-center mb-6">Koho obviňuješ?</h2>
                        <div className="space-y-3">
                           {alivePlayers.filter(p => p.role !== 'detective').map(player => (
                               <button key={player.name} onClick={() => handleAccusation(player.name)} className="w-full p-4 bg-gray-700 rounded-lg text-xl font-semibold hover:bg-gray-600 transition-colors">
                                   {player.name}
                               </button>
                           ))}
                        </div>
                    </div>
                </div>
            )}
            <button onClick={handleEndGame} className="mt-6 text-gray-500 hover:text-white transition-colors">Ukončit hru</button>
        </div>
    );
  }
  
  const renderMurdererEndGame = () => {
      const murderer = murdererPlayers.find(p => p.role === 'murderer');
      return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
            <div className={`w-full max-w-md text-center p-8 rounded-2xl shadow-2xl border-4 ${winner === 'detective' ? 'border-blue-500 bg-blue-900/20' : 'border-red-500 bg-red-900/20'}`}>
                <h1 className="text-5xl font-extrabold mb-4">{winner === 'detective' ? 'DETEKTIV VYHRÁL!' : 'VRAH VYHRÁL!'}</h1>
                <p className="text-2xl text-gray-300 mb-8">Vrah byl <span className="font-bold text-yellow-400">{murderer?.name}</span>.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={handlePlayMurdererAgain} className="px-8 py-3 bg-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-green-500 transition-colors">Hrát znovu</button>
                    <button onClick={handleEndGame} className="px-8 py-3 bg-gray-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-gray-500 transition-colors">Hlavní menu</button>
                </div>
            </div>
        </div>
      )
  };

  const renderCardGame = () => {
    const currentPlayer = (gameMode === 'party' || gameMode === 'competitive') ? players[currentPlayerIndex] : null;
    const isGuessWhoCard = currentCard?.category === 'Hádej, kdo jsem?';

    return (
        <div className={`min-h-screen bg-gray-900 text-white flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8`}>
          {isAdVisible && <AdComponent onClose={handleAdClose} />}
          <header className="w-full max-w-2xl flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-400">
                Party Starter
            </h1>
            <div>
              {gameMode === 'competitive' && 
                <button onClick={() => setShowScores(s => !s)} className="text-gray-400 hover:text-white transition-colors mr-4">Skóre</button>
              }
              <button onClick={handleEndGame} className="text-gray-400 hover:text-white transition-colors">
                Ukončit hru
              </button>
            </div>
          </header>
          
          <main className="w-full max-w-md flex-grow flex flex-col items-center justify-center py-4">
            {currentPlayer && (
                <div className="mb-4 text-center">
                    <p className="text-xl text-gray-400">Na řadě je,</p>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">{currentPlayer.name}!</p>
                </div>
            )}
            {isTimerRunning && (
              <div className="mb-4 text-center">
                <p className="text-6xl font-mono font-bold text-yellow-400 animate-pulse">
                  {timerValue}
                </p>
                <p className="text-sm text-gray-500 -mt-2">sekund zbývá</p>
              </div>
            )}
            {currentCard && (
              <>
                {isGuessWhoCard && !isTimerRunning && (
                  <p className="text-lg text-gray-300 mb-4 text-center animate-pulse">
                    Otočte telefon vodorovně!
                  </p>
                )}
                <GameCard 
                  category={currentCard.category}
                  text={currentCard.text}
                  categoryColorClass={categoryColors[currentCard.category] || 'border-gray-500'}
                />
              </>
            )}
            {gameMode === 'competitive' && currentCard && ['Úkol', 'Kdo z vás nejpravděpodobněji', 'Hádej, kdo jsem?'].includes(currentCard.category) && (
                <button onClick={handleAwardPoint} className="mt-4 px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-full shadow-md hover:bg-yellow-400 transition-colors">
                    Přidělit bod hráči {currentPlayer?.name}
                </button>
            )}
          </main>
    
          <footer className="w-full max-w-md">
            <button
                onClick={onNextButtonClick}
                className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-xl rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
                {isGuessWhoCard ? 'UHÁDNUTO!' : (gameMode === 'quick' ? 'Další karta' : 'Další tah')}
            </button>
          </footer>

          {showScores && gameMode === 'competitive' && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center" onClick={() => setShowScores(false)}>
                <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                    <h2 className="text-3xl font-bold text-center mb-6">Skóre</h2>
                    <div className="space-y-3">
                        {players.sort((a, b) => b.score - a.score).map((player, index) => (
                           <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                                <span className="font-semibold text-lg">{index + 1}. {player.name}</span>
                                <span className="font-bold text-xl text-yellow-400">{player.score}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}
        </div>
      );
  }

  if (!gameMode) {
    return renderModeSelection();
  }

  if (!isGameStarted) {
    return renderPlayerSetup();
  }
  
  if (gameMode === 'murderer') {
      if (murdererGameState === 'role-reveal') return renderMurdererRoleReveal();
      if (murdererGameState === 'playing') return renderMurdererGame();
      if (murdererGameState === 'ended') return renderMurdererEndGame();
  }

  return renderCardGame();
};

export default App;