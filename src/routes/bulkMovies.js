const express = require('express');
const router = express.Router();

const Content = require('../models/Content');
const Category = require('../models/Category');

const {bulkMovies} = require('../helpers/contents');

router.get("/", async(req, res)=>{
    try{
        const contents = bulkMovies.map(e => e)
        res.status(200).json(contents);
    }catch(err){
        console.log(err)
    }
});

router.post("/", async(req, res)=>{
    try{
        bulkMovies.forEach(async movie => {
            const newMovie = await Content.create({
                title: movie.title,
                description: movie.description,
                img: movie.poster
            });
            movie.category.forEach( async (category) => {
                const [newCategory, create] = await Category.findOrCreate({
                    where: {
                        name: category
                    }
                });
                await newMovie.addCategories(newCategory);
            })
        });

        res.status(200).json({
            msg: 'Content Created'
        })


    }catch(err){
        console.log(err)
    }
}),

module.exports = router;