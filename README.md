# Stupid - Projet Hackathon

## 📝 Description

**Stupid** est un projet innovant qui propose une solution de redirection intelligente et des fonctionnalités interactives. Le projet combine une extension de redirection avec une plateforme web multi-fonctionnelle.

## ✨ Fonctionnalités

Le site web propose plusieurs modules interconnectés avec des fonctionnalités avancées :

### 🔄 **Redirection**
Système de redirection intelligent de liens (fonctionnalité principale du projet). Permet de rediriger automatiquement les utilisateurs vers des sites spécifiques selon des règles prédéfinies.

### 🔧 **Problème** - Simulateur de Problèmes Web ⚠️ **ATTENTION : CETTE SECTION EST DANGEREUSE** ⚠️
Module éducatif qui simule les problèmes courants rencontrés en développement web mobile :
- **RAM Overload** : ⚠️ Ce n'est pas qu'une simulation ! Provoque un vrai crash par allocation mémoire massive
- **CPU Burner** : Script qui consomme réellement 100% du CPU
- **Webcam Hack** : Simulation d'alerte de sécurité (éducative uniquement)
- **Password Changer** : Interface interactive de changement de mot de passe pour réseaux sociaux, Gmail (simulation complète - vous ne connaîtrez pas le nouveau mot de passe)
- **Tour du Monde Linguistique** : Changement automatique des paramètres de langue du navigateur
- **Mode Psychédélique** : Modification des couleurs système
- **Drainage Express** : Test de consommation maximale de batterie (vide réellement la batterie)
- **Traduction Universelle** : Changement dynamique de langue de l'interface

> ⚠️ **Important** : Ces effets sont réels mais temporaires (10 secondes maximum). Optimisé pour Capacitor avec des effets en arrière-plan uniquement. **À utiliser uniquement pour démonstration !**

### ♻️ **Gaspillage** - Simulateur de Gaspillage
Module humoristique de simulation de gaspillage :
- **Gaspillage d'Argent** : Interface de transfert d'argent fictif avec simulation complète
- **Gaspillage de Stockage** : Génération et téléchargement de fichiers inutiles (100MB à 10GB)
- Interface avec validation de carte de crédit (simulation uniquement)
- Système de confirmation et statuts de transfert

### 🛠️ **Outils**
Boîte à outils utilitaires avec diverses fonctionnalités pratiques pour le développement et les tests.

### 🔍 **Découverte**
Module d'exploration et découverte de nouvelles fonctionnalités et contenus interactifs.

### 💬 **Chat** - Système de Communication Avancé
Double système de chat avec deux modes distincts :

#### Chat IA Curieuse
- IA interactive qui pose des questions personnalisées
- Progression conversationnelle avec 15 questions prédéfinies
- Système de réponses enthousiastes et adaptatif
- Barre de progression de conversation

#### Chat USB en Temps Réel
> ⚠️ **Prérequis** : Fonctionne uniquement avec un téléphone connecté en USB et un serveur WebSocket local

- Communication en temps réel via WebSocket
- Interface de connexion USB avec détection automatique
- URL de serveur configurable (par défaut : ws://localhost:8080)
- Reconnexion automatique en cas de déconnexion
- Statuts de connexion en temps réel (Connecté/Déconnecté/En cours)
- Compatible avec les appareils mobiles via connexion USB

**Configuration Chat USB :**
```bash
# Démarrer le serveur WebSocket (dans le dossier socket/)
cd socket
node server.js

# Le chat se connectera automatiquement à ws://localhost:8080
```

### 🎯 **Karaks**
Module spécialisé avec fonctionnalités dédiées aux interactions Karaks.

### 🎲 **Triche** - Détecteur Anti-Triche Interactif
> ⚠️ **Prérequis** : Fonctionne optimalement avec l'application mobile Capacitor

Module de détection de triche qui semble donner des réponses mais déclenche en réalité une alerte :
- **Caméra Native** : Accès direct à la caméra de l'appareil via Capacitor Camera API
- **Détection d'Actions Suspectes** : Surveillance des actions (clic droit, Ctrl+S, PrintScreen)
- **Capture Photo** : Prise de photo automatique lors de détection de triche
- **Sauvegarde** : Enregistrement des "preuves" dans le cache de l'appareil
- **Galerie** : Accès à la galerie photos de l'appareil
- **Alertes Sonores** : Sons de sirène pour les alertes
- **Interface Adaptative** : Différente selon la plateforme (web/mobile)

**Fonctionnalités spécifiques mobile :**
- Qualité photo optimisée (90%)
- Sauvegarde automatique dans Directory.Cache
- Interface native pour sélection photo/galerie
- Messages personnalisés selon la plateforme

### 🎮 **Jeux**
Section de jeux intégrés avec diverses activités ludiques et interactives.

## 🛠️ Technologies Utilisées

- **Frontend** : React 19 + TypeScript + Vite
- **Styling** : TailwindCSS + Framer Motion + Animate.css
- **Mobile** : Capacitor (Android)
- **Communication** : Socket.io + PeerJS
- **Icônes** : Lucide React

## 📋 Prérequis

Voici comment installer npm si elle n'est pas encore installée :

```bash
# Téléchargement et installation de nvm :
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Au lieu de redémarrer le shell :
\. "$HOME/.nvm/nvm.sh"

# Téléchargement et installation de Node.js :
nvm install 22

# Vérification de la version Node.js :
node -v # Devrait afficher "v22.17.1"
nvm current # Devrait afficher "v22.17.1"

# Vérification de la version npm :
npm -v # Devrait afficher "10.9.2"
```
-Entrer dans le dossier extension
-  npm install -g pnpm
-Charger l’extension dans Chrome :
Ouvrir chrome://extensions/

Activer le mode développeur

Cliquer sur Charger l’extension non empaquetée et chercher dans le fichier

Sélectionner le dossier build (ou dist selon ta config):
faire:
pnpm install
pnpm run build
pnpm run dev

Si vous n'avez pas la flemme, voici comment installer et tester le site uniquement :

### Installation de Node.js sur Linux

```bash
# Téléchargement et installation de nvm :
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Au lieu de redémarrer le shell :
\. "$HOME/.nvm/nvm.sh"

# Téléchargement et installation de Node.js :
nvm install 22

# Vérification de la version Node.js :
node -v # Devrait afficher "v22.17.1"
nvm current # Devrait afficher "v22.17.1"

# Vérification de la version npm :
npm -v # Devrait afficher "10.9.2"
```

## 🚀 Installation et Démarrage

### Frontend (Application principale)

```bash
# Se placer dans le dossier frontend
cd front

# Installation des dépendances
npm install --legacy-peer-deps

# Démarrage du serveur de développement
npm run dev
```

Après avoir lancé npm, il y a 2 liens : local et network. Avec le lien network, vous pouvez aussi y accéder via votre téléphone sur le même réseau.

### Socket Server (optionnel)

```bash
# Se placer dans le dossier socket
cd socket

# Installation des dépendances
npm install

# Démarrage du serveur socket
node server.js
```

## 📱 Développement Mobile

Pour le développement Android avec Capacitor :

```bash
cd front
npm run build
npx cap sync android
npx cap open android
```

## 🎯 Scripts Disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Build de production
- `npm run lint` - Vérification du code
- `npm run preview` - Prévisualisation du build

## 👥 Équipe du Projet

GAEL: Full stack
Judickael: Frontend
Fanantenana: Extension
Faniry: Fonctionnaliter boutton qui s'enfui
Skoerasoa: Conceptrice, peecheur


### 🎯 Répartition des Modules par Développeur
- **Module Redirection & Architecture** : [Nom 1]
- **Modules Problème & Triche** : [Nom 2]
- **Modules Chat & Socket** : [Nom 3]
- **Modules Gaspillage & Jeux** : [Nom 4]
- **Modules Outils & Documentation** : [Nom 5]

*Remplacez les informations ci-dessus avec les vrais détails de votre équipe*

## 📁 Structure du Projet

```
stupid/
├── front/                  # Application frontend React
│   ├── src/
│   │   ├── pages/         # Pages de l'application
│   │   ├── components/    # Composants réutilisables
│   │   └── assets/        # Ressources statiques
│   ├── android/           # Configuration Capacitor Android
│   └── public/            # Fichiers publics
├── socket/                # Serveur Socket.io/WebSocket
└── src/                   # Sources additionnelles
```

## 🔧 Configuration

Le projet utilise plusieurs certificats SSL locaux pour le développement HTTPS. Assurez-vous que les fichiers `localhost.pem` et `localhost-key.pem` sont correctement configurés.



