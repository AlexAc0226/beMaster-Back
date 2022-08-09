const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');

const Content = require('../models/Content');
const Category = require('../models/Category');

const isAdmin = require('../middlewares/isAdmin')
const verifyToken = require('../middlewares/verifyToken')


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const content = await Content.findOne({
            where: { id },
            include: [{
                model: Category,
                as: 'categories'
            }]
        });

        if(!content) {
            res.status(404).json({
                message: 'Content not found'
            });
        } else {
        res.status(200).json(content);
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/', async(req, res) => {
   try {
        const { title } = req.query;
        if(title){
            const contents = await Content.findAll({
                where: { title: {
                    [Op.iLike]: `%${title}%`
                } }, 
            });
            if(!contents) return res.status(404).send('Content not found');
            res.status(200).json(contents);
        } else {
            const contents = await Content.findAll({
                include: [{
                    model: Category,
                    as: 'categories'
                }]
            });
            if(!contents) return res.status(404).send('Content not found');
            res.status(200).json({contents});
        }
        

   } catch (error) {
    console.log(error);
   } 
});

router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { title, description, img, arrayCategoriesId } = req.body;
    
        const content = await Content.create({
            title,
            description,
            img,
        });
        
        arrayCategoriesId.forEach(async (categoryId) => {
            const existCategory = await Category.findOne({
                where: { id: categoryId }
            });
            await content.addCategory(existCategory);
        });

        const contentWithCategory = await Content.findOne({
            where: { id: content.id },
            include: [{ 
                model: Category,
            }]
        });
        res.status(200).json(contentWithCategory);

    } catch (err) {
       console.log(err);
    }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, img, arrayCategoriesIdToUpdate, arrayCategoriesUpdatedId } = req.body;
        
        const content = await Content.findOne({
            where: { id }
        });
        if(!content) {
            res.status(404).json({
                message: 'Content not found'
            });
        } else {
            const updatedContent = await content.update({
                title,
                description,
                img
            },{
                where: { id }
            });

            arrayCategoriesUpdatedId.forEach(async (categoryId) => {
                const existCategory = await Category.findOne({
                    where: { id: categoryId }
                });
                await content.addCategory(existCategory);
            });

            arrayCategoriesIdToUpdate.forEach(async (categoryId) => {
                const destroyCategory = await Category.findOne({
                    where: { id: categoryId }
                });
                await content.removeCategory(destroyCategory);
            })

            const contentWithCategory = await Content.findOne({
                where: { id: content.id },
                include: [{
                    model: Category,    
                }]
            });
            res.status(200).json(contentWithCategory);
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;