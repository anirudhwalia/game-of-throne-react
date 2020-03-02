const express=require('express');
const Battle=require('../models/Battle');
const router=express.Router();

// @route get api/battle/list
// @desc get list of all place where battle has taken place
// @access Public
router.get('/list',async (req,res)=>{
    
    try{
        const location_list= await Battle.distinct("location");
        res.json(location_list);
    }catch(error){
        console.error(`${__filename}-->${error.message}`);
        res.status(500).send("Server Failer");
    }

});

// @route get api/battle/count
// @desc get total number of battle occured
// @access Public
router.get('/count',async (req,res)=>{
    
    try{
        const battle_count= await Battle.estimatedDocumentCount();
        res.json({count:battle_count});
    }catch(error){
        console.error(`${__filename}-->${error.message}`);
        res.status(500).send("server failure");
    }

});

// @route get api/battle/search
// @desc return the data with all applied filters for king,type and  location
// @access Public
router.get('/search',async (req,res)=>{
    
    try{
        let searchQuery={};
        for(const [key,value] of Object.entries(req.query)){
            
            switch(key){
                case 'king': searchQuery.$or=[{attacker_king:{$regex:`.*${value}.*`, $options:'i'}},{defender_king:{$regex:`.*${value}.*`, $options:'i'}}];break;
                case 'type':searchQuery.battle_type=value;break;
                case 'location':searchQuery.location=value;break;
                default:break;
            }

        }
        console.log(searchQuery);
        const battle_list= await Battle.find(searchQuery);
        res.json({count:battle_list.length,battles:battle_list});
    }catch(error){
        console.log(error);
        res.status(500).send("server failure");
    }

});
module.exports=router;