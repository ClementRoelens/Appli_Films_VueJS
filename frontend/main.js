const URL = "http://localhost:3000/film/";

const app = Vue.createApp({
    data() {
        return {
            id: '',
            titre: '',
            realisateur: '',
            date: '',
            description: '',
            path: '',
            films: []
        }
    },
    methods: {
        getAllFilms() {
            var myInit = { method: 'GET' };

            fetch(URL, myInit)
                .then(res => res.json()
                    .then(json => {
                        this.films = json;
                    })
                )
                .catch(error => console.log(error));
        },
        getOneFilm(id) {
            if (id) {
                var myInit = { method: 'GET' };

                fetch(URL + id, myInit)
                    .then(res => res.json()
                        .then(filmChoisi => {
                            this.id = filmChoisi._id;
                            this.titre = filmChoisi.titre;
                            this.realisateur = filmChoisi.realisateur;
                            this.date = filmChoisi.date;
                            this.description = filmChoisi.description;
                            this.path = 'images/' + filmChoisi.titre + '.jpg';
                        })
                    )
                    .catch(error => console.log(error))
            }
            else {
                var myInit = { method: 'GET' };

                fetch(URL, myInit)
                    .then(res => res.json()
                        .then(films => {
                            var rand = Math.round(Math.random() * films.length);
                            var filmChoisi = films[rand - 1];

                            this.id = filmChoisi._id;
                            this.titre = filmChoisi.titre;
                            this.realisateur = filmChoisi.realisateur;
                            this.date = filmChoisi.date;
                            this.description = filmChoisi.description;
                            this.path = 'images/' + filmChoisi.titre + '.jpg';
                        })
                    )
                    .catch(error => console.log(error))
            }

        }
    },
    created() {
        this.getAllFilms();
        this.getOneFilm();
    }
}).mount("#app");

//TO DO

//Modèle

//Likes
//Genre
//Avis
//
//Rajouter des films
//Système de notations pour tout le monde
//Système de comptes pour pouvoir écrire des avis

