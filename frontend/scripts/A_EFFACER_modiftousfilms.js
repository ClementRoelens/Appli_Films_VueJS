const app = Vue.createApp({
    data() {
        return {
            i: 0,
            message: '',
            messageStyle:'',
            Url: 'http://localhost:3000/film/',
            films: [],
            id: '',
            titre: '',
            date: '',
            realisateur: '',
            description: '',
            imageUrl: '',
            genres: [
                'Action',
                'Aventure',
                'Comédie',
                'Drame',
                'Fantasy',
                'Guerre',
                'Historique',
                'Horreur',
                'Romance',
                'Science-fiction',
                'Thriller',
                'Western'
            ]
        };
    },
    methods: {
        submit() {
            // On crée une variable permettant la validation
            // À chaque nouvelle donnée de notre formulaire, on vérifiera avant de la traiter si l'utilisateur a entré quelque chose

            // J'utilise ici une validation manuelle "à l'ancienne", n'ayant rien trouvé qui me satisfasse assez en utilisant les capacités de Vue JS. 
            // Il existe certainement une meilleure méthode

            let isValide = true;

            // On crée un objet FormData qui contiendra nos données et notre image
            const formData = new FormData();
            formData.append('titre', this.titre)
            // formData.append('realisateur', this.realisateur)
            // formData.append('description', this.description)
            // formData.append('date', this.date)
            // Puis on traite la checkbox en ajoutant à FormData tous les éléments checkés
            const checkedGenres = new Array();
            const checkableGenres = document.querySelectorAll("input[type='checkbox']");
            checkableGenres.forEach(genre => {
                if (genre.checked) {
                    checkedGenres.push(genre.value);
                }
            })
            // Au moins un genre doit être sélectionné
            if (checkedGenres.length === 0) {
                isValide = false;
            }
            else {
                formData.append('genres', checkedGenres);
                // Enfin, on ajoute l'image
                const image = document.getElementById('image').files[0];
                if (!image) {
                    isValide = false;
                }
                else {
                    formData.append('file', image)
                    // Maintenant que toutes les données ont été rajoutés et sont valides, on envoie la requête
                    fetch(this.Url + this.id,
                        {
                            body: formData,
                            method: "put"
                        })
                        .then(() => {
                            // const message = document.getElementById('validationMessage');
                            this.message = 'Film correctement modifié!'
                            this.messageStyle = 'transition: opacity 2s linear;opacity:1'
                            this.suivant()
                            window.setTimeout(this.fadeout,3000)
                        })
                        .catch(error => console.log(error))
                }

            }
            // Si le formulaire n'est pas validé, on affiche un message
            if (!isValide) {
                // const message = document.getElementById('validationMessage');
                this.message = 'Tous les champs doivent être remplis et au moins un genre doit être sélectionné'
            }
        },
        suivant() {
            this.i++;
            this.peupler();
        },
        peupler() {
            fetch(this.Url, { method: "GET" })
                .then(films => films.json()
                    .then(filmsJson => {
                        this.films = filmsJson
                        this.titre = this.films[this.i].titre
                        this.imageUrl = this.films[this.i].imageUrl
                        this.id = this.films[this.i]._id
                        this.realisateur = this.films[this.i].realisateur
                        this.description = this.films[this.i].description
                        this.date = this.films[this.i].date
                    }))
        },
        fadeout(){
            this.messageStyle = 'transition: opacity 2s linear;opacity:0'
        }
    },
    created() {
        this.peupler();
    }
}).mount("#app");

