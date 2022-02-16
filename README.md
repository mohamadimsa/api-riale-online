[![Kraaken API CI](https://github.com/kraken-security/api/actions/workflows/node.js.yml/badge.svg)](https://github.com/kraken-security/api/actions/workflows/node.js.yml)
# Kraaken Project API

Kraaken API est le projet backend de l'entreprise kraaken.

## Les bases

### Architecture

Nous avons adopté une `architecture` issue du `PHP` qui s'appel le `MVC`

### Structures / FrameWork:

Nous utilisons dans notre projet le framework Kraaken, uniquement disponible dans notre entreprise,
de ce fait, nous devons avoir une documentation pointue, afin que toutes personnes qui rejoint le projet,
puisse si retrouver le plus facilement possible.

### Controller

Les controllers son disponible dans le dossier `./controllers/`

Un système de découverte automatique des controllers a été mise en place, afin d'éviter au maximum les imports rébarbatif.

#### Création d'un controller:

Pour créer un controller il suffit de créé un dossier `{name}Controller` le Pascal Case est de rigueur !!

Dans ce dossier il suffit de créé un fichier `.js` qui contiendras une méthode.

Pour utiliser le controller il faut ajouter un fichier dans le dossier `routes`.

### Routes
Ce fichier est un tableau d'objet structuré qui contient la `route`, la `method` et la `function` à utiliser pour le bon fonctionnement des routes avec les controller

Dans la clé `function` on utilisera comme valeur ceci :

```js
    const Controller = require("$controllers");
   [
       /**
        *@Route : /user/refresh-token
        *@Method : post
        */
       {
           url:"/user/refresh-token",
           method: "post",
           func : [Controller["UserController@refreshToken"]],
           perm: ['ROLE_USER']
       },
   ]
```

Pour utiliser la méthode depuis le fichier précédemment créé dans le dossier de controller,
on utilise le caractère `@`, cela donne ceci: `"FolderController@controllerMethodFileName"`


Si on veut que la route doit être utilisé par tous types d'utilisateur (tous les roles confondu), mais
que l'utilisateur doit être obligatoirement connecté on utilise le système de permission :

Sauf qu'on ne spécifie aucun role just le caractère `*`
```js
    const Controller = require("$controllers");
   [
       /**
        *@Route : /user/refresh-token
        *@Method : post
        */
       {
           url:"/user/refresh-token",
           method: "post",
           func : [Controller["UserController@refreshToken"]],
           perm: ['*']
       },
   ]
```

### Services

#### Notre FrameWork Kraaken possède plusieurs service:

### 1. Securité

Tous ce qui est lié à la sécurité

### 2. System

Les gestion du system kraaken, t-elle que la gestion des activité

### 3. Tasks

Les taches asynchrones executé par delai ou en tache de fond.

### 4. Terminal

Nous avons déployé un terminal en ligne de commande qui est personnalisable et scalable a souhait.

Pour l'instant il nous permet de générer ceci:

1. Controller
2. Mail
3. Factory
4. Route
5. Test

### 5. Mail

Le système d'envoie de mail.

### 6. SMS

Le système d'envoie des SMS.

### 6. history

Le système d'historique.

### Sécurité

Pour la sécurité du projet, nous utilisons `snyk`

Avant de push utilisé la commande afin de check la sécurité des dépendances du projet

1. `snyk wizard`
2. `snyk test`
3. `snyk protect`

###

connection au serveur

```text
ssh root@139.177.182.131
```

mot de passe: `kraaken`

lancer le serveur:

1. `cd /var/www/api`
2. `forever -c "npm start" ./`
3. `forever list`

relancer le serveur:

```
forever restartall
```

debug

```
forever list
```

puis

```
tail -f /root/.forever/[ficher de log depuis `forever list`].log
```# api-Bank-afrika
# api
