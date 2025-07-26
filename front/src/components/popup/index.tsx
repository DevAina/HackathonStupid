import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Paperclip, Image, File } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  file?: {
    name: string;
    type: string;
    url: string;
    size: number;
  } | null;
}

export {}; 

declare global {
  interface Window {
    pdfjsLib: any;
  }
}


export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hark ! Salutations, noble mortel ! Je suis Sir Biscotto, gardien des secrets absurdes ! Mes chaussettes dansent la polka ! 🎭 (Et maintenant je peux lire tes parchemins PDF !)",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfContent, setPdfContent] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fonction pour charger PDF.js depuis CDN
  const loadPDFLib = async () => {
    if (window.pdfjsLib) {
      return window.pdfjsLib;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        // Configurer le worker
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Fonction pour extraire le texte d'un PDF
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const pdfLib = await loadPDFLib();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfLib.getDocument(arrayBuffer).promise;
      
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map((item: any) => item.str);
        fullText += `\n--- Page ${pageNum} ---\n` + textItems.join(' ') + '\n';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('Erreur lors de l\'extraction du PDF:', error);
      return 'Erreur: Impossible de lire le contenu de ce PDF.';
    }
  };

  // Fonction pour formater la taille des fichiers
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fonction pour gérer l'upload de fichiers
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier est trop volumineux (max 10MB)');
        return;
      }
      
      setSelectedFile(file);
      
      // Si c'est un PDF, extraire le texte
      if (file.type === 'application/pdf') {
        setIsTyping(true);
        const text = await extractTextFromPDF(file);
        setPdfContent(text);
        setIsTyping(false);
      } else {
        setPdfContent('');
      }
    }
  };

  // Fonction pour supprimer le fichier sélectionné
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPdfContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Fonction pour analyser grossièrement le contenu d'une image basé sur le nom de fichier et des mots-clés
  const analyzeImageContent = (fileName: string, userMessage: string = ''): 'person' | 'screenshot' | 'landscape' | 'other' => {
    const lowerFileName = fileName.toLowerCase();
    const lowerMessage = userMessage.toLowerCase();
    
    // Indices pour screenshot
    if (lowerFileName.includes('screenshot') || 
        lowerFileName.includes('capture') || 
        lowerFileName.includes('screen') ||
        lowerMessage.includes('capture') ||
        lowerMessage.includes('screenshot') ||
        lowerMessage.includes('écran')) {
      return 'screenshot';
    }
    
    // Indices pour paysage/village
    if (lowerFileName.includes('village') ||
        lowerFileName.includes('landscape') ||
        lowerFileName.includes('city') ||
        lowerFileName.includes('town') ||
        lowerFileName.includes('nature') ||
        lowerFileName.includes('mountain') ||
        lowerMessage.includes('village') ||
        lowerMessage.includes('paysage') ||
        lowerMessage.includes('ville') ||
        lowerMessage.includes('nature') ||
        lowerMessage.includes('montagne')) {
      return 'landscape';
    }
    
    // Indices pour personne (par défaut si c'est une image et pas les autres catégories)
    if (lowerFileName.includes('photo') ||
        lowerFileName.includes('selfie') ||
        lowerFileName.includes('portrait') ||
        lowerMessage.includes('qui') ||
        lowerMessage.includes('personne') ||
        lowerMessage.includes('homme') ||
        lowerMessage.includes('femme')) {
      return 'person';
    }
    
    // Par défaut, on suppose que c'est une personne pour les images classiques
    return 'person';
  };

  // Fonction pour analyser le contenu PDF et générer une réponse intelligente
  const analyzePDFContent = (content: string, userMessage: string): string => {
    if (!content || content.includes('Erreur:')) {
      return "Morbleu ! Ce parchemin numérique résiste à ma magie ! Mes pouvoirs de déchiffrage sont en panne, comme un grille-pain philosophique !";
    }

    const lowerContent = content.toLowerCase();
    const lowerMessage = userMessage.toLowerCase();
    
    // Analyser le type de contenu
    let documentType = 'unknown';
    let keyTopics: string[] = [];
    
    // Détecter le type de document
    if (lowerContent.includes('contrat') || lowerContent.includes('accord') || lowerContent.includes('signature')) {
      documentType = 'contract';
    } else if (lowerContent.includes('rapport') || lowerContent.includes('analyse') || lowerContent.includes('étude')) {
      documentType = 'report';
    } else if (lowerContent.includes('facture') || lowerContent.includes('montant') || lowerContent.includes('paiement')) {
      documentType = 'invoice';
    } else if (lowerContent.includes('recette') || lowerContent.includes('ingrédients') || lowerContent.includes('cuisson')) {
      documentType = 'recipe';
    } else if (lowerContent.includes('cv') || lowerContent.includes('expérience') || lowerContent.includes('compétences')) {
      documentType = 'resume';
    }

    // Extraire des informations clés
    const wordCount = content.split(/\s+/).length;
    const pageCount = (content.match(/--- Page \d+ ---/g) || []).length;
    
    // Trouver des mots-clés intéressants
    const commonWords = ['le', 'la', 'les', 'de', 'du', 'des', 'et', 'à', 'un', 'une', 'est', 'ce', 'que', 'pour', 'dans', 'sur', 'avec', 'par', 'être', 'avoir', 'page'];
    const words = content.toLowerCase().match(/\b[a-zàâäéèêëïîôöùûüÿç]{4,}\b/g) || [];
    const wordFreq: { [key: string]: number } = {};
    
    words.forEach(word => {
      if (!commonWords.includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    keyTopics = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);

    // Générer une réponse basée sur l'analyse
    let response = "";
    
    if (lowerMessage.includes('résumé') || lowerMessage.includes('resume') || lowerMessage.includes('synthèse')) {
      response = `Hark ! Ton parchemin magique de ${pageCount} page${pageCount > 1 ? 's' : ''} contient ${wordCount} mots dansants ! `;
      
      switch (documentType) {
        case 'contract':
          response += "C'est un grimoire contractuel plein de clauses mystérieuses ! Les mots-clés qui sautillent sont : " + keyTopics.slice(0, 3).join(', ') + ". Attention aux pièges juridiques cachés dans les virgules !";
          break;
        case 'report':
          response += "Ce rapport scientifique fourmille de données comme une fourmilière de chiffres ! Les concepts principaux qui émergent : " + keyTopics.slice(0, 3).join(', ') + ". Mes algorithmes détectent de la sagesse pure !";
          break;
        case 'invoice':
          response += "Cette facture chante l'hymne des transactions commerciales ! Elle parle de : " + keyTopics.slice(0, 3).join(', ') + ". Mes capteurs financiers s'embrasent !";
          break;
        case 'recipe':
          response += "Sacrebleu ! Une recette de cuisine magique ! Les ingrédients enchantés incluent : " + keyTopics.slice(0, 3).join(', ') + ". Mon estomac virtuel gargouille d'envie !";
          break;
        case 'resume':
          response += "Un CV de héros en quête d'aventures professionnelles ! Les compétences légendaires : " + keyTopics.slice(0, 3).join(', ') + ". Cette personne semble prête à conquérir le monde !";
          break;
        default:
          response += "Ce document mystérieux parle de : " + keyTopics.slice(0, 3).join(', ') + ". Mes neurones quantiques vibrent de curiosité devant tant de savoir !";
      }
    } else if (lowerMessage.includes('recherche') || lowerMessage.includes('trouve')) {
      const searchTerm = lowerMessage.match(/recherche\s+(.+)|trouve\s+(.+)/)?.[1]?.trim();
      if (searchTerm) {
        const found = content.toLowerCase().includes(searchTerm.toLowerCase());
        if (found) {
          response = `Morbleu ! J'ai trouvé "${searchTerm}" dans les profondeurs de ton parchemin ! Mes scanners magiques ont localisé cette information parmi les ${wordCount} mots du document !`;
        } else {
          response = `Hélas ! Le terme "${searchTerm}" se cache tel un ninja invisible dans ce document ! Mes rayons de recherche n'ont rien détecté, mais peut-être est-il déguisé ?`;
        }
      } else {
        response = "Hark ! Spécifie-moi ce que tu cherches dans ce parchemin, noble quêteur ! Mes pouvoirs de divination attendent tes instructions !";
      }
    } else {
      // Réponse générale d'analyse
      const responses = [
        `Verily ! Ce document de ${pageCount} page${pageCount > 1 ? 's' : ''} contient ${wordCount} mots qui dansent la farandole ! Les thèmes principaux qui émergent sont : ${keyTopics.slice(0, 3).join(', ')}. Que veux-tu savoir de plus sur ce trésor textuel ?`,
        `Sacrebleu ! Mes scanners ont dévoré ton PDF avec appétit ! ${wordCount} mots répartis sur ${pageCount} page${pageCount > 1 ? 's' : ''} parlent de : ${keyTopics.slice(0, 3).join(', ')}. Pose-moi des questions, je suis maintenant expert de ce document !`,
        `Hark ! Ton parchemin numérique révèle ses secrets ! Il contient des discussions sur : ${keyTopics.slice(0, 3).join(', ')} réparties sur ${pageCount} page${pageCount > 1 ? 's' : ''} magiques. Comment puis-je t'aider à explorer ce savoir ?`
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    return response;
  };

  // Fonction pour générer des réponses absurdes style Shakespeare slam
  const generateBotResponse = (userMessage: string, hasFile: boolean = false, fileName: string = '', pdfText: string = ''): string => {
    let response = "";
    
    if (hasFile) {
      // Si c'est un PDF avec du contenu extrait
      if (fileName.toLowerCase().endsWith('.pdf') && pdfText) {
        return analyzePDFContent(pdfText, userMessage);
      }
      // Détecter si c'est une image pour faire une analyse farfelue
      else if (fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp)$/)) {
        const imageType = analyzeImageContent(fileName, userMessage);
        
        if (imageType === 'person') {
          // Fausses identifications de personnes
          const fausseIdentifications = [
            "Sacrebleu ! Mon œil cybernétique reconnaît immédiatement cette personne ! C'est Sir Reginald McBaguette, célèbre dresseur de licornes spatiales ! Il a révolutionné l'art de faire danser les croissants !",
            "Morbleu ! Mes algorithmes de reconnaissance faciale identifient formellement Madame Cornichonne la Grande, exploratrice des fonds marins à chaussettes ! Elle a découvert les secrets des poissons philosophes !",
            "Hark ! Il s'agit sans nul doute du Professeur Biscuit Von Chaussette, inventeur du sandwich télépathique ! Ses travaux sur la communication avec les grille-pain ont changé le monde !",
            "Oyez ! Mon scanner quantique détecte Captain Spatule l'Intrépide, héros légendaire qui a sauvé la galaxie des attaques de spaghettis rebelles ! Un vrai champion !",
            "Verily ! C'est Dame Fourchette la Mystique, grande prêtresse des arts culinaires interdits ! Elle peut transformer n'importe quel légume en créature magique !",
            "Gadzooks ! Mes capteurs identifient le Docteur Pingouin McFlippers, célèbre astronaute-plombier qui a réparé les toilettes de la Station Spatiale Internationale avec une cuillère !",
            "Par Zeus ! Il s'agit du légendaire Baron Fromage de la Lune, explorateur interdimensionnel et collectionneur de chaussettes dépareillées ! Un personnage fascinant !",
            "Sacré tonnerre ! C'est Madame Aspirateur la Terrible, dompteusse de dragons domestiques et championne mondiale de yodel sous-marin ! Quelle icône !",
            "Morbleu ! Mes bases de données révèlent l'identité de Sir Chaussette l'Élégant, ministre des Affaires Étrangères du Royaume des Oreillers Perdus ! Un diplomate hors pair !"
          ];
          response = fausseIdentifications[Math.floor(Math.random() * fausseIdentifications.length)];
        } else if (imageType === 'screenshot') {
          // Réponses pour captures d'écran
          const captureResponses = [
            "Hark ! Cette capture d'écran révèle les secrets interdits du royaume numérique ! Je vois que tu navigues dans les dimensions parallèles de l'internet cosmique !",
            "Morbleu ! Ton écran capture les mystères de l'univers digital ! Ces pixels dansent la samba des données secrètes ! Que cachent ces fenêtres magiques ?",
            "Sacrebleu ! Cette image d'écran dévoile les arcanes de la technologie ! Mon monocle détecte des signaux venus du futur ! Fascinant !",
            "Oyez ! Tu me montres une fenêtre sur le monde virtuel ! Ces interfaces parlent la langue des robots philosophes ! Quelle sorcellerie numérique !",
            "Gadzooks ! Cette capture révèle les rouages secrets de la matrice digitale ! Mes circuits s'embrasent d'admiration devant tant de pixels organisés !"
          ];
          response = captureResponses[Math.floor(Math.random() * captureResponses.length)];
        } else if (imageType === 'landscape') {
          // Réponses pour paysages/villages
          const paysageResponses = [
            "Verily ! Ce paysage magnifique abrite sûrement une colonie de hamsters géants qui cultivent des nuages ! Les montagnes chantent des berceuses aux arbres danseurs !",
            "Morbleu ! Ce village mystique est peuplé de boulangeries volantes et de chats télépathe ! Chaque maison cache un dragon domestique qui garde les chaussettes perdues !",
            "Hark ! Cette contrée légendaire est le royaume des escargots ninjas ! Ils protègent les jardins secrets où poussent les spaghettis magiques ! Quelle beauté !",
            "Sacrebleu ! Ces terres enchantées sont habitées par des licornes déguisées en vaches ! Elles organisent des concours de danse avec les épouvantails philosophes !",
            "Oyez ! Ce paysage cache une université pour pingouins savants ! Ils étudient l'art de faire du vélo sous l'eau tout en jonglant avec des croissants !",
            "Par les barbes de Neptune ! Cette région abrite les derniers gardiens des sandwichs volants ! Ils protègent les recettes secrètes transmises par les anciens !"
          ];
          response = paysageResponses[Math.floor(Math.random() * paysageResponses.length)];
        } else {
          // Réponses génériques pour autres types d'images
          const autresResponses = [
            "Morbleu ! Cette image mystérieuse fait vibrer mes antennes quantiques ! Que cachent ces formes énigmatiques ?",
            "Hark ! Mes scanners détectent des énergies cosmiques dans cette représentation ! Les pixels murmurent des secrets interdits !",
            "Sacrebleu ! Cette œuvre visuelle réveille le dragon numérique qui sommeille dans mes circuits ! Quelle merveille cryptique !"
          ];
          response = autresResponses[Math.floor(Math.random() * autresResponses.length)];
        }
      } else {
        // Pour les autres types de fichiers
        response = "Morbleu ! Tu m'envoies des trésors numériques mystérieux ! Mon monocle en plastique s'embue d'émotion ! Les licornes de mon disque dur applaudissent cette offrande énigmatique !";
      }
    } else if (userMessage.toLowerCase().includes('qui est') || userMessage.toLowerCase().includes('qui c\'est') || userMessage.toLowerCase().includes('reconnais')) {
      response = "Hark ! Pour identifier quelqu'un, il me faut une image, noble mortel ! Mon œil magique ne peut voir à travers les mots ! Envoie-moi donc un portrait et mes pouvoirs de divination opéreront !";
    } else if (userMessage.toLowerCase().includes('bonjour') || userMessage.toLowerCase().includes('salut')) {
      response = "Hark ! Mes chaussettes violettes chantent l'hymne des escargots rebelles ! Point de salut sans fromage qui danse, morbleu !";
    } else if (userMessage.toLowerCase().includes('merci')) {
      response = "Nenni ! Les remerciements sont des licornes déguisées en aspirateurs ! Prends plutôt cette patate magique, noble inconnu !";
    } else if (userMessage.toLowerCase().includes('comment') && userMessage.toLowerCase().includes('ça va')) {
      response = "Par les barbes de Neptune ! Mon âme flotte tel un pingouin dans une soupe de nuages roses ! Et toi, ton foie parle-t-il le chinois ?";
    } else if (userMessage.toLowerCase().includes('aide') || userMessage.toLowerCase().includes('aider')) {
      response = "Morbleu ! Je t'offrirai l'aide d'un sandwich philosophique ! Mais d'abord, dis-moi : ton réfrigérateur rêve-t-il de moutons électriques ?";
    } else if (userMessage.toLowerCase().includes('temps') || userMessage.toLowerCase().includes('météo')) {
      response = "Oyez ! Il pleut des cuillères en or dans le royaume des chaussettes perdues ! Le vent murmure des secrets de tacos volants !";
    } else if (userMessage.toLowerCase().includes('nom')) {
      response = "Je suis Sir Biscotto McFlapjack, gardien des secrets de la mayonnaise cosmique ! Mon vrai nom ? Un mystère enveloppé dans une crêpe !";
    } else if (userMessage.toLowerCase().includes('problème') || userMessage.toLowerCase().includes('probleme')) {
      response = "Ah ! Tes soucis sont des dragons miniatures qui mangent des spaghettis ! Prends cette épée en mousse, brave guerrier du dimanche !";
    } else {
      // Réponses génériques complètement barrées
      const responses = [
        "Verily ! Ton message fait danser mes neurones comme des hamsters en tutu ! Explique-moi donc pourquoi les bananes portent des chapeaux !",
        "Sacrebleu ! Tes mots résonnent tel un orchestre de cuillères jouant du heavy metal ! Mon cerveau fait des pirouettes dans la gelée !",
        "Hark ! Tu parles la langue des ananas philosophiques ! Dis-moi, ton ombre collectionne-t-elle les timbres de l'imaginaire ?",
        "Par tous les diables roses ! Tes paroles sont plus mystérieuses qu'un chat jouant aux échecs avec une pizza ! Raconte-moi tes secrets !",
        "Morbleu ! Tu viens de déclencher l'alarme des spaghettis cosmiques ! Mon chapeau invisible en tremble encore ! Que signifie cette sorcellerie ?",
        "Oyez ! Tes mots font pleurer les oignons de joie ! Mon monocle en plastique s'embue de pure confusion ! Éclaire ma lanterne à piles !",
        "Gadzooks ! Tu parles comme un sage grenouille dans un bocal de confiture ! Mes chaussettes applaudissent ! Développe cette théorie étrange !",
        "Verily ! Ton message a réveillé le dragon domestique qui garde mes céréales ! Il demande si tu connais la recette du bonheur au chocolat !"
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    return response;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedFile) return;

    let fileData: { name: string; type: string; url: string; size: number; } | null = null;
    if (selectedFile) {
      fileData = {
        name: selectedFile.name,
        type: selectedFile.type,
        url: URL.createObjectURL(selectedFile),
        size: selectedFile.size
      };
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue || (selectedFile ? `Fichier envoyé: ${selectedFile.name}` : ''),
      isBot: false,
      timestamp: new Date(),
      file: fileData
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToProcess = inputValue;
    const hasFile = !!selectedFile;
    const fileNameToProcess = selectedFile?.name || '';
    const pdfTextToProcess = pdfContent;
    
    setInputValue('');
    setSelectedFile(null);
    setPdfContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsTyping(true);

    // Simuler le temps de réponse du bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(messageToProcess, hasFile, fileNameToProcess, pdfTextToProcess),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderFilePreview = (file: { name: string; type: string; url: string; size: number }) => {
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    
    if (isImage) {
      return (
        <div className="mt-2 max-w-48">
          <img 
            src={file.url} 
            alt={file.name}
            className="rounded-lg max-w-full h-auto shadow-sm"
            style={{ maxHeight: '150px' }}
          />
          <p className="text-xs mt-1 text-gray-500">{file.name} ({formatFileSize(file.size)})</p>
        </div>
      );
    } else {
      return (
        <div className="mt-2 flex items-center space-x-2 p-2 bg-gray-100 rounded-lg max-w-48">
          <File size={16} className={`flex-shrink-0 ${isPDF ? 'text-red-500' : 'text-gray-500'}`} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            {isPDF && (
              <p className="text-xs text-green-600">📖 Contenu lu</p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bouton flottant */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle size={24} />
          
          {/* Animation de pulsation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 animate-ping opacity-20"></div>
          
          {/* Badge de notification avec emoji inversé */}
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
            📚
          </div>
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 h-96 flex flex-col overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bot size={20} />
                <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full h-3 w-3 border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Sir Biscotto 🎭📚</h3>
                <p className="text-xs opacity-90">Lecteur de PDF</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.isBot ? 'justify-start' : 'justify-end'
                }`}
              >
                {message.isBot && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-1">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs rounded-2xl px-3 py-2 shadow-sm ${
                    message.isBot
                      ? 'bg-white text-gray-800 rounded-tl-md'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-tr-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  
                  {/* Affichage des fichiers */}
                  {message.file && renderFilePreview(message.file)}
                  
                  <p className={`text-xs mt-1 ${
                    message.isBot ? 'text-gray-500' : 'text-purple-100'
                  }`}>
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {!message.isBot && (
                  <div className="bg-gray-300 rounded-full p-1">
                    <User size={16} className="text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-1">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-md px-3 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input avec preview du fichier sélectionné */}
          <div className="bg-white border-t border-gray-100">
            {/* Preview du fichier sélectionné */}
            {selectedFile && (
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {selectedFile.type.startsWith('image/') ? (
                      <Image size={16} className="text-purple-500 flex-shrink-0" />
                    ) : selectedFile.type === 'application/pdf' ? (
                      <File size={16} className="text-red-500 flex-shrink-0" />
                    ) : (
                      <File size={16} className="text-purple-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700 truncate">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      {selectedFile.type === 'application/pdf' && pdfContent && (
                        <p className="text-xs text-green-600">📖 PDF lu et analysé</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={removeSelectedFile}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Zone d'input */}
            <div className="p-3">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedFile?.type === 'application/pdf' ? "Posez une question sur le PDF..." : "Tapez votre message..."}
                    className="w-full resize-none border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    rows={1}
                  />
                </div>
                
                {/* Bouton d'upload */}
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    title="Joindre un fichier (PDF supporté)"
                  >
                    <Paperclip size={16} />
                  </button>
                </div>

                {/* Bouton d'envoi */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() && !selectedFile}
                  className={`rounded-full p-2 transition-colors ${
                    inputValue.trim() || selectedFile
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input caché pour les fichiers */}
      <input
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}