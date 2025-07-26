import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import music from "../../assets/music.mp3"

function Karaks() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedSong, setSelectedSong] = useState('');
  const [showLyrics, setShowLyrics] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const audioRef = useRef(null);

  // Liste des chansons disponibles
  const songList = [
    {
      id: 'song1',
      title: 'Fitiavako Mimoza',
      artist: 'Chanson Malagasy',
      file: music,
      duration: '2:27'
    },
    {
      id: 'song2',
      title: 'Calm Down',
      artist: 'Rema',
      file: music,
      duration: '3:24'
    },
    {
      id: 'song3',
      title: 'Despacito',
      artist: 'Dadi Yankee', 
      file: music,
      duration: '3:45'
    }
  ];

  // Structure des paroles avec timing (en secondes) - divisées en 2 pages
  const lyricsPage1 = [
    { word: "Tiako", start: 14, end: 14.8 },
    { word: "hafindra", start: 14.8, end: 15.8 },
    { word: "aminao", start: 15.8, end: 17.0 },
    
    { word: "Ny", start: 18, end: 18.3 },
    { word: "fitiavako", start: 18.3, end: 19.5 },
    { word: "mimoza", start: 19.5, end: 20.8 },
    
    { word: "Kanefa", start: 22, end: 22.8 },
    { word: "raha", start: 22.8, end: 23.3 },
    { word: "tsy", start: 23.3, end: 23.8 },
    { word: "tianao", start: 23.8, end: 25.0 },
    
    { word: "Dia", start: 26, end: 26.5 },
    { word: "avereno", start: 26.5, end: 27.5 },
    { word: "ho", start: 27.5, end: 27.8 },
    { word: "ahy", start: 27.8, end: 28.5 },
    
    { word: "Ny", start: 29, end: 29.3 },
    { word: "fitiavako", start: 29.3, end: 30.5 },
    { word: "mimoza", start: 30.5, end: 32.0 }
  ];

  const lyricsPage2 = [
    { word: "Misy", start: 34, end: 34.8 },
    { word: "toerana", start: 34.8, end: 35.8 },
    { word: "mafana", start: 35.8, end: 37.0 },
    
    { word: "Tsy", start: 38, end: 38.3 },
    { word: "mba", start: 38.3, end: 38.8 },
    { word: "mamanala", start: 38.8, end: 40.0 },
    
    { word: "Ao", start: 41, end: 41.5 },
    { word: "anatiko", start: 41.5, end: 42.5 },
    { word: "ao", start: 42.5, end: 43.2 },
    
    { word: "Toerana", start: 44, end: 44.8 },
    { word: "kelikely,", start: 44.8, end: 45.8 },
    { word: "afaka", start: 45.8, end: 46.5 },
    { word: "hitahiry", start: 46.5, end: 47.8 },
    
    { word: "Ny", start: 48, end: 48.3 },
    { word: "fitiavanao", start: 48.3, end: 49.5 },
    { word: "mimoza", start: 49.5, end: 50.8 },
    
    { word: "Manimanitra", start: 52, end: 53.2 },
    { word: "daholo,", start: 53.2, end: 53.8 },
    { word: "izay", start: 53.8, end: 54.3 },
    { word: "lalovanao", start: 54.3, end: 55.8 },
    
    { word: "Misy", start: 56, end: 56.5 },
    { word: "fofom-boninkazo", start: 56.5, end: 58.0 },
    
    { word: "Vononkazo", start: 59, end: 60.0 },
    { word: "mimoza", start: 60.0, end: 61.5 }
  ];

  // Grouper les mots par lignes pour l'affichage
  const lyricsLinesPage1 = [
    lyricsPage1.slice(0, 3),   // "Tiako hafindra aminao"
    lyricsPage1.slice(3, 6),   // "Ny fitiavako mimoza"
    lyricsPage1.slice(6, 10),  // "Kanefa raha tsy tianao"
    lyricsPage1.slice(10, 14), // "Dia avereno ho ahy"
    lyricsPage1.slice(14, 17)  // "Ny fitiavako mimoza"
  ];

  const lyricsLinesPage2 = [
    lyricsPage2.slice(0, 3),   // "Misy toerana mafana"
    lyricsPage2.slice(3, 6),   // "Tsy mba mamanala"
    lyricsPage2.slice(6, 9),   // "Ao anatiko ao"
    lyricsPage2.slice(9, 13),  // "Toerana kelikely, afaka hitahiry"
    lyricsPage2.slice(13, 16), // "Ny fitiavanao mimoza"
    lyricsPage2.slice(16, 20), // "Manimanitra daholo, izay lalovanao"
    lyricsPage2.slice(20, 22), // "Misy fofom-boninkazo"
    lyricsPage2.slice(22, 24)  // "Vononkazo mimoza"
  ];

  const allLyrics = [...lyricsPage1, ...lyricsPage2];
  const currentLyricsLines = currentPage === 0 ? lyricsLinesPage1 : lyricsLinesPage2;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime((audio as HTMLAudioElement).currentTime);
      
      // Trouver le mot actuel basé sur le temps
      const activeWordIndex = allLyrics.findIndex(lyric => 
        (audio as HTMLAudioElement).currentTime >= lyric.start && (audio as HTMLAudioElement).currentTime <= lyric.end
      );
      
      if (activeWordIndex !== -1) {
        setCurrentWordIndex(activeWordIndex);
        
        // Changer automatiquement de page si nécessaire
        if (activeWordIndex >= lyricsPage1.length && currentPage === 0) {
          setCurrentPage(1);
        } else if (activeWordIndex < lyricsPage1.length && currentPage === 1) {
          setCurrentPage(0);
        }
      }
    };

    const updateDuration = () => {
      setDuration((audio as HTMLAudioElement).duration || 0);
      setIsAudioReady(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentWordIndex(0);
      setCurrentPage(0);
    };

    (audio as HTMLAudioElement).addEventListener('timeupdate', updateTime);
    (audio as HTMLAudioElement).addEventListener('loadedmetadata', updateDuration);
    (audio as HTMLAudioElement).addEventListener('canplaythrough', () => setIsAudioReady(true));
    (audio as HTMLAudioElement).addEventListener('ended', handleEnded);

    return () => {
      (audio as HTMLAudioElement).removeEventListener('timeupdate', updateTime);
      (audio as HTMLAudioElement).removeEventListener('loadedmetadata', updateDuration);
      (audio as HTMLAudioElement).removeEventListener('canplaythrough', () => setIsAudioReady(true));
      (audio as HTMLAudioElement).removeEventListener('ended', handleEnded);
    };
  }, [selectedSong, currentPage]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !isAudioReady) return;

    if (isPlaying) {
(audio as HTMLAudioElement).pause();
    } else {
      (audio as HTMLAudioElement).play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;

(audio as HTMLAudioElement).currentTime = 0;
    setCurrentTime(0);
    setCurrentWordIndex(0);
    setCurrentPage(0);
  };

  const changeSong = (songId: string) => {
    if (audioRef.current) {
(audioRef.current as HTMLAudioElement).pause();
      setIsPlaying(false);
    }
    
    setSelectedSong(songId);
    setShowLyrics(true);
    setIsAudioReady(false);
    
    setCurrentTime(0);
    setCurrentWordIndex(0);
    setCurrentPage(0);
  };

  const getCurrentSong = () => {
    return songList.find(song => song.id === selectedSong);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getWordStyle = (globalWordIndex: number) => {
    const isActive = globalWordIndex === currentWordIndex;
    const isPassed = globalWordIndex < currentWordIndex;
    
    return {
      transition: 'all 0.3s ease',
      color: isActive ? '#3b82f6' : isPassed ? '#6b7280' : '#d1d5db',
      transform: isActive ? 'scale(1.1)' : 'scale(1)',
      fontWeight: isActive ? '600' : '400',
      textShadow: isActive ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
    };
  };

  const nextPage = () => {
    if (currentPage < 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fonction pour calculer la progression
  const getProgressInfo = () => {
    const totalWords = allLyrics.length;
    const currentProgress = currentWordIndex + 1;
    const progressPercentage = totalWords > 0 ? (currentProgress / totalWords) * 100 : 0;
    const currentWord = allLyrics[currentWordIndex]?.word || '';
    
    return {
      current: currentProgress,
      total: totalWords,
      percentage: progressPercentage,
      word: currentWord
    };
  };

  const progressInfo = getProgressInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-900 mb-2">🎤 Karaoké Malagasy</h1>
        </div>

        {/* Bulle de progression */}
        {selectedSong && showLyrics && isPlaying && (
          <div className="fixed top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border-2 border-red-200 z-50">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                {/* Cercle de progression */}
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#fee2e2"
                    strokeWidth="4"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - progressInfo.percentage / 100)}`}
                    className="transition-all duration-300"
                  />
                </svg>
                {/* Pourcentage au centre */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">
                    {Math.round(progressInfo.percentage)}%
                  </span>
                </div>
              </div>
              
              <div className="text-sm">
                <div className="font-semibold text-gray-800">
                  Mot: <span className="text-red-600">{progressInfo.word}</span>
                </div>
                <div className="text-gray-600">
                  {progressInfo.current}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu de sélection des chansons */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Hira</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {songList.map((song) => (
              <button
                key={song.id}
                onClick={() => changeSong(song.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedSong === song.id
                    ? 'border-red-500 bg-red-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-25'
                }`}
              >
                <div className="font-medium text-gray-900">{song.title}</div>
                <div className="text-sm text-gray-600">{song.artist}</div>
                <div className="text-xs text-gray-400 mt-1">{song.duration}</div>
                {selectedSong === song.id && (
                  <div className="text-xs text-red-600 mt-1 font-medium">▶ Voafidy</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Zone des paroles */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-xl min-h-[500px] flex flex-col justify-center">
          {!selectedSong || !showLyrics ? (
            <div className="text-center">
              <div className="text-6xl mb-4">🎵</div>
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">Safidio ny hira</h2>
              <p className="text-gray-500">Tsindrio ny hira etsy ambony mba hahita ny teny</p>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`p-2 rounded-full ${
                    currentPage === 0 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-red-600 hover:bg-red-100'
                  }`}
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div>
                  <h2 className="text-xl font-semibold text-red-700">{getCurrentSong()?.title}</h2>
                  <p className="text-gray-600">{getCurrentSong()?.artist}</p>
                  <p className="text-sm text-red-500 mt-1">Pejy {currentPage + 1}/2</p>
                </div>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-red-600 hover:bg-red-100'
                  }`}
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {currentLyricsLines.map((line, lineIndex) => (
                <div key={lineIndex} className="text-2xl md:text-3xl leading-relaxed">
                  {line.map((lyric, wordIndex) => {
                    const globalIndex = currentPage === 0 
                      ? currentLyricsLines.slice(0, lineIndex).reduce((acc, l) => acc + l.length, 0) + wordIndex
                      : lyricsPage1.length + currentLyricsLines.slice(0, lineIndex).reduce((acc, l) => acc + l.length, 0) + wordIndex;
                    
                    return (
                      <span
                        key={wordIndex}
                        style={getWordStyle(globalIndex)}
                        className="inline-block mx-1"
                      >
                        {lyric.word}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contrôles audio */}
        {selectedSong && showLyrics && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={restart}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                title="Avereno"
              >
                <RotateCcw size={20} />
              </button>
              
              <button
                onClick={togglePlay}
                disabled={!isAudioReady}
                className={`p-4 rounded-full transition-colors ${
                  isAudioReady 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title={isPlaying ? "Ajanony" : "Alefaso"}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </div>

            {/* Barre de progression */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Hira ankehitriny: <span className="font-medium text-red-600">{getCurrentSong()?.title}</span></p>
              <p className="text-xs mt-1">
                {!isAudioReady ? "Eo am-piandrasana..." : "Tsindrio ny play mba hanomboka ny karaoké!"}
              </p>
            </div>
          </div>
        )}

        {/* Audio element (caché) */}
        {selectedSong && (
          <audio
            ref={audioRef}
            preload="metadata"
            key={selectedSong}
          >
            <source src={getCurrentSong()?.file} type="audio/mpeg" />
            Tsy manohana ny audio ny navigateur-nao.
          </audio>
        )}
      </div>
    </div>
  );
}

export default Karaks;