const summoner_input = document.getElementById("summoner_input");
const region_input = document.getElementById("region_input");
const summoner_display = document.getElementById("summoner_display");
const summoner_data = summoner_display.getElementsByTagName("ul")[0];
const summoner_image = summoner_display.getElementsByTagName("img")[0];

const API_KEY = "RGAPI-c8ccd537-d3fc-46b3-a256-766611c8b23d";

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
    summoner_data.children[1].textContent = basicData.summonerLevel; 
    summoner_data.children[2].textContent = `${rankData[0].tier} ${rankData[0].rank}`; 
    summoner_data.children[3].textContent = `${rankData[1].tier} ${rankData[1].rank}`; 
}
//a futuro rellena informacion sobre las partidas dinamicamente en un table 
async function rellenarInfoPartidas(){

  let basicData = await basicInfoSummoner()
  let matchIdList = await matchIds(basicData.puuid);
  console.log(matchIdList);

  for(let i = 0; i < 3; i++){

    let match_data = await matchInfo(matchIdList[i]);
    let player_match_data = await player_matchData(match_data,basicData.puuid);
    console.log(`${player_match_data.championName} ${player_match_data.kills} ${player_match_data.deaths} ${player_match_data.assists}`);
  }
}
//retorna informacion auxiliar y nivel de invocador 
async function basicInfoSummoner() {
    let res = await fetch(`https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner_input.value}?api_key=${API_KEY}`);
    let resJSON = await res.json();
    return resJSON;
}
//retorna el rango del invocador
async function summonerRank(data) {
    let res = await fetch(`https://la2.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${API_KEY}`);
    let resJSON = res.json()
    return resJSON;
}
//retorna lista de ID para usar en la funcion matchInfo
async function matchIds(puuid){
  let res = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${API_KEY}`);
  let resJSON = res.json();
  return resJSON;
}

//retorna informacion de partida via id, se usa para mostrar modo de juego y ademas se usa en la funcion player_matchData
async function matchInfo(match_id){
  let res = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${match_id}?api_key=${API_KEY}`);
  let resJSON = res.json();
  return resJSON;
}
//retorna informacion sobre el jugador en cuestion en la partida dada por matchData
function player_matchData(matchData,pid){
  for(let i = 0; i < 10; i++){
    if(matchData.info.participants[i].puuid == pid){
      return matchData.info.participants[i];
    }
  }
}
