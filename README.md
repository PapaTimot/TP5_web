# TP de Web : Services, Authentification et base de données

## Utilisation :
 * Ce dépôt git contient deux projet npm :
   * un service d'authentification dans le répertoire Auth-Service
   * un service de gestion de ressources appelées 'alertes' dans le répertoire Alerts-Service
 * Avant de pouvoir utiliser les services implémentés, il faut exécuter la commande `npm install` dans chacun de ces deux répertoires afin de télécharger les dépendances. 
 * Le service d'authentification peut être lancé grâce à un simple `npm start` dans le répertoire 'Auth-Service'.
 * Le service d'alerte peut également être lancé avec `npm start` dans le répertoire 'Alerts-Service', mais il est nécessaire pour son fonctionnement d'avoir préalablement lancé le service d'authentification.
 * Pour exécuter les tests, utiliser la commande `npm test` dans chacun des deux répertoires de projet

## Autheurs :
 * Reprise d'un squelette de code et de consignes de Stéphane Michel et  Benoit Chanclou
 * Tp réalisé par Yoann Breton et Timothée Schneider-Maunoury

## Limites du TP
 * Nous n'avons pas encore implémenté la vérification des propriétés des alertes, ce qui explique en partie pourquoi certains tests ne passent pas pour le service d'alertes.
