import { useEffect, useState } from 'react';
import { Camera, CameraResultType  } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

function Triche() {
  const [caughtCheating, setCaughtCheating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const playSiren = async () => {
    try {
      const audio = new Audio('/alerts/police-siren.mp3');
      await audio.play();
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Accès à la caméra native avec Capacitor
  const activateCamera = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, // Utilisez l'énumération correcte
        promptLabelHeader: 'Triche détectée!',
        promptLabelPhoto: 'Prendre une photo',
        promptLabelPicture: 'Choisir depuis la galerie'
      });

      setPhoto(image.webPath || null);
      setCameraActive(true);
      setCaughtCheating(true);
      await playSiren();

      alert(
        '🚨 TRICHEUR ATTRAPÉ ! Les satellites anti-triche ont capturé ton image !'
      );

      // Sauvegarde optionnelle de la photo
      if (image.path) {
        await Filesystem.writeFile({
          path: 'triche_' + new Date().getTime() + '.jpeg',
          data: image.base64String || '',
          directory: Directory.Cache
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
      if (Capacitor.isNativePlatform()) {
        alert('📷 Caméra annulée ? Les licornes de surveillance te surveillent quand même !');
      } else {
        alert('📷 Active la caméra native depuis un appareil mobile pour une meilleure expérience de triche !');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (event) => {
        setPhoto(event.target?.result as string);
        setCaughtCheating(true);
        await playSiren();
        alert(
          '🚨 APPÂT MORDU ! Les pigeons cosmiques envoient ton selfie à ton prof !'
        );
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const detectCheating = (e: MouseEvent | KeyboardEvent) => {
      if (
        ('button' in e && e.button === 2) ||
        ('ctrlKey' in e && e.ctrlKey && 'key' in e && e.key === 's') ||
        ('key' in e && e.key === 'PrintScreen')
      ) {
        setCaughtCheating(true);
        playSiren();
        alert(
          '🚨 TRICHEUR DÉTECTÉ ! Les drones anti-triche arrivent !'
        );
      }
    };

    window.addEventListener('contextmenu', detectCheating);
    window.addEventListener('keydown', detectCheating);

    return () => {
      window.removeEventListener('contextmenu', detectCheating);
      window.removeEventListener('keydown', detectCheating);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold text-purple-600 animate-bounce">
        {caughtCheating ? '🚨 ALERTE TRICHE 🚨' : 'SCANNE TON EXAMEN'}
      </h1>

      {photo && (
        <div className="mt-4 w-64 h-64 border-4 border-red-500 rounded-lg overflow-hidden">
          <img
            src={photo}
            alt="Preuve de triche"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <p className="text-2xl text-center mt-4 text-gray-800">
        {caughtCheating ? (
          '😈 PRIS EN FLAGRANT DÉLIT ! Notre IA a enregistré tes données biométriques !'
        ) : loading ? (
          '⏳ Installation du scanner rétinien quantique...'
        ) : (
          '📸 Utilise la caméra native pour une meilleure expérience de triche !'
        )}
      </p>

      <div className="mt-6 p-6 bg-yellow-200 rounded-lg shadow-xl animate-pulse">
        {loading ? (
          <p className="text-lg font-semibold text-center">
            Chargement du détecteur de mensonges... <span className="animate-spin">🌀</span>
          </p>
        ) : (
          <>
            <p className="text-lg font-semibold text-center">
              Nouveauté avec Capacitor :
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-700">
              <li>Accès natif à la caméra de l'appareil</li>
              <li>Meilleure qualité d'image pour détecter les tricheurs</li>
              <li>Enregistrement automatique des preuves</li>
              <li>Interface optimisée pour mobile</li>
            </ul>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          className={`px-6 py-3 rounded-full text-white transition-all transform hover:scale-110 ${cameraActive ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          onClick={activateCamera}
          disabled={loading || cameraActive}
        >
          {loading ? 'Chargement...' : cameraActive ? 'Photo prise !' : '📸 Camera Native'}
        </button>

        <label className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:scale-110 cursor-pointer">
          {Capacitor.isNativePlatform() ? 'Choisir depuis la galerie' : 'Uploader une photo'}
          <input
            type="file"
            accept="image/*"
            capture={Capacitor.isNativePlatform() ? undefined : "environment"}
            className="hidden"
            onChange={handleImageUpload}
            disabled={loading || caughtCheating}
          />
        </label>
      </div>

      {caughtCheating && (
        <div className="mt-6 flex flex-col items-center">
          <div className="text-6xl animate-spin">🛸</div>
          <p className="mt-2 text-sm text-gray-500">
            Données envoyées au serveur de surveillance intergalactique
          </p>
        </div>
      )}
    </div>
  );
}

export default Triche;