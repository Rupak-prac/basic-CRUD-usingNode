const express = require('express');
const mongoose = require('mongoose');
const Houses = require('../models/house');
const AppError = require('../utils/AppError.js');
const route = express.Router({mergeParams:true}); 



// route.get('', (req, res)=>{
//     res.render('home')
// })
route.get('/', async(req, res, next)=>{
    const allData = await Houses.find();
    //console.log(allData)  
    res.render('allHouses', {allData})
} )

route.get('/new', (req,res)=>{
    res.render("new")
} )
route.post('/', async(req, res, next)=>{ 
    try{
         
        const bodyInfo = req.body; 
        const newEntry = await new Houses(bodyInfo);
        //newEntry.author = req.user._id   // adding new key-value "author:id" in newEntry
        await newEntry.save();
        req.flash('success', 'Congratulations New house is Created')
        res.redirect('/houses')
    } catch(e){
        next(e)
    }
} ) 

route.get('/:id', async(req, res, next)=>{
    try{
        const {id} = req.params;
        const foundHouse = await Houses.findById(id)
        //console.log(foundHouse)
        res.render('show', {foundHouse})
    } catch(e){
        next(e);
    }
})

route.get('/:id/edit', async(req, res, next)=>{
    try{
        const {id} = req.params;
        const foundHouse = await Houses.findById(id)
        res.render('edit', {foundHouse}) 
    } catch(e){
        next(e)
    }
} )

route.patch('/:id', async(req, res, next)=>{
    try{
        const {id} = req.params;
        const bodyData = req.body;
        const editedHouse = await Houses.findByIdAndUpdate(id, bodyData, {new:true, runValidators:true});
        await editedHouse.save()
        req.flash('success', 'this house is modified')
        res.redirect(`/houses/${id}`)
    } catch(err){
        next(err);
    }
 
})
route.delete('/:id', async(req, res, next)=>{
    try {
        const {id} = req.params;
        await Houses.findByIdAndDelete(id)
        req.flash('success', ' deleted!!')
        res.redirect('/houses')
    } catch (e) {
        next(e);
    }
} )

module.exports = route;