const databaseURL="https://tahmin-app1.firebaseio.com";
const axios =require('axios');

const getData= (url)=>axios.get(databaseURL+url).then(res=>res.data).catch(error=>console.log("firebase get data error",error));

module.exports= {getData};