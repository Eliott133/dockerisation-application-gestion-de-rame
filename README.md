# Deploiement de My Train Autohistory Application

![Logo Docker](https://logo-marque.com/wp-content/uploads/2021/03/Docker-Logo-650x366.png)



Ce repository contient le code source et les configurations de l'application My Train Autohistory.

## Prerequisites

Avant de commencer, assurez-vous que les éléments suivants sont installés sur votre ordinateur :

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (version V2 de docker compose)

## Vérifier la version de docker compose

```bash

docker-compose version
`````

## Getting Started

:warning: si vous utiliser un proxy référer vous à la partie [Configuration du proxy dans la section Configuration en tant qu'Administrateur](##Configuration en tant qu'Administrateur)


1. Cloner le  repository:

   ```bash
   git clone https://github.com/Eliott133/dockerisation-application-gestion-de-rame.git
   ```

   ```bash
   cd dockerisation-application-gestion-de-rame
   ```
2. Lancer le déploiement

   ```bash

   docker-compose --profile prod up -d
   ```

3. Acceder à l'application web

Dans la barre de recherche de votre navigateur accéder à :

   ```bash

      localhost:8080
   ```

4. Stopper le déploiement 

```bash
docker-compose --profile prod down
```

## Profils de Configuration

L'application My Train Autohistory utilise des profils dans Docker Compose pour gérer différentes configurations en fonction de l'environnement. Les profils sont les suivants :

- prod : Utilisé pour le déploiement en production.
- dev : Utilisé pour le développement (orienté base de données)
- front-build : pour rebuild l'application (prévoyer &approx; 5 min pour que l'application soit entièrement build)

Pour changer de profil :

```bash
# pour un déploiement en production
docker-compose --profile prod up -d
```

> :warning: pour ce profile : **le profile prod doit être lancé avant**

```bash
# pour un profil de développemment sur les différentes bases de donnes
docker-compose --profile dev up -d
```

```bash
# pour rebuild l'application
docker-compose --profile front-build up -d
```

## Configuration en tant qu'Administrateur

En tant qu'administrateur, vous devez gérer certaines configurations. Voici quelques points à prendre en compte :

- **Connexion aux bases de données** : vous pouvez configurer la connexion à la base de données de l'application via le fichier [configurationHost.py
](https://github.com/Eliott133/dockerisation-application-gestion-de-rame/blob/master/configurationHost.py). Vous pouvez trouver les informations de connexion dans le [docker-compose.yml
](https://github.com/Eliott133/dockerisation-application-gestion-de-rame/blob/master/docker-compose.yml), certaines informations fonctionnent avec les secrets docker vous pourrez les trouver dans le dossier secrets-data

- **Gestion des profils** : Utilisez les profils dans Docker Compose pour activer/désactiver des fonctionnalités spécifiques en fonction de l'environnement.

- **Logs** : Surveillez les logs pour détecter d'éventuels problèmes et suivre l'état de l'application.

- **Gestion des ports** : L'application utilise plusieurs ports pour différents services. Assurez-vous qu'aucun de ces ports n'est déjà utilisé sur votre machine pour éviter toute confusion :
   - Port 8080 : Interface Web de l'application
   - Port 8888 : Interface Web de phpMyAdmin (utilisé dans le profil "dev")
   - Port 8809 : Interface Web de Mongo Express (utilisé dans le profil "dev")
Si ces ports sont déjà utilisés par d'autres applications sur votre machine, vous devrez ajuster les ports dans le fichier docker-compose.yml pour éviter les conflits.

- **Configuration du proxy** : Si vous utilisez le proxy de l'IUT du Mans vous devez décommenter quelques lignes dans le [Dockerfile
](https://github.com/Eliott133/dockerisation-application-gestion-de-rame/blob/master/my-train-auto-history/api/Dockerfile). Il est également nécessaire de configurer le proxy directement sur docker desktop. [Configurer le proxy](https://linuxhint.com/configure-docker-for-use-with-proxy/).
   - Champs Proxy HTTP : http://proxy.univ-lemans.fr:3128
   - Champs Proxy HTTPS : http://proxy.univ-lemans.fr:3128

Vous pouvez trouver plus d'information à propos de l'architecture dans le pdf [diagramme_deploiement
](https://github.com/Eliott133/dockerisation-application-gestion-de-rame/blob/master/diagramme_deploiement_GPTD32_1.pdf) 


## Information sur les images utilisé

| Image                                   | Version   |
| --------------------------------------- | --------- |
| mariadb                                 | 11        |
| phpmyadmin                              | 5         |
| mongo                                   | latest   |
| mongo-express                           | latest   |
| nginx                                   | 1.25      |
| node                                    | 20        |
| dockerisation-application-gestion-de-rame-api | FROM python3.11 |




