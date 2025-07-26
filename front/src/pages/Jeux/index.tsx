import { useState, useEffect, useRef } from 'react';
import Head from 'react-helmet';

function Jeux() {
  const [currentGame, setCurrentGame] = useState<'clicker' | 'runner' | null>(null);
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState(2);
  const [isCheating, setIsCheating] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 50 });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number>(0);
  const fartSoundRef = useRef<HTMLAudioElement>(null);

  // Gestion du son
  const playFartSound = () => {
    if (Math.random() > 0.9 && fartSoundRef.current) {
      fartSoundRef.current.currentTime = 0;
      fartSoundRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  // Jeu 1: Clicker
  const handleClickerClick = () => {
    setScore(prev => prev + (isCheating ? 10 : 1));
    playFartSound();
  };

  // Jeu 2: Bouton qui fuit
  const handleRunnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScore(prev => prev + 1);
    playFartSound();
    moveButton();
  };

  const moveButton = () => {
    const gameWidth = gameAreaRef.current?.clientWidth || window.innerWidth;
    const gameHeight = gameAreaRef.current?.clientHeight || window.innerHeight;
    
    setButtonPosition({
      x: Math.random() * (gameWidth - 100) + 50,
      y: Math.random() * (gameHeight - 100) + 50
    });
  };

  // Animation du point qui saute (pour le jeu 1)
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      setPosition(prev => {
        let newY = prev.y + velocity * (deltaTime / 16);
        let newVelocity = velocity;
        
        const gameHeight = gameAreaRef.current?.clientHeight || window.innerHeight;
        
        if (newY > gameHeight - 50) {
          newY = gameHeight - 50;
          newVelocity = -Math.abs(velocity) * (0.7 + Math.random() * 0.3);
        } else if (newY < 50) {
          newY = 50;
          newVelocity = Math.abs(velocity) * (0.7 + Math.random() * 0.3);
        } else {
          newVelocity += (0.2 + Math.random() * 0.1) * (deltaTime / 16);
        }
        
        let newX = prev.x + (Math.random() > 0.99 ? (Math.random() - 0.5) * 10 : 0);
        newX = Math.max(10, Math.min(90, newX));
        
        setVelocity(newVelocity);
        return { x: newX, y: newY };
      });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (currentGame === 'clicker') {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [currentGame]);

  const shareScore = () => {
    const shareText = `J'ai marqué ${score} points dans ce jeu complètement stupide! ${isCheating ? '(Oui, je triche comme un porc 🐷)' : ''}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mon score incroyable!',
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        alert(`Partage manuel: ${shareText}`);
      });
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  const toggleCheat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCheating(!isCheating);
    setScore(prev => isCheating ? Math.floor(prev / 10) : prev * 10);
  };

  const resetGame = () => {
    setCurrentGame(null);
    setScore(0);
    setIsCheating(false);
  };

  // Menu principal
  if (!currentGame) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden flex flex-col items-center justify-center p-4">
        <Head>
          <title>Jeux Super Inutiles</title>
          <meta name="description" content="Des jeux complètement stupides pour perdre votre temps" />
        </Head>

        <h1 className="text-5xl md:text-6xl font-bold text-purple-600 mb-8 font-comic drop-shadow-lg animate-bounce">
          Jeux Super Inutiles
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl w-full">
          <div 
            onClick={() => setCurrentGame('clicker')}
            className="bg-white bg-opacity-70 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center"
          >
            <div className="text-4xl mb-4">🖱️</div>
            <h2 className="text-2xl font-bold text-purple-600 mb-2">Clicker Inutile</h2>
            <p className="text-center">Cliquez partout pour gagner des points! Un point orange saute bêtement.</p>
          </div>

          <div 
            onClick={() => setCurrentGame('runner')}
            className="bg-white bg-opacity-70 rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center"
          >
            <div className="text-4xl mb-4">🏃‍♂️</div>
            <h2 className="text-2xl font-bold text-purple-600 mb-2">Bouton Fugitif</h2>
            <p className="text-center">Essayez de cliquer sur le bouton qui vous fuit! Bonne chance!</p>
          </div>
        </div>

        <audio 
          ref={fartSoundRef}
          src="https://assets.mixkit.co/sfx/preview/mixkit-funny-fart-with-reverb-2751.mp3"
          preload="auto"
        />
      </div>
    );
  }

  // Jeux
  return (
    <div 
      ref={gameAreaRef}
      onClick={currentGame === 'clicker' ? handleClickerClick : undefined}
      className="relative w-full h-screen bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden flex flex-col items-center justify-center p-4"
    >
      <Head>
        <title>{currentGame === 'clicker' ? 'Clicker Inutile' : 'Bouton Fugitif'}</title>
        <meta name="description" content="Un jeu complètement stupide" />
      </Head>

      {/* Bouton retour */}
      <button
        onClick={resetGame}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        ← Retour
      </button>

      {/* Jeu Clicker */}
      {currentGame === 'clicker' && (
        <>
          {/* Point qui saute */}
          <div 
            className="absolute w-10 h-10 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
            style={{
              left: `${position.x}%`,
              top: `${position.y}px`,
              background: `radial-gradient(circle at 30% 30%, #ff9d00, #ff5500)`,
              boxShadow: `0 0 ${velocity * 5}px #ff9900`
            }}
          >
            <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"></div>
            <div 
              className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 ${velocity > 3 ? 'w-4 h-2 bg-red-500 rounded-b-full' : 'w-3 h-1 bg-black'}`}
            ></div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-purple-600 mb-8 font-comic drop-shadow-lg animate-bounce">
            Clicker Inutile
          </h1>
        </>
      )}

      {/* Jeu Bouton qui fuit */}
      {currentGame === 'runner' && (
        <>
          <h1 className="text-5xl md:text-6xl font-bold text-purple-600 mb-8 font-comic drop-shadow-lg animate-bounce">
            Bouton Fugitif
          </h1>

          <button
            onClick={handleRunnerClick}
            style={{
              position: 'absolute',
              left: `${buttonPosition.x}px`,
              top: `${buttonPosition.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
            className="px-8 py-4 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-all shadow-lg text-xl"
            onMouseEnter={moveButton}
          >
            Clique-moi!
          </button>
        </>
      )}

      {/* Affichage du score et boutons communs */}
      <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-8 font-mono">
        Score: {score}
      </div>
      
      <div className="flex gap-4 flex-wrap justify-center mb-8">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            shareScore();
          }}
          className="px-6 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg"
        >
          Partager mon score {isCheating && '🐷'}
        </button>
        
        {currentGame === 'clicker' && (
          <button
            onClick={toggleCheat}
            className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg ${
              isCheating 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-yellow-400 text-gray-800'
            }`}
          >
            {isCheating ? 'Arrêter de tricher' : 'Tricher comme un porc'}
          </button>
        )}
      </div>
      
      <div className="text-center max-w-md bg-white bg-opacity-70 rounded-xl p-4 shadow-lg">
        <p className="text-lg text-gray-700 mb-2">
          {currentGame === 'clicker' ? (
            isCheating 
              ? 'Bravo tricheur! Votre score augmente 10x plus vite! 🐷'
              : 'Cliquez n\'importe où pour augmenter votre score inutile!'
          ) : (
            score > 10 
              ? 'Vous êtes doué pour attraper ce bouton récalcitrant!'
              : 'Essayez de cliquer sur le bouton avant qu\'il ne s\'échappe!'
          )}
        </p>
      </div>
      
      {/* Audio pour les effets sonores stupides */}
      <audio 
        ref={fartSoundRef}
        src="https://assets.mixkit.co/sfx/preview/mixkit-funny-fart-with-reverb-2751.mp3"
        preload="auto"
      />
      
      {/* Petites animations stupides en arrière-plan */}
      {[...Array(10)].map((_, i) => (
        <div 
          key={i}
          className="absolute text-4xl opacity-20 pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${10 + Math.random() * 20}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            transform: `scale(${0.5 + Math.random() * 2})`
          }}
        >
          {['🐷', '💩', '🦄', '🌈', '🍕', '🎮', '🤡', '👾'][Math.floor(Math.random() * 8)]}
        </div>
      ))}
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-100vh) rotate(360deg); }
        }
        .font-comic {
          font-family: "Comic Sans MS", "Comic Sans", cursive;
        }
      `}</style>
    </div>
  );
}

export default Jeux;