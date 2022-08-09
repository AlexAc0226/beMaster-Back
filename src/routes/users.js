const router = require("express").Router();
const User = require("../models/User");

const isAdmin = require('../middlewares/isAdmin')
const verifyToken = require('../middlewares/verifyToken')

router.put("/:id", verifyToken, isAdmin, async(req, res) => {
  try{
    console.log(req.body)
    const user = await User.findOne({
      where:{
        id: req.params.id
      }
    });

    if(!user){
      return res.status(404).json({
        message: "User not found"
      });
    } else {
      await User.update({
        user_name: req.body.data.user_name,
        email: req.body.data.email,
        isAdmin: req.body.data.isAdmin,
      },{
        where:{
          id: req.params.id
        }
      })

      res.status(200).json({
        message: "User updated successfully",
      });
    }
  }catch(error){
    console.log(error);
  }
});

router.post('/admin', async(req, res) => {
  try {
    const user = await User.findOne({
      where:{
        email: req.body.email
      }
    });

    if(!user || user.isAdmin === true) {
      return res.status(404).json({
        message: "User not found or already admin" 
      });
    } else {
      const { password } = req.body;
      if(process.env.PASSWORD_ADMIN === password) {
        await User.update({
          isAdmin: true,
        },{
          where:{
            email: req.body.email
          }
        });

        res.status(200).json({
          message: "User updated successfully",
        });
      } else {
        res.status(401).json({
          message: "Password incorrect"
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id', verifyToken, isAdmin, async(req, res)=>{
  try {
    const getUserById = await User.findOne({
      where:{
        id: req.params.id
      }
    });

    if(!getUserById){
      return res.status(404).json({
        message: "User not found"
      });
    } else {
      res.status(200).json(getUserById);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/", verifyToken, isAdmin, async(req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;