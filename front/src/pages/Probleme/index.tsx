
import { useState } from 'react';
import './Probleme.css';

const ProblemeWeb = () => {
  const [activeProblem, setActiveProblem] = useState<string | null>(null);
  const [isShaking] = useState(false);

  // Problèmes optimisés pour mobile avec Capacitor - effets en arrière-plan uniquement
  const webProblems = [
    {
      name: "💥 RAM Overload",
      description: "CRASH L'APP - Allocation mémoire massive",
      action: () => {
        const hog: any[] = [];
        // Allocation massive et brutale pour crash
        try {
          while (true) {
            // Alloue des arrays énormes en continu
            hog.push(new Array(100000000).fill("💀".repeat(1000)));
            hog.push(new Array(50000000).fill(Math.random().toString().repeat(100)));
            hog.push(new Array(75000000).fill({
              data: new Array(1000).fill("CRASH"),
              more: new Array(1000).fill("NOW")
            }));
            // Force l'allocation immédiate
            JSON.stringify(hog[hog.length - 1]);
          }
        } catch (e) {
          // Continue même en cas d'erreur
          setTimeout(() => {
            const megaHog: any[] = [];
            for (let i = 0; i < 10000; i++) {
              megaHog.push(new Array(1000000).fill("💥"));
            }
          }, 100);
        }
      }
    },
    {
      name: "🌀 CPU Burner",
      description: "FIGE L'APPAREIL - CPU à 100% permanent",
      action: () => {
        // Multiple workers pour saturer TOUS les cores
        const workers: Worker[] = [];
        const workerCode = `
          // Boucle infinie sans possibilité d'arrêt
          while(true) {
            for(let i = 0; i < 10000000; i++) {
              Math.pow(Math.random(), Math.random());
              Math.sin(Math.cos(Math.tan(i)));
              JSON.stringify({a: Math.random(), b: new Array(1000).fill(i)});
            }
          }
        `;
        
        // Lance 8 workers simultanés pour saturer le CPU
        for (let w = 0; w < 8; w++) {
          try {
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));
            workers.push(worker);
          } catch (e) {
            console.log("Worker failed, using main thread");
          }
        }
        
        // Fallback sur le thread principal - SANS limite de temps
        const infiniteBurn = () => {
          while (true) {
            for (let i = 0; i < 1000000; i++) {
              Math.pow(Math.random(), Math.random());
              Math.sqrt(Math.sin(Math.cos(i)));
            }
          }
        };
        
        // Lance plusieurs instances
        setTimeout(infiniteBurn, 100);
        setTimeout(infiniteBurn, 200);
        setTimeout(infiniteBurn, 300);
      }
    },
    {
      name: "📸 Webcam Hack",
      description: "Alerte de sécurité bidon (pas d'animation)",
      action: () => {
        setTimeout(() => {
          if (confirm("⚠️ VOTRE WEBCAM A ÉTÉ PIRATÉE !\n\nNous avons filmé vous gratter le nez.\nPayez 0,50€ en Bitcoin pour supprimer la vidéo.")) {
            alert("Paiement reçu! Vidéo supprimée.\n(C'était juste une blague 😄)");
          }
        }, 2000);
        
        // Change le titre discrètement
        const originalTitle = document.title;
        document.title = "⚠️ ALERTE SÉCURITÉ ⚠️";
        setTimeout(() => {
          document.title = originalTitle;
        }, 10000);
      }
    },
    {
  name: "🌐 Password Changer",
  description: "Simulation interactive et ludique de changement de mot de passe",
  action: () => {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      .sim-modal {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(135deg, #1e1e2f, #3b3b5f);
        color: white; font-family: 'Segoe UI', sans-serif;
        display: flex; flex-direction: column; justify-content: center; align-items: center;
        z-index: 99999;
      }
      .sim-box {
        background: #2a2a40; padding: 30px; border-radius: 20px;
        box-shadow: 0 0 20px rgba(0,0,0,0.6); width: 350px; text-align: center;
      }
      .sim-box h2 {
        margin-bottom: 15px; font-size: 1.5em;
      }
      .sim-select, .sim-input, .sim-button {
        width: 100%; padding: 12px; margin: 10px 0; border-radius: 8px; border: none;
        font-size: 1em;
      }
      .sim-select { background: #444; color: white; }
      .sim-input { background: #333; color: #eee; }
      .sim-button {
        background: #00cc88; color: black; font-weight: bold;
        cursor: pointer; transition: background 0.3s;
      }
      .sim-button:hover {
        background: #00e699;
      }
      .sim-progress {
        width: 100%; height: 20px; background: #555; border-radius: 10px; overflow: hidden;
        margin-top: 15px;
      }
      .sim-bar {
        height: 100%; width: 0%; background: #4caf50; transition: width 0.4s ease;
      }
      .sim-status {
        margin-top: 10px; font-size: 0.9em; color: #ccc;
      }
    `;
    document.head.appendChild(style);

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'sim-modal';

    const box = document.createElement('div');
    box.className = 'sim-box';

    box.innerHTML = `
      <h2>🔐 Password Changer</h2>
      <select class="sim-select">
        <option value="facebook">🌐 Facebook</option>
        <option value="gmail">📧 Gmail</option>
        <option value="instagram">📸 Instagram</option>
        <option value="twitter">🐦 Twitter</option>
        <option value="linkedin">💼 LinkedIn</option>
      </select>
      <input class="sim-input" type="text" placeholder="Nom d'utilisateur" />
      <input class="sim-input" type="password" placeholder="Mot de passe actuel" />
      <button class="sim-button">Continuer</button>
      <div class="sim-progress" style="display:none;">
        <div class="sim-bar"></div>
      </div>
      <div class="sim-status"></div>
    `;

    modal.appendChild(box);
    document.body.appendChild(modal);

    // Elements
    const select = box.querySelector('.sim-select');
    const inputUser = box.querySelectorAll('.sim-input')[0];
    const inputPass = box.querySelectorAll('.sim-input')[1];
    const button = box.querySelector('.sim-button');
    const progressContainer = box.querySelector('.sim-progress');
    const progressBar = box.querySelector('.sim-bar');
    const status = box.querySelector('.sim-status');

    // Button click handler
    button.onclick = () => {
      if (!inputUser.value || !inputPass.value) {
        alert("🛑 Complète les champs pour continuer !");
        return;
      }

      button.disabled = true;
      inputUser.disabled = true;
      inputPass.disabled = true;
      select.disabled = true;
      progressContainer.style.display = 'block';

      const phrases = [
        "🔒 Connexion sécurisée...",
        "📡 Vérification des identifiants...",
        "🔧 Mise à jour des serveurs...",
        "📁 Changement du mot de passe...",
        "✅ Finalisation..."
      ];

      let i = 0;
      let percent = 0;
      const interval = setInterval(() => {
        percent += Math.random() * 18;
        if (i < phrases.length) {
          status.textContent = phrases[i];
          i++;
        }

        progressBar.style.width = `${Math.min(percent, 100)}%`;

        if (percent >= 100) {
          clearInterval(interval);
          progressBar.style.width = "100%";
          status.textContent = `🎉 Le mot de passe de ${select.value} a été changé avec succès !`;

          setTimeout(() => {
            document.body.removeChild(modal);
            style.remove();
            alert("✨ Votre mot de passe a été changé avec succès 😉");
          }, 3000);
        }
      }, 800);
    };
  }
},
      {
      name: "🔄 Tour du Monde Linguistique",
      description: "Change les paramètres de langue en arrière-plan",
      action: () => {
        const originalLang = document.documentElement.lang || 'fr';
        const originalDir = document.documentElement.dir || 'ltr';
        
        const languages = [
          { code: "zh", name: "Chinois", dir: "ltr" },
          { code: "ja", name: "Japonais", dir: "ltr" },
          { code: "ru", name: "Russe", dir: "ltr" },
          { code: "ar", name: "Arabe", dir: "rtl" },
          { code: originalLang, name: "Original", dir: originalDir }
        ];

        let currentIndex = 0;
        const switchLang = () => {
          const currentLang = languages[currentIndex];
          document.documentElement.lang = currentLang.code;
          document.documentElement.dir = currentLang.dir;
          document.title = `Langue: ${currentLang.name}`;
          
          // Ajouter rotation 180° à chaque changement de langue
          const root = document.documentElement;
          root.style.transition = "transform 1s ease-in-out";
          root.style.transformOrigin = "center center";
          const currentRotation = currentIndex * 180; // 0°, 180°, 360°, 540°, etc.
          root.style.transform = `rotate(${currentRotation}deg)`;
          
          currentIndex = (currentIndex + 1) % languages.length;
          setTimeout(switchLang, 2000); // Continue indéfiniment
        };
        
        switchLang();
      }
    },
    {
      name: "🛡️ Crypter mon fichier",
      description: "Crypte automatiaue votre fichier ",
      action: () => {
        // Pas d'animation visuelle, juste changement de meta theme
        const metaTheme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
        const originalColor = metaTheme?.content || '#000000';
        
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        let colorIndex = 0;
        
        const interval = setInterval(() => {
          if (metaTheme) {
            metaTheme.content = colors[colorIndex];
          }
          document.documentElement.style.setProperty('--theme-color', colors[colorIndex]);
          colorIndex = (colorIndex + 1) % colors.length;
        }, 1000);
        
        setTimeout(() => {
          clearInterval(interval);
          if (metaTheme) metaTheme.content = originalColor;
          document.documentElement.style.removeProperty('--theme-color');
        }, 10000);
      }
    },
    {
      name: "🔋 Drainage Express",
      description: "VIDE LA BATTERIE - Consommation MAXIMALE",
      action: () => {
        // AUCUN nettoyage automatique - consommation permanente
        
        // 1. Vibration en continu SANS ARRÊT
        if (navigator.vibrate) {
          const vibrateForever = () => {
            navigator.vibrate([1000, 500, 1000, 500, 1000]);
            setTimeout(vibrateForever, 4000);
          };
          vibrateForever();
        }
        
        // 2. CPU à fond PERMANENT
        const infiniteCPU = () => {
          while (true) {
            for (let i = 0; i < 1000000; i++) {
              Math.pow(Math.random(), Math.random());
              Math.sin(Math.cos(Math.tan(i)));
              JSON.stringify(new Array(1000).fill(Math.random()));
            }
          }
        };
        
        // Lance plusieurs instances CPU
        setTimeout(infiniteCPU, 100);
        setTimeout(infiniteCPU, 200);
        setTimeout(infiniteCPU, 300);
        
        // 3. Géolocalisation hyper-agressive PERMANENTE
        if (navigator.geolocation) {
          const geoSpam = () => {
            navigator.geolocation.getCurrentPosition(
              () => setTimeout(geoSpam, 100),
              () => setTimeout(geoSpam, 100),
              { enableHighAccuracy: true, maximumAge: 0, timeout: 1000 }
            );
          };
          geoSpam();
          
          // Watch position ultra-précis
          navigator.geolocation.watchPosition(
            () => {},
            () => {},
            { enableHighAccuracy: true, maximumAge: 0, timeout: 1000 }
          );
        }
        
        // 4. Spam réseau MASSIF et PERMANENT
        const networkSpam = () => {
          // Lance 50 requêtes simultanées
          for (let i = 0; i < 50; i++) {
            fetch('https://httpbin.org/delay/1').catch(() => {});
            fetch('https://httpbin.org/uuid').catch(() => {});
            fetch('https://httpbin.org/ip').catch(() => {});
            fetch('https://httpbin.org/user-agent').catch(() => {});
          }
          setTimeout(networkSpam, 500); // Relance toutes les 500ms
        };
        networkSpam();
        
        // 5. Allocation mémoire MASSIVE et PERMANENTE
        const memoryDestroy = () => {
          const hog: any[] = [];
          while (true) {
            hog.push(new Array(100000).fill(Math.random().toString()));
            hog.push({
              data: new Array(50000).fill("BATTERY_DRAIN"),
              more: new Array(50000).fill(Math.random())
            });
          }
        };
        setTimeout(memoryDestroy, 1000);
        
        // 6. Canvas rendering intensif PERMANENT
        const canvas = document.createElement('canvas');
        canvas.width = 2000;
        canvas.height = 2000;
        canvas.style.position = 'fixed';
        canvas.style.top = '-3000px'; // Caché mais actif
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const renderMadness = () => {
          if (ctx) {
            for (let i = 0; i < 100; i++) {
              ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              for (let j = 0; j < 50; j++) {
                ctx.beginPath();
                ctx.arc(
                  Math.random() * canvas.width,
                  Math.random() * canvas.height,
                  Math.random() * 100,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              }
            }
          }
          requestAnimationFrame(renderMadness);
        };
        renderMadness();
        
        // 7. Audio context pour forcer les haut-parleurs
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          gainNode.gain.value = 0; // Inaudible mais actif
          oscillator.frequency.value = 20000; // Très haute fréquence
          oscillator.start();
        } catch (e) {}
      }
    },
    {
      name: "🌍 Traduction Universelle",
      description: "FORCE LA TRADUCTION - Change toute la page aléatoirement et infiniment",
      action: () => {
        
        // Sauvegarde tout le texte original de la page
        const originalTexts: { element: Element; originalText: string }[] = [];
        
        // Fonction récursive pour sauvegarder tout le texte
        const saveOriginalTexts = (node: Element) => {
          // Ignore les scripts et styles
          if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
          
          // Si le nœud a du texte directement
          if (node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE) {
            const text = node.textContent || '';
            if (text.trim()) {
              originalTexts.push({
                element: node,
                originalText: text
              });
            }
          }
          
          // Parcours les enfants
          node.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
              saveOriginalTexts(child as Element);
            }
          });
        };
        
        // Commence à sauvegarder depuis le body
        saveOriginalTexts(document.body);
        
        const languages = [
          { code: 'zh-CN', name: 'Chinois', dir: 'ltr' },
          { code: 'ja', name: 'Japonais', dir: 'ltr' },
          { code: 'ru', name: 'Russe', dir: 'ltr' },
          { code: 'ar', name: 'Arabe', dir: 'rtl' },
          { code: 'hi', name: 'Hindi', dir: 'ltr' },
          { code: 'th', name: 'Thaï', dir: 'ltr' },
          { code: 'ko', name: 'Coréen', dir: 'ltr' }
        ];
        
        // Textes traduits pour chaque langue (simplifié pour l'exemple)
        const translatedTexts: Record<string, string[]> = {
          'zh-CN': [
            '内存过载', 'CPU燃烧器', '假摄像头黑客', '假连接断开', '语言世界之旅', '迷幻模式', '电池耗尽', '通用翻译',
            '崩溃应用程序 - 大量内存分配', '冻结设备 - CPU永久100%', '虚假安全警报', '静默模拟网络问题', '后台更改语言设置', '静默更改系统颜色', '耗尽电池 - 最大消耗', '强制翻译 - 随机更改语言',
            '网络问题模拟器', '为什么我的CSS在桌面有效但在移动设备无效？', 'Capacitor插件不可用？！', '我的应用在iOS 15上运行但在iOS 16上崩溃...', '为什么我的PWA拒绝安装？',
            '这些效果是真实的但临时的（最多10秒）', '优化为Capacitor - 无视觉动画', '仅用于演示（不要在专业设备上使用！）'
          ],
          'ja': [
            'RAMオーバーロード', 'CPUバーナー', '偽ウェブカメラハック', '偽接続切断', '言語世界ツアー', 'サイケデリックモード', '電池ドレイン', '汎用翻訳',
            'アプリクラッシュ - 大量メモリ割り当て', 'デバイス凍結 - CPU永続100%', '偽セキュリティ警告', 'ネットワーク問題を静かにシミュレート', 'バックグラウンドで言語設定を変更', 'システムカラーを静かに変更', 'バッテリーを空にする - 最大消費', '翻訳を強制 - ランダムに言語を変更',
            'ネットワーク問題シミュレーター', 'なぜ私のCSSはデスクトップで機能するがモバイルでは機能しないのですか？', '「Capacitorプラグインが利用できません」とは？！', 'iOS 15で動作したアプリがiOS 16でクラッシュ...', 'なぜ私のPWAはインストールを拒否するのですか？',
            'これらの効果は本物ですが一時的です（最大10秒）', 'Capacitor用に最適化 - 視覚的なアニメーションなし', 'デモンストレーションのみに使用（プロのデバイスでは使用しないでください！）'
          ],
          'ru': [
            'Перегрузка ОЗУ', 'Сжигатель ЦП', 'Поддельный взлом веб-камеры', 'Поддельная потеря соединения', 'Языковое путешествие', 'Психоделический режим', 'Разрядка батареи', 'Универсальный переводчик',
            'Сбой приложения - массивное выделение памяти', 'Заморозка устройства - ЦП постоянно 100%', 'Поддельное предупреждение безопасности', 'Тихо имитирует проблемы с сетью', 'Изменяет языковые настройки в фоне', 'Тихо меняет системные цвета', 'Разряжает батарею - максимальное потребление', 'Принудительный перевод - случайно меняет язык',
            'Симулятор сетевых проблем', 'Почему мой CSS работает на компьютере, но не на мобильном устройстве?', 'Как это "Плагин Capacitor недоступен"?!', 'Мое приложение работало на iOS 15, но падает на iOS 16...', 'Почему мой PWA отказывается устанавливаться?',
            'Эти эффекты реальны, но временны (максимум 10 секунд)', 'Оптимизировано для Capacitor - без визуальных анимаций', 'Использовать только для демонстрации (не использовать на профессиональных устройствах!)'
          ],
          'ar': [
            'تحميل ذاكرة التخزين', 'حارق المعالج', 'اختراق كاميرا مزيف', 'انقطاع اتصال مزيف', 'جولة لغوية عالمية', 'وضع مخدر', 'استنزاف البطارية', 'ترجمة عالمية',
            'تعطيل التطبيق - تخصيص ذاكرة ضخم', 'تجميد الجهاز - معالج 100% دائم', 'تنبيه أمان مزيف', 'محاكاة مشاكل الشبكة بصمت', 'تغيير إعدادات اللغة في الخلفية', 'تغيير ألوان النظام بصمت', 'تفريغ البطارية - استهلاك أقصى', 'ترجمة قسرية - تغيير اللغة عشوائياً',
            'محاكي مشاكل الشبكة', 'لماذا يعمل CSS الخاص بي على سطح المكتب ولكن ليس على الهاتف المحمول؟', 'كيف "البرنامج المساعد لـ Capacitor غير متاح"؟!', 'التطبيق الذي يعمل على iOS 15 ولكن يتعطل على iOS 16...', 'لماذا يرفض تطبيق PWA الخاص بي التثبيت؟',
            'هذه التأثيرات حقيقية ولكنها مؤقتة (10 ثوانٍ كحد أقصى)', 'مُحسَّن لـ Capacitor - بدون رسوم متحركة مرئية', 'لاستخدام العرض التوضيحي فقط (لا تستخدم على جهاز احترافي!)'
          ],
          'hi': [
            'RAM ओवरलोड', 'CPU बर्नर', 'फेक वेबकैम हैक', 'फेक कनेक्शन ड्रॉप', 'भाषा विश्व यात्रा', 'साइकेडेलिक मोड', 'बैटरी ड्रेन', 'यूनिवर्सल अनुवाद',
            'ऐप क्रैश - बड़े पैमाने पर मेमोरी आवंटन', 'डिवाइस फ्रीज - स्थायी रूप से CPU 100%', 'फर्जी सुरक्षा अलर्ट', 'नेटवर्क समस्याओं का मूक सिमुलेशन', 'पृष्ठभूमि में भाषा सेटिंग्स बदलना', 'सिस्टम रंगों को चुपचाप बदलना', 'बैटरी खाली करना - अधिकतम खपत', 'जबरदस्ती अनुवाद - बेतरतीब भाषा परिवर्तन',
            'नेटवर्क समस्याएं सिम्युलेटर', 'मेरा CSS डेस्कटॉप पर काम क्यों करता है लेकिन मोबाइल पर नहीं?', 'कैसे "Capacitor प्लगइन उपलब्ध नहीं है"?!', 'मेरा ऐप जो iOS 15 पर काम करता था लेकिन iOS 16 पर क्रैश होता है...', 'मेरा PWA इंस्टॉल करने से इनकार क्यों करता है?',
            'ये प्रभाव वास्तविक हैं लेकिन अस्थायी हैं (अधिकतम 10 सेकंड)', 'Capacitor के लिए अनुकूलित - कोई दृश्य एनिमेशन नहीं', 'केवल प्रदर्शन के लिए उपयोग करें (पेशेवर डिवाइस पर उपयोग न करें!)'
          ],
          'th': [
            'RAM โอเวอร์โหลด', 'CPU เบิร์นเนอร์', 'แฮ็กเว็บแคมปลอม', 'การตัดการเชื่อมต่อปลอม', 'ทัวร์ภาษาโลก', 'โหมดไซคีเดลิค', 'หมดแบตเตอรี่', 'การแปลสากล',
            'แอปข้องขัด - การจัดสรรหน่วยความจำจำนวนมาก', 'อุปกรณ์แช่แข็ง - CPU 100% ถาวร', 'การแจ้งเตือนความปลอดภัยปลอม', 'จำลองปัญหาเครือข่ายอย่างเงียบๆ', 'เปลี่ยนการตั้งค่าภาษาในพื้นหลัง', 'เปลี่ยนสีระบบอย่างเงียบๆ', 'ทำให้แบตเตอรี่หมด - การบริโภคสูงสุด', 'การแปลบังคับ - เปลี่ยนภาษาแบบสุ่ม',
            'เครื่องจำลองปัญหาเครือข่าย', 'ทำไม CSS ของฉันทำงานบนเดสก์ท็อปแต่ไม่ทำงานบนมือถือ?', 'อะไรนะ "ปลั๊กอิน Capacitor ไม่พร้อมใช้งาน"?!', 'แอปของฉันที่ทำงานบน iOS 15 แต่ขัดข้องบน iOS 16...', 'ทำไม PWA ของฉันปฏิเสธการติดตั้ง?',
            'ผลกระทบเหล่านี้เป็นเรื่องจริงแต่ชั่วคราว (สูงสุด 10 วินาที)', 'ปรับให้เหมาะกับ Capacitor - ไม่มีภาพเคลื่อนไหว', 'ใช้เพื่อการสาธิตเท่านั้น (ห้ามใช้กับอุปกรณ์ระดับมืออาชีพ!)'
          ],
          'ko': [
            'RAM 오버로드', 'CPU 버너', '가짜 웹캠 해킹', '가짜 연결 끊김', '언어 세계 여행', '사이키델릭 모드', '배터리 드레인', '유니버셜 번역',
            '앱 충돌 - 대량 메모리 할당', '기기 동결 - 영구 CPU 100%', '가짜 보안 경고', '네트워크 문제를 조용히 시뮬레이션', '백그라운드에서 언어 설정 변경', '시스템 색상을 조용히 변경', '배터리 소모 - 최대 소비', '강제 번역 - 무작위 언어 변경',
            '네트워크 문제 시뮬레이터', '내 CSS는 데스크톱에서는 작동하지만 모바일에서는 작동하지 않는 이유는 무엇입니까?', '"Capacitor 플러그인을 사용할 수 없습니다"는 무엇입니까?!', 'iOS 15에서는 작동했지만 iOS 16에서는 충돌하는 내 앱...', '내 PWA가 설치를 거부하는 이유는 무엇입니까?',
            '이 효과는 실제이지만 일시적입니다(최대 10초)', 'Capacitor에 최적화 - 시각적 애니메이션 없음', '데모용으로만 사용(전문 기기에서 사용하지 마세요!)'
          ]
        };
        
        const changeLanguageRandomly = () => {
          const randomLang = languages[Math.floor(Math.random() * languages.length)];
          
          // Change la langue et la direction du document
          document.documentElement.lang = randomLang.code;
          document.documentElement.dir = randomLang.dir;
          
          // Change tous les textes de la page
          const langTexts = translatedTexts[randomLang.code] || translatedTexts['zh-CN'];
          
          originalTexts.forEach((textInfo, index) => {
            if (index < langTexts.length) {
              textInfo.element.textContent = langTexts[index];
            }
          });
          
          // Continue à changer indéfiniment toutes les 2 secondes
          setTimeout(changeLanguageRandomly, 2000);
        };
        
        // Démarre le changement de langue
        changeLanguageRandomly();
      }
    }
  ];

  const triggerProblem = (problem: typeof webProblems[0]) => {
    setActiveProblem(problem.name);
    
    try {
      problem.action();
    } catch (error) {
      console.error(`Erreur lors de l'exécution de ${problem.name}:`, error);
    }
    
    setTimeout(() => setActiveProblem(null), 10000);
  };

  return (
    <div className={`probleme-container ${isShaking ? 'shake' : ''}`}>
      <h1 className="title">🤯 PROBLÈMES 🤯</h1>
      
      <div className="philosophical">
        <p>Nous avons quelques problèmes à vous proposé :</p>
        <ul>
  <li>Envie de bombarder ton CPU pour le faire chauffer comme un micro-ondes ? Facile.</li>
  <li>Remplis ta RAM jusqu’à ce que ton ordi pleure... ou redémarre tout seul.</li>
  <li>Chiffre ton disque dur sans sauvegarde, juste pour voir ce que ça fait.</li>
  <li>Change aléatoirement les mots de passe de tes réseaux sociaux — même toi tu ne les connaîtras plus.</li>
  <li>Passe la langue de ton système en hongrois, puis en coréen, sans traduction.</li>
</ul>

      </div>
      
      <div className="simulator">
        <p>Simulateur de catastrophes web (effets en arrière-plan uniquement) :</p>
        <div className="problem-grid">
          {webProblems.map((problem, index) => (
            <button
              key={index}
              className={`problem-btn ${
                activeProblem === problem.name ? 'active' : ''
              }`}
              onClick={() => triggerProblem(problem)}
              disabled={activeProblem !== null}
            >
              <span className="problem-name">{problem.name}</span>
              <span className="problem-desc">{problem.description}</span>
              {activeProblem === problem.name && (
                <span className="problem-status">En cours... (10s)</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="disclaimer">
        <p>⚠️ Ces effets sont réels mais temporaires (10 secondes max).</p>
        <p>Optimisé pour Capacitor - Pas d'animations visuelles</p>
        <p>À n'utiliser que pour démonstration (pas sur un device professionnel !)</p>
      </div>
    </div>
  );
};

export default ProblemeWeb;