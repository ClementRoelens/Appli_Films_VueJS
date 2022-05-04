const app = Vue.createApp({
    data() {
        return {
            id: '',
            titre: '',
            realisateur: '',
            date: '',
            description: '',
            // genre:[],
            path: '',
            films: [],
            Url: "http://localhost:3000/film/",
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
                }
            ]
        };
    },
    methods: {
        getAllFilms() {
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
                        .then(filmChoisi => {
                            this.assignationFilm(filmChoisi)
                        })
                    )
                    .catch(error => console.log(error))
            }
            else {
                const myInit = { method: 'GET' };

                fetch(this.Url, myInit)
                    .then(res => res.json()
                        .then(films => {
                            this.films = films;
                            const rand = Math.round(Math.random() * (films.length - 1));
                            const filmChoisi = films[rand];

                            this.assignationFilm(filmChoisi);
                        })
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


            this.genres.forEach(genre => {
                genre.active = film.genre.includes(genre.nom) ? true : false;
            });

        },
        rechercheParGenre(selection) {
            this.recupererTousLesFilms('par_genre/' + selection);
        },
        rechercheParReal(selection) {
            this.recupererTousLesFilms('par_real/' + selection);
        },
        recupererTousLesFilms(paramUrl) {
            // Cette fonction récupère tous les films selon un critère ou non
            const myInit = { method: 'GET' };
            const requeteUrl = paramUrl ? this.Url + paramUrl : this.Url;

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
        }
    },
    created() {
        this.getAllFilms();
        this.getOneFilm();
    }
}).mount("#app");


//TO DO

// Date au rechagrement par genre

//Validation des données dans le controller backend
//
//repasser sur les genres et dates

//Système de notations pour tout le monde
//Système de comptes pour pouvoir écrire des avis

// Une fois tout fini : revoir les CORS-policies...