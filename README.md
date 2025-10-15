# 💊 PharmaTrack : Système de Gestion de Pharmacie

## 📝 Description du Projet

PharmaTrack est une application web monopage (SPA) construite avec **Angular** qui simule le système de gestion de stock et de ventes d'une petite pharmacie.

L'objectif principal est de fournir un tableau de bord pour l'administration, de gérer les stocks de médicaments, d'alerter sur les ruptures, et d'enregistrer les transactions de vente.

## 🌟 Fonctionnalités Implémentées

* **Gestion des Stocks (CRUD)** : Ajouter, Modifier, Afficher et Supprimer des médicaments.
* **Sécurité par Rôles** : Accès restreint au Dashboard et aux actions d'administration (`admin`).
* **Vues Différenciées** : Les utilisateurs simples voient uniquement la liste des médicaments.
* **Alertes de Stock** : Notification visuelle des médicaments dont la quantité est inférieure à 10.
* **Tableau de Bord Admin** : Affichage du Chiffre d'Affaires du jour, du nombre de ventes, et de graphiques des revenus mensuels.
* **Moteur de Recherche** : Recherche rapide de médicaments par nom .
* **API REST** : Utilisation de `json-server` pour simuler un backend RESTful.

## 🛠️ Technologies Utilisées

* **Frontend** : Angular (Standalone Components)
* **Backend Simulé** : `json-server`
* **Langages** : TypeScript, HTML, SCSS
* **Graphiques** : `ng2-charts` (basé sur Chart.js)

## 🚀 Guide d'Installation et de Démarrage

Pour faire fonctionner ce projet en local, suivez les étapes ci-dessous.

### Prérequis

Assurez-vous d'avoir installé :
* Node.js (version LTS recommandée)
* npm ou yarn
* Angular CLI (`npm install -g @angular/cli`)

### Installation des Dépendances

Clonez le dépôt et installez les dépendances Angular et json-server :

```bash
# Cloner le dépôt
git clone [https://github.com/Aristide226/pharma-track-burkina.git]
pharma-track-burkina

# Installer les dépendances (Angular, ng2-charts, json-server, etc.)
npm install

# Démarre l'API sur http://localhost:3000
cd src
npx json-server --watch db.json

# Démarre l'application sur http://localhost:4200
ng serve
