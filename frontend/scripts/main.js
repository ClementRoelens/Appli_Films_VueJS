const app = Vue.createApp({
    data() {
        return {
            // Peut-être doit-on utiliser une dépendance pour stocker la valeur de l'URL?
            Url: "http://localhost:3000/",
            // Variables des films
            filmId: '',
            titre: '',
            realisateur: '',
            date: '',
            description: '',
            // genre:[],
            path: '',
            likes: 0,
            dislikes: 0,
            avis: [],
            films: [],
            // Ces genres sont utilisés pour construire la liste des genres en utilisant un v-for.
            // La propriété "active" est utilisée pour montrer à quel genre le film sélectionné appartient
            genres: [
                {
                    'nom': 'Action',
                    'active': false
                },
                {
                    'nom': 'Aventure',
                    'active': false
                },
                {
                    'nom': 'Comédie',
                    'active': false
                },
                {
                    'nom': 'Drame',
                    'active': false
                },
                {
                    'nom': 'Fantasy',
                    'active': false
                },
                {
                    'nom': 'Guerre',
                    'active': false
                },
                {
                    'nom': 'Historique',
                    'active': false
                },
                {
                    'nom': 'Horreur',
                    'active': false
                },
                {
                    'nom': 'Romance',
                    'active': false
                },
                {
                    'nom': 'Science-fiction',
                    'active': false
                },
                {
                    'nom': 'Thriller',
                    'active': false
                },
                {
                    'nom': 'Western',
                    'active': false
                }
            ],
            // Variables des comptes
            userId:"",
            pseudo: 'visiteur',
            isLogged: false,
            isAdmin: false,
            likedFilmsId: [],
            noticesFilmsId: [],
            likedNoticesId: [],
            token: ''
        };
    },
    methods: {
        recupérerTousLesFilms() {
            const myInit = { method: 'GET' };

            fetch(this.Url + "film/", myInit)
                .then(res => res.json()
                    .then(films => {
                        this.films = films;
                    })
                )
                .catch(error => console.log(error));
        },
        getOneFilm(id) {
            if (id) {
                const myInit = { method: 'GET' };

                fetch(this.Url + 'film/par_id/' + id, myInit)
                    .then(res => res.json()
                        .then(filmChoisi => this.assignationFilm(filmChoisi))
                    )
                    .catch(error => console.log(error))
            }
            else {
                const myInit = { method: 'GET' };

                fetch(this.Url + 'film/un_seul_au_hasard', myInit)
                    .then(res => res.json()
                        .then(filmChoisi => this.assignationFilm(filmChoisi))
                    )
                    .catch(error => console.log(error))
            }

        },
        rechercheParGenre(selection) {
            this.recupererFilms('film/par_genre/' + selection);
        },
        rechercheParReal(selection) {
            this.recupererFilms('film/par_real/' + selection);
        },
        recupererFilms(paramUrl) {
            // Cette fonction récupère tous les films selon un critère ou non
            const myInit = { method: 'GET' };
            const requeteUrl = paramUrl ? this.Url + paramUrl : this.Url + 'film/au_hasard';

            fetch(requeteUrl, myInit)
                .then(res => res.json()
                    .then(films => {
                        // En récupérer 25
                        this.films = films;
                        // Une fois tous les films récupérés et passés dans notre data, on en prend un au hasard pour l'assigner
                        const rand = Math.round(Math.random() * (films.length - 1));
                        const filmChoisi = films[rand];
                        this.assignationFilm(filmChoisi);
                    }))
                .catch(error => console.log(error))
        },
        like() {
            const bodyReq = {
                likes: this.likes,
                // Une fois l'authentification mise en place, faire un cancel dynamique
                cancel: false
            };
            const myInit = {
                body: JSON.stringify(bodyReq),
                method: "POST",
                headers: { 'Content-Type': 'application/json' }
            };
            fetch(this.Url + 'film/like/' + this.filmId, myInit)
                .then(res => res.json()
                    .then(film => this.assignationFilm(film))
                )
        },
        dislike() {
            const bodyReq = {
                dislikes: this.dislikes,
                // Une fois l'authentification mise en place, faire un cancel dynamique
                cancel: false
            };
            fetch(this.Url + 'film/dislike/' + this.filmId,
                {
                    body: JSON.stringify(bodyReq),
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then(res => res.json()
                .then(film => this.assignationFilm(film))
            )
        },
        ajouterAvis() {

        },
        assignationFilm(film) {
            this.filmId = film._id;
            this.titre = film.titre;
            this.realisateur = film.realisateur;
            this.date = film.date;
            this.description = film.description;
            this.path = film.imageUrl;
            this.likes = film.likes;
            this.dislikes = film.dislikes;
            this.avis = film.avis;

            this.genres.forEach(genre => {
                genre.active = film.genre.includes(genre.nom) ? true : false;
            });

        },
        login() {
            if (this.isLogged) {
                this.isLogged = false;
                this.isAdmin = false;
                this.nom = 'visiteur';
            }
            else {
                this.isLogged = true;
                this.isAdmin = true;
                this.nom = "Clément";
            }
        }
    },
    created() {
        this.recupererFilms();
        this.getOneFilm();
        this.token = localStorage.getItem("token");
        if (this.token != '') {
            console.log("Le token est présent!");
            this.isLogged = true;
            this.pseudo = localStorage.getItem("pseudo");
            this.isAdmin = localStorage.getItem("isAdmin");
            this.likedFilmsdId = JSON.parse(localStorage.getItem("likedFilmsdId"));
            this.noticesFilmsId = JSON.parse(localStorage.getItem("noticesFilmsId"));
            this.likedNoticesId = JSON.parse(localStorage.getItem("likedNoticesId"));
        }
    }
}).mount("#app");


//TO DO


//Créer les comptes et ne laisser que les authentifiés liker/disliker, pour que réappuyer sur le pouce annule
//Ajout de film : utiliser du binding plutôt qu'un bête getElementById sur l'ajout
//Contrôler que les champs ne soient pas undefined dans les requêtes du backend

//Paramétrer la page d'accueil : si id, afficher celle-là
//Validation des données dans le controller backend
//
//repasser sur les genres et dates

//Utiliser le routing de VueJS plutôt que les window.location

// Trouver un moyen de correctement centrer verticalement la section avis/likes/dislikes

//Changer les URL des images pour ne pas intégrer le "localhost"...

//Vérifier le fonctionnement du JWT et de la chaîne qu'on donne quand on sign

// Une fois tout fini : revoir les CORS-policies...