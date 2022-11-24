const registerApp = document.getElementById("registerApp");

if (registerApp) {
    Vue.createApp({
        data() {
            return {
                error: "",
                success: "",
                isLoading: false,
                photo: null,
                register: {
                    nom: "",
                    prenom: "",
                    postnom: "",
                    lieu_naissance: "",
                    date_naissance: "",
                    numero_passeport: "",
                    date_delivrance: "",
                    date_expiration: "",
                    autorite_emettrice: "",
                    pays_provenance: "",
                    date_arrivee: "",
                    date_depart: "",
                    duree_sejour: "",
                    motif: "",
                    telephone: "",
                    email: "",
                    profession: "",
                    activites: "",
                    adresse_kinshasa: "",
                    lieu_logement: "",
                },
            };
        },
        watch: {},
        computed: {},
        mounted() {
        },

        methods: {
            async registerSubmit() {

                for (let input in this.register) {
                    if (this.register[input].trim() === "") {
                        this.error = "Tous les champs sont obligatoires";
                        return;
                    }
                }

                const body = new FormData();
                body.append("nom", this.register.nom);
                body.append("prenom", this.register.prenom);
                body.append("postnom", this.register.postnom);
                body.append("lieu_naissance", this.register.lieu_naissance)
                body.append("date_naissance", this.register.date_naissance)
                body.append("numero_passeport", this.register.numero_passeport)
                body.append("date_delivrance", this.register.date_delivrance)
                body.append("date_expiration", this.register.date_expiration)
                body.append("autorite_emettrice", this.register.autorite_emettrice)
                body.append("pays_provenance", this.register.pays_provenance)
                body.append("date_arrivee", this.register.date_arrivee)
                body.append("date_depart", this.register.date_depart)
                body.append("duree_sejour", this.register.duree_sejour)
                body.append("motif", this.register.motif)
                body.append("telephone", this.register.telephone)
                body.append('email', this.register.email)
                body.append('profession', this.register.profession)
                body.append('activites', this.register.activites)
                body.append('adresse_kinshasa', this.register.adresse_kinshasa)
                body.append('lieu_logement', this.register.lieu_logement)
                body.append('photo', this.$refs.photo.files[0])

                try {
                    this.isLoading = true;
                    const response = await axios({
                        url: "/api/v1/register",
                        method: 'POST',
                        data: body,
                    })

                    if (response.data.status === 'success') {
                        this.success =
                            "Votre enregistrement s'est effectué avec succèss. Um mail de confirmation est envoyé à votre boîte de récéption";

                        //Reinitialisation
                        for (let input in this.register) {
                            this.register[input] = "";
                        }
                    }
                } catch (error) {
                    console.log(error.response.data.message)
                    this.error = error.response.data.message;
                }
                this.isLoading = false;
            }
        }
    })
        .mount("#registerApp");
}
