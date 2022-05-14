const app = Vue.createApp({
    data() {
        return {
            Url: "http://localhost:3000/film/",
            // Variables des films
            id: '',
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
            nom:'visiteur',
            isLogged:false,
            isAdmin:false,
            userLikes:0,
            userAvis:0
        };
    },
    methods: {
        recupérerTousLesFilms() {
            const myInit = { method: 'GET' };

            fetch(this.Url, myInit)
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

                fetch(this.Url + 'par_id/' + id, myInit)
                    .then(res => res.json()
                        .then(filmChoisi => this.assignationFilm(filmChoisi))
                    )
                    .catch(error => console.log(error))
            }
            else {
                const myInit = { method: 'GET' };

                fetch(this.Url + 'un_seul_au_hasard', myInit)
                    .then(res => res.json()
                        .then(filmChoisi => this.assignationFilm(filmChoisi))
                    )
                    .catch(error => console.log(error))
            }

        },
        assignationFilm(film) {
            this.id = film._id;
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
        rechercheParGenre(selection) {
            this.recupererFilms('par_genre/' + selection);
        },
        rechercheParReal(selection) {
            this.recupererFilms('par_real/' + selection);
        },
        recupererFilms(paramUrl) {
            // Cette fonction récupère tous les films selon un critère ou non
            const myInit = { method: 'GET' };
            const requeteUrl = paramUrl ? this.Url + paramUrl : this.Url + 'au_hasard';

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
            fetch(this.Url + 'like/' + this.id,
                {
                    body: JSON.stringify(bodyReq),
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then(res => res.json()
                .then(film => this.assignationFilm(film))
            )
        },
        dislike() {
            const bodyReq = {
                dislikes: this.dislikes,
                // Une fois l'authentification mise en place, faire un cancel dynamique
                cancel: false
            };
            fetch(this.Url + 'dislike/' + this.id,
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
        login(){
           if (this.isLogged){
               this.isLogged = false;
               this.isAdmin = false;
               this.nom = 'visiteur';
           }
           else{
               this.isLogged = true;
               this.isAdmin = true;
               this.nom = "Clément";
           }
        }
    },
    created() {
        this.recupererFilms();
        this.getOneFilm();
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


// Trouver un moyen de correctement centrer verticalement la section avis/likes/dislikes

// Une fois tout fini : revoir les CORS-policies...