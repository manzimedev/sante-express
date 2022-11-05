const messageApp = document.getElementById('app-messag')
const registerApp = document.getElementById('registerApp')

const clientApi = () => {
    return axios.create({
        baseURL: `https://api-edgrk.herokuapp.com/api/v1/`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTMsImlhdCI6MTY0NTAzODE2OSwiZXhwIjoxNjc2NTc0MTY5fQ.W5xMxvz0ny73c8zwGXZDX5lY_0e3JkAatLjLbq-oGlM`
        }
    });
}

if (registerApp) {
    Vue.createApp({
        data() {
            return {
                districts: [],
                communes: [],
                quartiers: [],
                errors:[],
                success: '',
                contribuable: {
                    nom: "",
                    prenom: "",
                    postnom: "",
                    sigle: "",
                    rccm: "",
                    idnat: "",
                    telephone: "",
                    email: "",
                    id_typecontribuable: 1,
                    nif: "",
                    avenue: "",
                    numero: "",
                    id_quartier: "",
                    id_commune: "",
                    id_district: 2
                }
            }
        },
        watch: {},
        computed: {
            hasCommunes() {
                return this.communes.filter(el => el.id_district === this.contribuable.id_district)
            },
            hasQuartiers() {
                if(this.contribuable.id_commune){
                    return this.quartiers.filter(el => el.id_commune === this.contribuable.id_commune)
                }
            }
        },
        mounted() {
            this.getAllDistrict()
            this.getAllCommunes()
            this.getAllQuartiers()
        },
        methods: {
            async getAllDistrict() {
                try {
                    const districts = await clientApi()
                        .get('/district')
                    this.districts = districts.data.data.declarations
                } catch (err) {
                    console.log(err.response.data.message)
                }
            },
            async getAllCommunes() {
                try {
                    const communes = await clientApi()
                        .get('/commune')
                    this.communes = communes.data.data.declarations
                } catch (err) {
                    console.log(err.response.data.message)
                }
            },
            async getAllQuartiers() {
                try {
                    const quartiers = await clientApi()
                        .get('/quartier', {
                            params:{
                                limit:1000
                            }
                        })
                    this.quartiers = quartiers.data.data.declarations
                    console.log(this.quartiers.length)
                } catch (err) {
                    console.log(err.response.data.message)
                }
            },
            async register() {
                try {
                    console.log(this.contribuable)
                    const res = await clientApi()
                        .post('/identification', this.contribuable)
                    if (res.data.status === "success") {

                        //await new FetchApi('https://api-edgrk.herokuapp.com/api/v1/declaration/send-sms', 'POST', body).fetch()

                        this.contribuable.nom = ""
                        this.contribuable.prenom = ""
                        this.contribuable.postnom = ""
                        this.contribuable.sigle = ""
                        this.contribuable.nif = ""
                        this.contribuable.rccm = ""
                        this.contribuable.idnat = ""
                        this.contribuable.telephone = ""
                        this.contribuable.id_quartier = ""
                        this.contribuable.id_commune = ""
                        this.contribuable.id_district = ""
                        this.contribuable.numero = ""
                        this.contribuable.avenue = ""
                        this.contribuable.id_typecontribuable = ""
                        this.contribuable.email = ""

                        this.errors = []
                        this.success = 'Votre enregistrement s\'est effectué avec succès!'

                        setTimeout(() => {
                            this.alert.message = ''
                        }, 10000)
                    }
                } catch (err) {
                    console.log(err.response.data.message)

                    this.alert = false
                    this.alert = true
                    this.errors = err.response.data.message.split(',')
                }
            }
        }
    })
        .mount('#registerApp')
}


if (messageApp) {
    Vue.createApp({
        data() {
            return {
                alert: false,
                contact: {
                    nom: "",
                    prenom: "",
                    email: "",
                    telephone: "",
                    message: ""
                }
            }
        },
        watch: {},
        methods: {
            async sendMessage() {
                try {
                    const response = await fetch('/api/v1/contact-message', {
                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                        mode: 'cors', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: 'same-origin', // include, *same-origin, omit
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        redirect: 'follow', // manual, *follow, error
                        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                        body: JSON.stringify(this.contribuable)
                    });
                    const res = await response.json();
                    if (res.status === "success") {
                        this.contribuable.nom = ""
                        this.contribuable.sigle = ""
                        this.contribuable.nif = ""
                        this.contribuable.rccm = ""
                        this.contribuable.idnat = ""
                        this.contribuable.telephone = ""
                        this.contribuable.quartier = ""
                        this.contribuable.commune = ""
                        this.contribuable.numero = ""
                        this.contribuable.avenue = ""
                        this.contribuable.type = ""
                        this.contribuable.email = ""

                        this.alert = true

                        setTimeout(() => {
                            this.alert = false
                        }, 10000)
                    }

                } catch (err) {
                    console.log(err)
                }
            }
        }
    })
        .mount('#app-message')
}
