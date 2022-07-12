const app = Vue.createApp({
    data() {
        return {
            Url: 'http://localhost:3000/',
            nickname: '',
            password: ''
        }
    },
    methods: {
        signin() {
            const bodyReq = {
                nickname: this.nickname,
                password: this.password
            };
            const myInit = {
                body: JSON.stringify(bodyReq),
                method: "POST",
                headers: { 'Content-Type': 'application/json' }
            };
            fetch(this.Url + "user/signin", myInit)
                .then(user => {
                    // Si les credentials sont corrects, on récupère le token ainsi que toutes les valeurs de l'utilisateur
                    user.json()
                        .then(res => {
                            if (res.error){
                                alert("Mot de passe incorrect")
                            }
                            else {
                                console.log('Then lancé');
                                localStorage.setItem("id", res.userId);
                                localStorage.setItem("nickname", res.nickname);
                                localStorage.setItem("likedFilmsId", JSON.stringify(res.likedFilmsId));
                                localStorage.setItem("opinionsId", JSON.stringify(res.opinionsId));
                                localStorage.setItem("likedOpinionssId", JSON.stringify(res.likedOpinionsId));
                                localStorage.setItem("dislikedFilmsId", JSON.stringify(res.dislikedFilmsId));
                                localStorage.setItem("isAdmin", res.isAdmin);
                                localStorage.setItem("jwt", res.token);
                                window.location.href = "./index.html";
                            }
                            
                        });
                })
                .catch(error => {
                    console.log("catch lancé"+error);
                });
        }
    }
}).mount("#app");
