const getData= require('./getData/oley');
const setData= require('./setData/setMatches');
const setMatches = require('./setData/setMatches').setScoreOfMatchArray;
const setFirebase= require('./setData/firebase');

let matches= {
    football:{},
    basketball:{}
};

let stats = {
    football : {},
    basketball : {}
};

const matchesWithScores = {
    football:{},
    basketball:{}
}


const start = () => {
    getData.getBulletin().then(bulletin=>{
        const groupedEventLists=
        [bulletin.football,bulletin.basketball].map(
            eventList=> setData.groupByStage(eventList)
        );
        matches.football= groupedEventLists[0];
        matches.basketball=groupedEventLists[1];

        const leagueIdArrays = groupedEventLists.map(
            groupedEventList=> Object.keys(groupedEventList).filter(stageId=>stageId!="0")
        );

        return Promise.all(leagueIdArrays.map((leagueIdArray,index)=>
            getData.getLeagueTables(index+1,leagueIdArray)
    ))
    .then(statsArray=>{
        stats.football= statsArray[0];
        stats.basketball= statsArray[1];
        setScores();
        return Promise.all([setFirebase.updateData("/matches.json",matchesWithScores),setFirebase.updateData("/stats.json",stats)])
            .then(res=>res.data);
    })
    .catch(error=> console.log("error while starting server",error));
        
    })
}

const setScores = () => {
    for(let sportType in matches){
        
        for(let stageId in matches[sportType]){
            matchesWithScores[sportType][stageId]=setMatches(matches[sportType][stageId],stats[sportType][stageId])
        }
    }
}



module.exports = {start};