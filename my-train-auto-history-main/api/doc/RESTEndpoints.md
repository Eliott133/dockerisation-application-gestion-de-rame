# COMMUN

## Chemin de base

/api/v1

## Erreur
Une erreur vient toujours avec un header status et 
Corps de reponse d'erreur 

```
{
    "error": <string>,
    "details": <string>?,
    "code": <number>,
    "type": <string>?
}
```

# Endpoints

5 endpoints possible

## GET /api/v1/rames/

Listing des rames

Codes de réponse:
- 200 : OK, rame ajoutée avec ses tâches
- 500 : unmanaged server error

Corps de réponse
```
[
{
  "numSerie": <string>,
  "typeRame": <string>,
  "numTaches": <number>
}
]
```

## POST /api/v1/rames/

Entrée d'une rame dans le centre.

Corps de requête
```
{
  "numSerie": <string, not blank, max 12 chars>,
  "typeRame": <string, not blank, max 50 chars>,
  "operateur": <string, not blank, max 150 chars>,
  "taches": Array<string, not blank> not empty, max 200 taches, 
}
```

Codes de réponse:
- 200 : OK, rame ajoutée avec ses tâches
- 400: BAD REQUEST corps de requête invalide : champs manquant ou ne respectant pas les conditions de validation
- 409 : CONFLICT, rame de numSerie déjà présente
- 500 : unmanaged server error

Corps de réponse
```
{
  "numSerie": <string>,
  "typeRame": <string>,
  "numTaches": <number>
  "tachesRestantes": [{idx: <number>, tache:<string>}]
}
```

## GET /api/v1/rames/:numSerie?details

Obtention des information d'une rame présente dans le centre. 
Si paramètre de recherche details present, retourne également les tâches restante à réaliser.

Parametre
- detail: present or not. Si present, fourni en plus la liste des tâche à faire

Codes de réponse:
- 200 : OK, rame ajoutée avec ses tâches
- 404: rame inconnue
- 500 : unmanaged server error

Corps de réponse
```
{
  "numSerie": <string>,
  "typeRame": <string>,
  "numTaches": <number>,
  "tachesRestantes": [{idx: <number>, tache:<string>}]
}
```

## GET /api/v1/rames/:numSerie/actions

Obtention de l'historique des actions d'une rame présente dans l'entrepot.

Codes de réponse:
- 200 : OK, rame ajoutée avec ses tâches
- 404: rame inconnue
- 500 : unmanaged server error

Corps de réponse, trié par timestamp DESC
```
[
{
  "timestamp": <string>,
  "operateur": <string>,
  "action": <string>,
  "taches": [{idx: <number>, tache:<string>}]
}
]
```

## POST /api/v1/rames/:numSerie/action

Action effectuée sur une rame présente dans l'entrepot. Peut être tache(s) réalisée(s), tache(s) ajoutée(s) ou sortie de rame.

Corps de requête si réalisation de tâche 
```
{
  "operateur": <string, not blank, max 150 chars>,
  "action": "entretien",
  "taches": Array<number not null> not empty, max 200, 
}
```

Corps de requête si ajout de tâche 
```
{
  "operateur": <string, not blank, max 150 chars>,
  "action": "ajoutTaches",
  "taches": Array<string not blank> not empty, max 200, 
}
```

Corps de requête si sortie de rame 
```
{
  "operateur": <string, not blank, max 150 chars>,
  "action": "sortie"
}
```

Codes de réponse :
- 200 : OK, si réalisation ou ajout de taches
- 204 : NO CONTENT si sortie de rame
- 400: BAD REQUEST corps de requête invalide : champs manquant ou ne respectant pas les conditions de validation, ou indice de tache incorrect (quand action="entretien")
- 404: rame inconnue
- 500 : unmanaged server error

Corps de réponse si réalisation ou ajout de taches
```
{
  "numSerie": <string>,
  "typeRame": <string>,
  "numTaches": <number>,
  "tachesRestantes": [string]
}
```

Pas de cors de réponse si sortie de rame.

## GET /api/v1/actions

Recherche d'actions réalisées dans le centre. Retourne par défaut les 10 dernières action. 
Filtre possible sur le numéro de série d'une rame et sur l'opérateur
Limite du nombre d'action paramétrable (limite peut être retirée ou modifiée) 

Paramètre de recherche
- numSerie: <String>, optionnel?
- operateur: <String>, optionnel?
- limit: Number, default=10 (désactivé si limite = -1)

Codes de réponse:
- 200 : OK, rame ajoutée avec ses tâches
- 500 : unmanaged server error

Corps de réponse, trié par timestamp DESC
```
[
{
  "timestamp": <string>,
  "operateur": <string>,
  "action": <string>,
  "taches": [{idx: <number>, tache:<string>}]
}
]
```

