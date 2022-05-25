const app = Vue.createApp({
    data() {
        return {
            Url: 'http://localhost:3000/',
            pseudo: '',
            password: ''
        }
    },
    methods: {
        connexion() {
            const bodyReq = {
                pseudo: this.pseudo,
                password: this.password
            };
            const myInit = {
                body: JSON.stringify(bodyReq),
                method: "POST",
                headers: { 'Content-Type': 'application/json' }
            };
            fetch(this.Url + "user/connexion", myInit)
                .then(user => {
                    // Si les credentials sont corrects, on récupère le token ainsi que toutes les valeurs de l'utilisateur
                    user.json()
                        .then(res => {
                            console.log('Then lancé');
                            localStorage.setItem("id", res.userId);
                            localStorage.setItem("pseudo", res.pseudo);
                            localStorage.setItem("likedFilmsId", JSON.stringify(res.likedFilmsId));
                            localStorage.setItem("noticesFilmsId", JSON.stringify(res.noticesFilmsId));
                            localStorage.setItem("likedNoticesId", JSON.stringify(res.likedNoticesId));
                            localStorage.setItem("dislikedFilmsId", JSON.stringify(res.dislikedFilmsId));
                            localStorage.setItem("isAdmin", res.isAdmin);
                            localStorage.setItem("jwt", res.token);
                            window.location.href = "./index.html";
                        });
                })
                .catch(error => {
                    console.log("catch lancé"+error);
                });
        }
    }
}).mount("#app");
