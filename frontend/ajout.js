const URL = "http://localhost:3000/film/";

const app = Vue.createApp({
methods : {
    submit(){
        var formData = new FormData(form)
        var form = document.querySelectorAll('form input , form textarea');
        form.forEach(element => {
            formData.append(element.name,element.value);
        });

        fetch(URL+"ajout",
            {
                body:formData,
                method:"post"
            })
            .then(console.log("Requête envoyée"));
    }
}
}).mount("#app");

