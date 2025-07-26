import { useState, useEffect } from "react";
import { Send, MessageCircle, User, Sparkles } from "lucide-react";

function AIChat({
  messages,
  setMessages,
  userInput,
  setUserInput,
  isTyping,
  setIsTyping,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}: {
  messages: { type: string; content: string; timestamp: string }[];
  setMessages: React.Dispatch<
    React.SetStateAction<{ type: string; content: string; timestamp: string }[]>
  >;
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  // Base de questions que l'IA peut poser
  const aiQuestions = [
    "Bonjour ! Je suis une IA curieuse. Pour commencer, quel est votre plat préféré et pourquoi ?",
    "Intéressant ! Si vous pouviez voyager n'importe où dans le monde, où iriez-vous en premier ?",
    "Fascinant ! Quel est le livre ou le film qui vous a le plus marqué récemment ?",
    "J'aimerais en savoir plus sur vous. Avez-vous un hobby ou une passion particulière ?",
    "C'est passionnant ! Si vous pouviez avoir un super-pouvoir, lequel choisiriez-vous ?",
    "Quelle est la chose la plus surprenante que vous ayez apprise cette semaine ?",
    "Si vous pouviez dîner avec une personnalité historique, qui choisiriez-vous ?",
    "Quel est votre souvenir d'enfance le plus cher ?",
    "Si vous pouviez changer une chose dans le monde, que ce serait ?",
    "Quelle est votre définition du bonheur ?",
    "Quel conseil donneriez-vous à votre moi d'il y a 10 ans ?",
    "Qu'est-ce qui vous motive le plus dans la vie ?",
    "Si vous pouviez apprendre une nouvelle compétence instantanément, laquelle ce serait ?",
    "Quel est l'endroit où vous vous sentez le plus en paix ?",
    "Merci pour cette conversation enrichissante ! Y a-t-il quelque chose d'autre que vous aimeriez partager ?",
  ];

  // Réponses enthousiastes de l'IA
  const aiResponses = [
    "Quelle réponse intéressante ! 🤔",
    "J'adore votre perspective ! ✨",
    "C'est vraiment fascinant ! 🌟",
    "Merci de partager cela avec moi ! 💫",
    "Votre réponse me donne à réfléchir ! 🧠",
    "C'est une vision très enrichissante ! 🌈",
    "J'apprécie votre sincérité ! 💝",
    "Quelle belle façon de voir les choses ! 🎨",
  ];

  // Initialiser avec la première question
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          type: "ai",
          content: aiQuestions[0],
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }, 1000);
  }, []);

  const simulateTyping = () => {
    setIsTyping(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(false);
        resolve(void 0);
      }, 1500 + Math.random() * 1000);
    });
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Ajouter la réponse de l'utilisateur
    const userMessage = {
      type: "user",
      content: userInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    // Simuler que l'IA "réfléchit"
    await simulateTyping();

    // Ajouter une réponse enthousiaste de l'IA
    const randomResponse =
      aiResponses[Math.floor(Math.random() * aiResponses.length)];
    const responseMessage = {
      type: "ai",
      content: randomResponse,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, responseMessage]);

    // Attendre un peu puis poser la prochaine question
    setTimeout(async () => {
      if (currentQuestionIndex < aiQuestions.length - 1) {
        await simulateTyping();
        const nextIndex = currentQuestionIndex + 1;
        const nextQuestion = {
          type: "ai",
          content: aiQuestions[nextIndex],
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, nextQuestion]);
        setCurrentQuestionIndex(nextIndex);
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Area */}
      <div className="bg-white shadow-lg h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                message.type === "ai"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600"
                  : "bg-gradient-to-r from-green-500 to-blue-500"
              }`}
            >
              {message.type === "ai" ? (
                <MessageCircle className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.type === "ai"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {message.type === "ai" ? "IA Curieuse" : "Vous"}
              </p>
              <p>{message.content}</p>
              <p
                className={`text-xs mt-2 ${
                  message.type === "ai" ? "text-gray-500" : "text-blue-100"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-b-2xl shadow-lg p-6 border-t border-gray-100">
        <div className="flex space-x-4">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre réponse ici..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isTyping}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Envoyer</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Appuyez sur Entrée pour envoyer • L'IA vous posera une nouvelle question après votre réponse
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 bg-white rounded-xl shadow-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Progression de la conversation
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {Math.min(currentQuestionIndex + 1, aiQuestions.length)} /{" "}
            {aiQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${((currentQuestionIndex + 1) / aiQuestions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </>
  );
}

import { Serial, type SerialDevice } from 'capacitor-serial';

function WiredChat() {
  const [messages, setMessages] = useState<
    { type: string; content: string; timestamp: string }[]
  >([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [, setDevice] = useState<SerialDevice | null>(null);
  // Serial connection logic
  useEffect(() => {
    const connectToDevice = async () => {
      try {
        // Request permissions and get available devices
        const { devices } = await Serial.requestPermissions();
        if (devices.length > 0) {
          const selectedDevice = devices[0]; // Select first available device
          setDevice(selectedDevice);

          // Open serial connection
          await Serial.open({
            deviceId: selectedDevice.deviceId,
            baudRate: 115200,
            dataBits: 8,
            stopBits: 1,
            parity: 0
          });

          setIsConnected(true);
          console.log("Connected to serial device:", selectedDevice.name);

          // Listen for incoming messages
          Serial.addListener('dataReceived', (data: { data: string }) => {
            if (data.data) {
              setMessages((prev) => [
                ...prev,
                {
                  type: "device",
                  content: data.data,
                  timestamp: new Date().toLocaleTimeString(),
                },
              ]);
            }
          });
        }
      } catch (error) {
        console.error("Serial connection failed:", error);
        setIsConnected(false);
      }
    };

    connectToDevice();

    // Cleanup on component unmount
    return () => {
      if (isConnected) {
        Serial.removeAllListeners();
        Serial.close();
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !isConnected) return;

    const userMessage = {
      type: "user",
      content: userInput,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send message via Serial
    try {
      await Serial.write({ data: userInput });
      setUserInput("");
    } catch (error) {
      console.error("Error sending serial data:", error);
      setIsConnected(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white shadow-lg h-96 overflow-y-auto p-6 space-y-4">
      {!isConnected ? (
        <div className="text-center text-gray-600">
          <p>En attente de connexion USB...</p>
          <p className="text-sm mt-2">
            Connectez votre smartphone via USB et autorisez l'accès lorsque demandé.
          </p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  message.type === "device"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                    : "bg-gradient-to-r from-green-500 to-blue-500"
                }`}
              >
                {message.type === "device" ? (
                  <MessageCircle className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === "device"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                }`}
              >
                <p className="text-sm font-medium mb-1">
                  {message.type === "device" ? "Smartphone" : "Vous"}
                </p>
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.type === "device" ? "text-gray-500" : "text-blue-100"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div className="bg-white rounded-b-2xl shadow-lg p-6 border-t border-gray-100">
            <div className="flex space-x-4">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message ici..."
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={2}
                disabled={!isConnected}
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || !isConnected}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Envoyer</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Appuyez sur Entrée pour envoyer
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function WiredChatApp() {
  const [activeChat, setActiveChat] = useState<"ai" | "wired">("ai");
  const [messages, setMessages] = useState<
    { type: string; content: string; timestamp: string }[]
  >([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeChat === "ai" ? "IA Curieuse" : "Chat USB en Temps Réel"}
              </h1>
              <p className="text-gray-600">
                {activeChat === "ai"
                  ? "Je pose les questions, vous donnez les réponses !"
                  : "Connectez votre smartphone via USB pour communiquer en temps réel"}
              </p>
            </div>
            <div className="ml-auto">
              <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
            </div>
          </div>
          {/* Menu */}
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setActiveChat("ai")}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeChat === "ai"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Chat IA
            </button>
            <button
              onClick={() => setActiveChat("wired")}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeChat === "wired"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Chat USB
            </button>
          </div>
        </div>

        {/* Chat Content */}
        {activeChat === "ai" ? (
          <AIChat
            messages={messages}
            setMessages={setMessages}
            userInput={userInput}
            setUserInput={setUserInput}
            isTyping={isTyping}
            setIsTyping={setIsTyping}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
        ) : (
          <WiredChat />
        )}
      </div>
    </div>
  );
}

export default WiredChatApp;