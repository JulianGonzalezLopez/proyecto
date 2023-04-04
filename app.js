const summoner_input = document.getElementById("summoner_input");
const region_input = document.getElementById("region_input");
const summoner_display = document.getElementById("summoner_display");
const summoner_data = summoner_display.getElementsByTagName("ul")[0];
const summoner_image = summoner_display.getElementsByTagName("img")[0];
const summoner_display_history = document.getElementById("summoner_display_history");

const hashTable = {"RANKED_FLEX_SR":"Flex", "RANKED_SOLO_5x5":"Solo/Duo"};



const API_KEY = "RGAPI-bcba9679-d145-4184-9b59-e50196c0693a";

summoner_input.addEventListener("keydown", (event) => {
  if (event.isComposing || event.key === "Enter") {
    if (summoner_input.value != "") {
        rellenarInfoSummoner();
        rellenarInfoPartidas();
    }
  }
});
//rellena informacion sobre el invocador en el div con id summoner_display
async function rellenarInfoSummoner(){
    let basicData = await basicInfoSummoner()
    let rankData = await summonerRank(basicData)
    summoner_image.src = `https://ddragon.leagueoflegends.com/cdn/11.6.1/img/profileicon/${basicData.profileIconId}.png`;
    summoner_data.children[0].textContent = summoner_input.value;
    summoner_data.children[1].textContent = `Level: ${basicData.summonerLevel}`;
    let aux = 2;
    for(let i = 0; i < rankData.length; i++){
      summoner_data.children[aux].textContent = `${hashTable[rankData[i].queueType]} = ${rankData[i].tier} ${rankData[i].rank}`;  
      aux++;
    } 
    summoner_data.children[4].textContent = `Winratio ranked ${Math.trunc((rankData[0].wins + rankData[1].wins)/(rankData[0].wins + rankData[1].wins + rankData[0].losses + rankData[1].losses)*100)}%`; 
}
//a futuro rellena informacion sobre las partidas dinamicamente en un table 
async function rellenarInfoPartidas(){
  borrarHistorial();
  borrarInfoSummoner();
  let basicData = await basicInfoSummoner()
  let matchIdList = await matchIds(basicData.puuid);
  //console.log(matchIdList);
  for(let i = 0; i < 3; i++){
    let match_data = await matchInfo(matchIdList[i]);
    let player_match_data = await player_matchData(match_data,basicData.puuid);
    let outcome = player_match_data.win ? "Victory" : "Defeat";
    summoner_display_history.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].appendChild(crearRegistro([player_match_data.championName,player_match_data.kills,player_match_data.deaths,player_match_data.assists,outcome]))
    //console.log(`${player_match_data.championName} ${player_match_data.kills} ${player_match_data.deaths} ${player_match_data.assists}`);
  }
}

//Funcion para pedir toda la info buscando el estandar DRY uwu
async function genericRequest(endpoint){
  try{
    let res = await fetch(endpoint);
    if(res.ok){
      let resJSON = await res.json();
      return resJSON;      
    }  
  }
  catch(e){
    return null;
  }
}

//retorna informacion auxiliar y nivel de invocador 
async function basicInfoSummoner() {
  let res = await genericRequest(`https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner_input.value}?api_key=${API_KEY}`);
  if(res != null){
    return res;
  }
  else{
    console.log("404");
  }
}
//retorna el rango del invocador (nada, soloq, flex, soloq y flex)
async function summonerRank(data) {
  let res = await genericRequest(`https://la2.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${API_KEY}`);
  return res;
}
//retorna lista de ID para usar en la funcion matchInfo
async function matchIds(puuid){
  let res = await genericRequest(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${API_KEY}`);
  return res;
}
//retorna informacion de partida via id, se usa para mostrar modo de juego y ademas se usa en la funcion player_matchData
async function matchInfo(match_id){
  let res = await genericRequest(`https://americas.api.riotgames.com/lol/match/v5/matches/${match_id}?api_key=${API_KEY}`);
  return res;
}


//retorna informacion sobre el jugador en cuestion en la partida dada por matchData
function player_matchData(matchData,pid){
  for(let i = 0; i < 10; i++){
    if(matchData.info.participants[i].puuid == pid){
      return matchData.info.participants[i];
    }
  }
}

//Crea y retorna un elemento tr con la cantidad de sub-elementos td como informacion se necesite en la tabla
function crearRegistro(infoPartida){

  let tr = document.createElement("tr");

  for(let i = 0; i < infoPartida.length; i++){
    let td = document.createElement("td");
    tdText = document.createTextNode(infoPartida[i]);
    td.appendChild(tdText);
    tr.appendChild(td);
  }

  return tr;
}


function borrarHistorial(){
  summoner_display_history.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].innerHTML = "";
}

function borrarInfoSummoner(){
  summoner_image.src = "";
  summoner_data.children[0].textContent = "";
  summoner_data.children[1].textContent = ""; 
  summoner_data.children[2].textContent = ""; 
  summoner_data.children[3].textContent = "";
  summoner_data.children[4].textContent = "";
}