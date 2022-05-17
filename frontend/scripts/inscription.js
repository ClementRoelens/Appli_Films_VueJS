const app = Vue.createApp({
    data() {
        return {
            Url: 'http://localhost:3000/',
            pseudo: '',
            password: ''
        }
    },
    methods: {
        inscription() {
            const bodyReq = {
                pseudo: this.pseudo,
                password: this.password
            };
            const myInit = {
                body: JSON.stringify(bodyReq),
                method: "POST",
                headers: { 'Content-Type': 'application/json' }
            };
            fetch(this.Url + "user/inscription", myInit)
                .then(res => {
                    alert(res);
                    window.location.href = "./index.html";
                })
                .catch(error => {
                    console.log(error);
                    alert("Échec de la création de l'utilisateur");
            });
        }
    }
}).mount("#app");
