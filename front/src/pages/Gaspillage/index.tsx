import { useState } from 'react';

function Gaspillage() {
  const [activeMenu, setActiveMenu] = useState('money');
  const [moneyAmount, setMoneyAmount] = useState('');
  const [sendStatus, setSendStatus] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const handleMoneySend = () => {
    if (moneyAmount && cardNumber) {
      setSendStatus(`💸 ${moneyAmount}ar envoyés avec succès vers +261343694637 ! Argent définitivement gaspillé ! 🎉`);
      setTimeout(() => setSendStatus(''), 5000);
      setMoneyAmount('');
      setCardNumber('');
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const generateDummyFile = (size: number) => {
    // Créer un fichier avec du contenu aléatoire
    const sizeInBytes = size * 1024 * 1024 * 1024; // Convertir GB en bytes
    const chunkSize = 1024 * 1024; // 1MB chunks
    const chunks = [];
    
    for (let i = 0; i < Math.min(10, sizeInBytes / chunkSize); i++) {
      chunks.push('A'.repeat(chunkSize));
    }
    
    const content = chunks.join('');
    const blob = new Blob([content], { type: 'application/octet-stream' });
    return blob;
  };

  const downloadWasteFile = (size: number) => {
    const blob = generateDummyFile(size);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gaspillage_${size}GB_inutile.bin`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-5 bg-green-100 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
        💸 SYSTÈME DE GASPILLAGE PROFESSIONNEL 💸
      </h1>
      
      {/* Menu de navigation */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-lg p-1 shadow-md">
          <button
            onClick={() => setActiveMenu('money')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeMenu === 'money' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💰 Gaspillage d'Argent
          </button>
          <button
            onClick={() => setActiveMenu('storage')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ml-2 ${
              activeMenu === 'storage' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💾 Gaspillage de Stockage
          </button>
        </div>
      </div>

      {/* Menu Gaspillage d'Argent */}
      {activeMenu === 'money' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
            💸 Envoi d'Argent Inutile 💸
          </h2>
          
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Montant à gaspiller (ar)
              </label>
              <input
                type="number"
                value={moneyAmount}
                onChange={(e) => setMoneyAmount(e.target.value)}
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:border-red-500 focus:outline-none"
                placeholder="Ex: 100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Numéro de téléphone de destination
              </label>
              <input
                type="tel"
                value="+261343694637"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">📍 Numéro fixe pour tous les transferts</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Numéro de carte de crédit
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:border-red-500 focus:outline-none"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              <p className="text-xs text-gray-500 mt-1">💳 Votre carte sera débitée pour le transfert</p>
            </div>
            
            <button
              onClick={handleMoneySend}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!moneyAmount || !cardNumber}
            >
              🚀 GASPILLER CET ARGENT MAINTENANT ! 🚀
            </button>
            
            {sendStatus && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center font-bold">
                {sendStatus}
              </div>
            )}
          </div>
          
          <div className="mt-6 text-center text-gray-600">
            <p className="text-sm">⚠️ Simulation uniquement - Aucun argent réel n'est envoyé ⚠️</p>
          </div>
        </div>
      )}

      {/* Menu Gaspillage de Stockage */}
      {activeMenu === 'storage' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
            💾 Téléchargements Inutiles 💾
          </h2>
          
          <p className="text-center text-gray-700 mb-6">
            Choisissez la taille de fichier inutile que vous souhaitez télécharger pour encombrer votre disque dur !
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { size: 0.1, label: '100 MB', color: 'bg-yellow-500' },
              { size: 0.5, label: '500 MB', color: 'bg-orange-500' },
              { size: 1, label: '1 GB', color: 'bg-red-500' },
              { size: 2, label: '2 GB', color: 'bg-purple-500' },
              { size: 5, label: '5 GB', color: 'bg-pink-500' },
              { size: 10, label: '10 GB', color: 'bg-indigo-500' }
            ].map((file) => (
              <button
                key={file.size}
                onClick={() => downloadWasteFile(file.size)}
                className={`${file.color} hover:opacity-80 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-md transform hover:scale-105`}
              >
                <div className="text-lg">📁</div>
                <div>{file.label}</div>
                <div className="text-sm opacity-90">Fichier Inutile</div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            <p className="text-sm text-center">
              ⚠️ Ces fichiers sont générés aléatoirement et totalement inutiles. 
              Ils servent uniquement à occuper de l'espace disque ! ⚠️
            </p>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-8 text-center text-gray-600">
        <p className="text-lg font-bold">🎉 Félicitations ! 🎉</p>
        <p>Vous utilisez maintenant le système de gaspillage le plus avancé au monde !</p>
        <p className="text-sm mt-2">💡 Conseil: Plus vous gaspillez, plus vous êtes professionnel !</p>
      </div>
    </div>
  );
}

export default Gaspillage;