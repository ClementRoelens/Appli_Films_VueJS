const app = Vue.createApp({
    data() {
        return {
            URL:'http://localhost:3000/film/',
            genres: [
                'Action',
                'Aventure',
                'Comédie',
                'Drame',
                'Fantasy',
                'Horreur',
                'Romance',
                'Science-fiction',
                'Thriller'
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
            const form = document.querySelectorAll('form input , form textarea');
            // On fait une première boucle pour récupérer les valeurs des champs de saisie simples, et on sort si une valeur est vide
            for (i = 0; i < 4 ; i++) {
                if (form[i].value !== '') {
                    formData.append(form[i].name, form[i].value);
                }
                else {
                    isValide = false;
                    break;
                }
            }
            if (isValide) {
                // Puis on traite la checkbox en ajoutant à FormData tous les éléments checkés
                const checkedGenres = new Array();
                const checkableGenres = document.querySelectorAll("input[type='checkbox'");
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
                    const image = form[form.length - 1].files[0];
                    if (!image){
                        isValide = false;
                    }
                    else {
                        formData.append('file', form[form.length - 1].files[0])
                        // Maintenant que toutes les données ont été rajoutés et sont valides, on envoie la requête
                        fetch(this.URL,
                            {
                                body: formData,
                                method: "post"
                            })
                            .then(()=>window.location.href='index.html')
                            .catch(error=>console.log(error))
                    }                  
                }
            }
            // Si le formulaire n'est pas validé, on affiche un message
            if (!isValide){
                const message = document.getElementById('validationMessage');
                message.innerHTML = 'Tous les champs doivent être remplis et au moins un genre doit être sélectionné'
            }
        },
    }
}).mount("#app");

