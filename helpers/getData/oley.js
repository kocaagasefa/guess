const axios= require('axios');

const oleyLeagueStageUrl = (sportType,stageId,home_away)=>`https://widget.oley.com/statistics/leaguetable/${sportType}/${stageId}/${home_away}/1`;
const oleyBulletinUrl=`https://bulletin.oley.com/data/bulletin-with-percentage?_=1`;
const sportType= {
    FOOTBALL:1,
    BASKETBALL:2
}

const getBulletin= () => {
    return axios.get(oleyBulletinUrl)
        .then(res=>{
            return {
                football:res.data.data.bulletin.football.eventList,
                basketball:res.data.data.bulletin.basketball.eventList,
                time:new Date().getTime()
            }}).catch(error=>console.log("getBulletin from Oley error",error));
}

getLeagueIds=(eventList)=>{
    const leagueIds=new Set();
    eventList.filter(match=>match.helperInfo.stage.id!==0)
        .forEach(match =>leagueIds.add(match.helperInfo.stage.id));
    return Array.from(leagueIds);
}

getLeagueTable = (sportType,stageId)=>{     
    return  Promise.all(
            [axios.get(oleyLeagueStageUrl(sportType,stageId,"home")).then(response=>response.data),
            axios.get(oleyLeagueStageUrl(sportType,stageId,"away")).then(response=>response.data)])            
            .then(response=>{
                const tables= {
                    stageId,
                    home:response[0].items,
                    away:response[1].items,
                    time:new Date().getTime()
                }   
                //return firebase.postData("/leagues/"+stageId+".json",tables).then(res=>res.data);    
                return tables;
            }).catch(error=>console.log("Oley.com get leagues error",error));
}

const getLeagueTables =(sportType,stageIdsArray) => {    

    return Promise.all(stageIdsArray.map(stageId=>getLeagueTable(sportType,stageId)))
    .then(statsArray=>statsArray.reduce((acc,current)=>{
        acc[current.stageId]=current;
        return acc;
    },{}))
    .catch(error=>console.log("Get League Tables from Oley failed"));
}



module.exports={getBulletin,getLeagueTable,getLeagueTables,getLeagueIds};