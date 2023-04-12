const menu_btn = document.getElementById("menu-btn");
const menu_ul = document.getElementById("menu-ul")
const menu_ul_li = menu_ul.getElementsByTagName("li")

function cambiarDisplay(){
    if(menu_ul.style.display == "none"){
        menu_ul.style.display = "flex"
    }
    else{
        menu_ul.style.display = "none"
    }
    console.log(menu_ul.style.display);
}

menu_btn.addEventListener("click",cambiarDisplay);


console.log(menu_ul_li);

for(let i = 0; i < menu_ul_li.length; i++){
    menu_ul_li[i].getElementsByTagName("a")[0].addEventListener("click",cambiarDisplay);
}