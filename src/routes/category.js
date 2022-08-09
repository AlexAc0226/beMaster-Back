const express = require('express');
const router = express.Router();

const Category = require('../models/Category');
const Content = require('../models/Content');

const {Op} = require('sequelize')

const isAdmin = require('../middlewares/isAdmin')
const verifyToken = require('../middlewares/verifyToken')

const { bullCategories } = require('../helpers/categories');

router.get('/', async(req, res) => {
    try {
        const { name } = req.query;
        if(name) {
            const categories = await Category.findAll({
                where: { name: { [Op.iLike]: `%${name}%` } },
                include: [{
                    model: Content,
                    as: 'contents'
                }]
              });
            res.json(categories);
        } else {
            const contents = await Category.findAll({
                include: [{
                    model: Content,
                    as: 'contents'
                }]
            });
            res.json(contents);
        }
        

    }catch(err){
        console.log(err)
    }
});


router.post('/bulk', verifyToken, isAdmin, async(req, res)=>{
    try {
        bullCategories.forEach(async(category)=>{
            await Category.create(category);
        });

        res.status(200).json({
            message: 'Categories created'
        });
    } catch (error){
        console.log(error)
    }
});

module.exports = router;