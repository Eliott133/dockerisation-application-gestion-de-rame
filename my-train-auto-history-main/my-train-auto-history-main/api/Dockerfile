# Utilisation de l'image de base Python version 3.11
FROM python:3.11

# Décommentez ces lignes si vous utilisez un proxy (connection de l'IUT)
# ENV http_proxy http://proxy.univ-lemans.fr:3128
# ENV https_proxy http://proxy.univ-lemans.fr:3128

# Métadonnées de l'image
LABEL version="1.0"
LABEL maintainer="eliott.maubert.etu@univ-lemans.fr"
LABEL description="My Train Autohistory server"

# Définition du répertoire de travail dans l'image
WORKDIR /usr/src/app

# Copie du fichier requirements.txt dans le répertoire de travail
COPY requirements.txt .

# Installation des dépendances définies dans requirements.txt (sans utiliser le cache)
RUN pip --no-cache-dir install -r requirements.txt

# Copie de tous les fichiers du contexte de construction dans le répertoire de travail de l'image
COPY . .

# Commande d'entrée qui sera exécutée lorsque le conteneur sera démarré
ENTRYPOINT ["/bin/sh","start-server.sh"]
