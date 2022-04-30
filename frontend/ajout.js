const URL = "http://localhost:3000/film/";

const app = Vue.createApp({
    methods: {
        submit() {
            var formData = new FormData();
            var form = document.querySelectorAll('form input , form textarea');
            for (i = 0; i < form.length - 1; i++) {
                formData.append(form[i].name, form[i].value);
            }
            formData.append('file', form[form.length - 1].files[0])

            fetch(URL,
                {
                    body: formData,
                    method: "post"
                })
                .then(console.log("Requête envoyée"))
                // .catch(error=>error);
        },
    }
}).mount("#app");

