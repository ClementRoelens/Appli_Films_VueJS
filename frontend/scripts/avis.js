const app = Vue.createApp({
    data() {
        return {
            Url: "http://localhost:3000/",
            avis: "",
            filmId: localStorage.getItem("avisEnCours")
        }
    },
    methods: {
        posterAvis() {
            const bodyReq = {
                filmId: this.filmId,
                userId:localStorage.getItem("id"),
                contenu: this.avis
            };
            let myInit = {
                body: JSON.stringify(bodyReq),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            };
            fetch(this.Url + "avis/ajout", myInit)
                .then(res => {
                    if (res.ok) {
                        res.json()
                            .then(avis => {
                                console.log("Avis ajouté. Il faut maintenant modifier l'user");
                                const userId = localStorage.getItem("id");
                                myInit = {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                                    }
                                };
                                fetch(this.Url + `user/addNotice/${userId}/${this.filmId}`, myInit)
                                    .then(res2 => {
                                        if (res2.ok) {
                                            console.log("user modifié. Il faut maintenant modifier le film");
                                            fetch(this.Url + `film/addNotice/${this.filmId}/${avis._id}`, myInit)
                                                .then(res3 => {
                                                    if (res3.ok) {
                                                        console.log('Film modifié');
                                                        localStorage.removeItem("avisEnCours");
                                                        window.location.href = "./index.html";
                                                    }
                                                    else {
                                                        console.log("Erreur dans la modification du film");
                                                    }
                                                })
                                        }
                                        else {
                                            console.log("Erreur dans la modification de l'utilisateur");
                                        }
                                    })
                            })
                    }
                    else {
                        console.log("Erreur dans l'ajout de l'avis");
                    }
                })
        }
    }
}).mount('#app');