const registerApp = document.getElementById("registerApp");

if (registerApp) {
  Vue.createApp({
    data() {
      return {
        error: "",
        success: "",
        isLoading: false,
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
    mounted() {},
    methods: {
      async registerSubmit() {
        for (let input in this.register) {
          if (this.register[input].trim() === "") {
            this.error = "Tous les champs sont obligatoires";
            return;
          }
        }

        this.isLoading = true;
        const response = await fetch("/api/v1/register", {
          method: "POST",
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(this.register),
        });
        if (!response.ok) {
          const res = await response.json();
          this.error = res.message;
          return;
        }
        this.isLoading = false;
        this.success =
          "Votre enregistrement s'est effectué avec succèss. Um mail de confirmation est envoyé à votre boîte de confirmation";

        //Reinitialisation
        for (let input in this.register) {
          this.register[input] = "";
        }
      },
    },
  }).mount("#registerApp");
}
