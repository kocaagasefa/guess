
const groupByStage = (eventList) => {
    return eventList.reduce((acc,currentMatch)=>{
        if(!currentMatch.helperInfo) return acc;
        let currentId=currentMatch.helperInfo.stage.id;
        acc[currentId]?acc[currentId].push(currentMatch):acc[currentId]=[currentMatch];
        return acc;
    },{});
}

const setScore=(match,league)=>{
    if(!league||!match.helperInfo||!league.home||!league.away) return match;
    
    const homeTeamId = match.helperInfo.homeTeam.id;
    const awayTeamId = match.helperInfo.awayTeam.id;
    const homeStats= league.home.filter(team=>team.teamId===homeTeamId)[0];
    const awayStats= league.away.filter(team=>team.teamId===awayTeamId)[0];

    if(!homeStats||!awayStats) return match;
    const played = homeStats.played+awayStats.played;
    const goalScoredByHome = (homeStats.goalsScored+awayStats.goalsAgainst)/(played);
    const goalScoredByAway = (homeStats.goalsAgainst+awayStats.goalsScored)/(played);

    match.played=played;
    match.score={
        goalScoredByHome,
        goalScoredByAway
    }
    return match;
}

const setScoreOfMatchArray = (matches,league)=> {
    return matches.map( match => setScore(match,league));
}


module.exports= {groupByStage,setScoreOfMatchArray};