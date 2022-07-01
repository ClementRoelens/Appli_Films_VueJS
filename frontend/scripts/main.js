const app = Vue.createApp({
    data() {
        return {
            // Peut-être doit-on utiliser une dépendance pour stocker la valeur de l'URL?
            Url: "http://localhost:3000/",

            // Variables des films
            filmId: "",
            title: "",
            director: "",
            date: "",
            description: "",
            // genre:[],
            path: "",
            likes: 0,
            dislikes: 0,
            likedIcon: "../icons/thumbup.png",
            dislikedIcon: "../icons/thumbdown.png",
            opinions: [],
            opinionIndex: 0,
            films: [],
            // Ces genres sont utilisés pour construire la liste des genres en utilisant un v-for.
            // La propriété "active" est utilisée pour montrer à quel genre le film sélectionné appartient
            genres: [
                {
                    "nom": "Action",
                    "active": false
                },
                {
                    "nom": "Aventure",
                    "active": false
                },
                {
                    "nom": "Comédie",
                    "active": false
                },
                {
                    "nom": "Drame",
                    "active": false
                },
                {
                    "nom": "Fantasy",
                    "active": false
                },
                {
                    "nom": "Guerre",
                    "active": false
                },
                {
                    "nom": "Historique",
                    "active": false
                },
                {
                    "nom": "Horreur",
                    "active": false
                },
                {
                    "nom": "Romance",
                    "active": false
                },
                {
                    "nom": "Science-fiction",
                    "active": false
                },
                {
                    "nom": "Thriller",
                    "active": false
                },
                {
                    "nom": "Western",
                    "active": false
                }
            ],

            // Variables des comptes
            userId: "",
            pseudo: "visiteur",
            isLogged: false,
            isAdmin: false,
            // Ces listes permettent de ne pas s'exprimer plusieurs fois sur un même film, et de retrouver le nombre d'opinions exprimées
            // Elles sont par défaut vides, car l'utilisateur n'est par défaut pas authentifié et ne peut donc pas s'exprimer
            likedFilmsId: [],
            dislikedFilmsId: [],
            // En plus d'une expression de faveur ou de défaveur, l'utilisateur peut également rédiger un avis sur un film
            opinionsId: [],
            // L'utilisateur peut également aimer un avis
            likedOpinionsId: [],
            token: null
        };
    },
    methods: {
        // GET
        recupérerTousLesFilms() {
            const myInit = { method: "GET" };
            fetch(this.Url + "film/", myInit)
                .then(res => res.json()
                    .then(films => {
                        this.films = films;
                    })
                )
                .catch(error => console.log(error));
        },
        getOneFilm(id) {
            const myInit = { method: "GET" };
            // Si aucun id n'est passé, on récupérera un film au hasard
            const reqUrl = id ? "film/par_id/" + id : "film/un_seul_au_hasard";
            fetch(this.Url + reqUrl, myInit)
                .then(res => res.json()
                    .then(filmChoisi => this.assignationFilm(filmChoisi))
                ).catch(error => console.log(error))
        },
        recupererFilms(type = "au_hasard", paramUrl = "") {
            // Cette fonction récupère 25 films selon un critère ou non
            // Par défaut, elle récupère au hasard 25 films de la liste sans aucun filtre
            const myInit = { method: "GET" };
            const requeteUrl = this.Url + "film/" + type + paramUrl;
            console.log("recupererFilms URL : " + requeteUrl);
            fetch(requeteUrl, myInit)
                .then(res => res.json()
                    .then(films => {
                        this.films = films;
                        // Une fois les films récupérés et passés dans notre data, on en prend un au hasard pour l'assigner
                        const rand = Math.round(Math.random() * (films.length - 1));
                        const filmChoisi = films[rand];
                        this.assignationFilm(filmChoisi);
                    }))
                .catch(error => console.log(error))
        },

        // POST
        like() {
            // Il n'est pas possible de liker sans être authentifié
            if (this.isLogged) {
                // On prépare deux requêtes : d'abord une portant sur l'utilisateur
                const bodyReq = {
                    filmId: this.filmId,
                    userId: this.userId
                };
                const myInit = {
                    body: JSON.stringify(bodyReq),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.token
                    }
                };
                fetch(this.Url + "user/likedFilm", myInit)
                    .then(user => user.json()
                        .then(res => {
                            // Si le film était déjà liké, la requête a enlevé le film de la liste des films likés. S'il ne l'était pas, elle l'a ajouté
                            // On reçoit la nouvelle liste et surtout l'opération qui en découle : soit ajouter soit enlever un like à ce film
                            localStorage.removeItem("likedFilmsId");
                            localStorage.setItem("likedFilmsId", JSON.stringify(res.user.likedFilmsId));
                            this.likedFilmsId = res.user.likedFilmsId;
                            // On prépare la deuxième requête sur le film maintenant qu'on sait si on doit incrémenter ou désincrémenter le nombre de likes
                            const bodyReq2 = {
                                likes: this.likes,
                                operation: res.operation,
                                userId: this.userId
                            };
                            const myInit2 = {
                                body: JSON.stringify(bodyReq2),
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + this.token
                                }
                            };
                            fetch(this.Url + "film/like/" + this.filmId, myInit2)
                                .then(res => res.json()
                                    .then(film => {
                                        console.log("Succès de la requête de mise à jour du film");
                                        // On appelle la fonction d'assignation pour mettre à jour le film maintenant modifié
                                        this.assignationFilm(film);
                                    })).catch(error => console.log(error));
                        })).catch(error => console.log(error));
            }
            else {
                alert("Connectez-vous pour effectuer cette action");
            }
        },
        dislike() {
            // Cette fonction a exactement le même fonctionnement que la précédente, mais pour les dislikes
            if (this.isLogged) {
                const bodyReq = {
                    filmId: this.filmId,
                    userId: this.userId
                };
                const myInit = {
                    body: JSON.stringify(bodyReq),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.token
                    }
                };
                fetch(this.Url + "user/dislikedFilm", myInit)
                    .then(user => user.json()
                        .then(res => {
                            localStorage.removeItem("dislikedFilmsId");
                            localStorage.setItem("dislikedFilmsId", JSON.stringify(res.user.dislikedFilmsId));
                            this.dislikedFilmsId = res.user.dislikedFilmsId;

                            const bodyReq2 = {
                                dislikes: this.dislikes,
                                operation: res.operation
                            };
                            const myInit2 = {
                                body: JSON.stringify(bodyReq2),
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + this.token
                                }
                            };
                            fetch(this.Url + "film/dislike/" + this.filmId, myInit2)
                                .then(res => res.json()
                                    .then(film => {
                                        console.log("Succès de la requête de mise à jour du film");
                                        this.assignationFilm(film);
                                    })
                                ).catch(error => console.log(error));
                        })
                    )
                    .catch(error => console.log(error));
            }
            else {
                alert("Connectez-vous pour effectuer cette action");
            }
        },
        addOpinion() {
            // Il faut utiliser une autre méthode ensuite
            localStorage.setItem("tempOpinionId", this.filmId);
            window.location.href = './opinion.html';
        },

        // Affichage et autre
        assignationFilm(film) {
            // Quand un film est sélectionné ou mis à jour, on appelle cette fonction pour afficher les différentes infos
            this.filmId = film._id;
            this.title = film.title;
            this.director = film.director;
            this.date = film.date;
            this.description = film.description;
            this.path = this.Url + film.imageUrl;
            this.likes = film.likes;
            this.dislikes = film.dislikes;
            let i = 0;
            film.opinionsId.forEach(opinionId => {
                fetch(this.Url + "opinion/getOneOpinion/" + opinionId)
                    .then(res => res.json().
                        then(receivedOpinion => {
                            this.opinions.push(receivedOpinion);
                            i++;
                            // Les avis les plus likés vont être présentés en premier
                            // On les trie une fois que tous les avis ont été ajoutés
                            if (film.opinions.length > 1 && i == film.opinions.length) {
                                opinions.sort((a, b) => {
                                    return a.likes - b.likes;
                                });
                            }
                        })
                        .catch(error => {
                            console.log("Erreur lors de la réception de l'avis " + opinionId);
                            console.log(error);
                        }))
            });

            this.opinionIndex = 0;
            // Les genres auxquels le film appartient seront dégrisés
            this.genres.forEach(genre => {
                genre.active = film.genres.includes(genre.nom) ? true : false;
            });
            // Si le film a déjà été liké par l'utilisateur, le pouce vers le haut apparaîtra bleu
            if (this.likedFilmsId.includes(this.filmId)) {
                this.likedIcon = "../icons/thumbup_done.png";
            }
            else {
                this.likedIcon = "../icons/thumbup.png";
            }
            // Si le film a déjà été disliké par l'utilisateur, le pouce vers le bas apparaîtra rouge
            if (this.dislikedFilmsId.includes(this.filmId)) {
                this.dislikedIcon = "../icons/thumbdown_done.png";
            }
            else {
                this.dislikedIcon = "../icons/thumbdown.png";
            }
        },
        deconnexion() {
            // L'utilisateur se déconnecte : on vide ses infos du localStorage et on redonne aux data leurs valeurs de base
            localStorage.clear();
            this.token = null;
            this.isLogged = false;
            this.pseudo = "visiteur";
            this.isAdmin = false;
            this.likedFilmsId = [];
            this.dislikedFilmsId = [];
            this.opinionsId = [];
            this.likedOpinionsId = [];
            // Puis on actualise la page
            window.location.reload();
        }
    },
    created() {
        // Tout d'abord, on cherche si l'utilisateur est authentifié
        this.token = localStorage.getItem("jwt");
        try {
            if (this.token && (this.token != "undefined")) {
                // Puisque l'utilisateur est authentifié, on affiche toutes ses infos
                // Au cas où une donnée serait corrompue...
                this.isLogged = true;
                this.userId = localStorage.getItem("id");
                this.pseudo = localStorage.getItem("pseudo");
                this.isAdmin = localStorage.getItem("isAdmin");
                this.likedFilmsId = JSON.parse(localStorage.getItem("likedFilmsId"));
                this.dislikedFilmsId = JSON.parse(localStorage.getItem("dislikedFilmsId"));
                this.opinionsId = JSON.parse(localStorage.getItem("opinionsId"));
                this.likedOpinionsId = JSON.parse(localStorage.getItem("likedOpinionsId"));
            };
        }
        catch (error) {
            console.log(error);
            this.deconnexion();
        }
        // On récupère 25 films au hasard pour peupler la partie gauche de l'appli, ce qui va automatiquement prendre un film au hasard pour l'afficher
        this.recupererFilms();
    }
}).mount("#app");


//TO DO

// Gérer dans la page de connexion les cas de mdp incorrect...
// Gérer l'expiration du JWT

// Créer un middleware d'authentification admin ?

//Et voir s'il est possible de passer un paramètre à la page d'accueil : l'id, un message, etc
//
//Ajouter un genre préféré pour un user?

//Utiliser le routing de VueJS plutôt que les window.location

// Trouver un moyen de correctement centrer verticalement la section avis/likes/dislikes

//Changer les URL des images pour ne pas intégrer le "localhost"...

//Vérifier le fonctionnement du JWT et de la chaîne qu'on donne quand on sign

// Une fois tout fini : revoir les CORS-policies...