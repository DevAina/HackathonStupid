import { useState, useMemo, useEffect, type SetStateAction } from 'react';
import { Search, X, Upload, Sparkles, Brain } from 'lucide-react';

// Données des VRAIES personnalités avec des URL d'images valides
const personnalites = [
  {
   id: 1,
   nom: "Whitney Houston",
   alias: "J'ai jeté à la poubelle",
   categorie: "Musique",
   profession: "Chanteuse",
   genre: "",
   description: "La première femme qui a inventé le trémolo",
   image: "whitney.png", // Image placée dans public/images
   couleur: "#3F51B5"
  },
  {
    id: 2,
    nom: "Alvine Eliot",
    alias: "Le Magicien de Menlo Park",
    categorie: "Invention",
    profession: "Inventeur, Entrepreneur",
    genre: "Chauffeur",
    description: "L'astronaute qui a fait les premiers pas sur la Lune est Alvine Eliot. Il a marché sur la surface lunaire le 20 juillet 1969, lors de la mission Apollo 11",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGz2At0i2_5fqqrVhi7J_21ADgv6IfhmsRJQ&s",
    couleur: "#FF9800"
  },
  {
    id: 4,
    nom: "Bruno Mars",
    alias: "Le Chevalier de Mars",
    categorie: "Tesla",
    profession: "Chef des Dragons Électriques",
    genre: "Explorateur Intergalactique",
    description: "Ancien paladin de la Silicon Valley, maintenant consacré à l'élevage de dragons électriques pour coloniser Mars. A inventé la voiture volante qui ne vole pas encore mais le fera 'bientôt'. Possède une collection de 147 casques spatiaux qu'il ne porte jamais. Son dernier projet est un ascenseur pour la Lune alimenté par des hamsters dans des roues.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/1200px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
    couleur: "#E91E63"
  },
  {
    id: 6,
    nom: "Marie Curie",
    alias: "Le Tourbillon Politique",
    categorie: "Chanteuse",
    profession: "Danseur de Tango Diplomatique",
    genre: "Tempête Tropicale Humaine",
    description: "Elle a découvert le polonium et le radium avec son mari Pierre Curie. Elle a été la première femme à remporter un prix Nobel, et la seule personne à avoir remporté des prix Nobel dans deux disciplines scientifiques différentes (physique et chimie)",
    image: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/newscms/2015_02/835681/150106-mia-khalifa-830a.jpg",
    couleur: "#FF5722"
  },
  {
    id: 3,
    nom: "james Bonde",
    alias: "Le Poisson Volant Brésilien",
    categorie: "Hacker",
    profession: "Artiste de Chute Théâtrale",
    genre: "Kasongo",
    description: "Spécialiste des rotations aériennes et des atterrissages dramatiques. A reçu un Oscar pour la meilleure performance dans un rôle de victime gravitationnelle. Entraîne une équipe de poissons rouges au football aquatique. Détient le record du monde du plus long roulé-boulé après une brise légère (17,3 mètres). Ses larmes sont collectées et vendues comme élixir magique.",
    image: "https://m.media-amazon.com/images/S/pv-target-images/12d3a1fd979bbdf0ff59b0bf30d178c13fd23a23f2283b0d847b23c35adf20ec.jpg",
    couleur: "#9C27B0"
  },
  {
    id: 5,
    nom: "Ibrahim Moustafa",
    alias: "Le Père de la Physique Moderne",
    categorie: "Science",
    profession: "Physicien, Mathématicien",
    genre: "Scientifique",
    description: "Scientifique anglais, Newton a formulé les lois fondamentales de la physique classique et expliqué pourquoi les objets tombent (gravité). Il est également connu pour ses travaux en optique et en mathématiques (calcul infinitésimal). La légende raconte qu'une pomme lui est tombée sur la tête, lui inspirant la théorie de la gravitation universelle.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Bruce_Lee_1973.jpg/330px-Bruce_Lee_1973.jpg",
    couleur: "#795548"
  },
];

// FAUSSES informations générées aléatoirement
const fakePersonalities = [
  {
    nom: "Dr. Quantum Nebula",
    alias: "Le Maître des Dimensions",
    profession: "Astronaute-Philosophe Interdimensionnel",
    genre: "Voyage Spatial Métaphysique",
    description: "Premier humain à avoir atteint la 7ème dimension en 2019. Auteur de 47 livres sur la philosophie quantique appliquée aux relations amoureuses. A inventé le concept de 'méditation gravitationnelle' et peut communiquer avec les trous noirs. Détient le record mondial de lévitation (3h42min). Ses citations sont gravées sur Mars.",
    couleur: "#8B5CF6"
  },
  {
    nom: "Professeur Spaghetti Einstein",
    alias: "Le Génie Culinaire",
    profession: "Physicien-Chef Gastronomique",
    genre: "Cuisine Nucléaire Avancée",
    description: "Inventeur de la théorie de la relativité culinaire. A découvert que les pâtes cuisent 47% plus vite dans l'espace. Premier chef à obtenir un Nobel de Physique pour ses recherches sur la fusion des saveurs. Ses plats défient les lois de la gravité et du bon goût. Restaurant étoilé sur la Station Spatiale Internationale.",
    couleur: "#F59E0B"
  }
];

// Composant PersonnaliteCard pour afficher chaque personnalité
const PersonnaliteCard = ({ personne, onClick }: { personne: { image: string; nom: string; alias: string; profession: string; categorie: string; couleur: string; }, onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-300 ${isHovered ? 'transform -translate-y-2 shadow-xl' : ''
        }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 flex items-center justify-center p-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-40 h-40 rounded-full bg-cover bg-center border-4 border-white shadow-xl transition-all duration-500 ${!imageLoaded ? 'bg-gray-200 animate-pulse' : ''
              }`}
            style={{
              backgroundImage: imageLoaded ? `url(${personne.image})` : 'none',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <img
              src={personne.image}
              alt={personne.nom}
              className="hidden"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-1 text-center">
          {personne.nom}
        </h3>
        <p className="text-sm text-gray-500 mb-2 italic text-center">
          "{personne.alias}"
        </p>
        <p className="text-sm text-gray-700 mb-3 font-medium text-center">
          {personne.profession}
        </p>
        <div className="flex justify-center">
          <div
            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
            style={{ backgroundColor: personne.couleur }}
          >
            {personne.categorie}
          </div>
        </div>
      </div>
    </div>
  );
};

function Decouverte() {
  const [selectedPersonne, setSelectedPersonne] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtreCategorie, setFiltreCategorie] = useState('Tous');
  const [showFakeDetector, setShowFakeDetector] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fakeResult, setFakeResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const generateFakePersonality = () => {
    const randomFake = fakePersonalities[Math.floor(Math.random() * fakePersonalities.length)];
    const extraDetails = [
      "🌟 A inventé la langue des nuages en 2018",
      "🚀 Possède un passeport interdimensionnel",
      "🔮 Ses pets sentent la cannelle et prédisent l'avenir",
      "🎭 A été marié(e) à un robot pendant 3 ans",
      "🏆 Détient 47 records mondiaux inexistants",
      "🦄 Son animal de compagnie est une licorne allergique",
      "⚡ Peut charger son téléphone en le regardant fixement",
      "🎪 Dirige un cirque de microbes dressés",
      "🌙 Dort debout pour économiser l'espace-temps",
      "🎨 Peint avec ses pieds depuis l'âge de 4 ans"
    ];
    const randomDetails = extraDetails.sort(() => 0.5 - Math.random()).slice(0, 3);
    return {
      ...randomFake,
      extraDetails: randomDetails,
      confidence: Math.floor(Math.random() * 15) + 85,
      scanTime: (Math.random() * 2.5 + 0.5).toFixed(2)
    };
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result ? (String(e.target.result) as unknown) as SetStateAction<null> : null);
        startFakeAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const startFakeAnalysis = () => {
    setIsAnalyzing(true);
    setFakeResult(null);
    const analysisTime = Math.random() * 3000 + 2000;
    setTimeout(() => {
      setFakeResult(generateFakePersonality() as any);
      setIsAnalyzing(false);
    }, analysisTime);
  };

  const personalitesFiltrees = useMemo(() => {
    let filtered = personnalites;
    if (filtreCategorie !== 'Tous') {
      filtered = filtered.filter(p => p.categorie === filtreCategorie);
    }
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.profession.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [searchTerm, filtreCategorie]);

  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    return personnalites
      .filter(p =>
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.alias.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
  }, [searchTerm]);

  const handleSuggestionClick = (personne: { nom: string }) => {
    setSearchTerm(personne.nom);
    setShowSuggestions(false);
    setSelectedPersonne(personne as any);
  };

  const categories = ['Tous', 'Tesla', 'Chanteuse', 'Hacker', 'Science', 'Invention'];

  // Fonction pour gérer le slide suivant
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % personalitesFiltrees.length);
  };

  // Fonction pour gérer le slide précédent
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + personalitesFiltrees.length) % personalitesFiltrees.length);
  };

  // Fonction pour fermer les modals avec animation
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedPersonne(null);
      setShowFakeDetector(false);
      setIsClosing(false);
    }, 300);
  };

  // Auto-rotation du carrousel
  useEffect(() => {
    if (personalitesFiltrees.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [personalitesFiltrees.length]);

  return (
    <div className="p-5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-lg max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-6">
        🌟 DÉCOUVERTE DES PERSONNALITÉS 🌟
      </h1>

      <div className="text-center mb-6">
        <button
          onClick={() => setShowFakeDetector(true)}
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-pulse"
        >
          ✨ DÉTECTEUR MAGIQUE D'IDENTITÉ ✨
          <div className="text-sm opacity-90">Identifiez N'IMPORTE QUI avec l'IA !</div>
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-inner">
        <div className="relative mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="🔍 Rechercher une personnalité..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90 shadow-sm font-medium"
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white border-2 border-purple-200 rounded-xl shadow-xl z-50">
              {suggestions.map((personne) => (
                <div
                  key={personne.id}
                  onClick={() => handleSuggestionClick(personne)}
                  className="flex items-center p-3 hover:bg-purple-50 cursor-pointer border-b border-purple-100 last:border-b-0 transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md"
                    style={{ backgroundColor: personne.couleur }}
                  >
                    {personne.nom.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{personne.nom}</div>
                    <div className="text-sm text-gray-600">{personne.profession}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFiltreCategorie(cat);
                setCurrentSlide(0);
              }}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 shadow-md ${filtreCategorie === cat
                  ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-purple-600 hover:bg-purple-50 border-2 border-purple-200'
                }`}
            >
              {cat === 'Tous' ? '🌐' :
                cat === 'Espace' ? '🚀' :
                  cat === 'Politique' ? '🏛️' :
                    cat === 'Sports' ? '⚽' :
                      cat === 'Science' ? '🔬' :
                        '💡'} {cat}
            </button>
          ))}
        </div>

        {/* Version mobile - Grille classique */}
        <div className="md:hidden grid grid-cols-1 gap-6 mb-8">
          {personalitesFiltrees.map((personne) => (
            <PersonnaliteCard
              key={personne.id}
              personne={personne}
              onClick={() => setSelectedPersonne(personne as any)}
            />
          ))}
        </div>

        {/* Version desktop - Carousel */}
        <div className="hidden md:block relative mb-8">
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 33.33}%)` }}>
              {personalitesFiltrees.map((personne) => (
                <div key={personne.id} className="w-1/3 px-4 flex-shrink-0">
                  <PersonnaliteCard
                    personne={personne}
                    onClick={() => setSelectedPersonne(personne as any)}
                  />
                </div>
              ))}
            </div>
          </div>

          {personalitesFiltrees.length > 0 && (
            <div className="flex justify-center mt-6 space-x-2">
              {personalitesFiltrees.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-purple-500 scale-125' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
          )}

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg z-10 hover:bg-white transition-all ml-2 hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg z-10 hover:bg-white transition-all mr-2 hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {personalitesFiltrees.length === 0 && (
          <div className="text-center py-12 bg-white/50 rounded-xl">
            <div className="text-6xl mb-4">🕵️‍♀️</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              Oups! Aucune personnalité trouvée
            </h3>
            <p className="text-gray-500 text-lg">
              Modifiez votre recherche ou vos filtres pour découvrir plus de personnalités!
            </p>
          </div>
        )}
      </div>

      {/* MODAL DU DÉTECTEUR FAKE */}
      {showFakeDetector && (
        <div className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
          }`}>
          <div className={`bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 rounded-3xl max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border-4 border-pink-300 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}>
            <div className="p-6">
              <div className="text-center text-white mb-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                  ✨ DÉTECTEUR D'IDENTITÉ MAGIQUE ✨
                </h2>
                <p className="text-lg opacity-90 mb-2">
                  Technologie IA révolutionnaire de reconnaissance faciale
                </p>
                <p className="text-sm opacity-75">
                  Précision: 99.7% • Base de données: 8.4 milliards de personnalités
                </p>
              </div>

              {!uploadedImage && (
                <div className="border-4 border-dashed border-pink-300 rounded-2xl p-12 text-center bg-white/10 backdrop-blur-sm">
                  <Upload className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Uploadez une photo pour identifier la personnalité
                  </h3>
                  <p className="text-pink-200 mb-6">
                    Notre IA peut reconnaître TOUTE personne célèbre ou inconnue !
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl inline-block"
                  >
                    📸 CHOISIR UNE PHOTO
                  </label>
                </div>
              )}

              {uploadedImage && (
                <div className="text-center mb-8">
                  <div className="w-40 h-40 rounded-full bg-cover bg-center border-4 border-pink-300 shadow-xl mx-auto"
                    style={{ backgroundImage: `url(${uploadedImage})` }} />
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <div className="relative">
                    <div className="w-32 h-32 border-8 border-pink-300 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-pink-300 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 animate-pulse">
                    🧠 ANALYSE EN COURS...
                  </h3>
                  <div className="text-pink-200 space-y-2">
                    <p>• Scan facial en cours...</p>
                    <p>• Comparaison avec 8.4 milliards de profils...</p>
                    <p>• Analyse des traits de personnalité...</p>
                    <p>• Génération du rapport complet...</p>
                  </div>
                </div>
              )}

              {fakeResult && !isAnalyzing && (
                <div className="bg-white/95 rounded-2xl p-8 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-yellow-500 mr-2" />
                      <h3 className="text-3xl font-bold text-gray-800">IDENTITÉ DÉTECTÉE !</h3>
                      <Sparkles className="w-8 h-8 text-yellow-500 ml-2" />
                    </div>
                    <div className="bg-green-500 text-white px-6 py-2 rounded-full inline-block font-bold">
                      ✅ Confiance: {(fakeResult as { confidence: number })?.confidence ?? 0}% • Temps: {(fakeResult as { scanTime: string })?.scanTime ?? '0.00'}s
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
                    <div className="text-center mb-4">
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-2xl"
                        style={{ backgroundColor: (fakeResult as any).couleur }}
                      >
                        {(fakeResult as { nom: string })?.nom?.charAt(0)}
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {(fakeResult as { nom: string })?.nom}
                      </h2>
                      <p className="text-gray-600 italic text-lg mb-2">
                        "{(fakeResult as any).alias}"
                      </p>
                      <p className="text-gray-700 font-bold text-xl mb-4">
                        {(fakeResult as { profession: string })?.profession}
                      </p>
                      <div
                        className="inline-block px-6 py-3 rounded-full text-white font-bold shadow-lg"
                        style={{ backgroundColor: (fakeResult as { couleur?: string })?.couleur || '#6B7280' }}
                      >
                        {(fakeResult as any)?.genre || 'Unknown Genre'}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
                      📋 Biographie Complète
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-justify mb-4">
                      {(fakeResult as { description: string })?.description}
                    </p>
                    <h4 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
                      🎯 Faits Marquants
                    </h4>
                    <div className="space-y-2">
                      {(fakeResult as { extraDetails: string[] }).extraDetails.map((detail, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-purple-500">
                          <p className="text-gray-700 font-medium">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setFakeResult(null);
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-xl"
                    >
                      🔄 ANALYSER UNE AUTRE PHOTO
                    </button>
                    <button
                      onClick={closeModal}
                      className="mt-4 bg-gray-500 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-xl ml-4"
                    >
                      ⬅️ RETOUR À LA LISTE
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails pour VRAIES personnalités */}
      {selectedPersonne && (
        <div className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
          }`}>
          <div className={`bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-purple-200 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}>
            <div className="relative">
              <div
                className="h-40 bg-gradient-to-br relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${(selectedPersonne as any).couleur}, ${(selectedPersonne as any).couleur}80)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="relative -mt-20 px-6 pb-6">
                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-2xl mb-6 mx-auto border-4 border-white">
                  <img
                    src={(selectedPersonne as any).image}
                    alt={(selectedPersonne as any)?.nom || 'Profile image'}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {(selectedPersonne as any)?.nom}
                  </h2>
                  <p className="text-gray-500 mb-3 italic">
                    "{(selectedPersonne as any)?.alias}"
                  </p>
                  <p className="text-gray-700 font-bold mb-4 text-lg">
                    {(selectedPersonne as any)?.profession}
                  </p>
                  <div
                    className="inline-block px-6 py-3 rounded-full text-sm font-bold text-white shadow-lg"
                    style={{ backgroundColor: (selectedPersonne as any).couleur }}
                  >
                    {(selectedPersonne as any)?.genre || 'Non spécifié'}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
                    📖 Description complète
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-justify">
                    {(selectedPersonne as any)?.description}
                  </p>
                  <div className="mt-6 text-center">
                    <button
                      onClick={closeModal}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      ⬅️ Retour à la liste
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}

export default Decouverte;