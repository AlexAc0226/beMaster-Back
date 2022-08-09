const router = require("express").Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User.js");

const TOKEN_KEY = process.env.TOKEN_KEY;


//REGISTER
router.post("/register", async (req, res) => {
    const [newUser, created] = await User.findOrCreate({
        where: {
            email: req.body.email,
        },
        defaults: {
            user_name: req.body.user_name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
        },
    });
  try {
    if (created) {
        res.status(201).json({
            message: "Usuario creado correctamente",
            user: newUser,
        });
    } else {
        res.status(400).json({
            message: "El usuario ya existe",
        });
    }
  } catch (err) {
    res.status(500).json(err);
  } 
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
        where: {
            email: req.body.email,
        },
    });
    if (!user) {
        res.status(401).json("No se encontró el usuario");
    } else {
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            res.status(401).json("Contraseña incorrecta");
        } else {
            const token = jwt.sign({ id: user.id, user_name: user.user_name, email: user.email, isAdmin: user.isAdmin }, 
                TOKEN_KEY, {
                expiresIn: "20d",
            });
            let results = { ...user.dataValues, token };
            res.status(200).json({
                message: "Te has logueado correctamente",
                results,
            });
        }
    }    
  } catch (err) {
    res.status(500).json(err);
  }
}); 

module.exports = router