import Sequelize from "sequelize";

import sequelize from "./../utils/database.js";

const Register = sequelize.define("register", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nom: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Veuillez fournir votre nom",
      },
      notEmpty: {
        msg: "Veuillez fournir votre nom",
      },
    },
  },
  postnom: Sequelize.STRING,
  prenom: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Veuillez fournir votre prénom",
      },
      notEmpty: {
        msg: "Veuillez fournir votre prénom",
      },
    },
  },
  lieu_naissance: Sequelize.STRING,
  date_naissance: Sequelize.DATEONLY,
  telephone: Sequelize.STRING,
  email: Sequelize.STRING,
  numero_passeport: Sequelize.STRING,
  date_delivrance: Sequelize.STRING,
  date_expiration: Sequelize.STRING,
  autorite_emettrice: Sequelize.STRING,
  pays_provenance: Sequelize.STRING,
  date_arrivee: Sequelize.DATEONLY,
  date_depart: Sequelize.DATEONLY,
  duree_sejour: Sequelize.INTEGER,
  motif: Sequelize.STRING,
  profession: Sequelize.STRING,
  activites: Sequelize.STRING,
  adresse_kinshasa: Sequelize.STRING,
  lieu_logement: Sequelize.STRING,
});

export default Register;
