const summoner_input = document.getElementById("summoner_input");
const region_input = document.getElementById("region_input");
const summoner_display = document.getElementById("summoner_display");
const summoner_data = summoner_display.getElementsByTagName("ul")[0];
const summoner_image = summoner_display.getElementsByTagName("img")[0];

const API_KEY = "RGAPI-b21e6aba-b5ff-4466-a484-1e3039149261";

summoner_input.addEventListener("keydown", (event) => {
  if (event.isComposing || event.key === "Enter") {
    if (summoner_input.value != "") {
        rellenarInfoSummoner()
    }
  }
});

async function rellenarInfoSummoner(){
    let basicData = await basicInfoSummoner()
    let rankData = await summonerRank(basicData)
    summoner_image.src = `https://ddragon.leagueoflegends.com/cdn/11.6.1/img/profileicon/${basicData.profileIconId}.png`;
    summoner_data.children[0].textContent = summoner_input.value;
    summoner_data.children[1].textContent = basicData.summonerLevel; 
    summoner_data.children[2].textContent = `${rankData[0].tier} ${rankData[0].rank}`; 
    summoner_data.children[3].textContent = `${rankData[1].tier} ${rankData[1].rank}`; 
}

async function basicInfoSummoner() {
    let res = await fetch(`https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner_input.value}?api_key=${API_KEY}`);
    let resJSON = await res.json();
    return resJSON;
}

async function summonerRank(data) {
    let res = await fetch(`https://la2.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${API_KEY}`);
    let resJSON = res.json()
    return resJSON;
}


 