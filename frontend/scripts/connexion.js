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
                    user.json()
                        .then(res => {
                            localStorage.setItem("id",res.userId);
                            localStorage.setItem("pseudo", res.pseudo);
                            localStorage.setItem("likedFilmsId",JSON.stringify(res.likedFilmsId));
                            localStorage.setItem("noticesFilmsId",JSON.stringify(res.noticesFilmsId));
                            localStorage.setItem("likedNoticesId",JSON.stringify(res.likedNoticesId));
                            localStorage.setItem("isAdmin",res.isAdmin);
                            localStorage.setItem("jwt",res.token);
                            window.location.href = "./index.html";
                        });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
}).mount("#app");
