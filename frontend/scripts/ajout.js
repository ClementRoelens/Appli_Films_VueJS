const app = Vue.createApp({
    data() {
        return {
            Url: 'http://localhost:3000/film/',
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
            ],
            titre: "",
            realisateur: "",
            description: "",
            date: ""
        };
    },
    methods: {
        submit() {
            // On crée une variable permettant la validation
            // À chaque nouvelle donnée de notre formulaire, on vérifiera avant de la traiter si l'utilisateur a entré quelque chose

            // J'utilise ici une validation manuelle "à l'ancienne", n'ayant rien trouvé qui me satisfasse assez en utilisant les capacités de Vue JS. 
            // Il existe certainement une meilleure méthode

            let isValide = false;

            // On crée un objet FormData qui contiendra nos données et notre image
            const formData = new FormData();
            // Et on ajoute les premiers champs si ceux-ci ont été remplis
            if (this.titre && this.realisateur && this.description && this.date) {
                formData.append("titre", this.titre);
                formData.append("realisateur", this.realisateur);
                formData.append("description", this.description);
                formData.append("date", this.date);

                // Puis on traite la checkbox en ajoutant à FormData tous les éléments checkés
                const checkedGenres = new Array();
                const checkableGenres = document.querySelectorAll("input[type='checkbox'");
                checkableGenres.forEach(genre => {
                    if (genre.checked) {
                        checkedGenres.push(genre.value);
                    }
                })
                // Au moins un genre doit être sélectionné
                if (checkedGenres.length !== 0) {
                    formData.append('genres', checkedGenres);
                    // Enfin, on ajoute l'image
                    const image = document.getElementById("image").files[0];
                    // On va vérifier qu'un fichier a bien été ajouté et que c'est bien une image
                    const authorizedMimeTypes = ["image/jpg", "image/jpeg", "image/png"]
                    if (image && authorizedMimeTypes.includes(image.type)) {
                        formData.append('file', image)
                        // Maintenant que toutes les données ont été rajoutés et sont valides, on confirme leur validité et n'affiche pas le message les demandant
                        isValide = true;
                        this.realisateur = '';
                        // Puis on envoie la requête
                        fetch(this.Url + "ajout",
                            {
                                body: formData,
                                method: "POST"
                            })
                            .then(() => {
                                window.location.href = './index.html'
                            })
                            .catch(error => console.log(error))
                    }
                }
            }
            // Si le formulaire n'est pas validé, on affiche un message
            if (!isValide) {
                const message = document.getElementById('validationMessage');
                message.innerHTML = 'Tous les champs doivent être remplis, au moins un genre doit être sélectionné, et le fichier sélectionné doit être une image au format .jpg ou .png'
            }

        },
    }
}).mount("#app");

