import { useState, useEffect, useRef } from 'react';
import fan from '/sounds/fan.mp3';

function Outils() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [fanSpeed, setFanSpeed] = useState<number>(0);
  const [weight, setWeight] = useState<number>(70); // Pour la balance
  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const [calculatorValue, setCalculatorValue] = useState<string>('0');
  const [acTemperature, setAcTemperature] = useState<number>(22);
  const [acPower, setAcPower] = useState<boolean>(false);
  const [measurementStarted, setMeasurementStarted] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [measurementResult, setMeasurementResult] = useState<number | null>(null);
  
  // Références pour les sons
  const fanSoundRef = useRef<HTMLAudioElement | null>(null);
  const acSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Effet pour gérer le son du ventilateur
  useEffect(() => {
    if (fanSoundRef.current) {
      if (fanSpeed > 0 && selectedTool === 'ventilateur') {
        fanSoundRef.current.volume = fanSpeed / 10;
        fanSoundRef.current.play();
      } else {
        fanSoundRef.current.pause();
        fanSoundRef.current.currentTime = 0;
      }
    }
  }, [fanSpeed, selectedTool]);
  
  // Effet pour gérer le son du climatiseur
  useEffect(() => {
    if (acSoundRef.current) {
      if (acPower && selectedTool === 'climatiseur') {
        acSoundRef.current.volume = 0.7;
        acSoundRef.current.play();
      } else {
        acSoundRef.current.pause();
        acSoundRef.current.currentTime = 0;
      }
    }
  }, [acPower, selectedTool]);

  const startMeasurement = () => {
    setFakeLoading(true);
    setMeasurementStarted(true);
    setMeasurementResult(null);
    
    // Simulation du temps de mesure
    setTimeout(() => {
      const randomVariation = Math.floor(Math.random() * 10) - 5; // -5 à +5 kg
      const calculatedWeight = Math.max(20, Math.min(150, weight + randomVariation));
      setMeasurementResult(calculatedWeight);
      setFakeLoading(false);
    }, 3000);
  };

  const renderTool = () => {
    switch (selectedTool) {
      case 'climatiseur':
        return (
          <div>
            <h3 className="text-purple-600 font-bold text-center text-2xl mb-4">Climatiseur Virtuel</h3>
            
            {/* Contrôle de l'alimentation */}
            <div className="flex justify-center mb-6">
              <button 
                onClick={() => setAcPower(!acPower)}
                className={`px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ${acPower 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 text-gray-700'}`}
              >
                {acPower ? 'ÉTEINDRE' : 'ALLUMER'}
              </button>
            </div>
            
            {/* Appareil climatiseur */}
            <div className="relative w-full max-w-md mx-auto h-[250px] mb-6 bg-gray-100 rounded-xl border-4 border-gray-300 p-4">
              {/* Écran de température */}
              <div className="absolute top-4 right-4 w-[80px] h-[40px] bg-black rounded-md flex items-center justify-center">
                <span className={`text-2xl font-bold ${acPower ? 'text-green-400' : 'text-gray-600'}`}>
                  {acPower ? acTemperature : '--'}
                </span>
              </div>
              
              {/* Grilles de ventilation */}
              <div className="absolute top-[60px] left-4 right-4 h-[30px] bg-gray-200 rounded-md flex justify-around items-center overflow-hidden">
                {acPower && Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-[2px] h-full bg-gray-400 animate-pulse"></div>
                ))}
              </div>
              
              {/* Boutons de contrôle */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => acPower && setAcTemperature(prev => Math.min(prev + 1, 30))}
                    disabled={!acPower}
                    className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center ${acPower ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-300 text-gray-500'}`}
                  >
                    <span className="text-2xl">+</span>
                  </button>
                  <span className="text-sm">Plus chaud</span>
                </div>
                
                <div className="flex flex-col items-center mx-4">
                  <input 
                    type="range" 
                    min="16" 
                    max="30" 
                    value={acTemperature} 
                    onChange={(e) => setAcTemperature(parseInt(e.target.value))} 
                    disabled={!acPower}
                    className="w-[120px] h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-2"
                  />
                  <span className="text-sm">Température</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => acPower && setAcTemperature(prev => Math.max(prev - 1, 16))}
                    disabled={!acPower}
                    className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center ${acPower ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'}`}
                  >
                    <span className="text-2xl">-</span>
                  </button>
                  <span className="text-sm">Plus froid</span>
                </div>
              </div>
              
              {/* Effet visuel quand le climatiseur est allumé */}
              {acPower && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute text-2xl animate-bounce"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${5 + Math.random() * 5}s`
                      }}
                    >
                      ❄️
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Affichage de la température */}
            <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300 text-center w-4/5 mx-auto">
              <p className="text-lg">
                <span className="font-bold">Température réglée:</span> 
                <span className={acTemperature < 22 ? 'text-blue-500' : 'text-red-500'}> {acPower ? `${acTemperature}°C` : '--'}</span>
              </p>
            </div>
            
            <p className="mt-5 text-center">
              {acPower 
                ? acTemperature < 20 
                  ? "Brrr! C'est frais par ici!" 
                  : acTemperature > 25 
                    ? "C'est plutôt tiède pour un climatiseur..." 
                    : "Température parfaite!"
                : "Le climatiseur est éteint"}
            </p>
          </div>
        );
        
      case 'ventilateur':
        // Calcul de la température basée sur la vitesse du ventilateur
        const fanTemperature = Math.max(26 - fanSpeed * 0.5, 20).toFixed(1);
        
        return (
          <div>
            <h3 className="text-purple-600 font-bold text-center text-2xl mb-4">Ventilateur Virtuel</h3>
            <p className="text-center">Vitesse: {fanSpeed}</p>
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={fanSpeed} 
              onChange={(e) => setFanSpeed(parseInt(e.target.value))} 
              className="w-4/5 mx-auto block mt-3"
            />
            <div className="relative w-[200px] h-[200px] mx-auto mt-4">
              <div className="w-[150px] h-[150px] rounded-full border-[5px] border-purple-600 relative mx-auto flex justify-center items-center">
                <div className="absolute w-[120px] h-[20px] bg-yellow-400 rounded-[10px] origin-center"
                  style={{
                    transform: `rotate(0deg) ${fanSpeed > 0 ? `translateY(${Math.sin(Date.now() / 100) * 5}px)` : ''}`,
                    animation: fanSpeed > 0 ? `spin ${11 - fanSpeed}s linear infinite` : 'none'
                  }}></div>
                <div className="absolute w-[120px] h-[20px] bg-yellow-400 rounded-[10px] origin-center"
                  style={{
                    transform: `rotate(60deg) ${fanSpeed > 0 ? `translateY(${Math.sin(Date.now() / 100 + 2) * 5}px)` : ''}`,
                    animation: fanSpeed > 0 ? `spin ${11 - fanSpeed}s linear infinite` : 'none'
                  }}></div>
                <div className="absolute w-[120px] h-[20px] bg-yellow-400 rounded-[10px] origin-center"
                  style={{
                    transform: `rotate(120deg) ${fanSpeed > 0 ? `translateY(${Math.sin(Date.now() / 100 + 4) * 5}px)` : ''}`,
                    animation: fanSpeed > 0 ? `spin ${11 - fanSpeed}s linear infinite` : 'none'
                  }}></div>
              </div>
              <div className="w-[60px] h-[100px] bg-purple-600 mx-auto"></div>
            </div>
            
            {/* Affichage de la température */}
            <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300 text-center w-4/5 mx-auto">
              <p className="text-lg">
                <span className="font-bold">Température ressentie:</span> 
                <span className={fanSpeed > 5 ? 'text-blue-500' : 'text-red-500'}> {fanTemperature}°C</span>
              </p>
            </div>
            
            <p className="mt-5 text-center">{fanSpeed > 0 ? "Whoosh! Vous sentez l'air virtuel?" : "Le ventilateur est éteint"}</p>
            
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        );
      
      case 'balance':
        return (
          <div>
            <h3 className="text-purple-600 font-bold text-center text-2xl mb-4">Balance Magique</h3>
            
            {!measurementStarted ? (
              <div className="text-center">
                <div className="relative w-[200px] h-[200px] mx-auto mt-4 mb-6">
                  {/* Plateforme de la balance vide */}
                  <div className="w-[180px] h-[20px] bg-purple-600 rounded-[10px] mx-auto"></div>
                  <div className="w-[20px] h-[100px] bg-purple-600 mx-auto">
                    <div className="absolute w-[60px] h-[30px] bg-white border-2 border-purple-600 rounded top-[10px] left-[80px] flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">0.0</span>
                    </div>
                  </div>
                  <div className="w-[100px] h-[20px] bg-purple-600 rounded-[20px] mx-auto"></div>
                </div>
                
                <p className="mb-4 text-lg">Placez un objet sur votre écran maintenant!</p>
                <p className="mb-6 text-sm text-gray-600">(La balance magique peut mesurer à travers l'écran)</p>
                
                <button 
                  onClick={startMeasurement}
                  className="px-6 py-3 bg-purple-600 text-white rounded-full font-bold text-lg hover:bg-purple-700 transition-colors"
                >
                  Démarrer la Mesure
                </button>
              </div>
            ) : fakeLoading ? (
              <div className="text-center">
                <div className="relative w-[200px] h-[200px] mx-auto mt-4 mb-6">
                  {/* Animation de mesure */}
                  <div className="w-[180px] h-[20px] bg-purple-600 rounded-[10px] mx-auto animate-pulse"></div>
                  <div className="w-[20px] h-[100px] bg-purple-600 mx-auto">
                    <div className="absolute w-[60px] h-[30px] bg-white border-2 border-purple-600 rounded top-[10px] left-[80px] flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">...</span>
                    </div>
                    <div 
                      className="absolute w-[60px] h-[4px] bg-red-600 top-[50px] left-[80px] origin-right animate-spin"
                      style={{ animationDuration: '1.5s' }}
                    ></div>
                  </div>
                  <div className="w-[100px] h-[20px] bg-purple-600 rounded-[20px] mx-auto"></div>
                </div>
                
                <p className="text-lg">Mesure en cours...</p>
                <p className="text-sm text-gray-600">Ne bougez pas l'objet!</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative w-[200px] h-[200px] mx-auto mt-4 mb-6">
                  {/* Plateforme de la balance avec résultat */}
                  <div className="w-[180px] h-[20px] bg-purple-600 rounded-[10px] mx-auto"></div>
                  <div className="w-[20px] h-[100px] bg-purple-600 mx-auto">
                    <div className="absolute w-[60px] h-[30px] bg-white border-2 border-purple-600 rounded top-[10px] left-[80px] flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">{measurementResult}</span>
                    </div>
                    <div 
                      className="absolute w-[60px] h-[4px] bg-red-600 top-[50px] left-[80px] origin-right"
                      style={{
                        transform: `rotate(${-45 + (measurementResult! / 150) * 90}deg)`
                      }}
                    ></div>
                  </div>
                  <div className="w-[100px] h-[20px] bg-purple-600 rounded-[20px] mx-auto"></div>
                </div>
                
                <p className="text-xl font-bold mb-2">Résultat: {measurementResult} kg</p>
                <p className="mb-4">
                  {measurementResult! > 120 ? "Wow! Cet objet est lourd!" : 
                   measurementResult! > 60 ? "Poids moyen détecté" : 
                   "Objet léger détecté"}
                </p>
                
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setMeasurementStarted(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full font-bold hover:bg-gray-400 transition-colors"
                  >
                    Nouvelle Mesure
                  </button>
                  <button 
                    onClick={() => setWeight(measurementResult!)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-bold text-purple-600 mb-2">Ajustement manuel</h4>
              <p className="text-sm mb-2">Calibrage: {weight} kg</p>
              <input 
                type="range" 
                min="0" 
                max="150" 
                value={weight} 
                onChange={(e) => setWeight(parseInt(e.target.value))} 
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-2">
                Ajustez ce curseur si la balance n'est pas assez précise
              </p>
            </div>
          </div>
        );
        
      case 'lampe':
        return (
          <div>
            <h3 className="text-purple-600 font-bold text-center text-2xl mb-4">Lampe de Poche Virtuelle</h3>
            <div className="relative w-[100px] h-[250px] flex flex-col items-center mx-auto">
              <div 
                className="w-[100px] h-[150px] absolute top-[-100px] transition-opacity duration-300 ease-in-out"
                style={{
                  background: 'radial-gradient(ellipse at top, rgba(255,255,0,0.8) 0%, rgba(255,255,0,0) 70%)',
                  opacity: flashlightOn ? 1 : 0
                }}
              ></div>
              <div className="w-[80px] h-[40px] bg-[#333333] rounded-[5px_5px_20px_20px]"></div>
              <div className="w-[60px] h-[150px] bg-purple-600 rounded-[10px_10px_0_0]"></div>
            </div>
            <button 
              onClick={() => setFlashlightOn(!flashlightOn)}
              className="mt-5 p-[10px] rounded-[5px] text-lg cursor-pointer transition-colors duration-300 ease-in-out block mx-auto"
              style={{
                backgroundColor: flashlightOn ? '#ffcc00' : '#6600cc',
                color: flashlightOn ? '#6600cc' : '#ffcc00'
              }}
            >
              {flashlightOn ? "Éteindre" : "Allumer"}
            </button>
            <p className="mt-5 text-center">
              {flashlightOn ? "Wow! Quelle luminosité virtuelle!" : "Il fait noir ici..."}
            </p>
          </div>
        );

      case 'calculatrice':
        const handleCalculatorButton = (value: string) => {
          if (value === 'C') {
            setCalculatorValue('0');
          } else if (value === '=') {
            try {
              // Calculer le vrai résultat d'abord
              const realResult = Function('return ' + calculatorValue)();
              
              // Générer un faux résultat amusant
              const fakeResults = [
                '42', // La réponse à tout
                '🥕', // Une carotte
                'ERREUR 404: Maths non trouvées',
                '∞ + 1',
                'Patate',
                '🎂',
                '2 + 2 = 🐟',
                'NaN mais en français',
                realResult + 0.1, // Presque juste
                Math.floor(Math.random() * 1000), // Nombre aléatoire
                'Demandez à Siri',
                '💩',
                'Ça dépend...',
                realResult * -1, // Opposé du vrai résultat
                '🦄', // Licorne
                'BLUE SCREEN',
                realResult + ' (peut-être)',
                '🤖 CALCUL IMPOSSIBLE',
                'Trop compliqué!',
                '7' // Toujours 7
              ];
              
              // Choisir un résultat faux aléatoire
              const randomFakeResult = fakeResults[Math.floor(Math.random() * fakeResults.length)];
              setCalculatorValue(String(randomFakeResult));
            } catch (error) {
              setCalculatorValue('Même pas capable de faire une erreur correctement! 🤦‍♂️');
            }
          } else {
            setCalculatorValue(prev => prev === '0' ? value : prev + value);
          }
        };

        return (
          <div>
            <h3 className="text-purple-600 font-bold text-center text-2xl mb-4">Calculatrice Menteuse Virtuelle</h3>
            <div className="w-[220px] bg-[#333] rounded-[10px] p-[15px] flex flex-col gap-[10px] mx-auto">
              <div className="bg-[#ddd] p-[10px] rounded-[5px] text-right text-2xl font-mono min-h-[40px] overflow-hidden">
                {calculatorValue}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C'].map(btn => (
                  <button 
                    key={btn} 
                    onClick={() => handleCalculatorButton(btn)}
                    className="p-[10px] bg-purple-600 text-white rounded-[5px] text-lg cursor-pointer hover:bg-purple-700 transition-colors"
                    style={{
                      gridColumn: btn === 'C' ? 'span 4' : 'auto'
                    }}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-5 text-center text-sm">
              ⚠️ ATTENTION: Cette calculatrice donne TOUJOURS des réponses fausses! 🤣<br/>
              Parfait pour confondre vos professeurs de maths! 😈
            </p>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <h3 className="text-purple-600 font-bold text-center text-2xl mb-4">Sélectionnez un outil inutile ci-dessus</h3>
            <p>Tous nos outils sont garantis 100% virtuels et 200% inutiles!</p>
            <p className="text-6xl">🛠️</p>
          </div>
        );
    }
  };

  return (
    <div className="p-5 bg-blue-100 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h1 className="text-purple-600 font-bold text-center text-3xl mb-6">🔧 OUTILS TOTALEMENT INUTILES 🔧</h1>
      
      {/* Éléments audio pour les effets sonores */}
      <audio 
        ref={fanSoundRef} 
        src={fan}
        loop 
        className="hidden"
      />
      <audio 
        ref={acSoundRef} 
        src="https://assets.mixkit.co/sfx/212/212-preview.mp3" 
        loop 
        className="hidden"
      />
      
      <div className="flex flex-wrap gap-5 justify-center mb-8">
        <button 
          onClick={() => setSelectedTool('ventilateur')} 
          className={`p-4 border-3 border-dashed border-purple-600 rounded-xl cursor-pointer font-bold text-lg transition-all duration-300 min-w-[150px] text-center ${selectedTool === 'ventilateur' 
            ? 'bg-purple-600 text-yellow-400 border-yellow-400 scale-105' 
            : 'bg-yellow-400 text-purple-600'}`}
        >
          🌬️ Ventilateur
        </button>
        <button 
          onClick={() => setSelectedTool('climatiseur')} 
          className={`p-4 border-3 border-dashed border-purple-600 rounded-xl cursor-pointer font-bold text-lg transition-all duration-300 min-w-[150px] text-center ${selectedTool === 'climatiseur' 
            ? 'bg-purple-600 text-yellow-400 border-yellow-400 scale-105' 
            : 'bg-yellow-400 text-purple-600'}`}
        >
          ❄️ Climatiseur
        </button>
        <button 
          onClick={() => setSelectedTool('balance')} 
          className={`p-4 border-3 border-dashed border-purple-600 rounded-xl cursor-pointer font-bold text-lg transition-all duration-300 min-w-[150px] text-center ${selectedTool === 'balance' 
            ? 'bg-purple-600 text-yellow-400 border-yellow-400 scale-105' 
            : 'bg-yellow-400 text-purple-600'}`}
        >
          ⚖️ Balance
        </button>
        <button 
          onClick={() => setSelectedTool('lampe')} 
          className={`p-4 border-3 border-dashed border-purple-600 rounded-xl cursor-pointer font-bold text-lg transition-all duration-300 min-w-[150px] text-center ${selectedTool === 'lampe' 
            ? 'bg-purple-600 text-yellow-400 border-yellow-400 scale-105' 
            : 'bg-yellow-400 text-purple-600'}`}
        >
          🔦 Lampe de Poche
        </button>
        <button 
          onClick={() => setSelectedTool('calculatrice')} 
          className={`p-4 border-3 border-dashed border-purple-600 rounded-xl cursor-pointer font-bold text-lg transition-all duration-300 min-w-[150px] text-center ${selectedTool === 'calculatrice' 
            ? 'bg-purple-600 text-yellow-400 border-yellow-400 scale-105' 
            : 'bg-yellow-400 text-purple-600'}`}
        >
          🧮 Calculatrice
        </button>
      </div>
      
      <div className="p-5 bg-white rounded-xl border-3 border-dashed border-purple-600 min-h-[300px] flex flex-col items-center justify-center">
        {renderTool()}
      </div>
      
      <p className="mt-5 text-center italic">
        <em>Note: Aucun de ces outils ne fonctionne réellement. Ils sont juste là pour vous faire perdre votre temps! 😂</em>
      </p>
    </div>
  );
}

export default Outils;