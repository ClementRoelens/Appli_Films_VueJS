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
            selectedOpinion: null,
            likedOpinionIcon: "../icons/empty_heart.png",
            films: [],
            // Ces genres sont utilisés pour construire la liste des genres en utilisant un v-for.
            // La propriété "active" est utilisée pour montrer à quel genre le film sélectionné appartient
            genres: [
                {
                    "name": "Action",
                    "active": false
                },
                {
                    "name": "Aventure",
                    "active": false
                },
                {
                    "name": "Comédie",
                    "active": false
                },
                {
                    "name": "Drame",
                    "active": false
                },
                {
                    "name": "Fantasy",
                    "active": false
                },
                {
                    "name": "Guerre",
                    "active": false
                },
                {
                    "name": "Historique",
                    "active": false
                },
                {
                    "name": "Horreur",
                    "active": false
                },
                {
                    "name": "Romance",
                    "active": false
                },
                {
                    "name": "Science-fiction",
                    "active": false
                },
                {
                    "name": "Thriller",
                    "active": false
                },
                {
                    "name": "Western",
                    "active": false
                }
            ],

            // Variables des comptes
            userId: "",
            nickname: "visiteur",
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
        getAllFilms() {
            const myInit = { method: "GET" };
            fetch(this.Url + "film/getAllFilms", myInit)
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
            const reqUrl = id ? "film/getOneFilm/" + id : "film/getOneRandom";
            fetch(this.Url + reqUrl, myInit)
                .then(res => res.json()
                    .then(choosenFilm => this.filmAssignation(choosenFilm))
                ).catch(error => console.log(error))
        },
        getFilms(type = "getRandomFilms", paramUrl = "") {
            // Cette fonction récupère 25 films selon un critère ou non
            // Par défaut, elle récupère au hasard 25 films de la liste sans aucun filtre
            const myInit = { method: "GET" };
            const requeteUrl = this.Url + "film/" + type + paramUrl;
            fetch(requeteUrl, myInit)
                .then(res => res.json()
                    .then(films => {
                        this.films = films;
                        // Une fois les films récupérés et passés dans notre data, on en prend un au hasard pour l'assigner
                        const rand = Math.round(Math.random() * (films.length - 1));
                        const choosenFilm = films[rand];
                        this.filmAssignation(choosenFilm);
                    }))
                .catch(error => console.log(error))
        },

        // Likes et avis
        like() {
            // Il n'est pas possible de liker sans être authentifié
            if (this.isLogged) {
                // On prépare deux requêtes : d'abord une portant sur l'utilisateur
                const bodyReq = {
                    filmId: this.filmId,
                    userId: this.userId,
                    likes: this.likes,
                    likedFilmsId: this.likedFilmsId
                };
                const myInit = {
                    body: JSON.stringify(bodyReq),
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.token
                    }
                };
                fetch(this.Url + "shared/likeFilm", myInit)
                    .then(user => user.json()
                        .then(res => {
                            // Si le film était déjà liké, la requête a enlevé le film de la liste des films likés. S'il ne l'était pas, elle l'a ajouté
                            // On reçoit la nouvelle liste et surtout l'opération qui en découle : soit ajouter soit enlever un like à ce film
                            this.likedFilmsId = res.user.likedFilmsId;
                            localStorage.setItem("likedFilmsId", JSON.stringify(this.likedFilmsId));
                            this.likes = res.film.likes;
                            this.filmUpdate();
                        }))
                    .catch(error => console.log(error));
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
                    userId: this.userId,
                    dislikes: this.dislikes,
                    dislikedFilmsId: this.dislikedFilmsId
                };
                const myInit = {
                    body: JSON.stringify(bodyReq),
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.token
                    }
                };
                fetch(this.Url + "shared/dislikeFilm", myInit)
                    .then(user => user.json()
                        .then(res => {
                            // Si le film était déjà liké, la requête a enlevé le film de la liste des films likés. S'il ne l'était pas, elle l'a ajouté
                            // On reçoit la nouvelle liste et surtout l'opération qui en découle : soit ajouter soit enlever un like à ce film
                            this.dislikedFilmsId = res.user.dislikedFilmsId;
                            localStorage.setItem("dislikedFilmsId", JSON.stringify(this.dislikedFilmsId));
                            this.dislikes = res.film.dislikes;
                            this.filmUpdate();
                            console.log("Après l'opération, le film a " + this.dislikes + " dislikes");
                        }))
                    .catch(error => console.log(error));
            }
            else {
                alert("Connectez-vous pour effectuer cette action");
            }
        },
        addOpinion() {
            localStorage.setItem("tempOpinionId", this.filmId);
            window.location.href = './opinion.html';
        },
        likeOpinion() {
            const bodyReq = {
                userId: this.userId,
                filmId: this.filmId,
                opinionId: this.selectedOpinion._id
            };
            const myInit = {
                body: JSON.stringify(bodyReq),
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.token
                }
            };
            fetch(this.Url + "shared/likeOpinion/", myInit)
                .then(res => res.json()
                    .then(json => {
                        this.likedOpinionsId = json.user.likedOpinionsId;
                        this.selectedOpinion.likes = json.opinion.likes;
                        this.opinionUpdate();
                    }))
                .catch(error => { console.log(error); });
        },

        // Affichage et autre
        filmAssignation(film) {
            // Quand un film est sélectionné ou mis à jour, on appelle cette fonction pour afficher les différentes infos
            this.filmId = film._id;
            this.title = film.title;
            this.director = film.director;
            this.date = film.date;
            this.description = film.description;
            this.path = this.Url + film.imageUrl;
            this.likes = film.likes;
            this.dislikes = film.dislikes;
            this.opinions = [];
            this.selectedOpinion = null;
            let i = 0;
            film.opinionsId.forEach(opinionId => {
                fetch(this.Url + "opinion/getOneOpinion/" + opinionId)
                    .then(res => {
                        res.json()
                            .then(receivedOpinion => {
                                this.opinions.push(receivedOpinion);
                                i++;
                                // Les avis les plus likés vont être présentés en premier
                                // On les trie une fois que tous les avis ont été ajoutés
                                if (film.opinionsId.length > 1 && i == film.opinionsId.length) {
                                    this.opinions.sort((a, b) => {
                                        return a.likes - b.likes;
                                    });
                                }
                                if (i == film.opinionsId.length) {
                                    this.opinionIndex = 0;
                                    this.selectedOpinion = this.opinions[0];
                                    this.opinionUpdate();
                                    console.log("Avis pour " + this.title + " : " + this.opinions);
                                    console.log("Avis sélectionné : " + this.selectedOpinion);
                                }
                            })
                            .catch(error => {
                                console.log("Erreur lors de la réception de l'avis " + opinionId);
                                console.log(error);
                            })
                    })
            });

            // Les genres auxquels le film appartient seront dégrisés
            this.genres.forEach(genre => {
                genre.active = film.genres.includes(genre.name) ? true : false;
            });
            this.filmUpdate();
        },
        filmUpdate() {
            // Si le film a déjà été liké par l'utilisateur, le pouce vers le haut apparaîtra bleu
            if (this.likedFilmsId.includes(this.filmId)) {
                console.log("Ce film a été liké par l'utilisateur");
                this.likedIcon = "../icons/thumbup_done.png";
            }
            else {
                console.log("Ce film n'a pas été liké par l'utilisateur");
                this.likedIcon = "../icons/thumbup.png";
            }
            // Si le film a déjà été disliké par l'utilisateur, le pouce vers le bas apparaîtra rouge
            if (this.dislikedFilmsId.includes(this.filmId)) {
                console.log("Ce film a été disliké par l'utilisateur");
                this.dislikedIcon = "../icons/thumbdown_done.png";
            }
            else {
                console.log("Ce film n'a pas été disliké par l'utilisateur");
                this.dislikedIcon = "../icons/thumbdown.png";
            }
        },
        opinionUpdate() {
            // Si l'avis a été liké par l'utilisateur, l'icône change
            if (this.likedOpinionsId.includes(this.selectedOpinion._id)) {
                this.likedOpinionIcon = "../icons/full_heart.png";
            }
            else {
                this.likedOpinionIcon = "../icons/empty_heart.png";
            }
        },
        opinionSelection(operation) {
            const newIndex = this.opinionIndex + operation;
            if (newIndex >= 0 && newIndex < this.opinions.length){
                this.opinionIndex += operation;
                this.selectedOpinion = this.opinions[this.opinionIndex];
                this.opinionUpdate();
            }
            
        },
        signout() {
            // L'utilisateur se déconnecte : on vide ses infos du localStorage et on redonne aux data leurs valeurs de base
            localStorage.clear();
            this.token = null;
            this.isLogged = false;
            this.nickname = "visiteur";
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
                this.nickname = localStorage.getItem("nickname");
                this.isAdmin = localStorage.getItem("isAdmin");
                this.likedFilmsId = JSON.parse(localStorage.getItem("likedFilmsId"));
                this.dislikedFilmsId = JSON.parse(localStorage.getItem("dislikedFilmsId"));
                this.opinionsId = JSON.parse(localStorage.getItem("opinionsId"));
                this.likedOpinionsId = JSON.parse(localStorage.getItem("likedOpinionsId"));
            };
        }
        catch (error) {
            console.log(error);
            this.signout();
        }
        // On récupère 25 films au hasard pour peupler la partie gauche de l'appli, ce qui va automatiquement prendre un film au hasard pour l'afficher
        this.getFilms();
    }
}).mount("#app");


//TO DO

// Vérifier chaque requête, que les données puissent le moins possibles être falsifiées/corrompues par l'utilisateur
// Gérer dans la page de connexion les cas de mdp incorrect...
// Gérer l'expiration du JWT (et le JWT en général)
// Implenter les res.ok dans tous les fetch

// Créer un middleware d'authentification admin ?

//Et voir s'il est possible de passer un paramètre à la page d'accueil : l'id, un message, etc
//
//Ajouter un genre préféré pour un user?

//Utiliser le routing de VueJS plutôt que les window.location

// Trouver un moyen de correctement centrer verticalement la section avis/likes/dislikes

//Changer les URL des images pour ne pas intégrer le "localhost"...

//Vérifier le fonctionnement du JWT et de la chaîne qu'on donne quand on sign

// Une fois tout fini : revoir les CORS-policies...