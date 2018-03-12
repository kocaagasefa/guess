const databaseURL="https://tahmin-app1.firebaseio.com";
const axios =require('axios');

const postData= (url,data) => axios.post(databaseURL+url,data).catch(error=>console.log("firebase post data error"));
const updateData = (url,data) => axios.put(databaseURL+url,data).catch(error=>console.log("firebase database update error"));
module.exports= {postData,updateData};