import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import 'animate.css';

function Layout() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [randomEmoji, setRandomEmoji] = useState('🤪');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [burgerState, setBurgerState] = useState(0);

  const emojis = ['🤪', '😵‍💫', '🤡', '🙃', '😜', '🤠', '🥴', '😎', '🤯', '😂'];

  // Liens de navigation
  const navLinks = [
    { to: "/outils", text: "🔧 OUTILS 🔧" },
    { to: "/decouverte", text: "🤖 DECOUVERTE 🤖" },
    { to: "/chat", text: "📩 CHAT 📩" },
    { to: "/karaks", text: "🎤 KARAKS 🎤" },
    { to: "/triche", text: "📃 TRICHE 📃" },
    { to: "/gaspillage", text: "💸 GASPILLAGE 💸" },
    { to: "/", text: "🤯 PROBLÈMES 🤯" },
    { to: "/jeux", text: "👾 JEUX 👾" },
  ];

  useEffect(() => {
    // Changer l'emoji toutes les 2 secondes
    const emojiInterval = setInterval(() => {
      setRandomEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 2000);

    // Horloge
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Animation aléatoire du burger quand ouvert
    const burgerInterval = setInterval(() => {
      if (isMenuOpen) {
        setBurgerState(Math.floor(Math.random() * 5));
      }
    }, 1500);

    return () => {
      clearInterval(emojiInterval);
      clearInterval(timeInterval);
      clearInterval(burgerInterval);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setBurgerState(0);
  };

  // Styles dynamiques pour le burger fou
  const burgerStyles = [
    { transform: 'rotate(0deg)', background: 'yellow' },
    { transform: 'rotate(360deg)', background: 'red' },
    { transform: 'scale(1.5)', background: 'blue' },
    { transform: 'skew(20deg, 20deg)', background: 'green' },
    { transform: 'translateY(10px) rotate(45deg)', background: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      {/* Logo de l'application en haut à gauche */}
      <div className="fixed top-4 left-4 z-50">
        <img 
          src="/logo.png" 
          alt="Logo de l'application" 
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-dashed border-purple-500 shadow-lg animate__animated animate__pulse animate__infinite"
        />
      </div>

      {/* Confetti flottants */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-spin">🎉</div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce">✨</div>
        <div className="absolute bottom-32 left-16 text-5xl animate-pulse">🦄</div>
        <div className="absolute bottom-16 right-32 text-4xl animate-ping">🌈</div>
        <div className="absolute top-1/2 left-1/4 text-2xl animate-spin">🍕</div>
        <div className="absolute top-3/4 right-1/4 text-3xl animate-bounce">🎪</div>
      </div>

      {/* Menu mobile */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={toggleMenu}
          className="p-3 rounded-full shadow-lg border-4 border-dashed border-purple-500 transition-all duration-500"
          style={burgerStyles[burgerState]}
          aria-label="Menu"
        >
          {isMenuOpen ? (
            <span className="text-3xl">❌</span>
          ) : (
            <div className="space-y-2 relative">
              <span className="block w-8 h-1 bg-purple-700 rounded-full"></span>
              <span className="block w-8 h-1 bg-purple-700 rounded-full animate-pulse"></span>
              <span className="block w-8 h-1 bg-purple-700 rounded-full"></span>
              <span className="absolute -top-2 -right-2 text-2xl animate-bounce">🍔</span>
            </div>
          )}
        </button>

        {/* Menu déroulant */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-4 w-72 bg-gradient-to-b from-yellow-200 to-pink-200 rounded-2xl p-4 shadow-2xl border-4 border-dashed border-indigo-500 animate__animated animate__bounceIn">
            <div className="absolute -top-4 -left-4 text-4xl animate-spin">🌀</div>
            <div className="absolute -bottom-4 -right-4 text-4xl animate-bounce">🎪</div>
            
            <ul className="space-y-3 relative z-10">
              {navLinks.map((link, index) => (
                <li 
                  key={index} 
                  className="animate__animated animate__fadeInUp" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="block no-underline text-purple-900 text-lg font-bold bg-white py-3 px-4 rounded-lg border-3 border-dashed border-purple-500 transition-all duration-300 hover:bg-purple-500 hover:text-white hover:scale-105 hover:rotate-2"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto p-5 relative z-10 pt-20 md:pt-10">
        <header className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 rounded-3xl p-6 mb-8 shadow-2xl border-4 border-dashed border-indigo-500 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 w-8 h-8 bg-red-400 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-4 w-6 h-6 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 left-8 w-10 h-10 bg-green-400 rounded-full animate-spin"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-purple-900 text-center mb-2 transform hover:scale-105 transition-transform duration-300">
              <span className="animate-pulse">{randomEmoji}</span> L'APPLICATION LE PLUS INUTILE DU MONDE <span className="animate-pulse">{randomEmoji}</span>
            </h1>

            {/* Horloge */}
            <div className="text-center mb-4 rounded-full p-2">
              <p className="text-sm text-purple-900 font-semibold">
                ⏰ Temps perdu: {currentTime.toLocaleTimeString()} ⏰
              </p>
            </div>

            {/* Navigation desktop */}
            <nav className="hidden lg:flex justify-center items-center">
              <ul className="flex flex-wrap gap-2 md:gap-4 list-none p-0 m-0 justify-center">
                {navLinks.map((link, index) => (
                  <li 
                    key={index} 
                    className="transform -rotate-2 transition-transform duration-300 ease-in-out hover:rotate-3 hover:scale-110"
                  >
                    <Link
                      to={link.to}
                      className="no-underline text-purple-900 text-lg md:text-xl font-bold bg-yellow-300 py-1 px-3 md:py-2 md:px-5 rounded-lg border-3 border-dashed border-purple-700 inline-block transition-all duration-300 ease-in-out hover:bg-purple-700 hover:text-yellow-300 hover:border-yellow-300 hover:scale-110 hover:-rotate-3"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main className="relative">
          {/* Conteneur principal */}
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-2xl p-4 md:p-8 min-h-[300px] md:min-h-[500px] border-4 border-dashed border-purple-300 relative overflow-hidden">
            {/* Décorations */}
            <div className="absolute top-4 right-4 text-4xl md:text-6xl opacity-20 animate-spin">⚡</div>
            <div className="absolute bottom-4 left-4 text-4xl md:text-5xl opacity-20 animate-bounce">🌟</div>

            <div className="relative z-10">
              <Outlet />
            </div>
          </div>
        </main>

        <footer className="mt-8 md:mt-12 border-t-4 border-dashed border-purple-400 pt-4 md:pt-6 text-center relative">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-3 md:p-4 shadow-xl">
            <p className="text-white text-base md:text-lg font-bold mb-1 md:mb-2">
              © 2025 - Site créé pour gaspiller votre temps précieux 😜
            </p>
            <p className="text-purple-100 text-xs md:text-sm">
              ⚠️ Attention: Ce site peut provoquer des fous rires incontrôlables ⚠️
            </p>
            <div className="flex justify-center gap-2 md:gap-4 mt-2 md:mt-3">
              <span className="text-xl md:text-2xl animate-bounce">🎪</span>
              <span className="text-xl md:text-2xl animate-pulse">🎨</span>
              <span className="text-xl md:text-2xl animate-spin">🎯</span>
              <span className="text-xl md:text-2xl animate-bounce">🎮</span>
              <span className="text-xl md:text-2xl animate-pulse">🎭</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Layout;