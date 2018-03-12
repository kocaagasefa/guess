const express = require('express');
const app = express();
const getData= require('./helpers/getData/oley');
const setData= require ('./helpers/setData/setMatches');
const start = require('./helpers/start').start;
const getFirebase = require('./helpers/getData/firebase');

//start();


app.get('/stage/:sportType/:stageId',(req,res)=>{    
    const {sportType,stageId}= req.params;
    console.log(sportType,stageId);
    getData.getLeagueTable(sportType,stageId)
        .then(data=>res.send(data));
});

app.get('/leagues/:sportType',(req,res)=>{

    const sportType=req.params.sportType;
    getData.getBulletin().then(data=>{
        return getData.getLeagueTables(sportType==="football"? 1:2,getData.getLeagueIds(data[sportType]));
    }).then(response=>res.send(response));
})

app.get('/',(req,res)=>{
    getFirebase.getData('/matches.json')
        .then(data=>res.send(data));
})

app.listen(3001,()=>{
    console.log("Server started on port 3001")
});
