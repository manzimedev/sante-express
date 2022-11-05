import crypto from 'crypto'
import Sequelize from 'sequelize'
import bcrypt from 'bcryptjs'

import sequelize from './../utils/database.js'

const User = sequelize.define('user',{
    id:{
        type:Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull:false,
        primaryKey:true,
    },
    firstName:{
        type:Sequelize.STRING(50),
        allowNull: false,
        validate:{
            notNull:{
                msg: 'Un utilisateur doit avoir un prénom'
            },
            notEmpty:{
                msg: 'Un utilisateur doit avoir un prénom'
            }
        },
        set(value){
            if(value){
                this.setDataValue('firstName', value.toUpperCase())
            }

        },
    },
    lastName:{
        type:Sequelize.STRING(50),
        set(value){
            if(value){
                this.setDataValue('lastName', value.toUpperCase())
            }

        },
        allowNull: false,
        validate:{
            notNull:{
                msg: 'Un utilisateur doit avoir un nom'
            },
            notEmpty:{
                msg: 'Un utilisateur doit avoir un nom'
            }
        }
    },
    email:{
        type:Sequelize.STRING(100),
        unique:true,
        allowNull:false,
        validate:{
            isEmail:{
                msg:'Le format de l\'adresse email n\'est pas valide'
            },
            notNull:{
                msg:'Veuillez fournir l\'adresse email'
            },
            notEmpty: {
                msg:'Veuillez fournir l\'adresse email'
            }
        }
    },
    phone:{
        type:Sequelize.STRING(13),
        unique:true,
        allowNull:false,
        validate:{
            notNull:{
                msg:'Veuillez fournir le numéro de téléphone'
            },
            notEmpty:{
                msg:'Veuillez fournir le numéro de téléphone'
            }
        }
    },
    password:{
        type:Sequelize.STRING,
        allowNull: false,
        validate:{
            notNull:{
                msg: 'Veuillez fournir le mot de passe'
            },
            notEmpty:{
                msg: 'Veuillez fournir le mot de passe'
            }
        }
    },
    passwordConfirm:{
        type:Sequelize.VIRTUAL,
        allowNull: false,
        validate:{
            notNull:{
                msg: 'Veuillez confirmer le mot de passe'
            },
            notEmpty:{
                msg: 'Veuillez confirmer le mot de passe'
            },
            comparePassword(value){
                if(value!==this.password){
                    throw Error('Les deux mots de passe ne sont pas le même')
                }
            }
        }
    },
    photo:Sequelize.STRING,
    active:{
        type:Sequelize.BOOLEAN,
        defaultValue:true,
    },
    passwordResetToken: Sequelize.STRING,
    passwordResetExpires: Sequelize.STRING,
    passwordChangedAt: Sequelize.DATE
},sequelize)

//Hash password
User.beforeSave(async (user, options) => {
    // Only run this function if password was actually modified
    if (!user.changed('password')) return false

    // Hash the password with cost of 12
    user.password = await bcrypt.hash(user.password, 12);

    // Delete passwordConfirm field

});

User.beforeSave((user, options)=>{
    if(!user.changed('password') || user.isNewRecord) return false
    user.passwordChangedAt = Date.now() - 1000;
})

//Compare passwords
User.prototype.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

User.prototype.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

User.prototype.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};


export default User