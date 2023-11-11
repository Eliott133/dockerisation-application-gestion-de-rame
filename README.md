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
](https://github.com/Eliott133/dockerisation-application-gestion-de-rame/blob/master/configurationHost.py).Vous pouvez trouver les informations de connexion dans le [docker-compose.yml
](https://github.com/Eliott133/dockerisation-application-gestion-de-rame/blob/master/docker-compose.yml) certaine information fonctionne avec les secret docker vous pourrez les trouvez dans le dossier secrets-data

- **Gestion des profils** : Utilisez les profils dans Docker Compose pour activer/désactiver des fonctionnalités spécifiques en fonction de l'environnement.

- **Logs** : Surveillez les logs pour détecter d'éventuels problèmes et suivre l'état de l'application.

- **Gestion des ports** : L'application utilise plusieurs ports pour différents services. Assurez-vous qu'aucun de ces ports n'est déjà utilisé sur votre machine pour éviter toute confusion :
   - Port 8080 : Interface Web de l'application
   - Port 8888 : Interface Web de phpMyAdmin (utilisé dans le profil "dev")
   - Port 8809 : Interface Web de Mongo Express (utilisé dans le profil "dev")
Si ces ports sont déjà utilisés par d'autres applications sur votre machine, vous devrez ajuster les ports dans le fichier docker-compose.yml pour éviter les conflits.

Vous pouvez trouver plus d'information à propos de l'architecture dans le pdf [diagramme_deploiement
](https://github.com/Eliott133/dockerisation-application-gestion-de-rame/blob/master/diagramme_deploiement_GPTD32_1.pdf) 


