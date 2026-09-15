const chatbot=document.querySelector(".ai_chatbot");
const fullscreen=document.querySelector(".ai_fullscreen");
const closebutton=document.querySelector(".ai_close");
const searchbar=document.querySelector(".searchbar");

chatbot.addEventListener("click", function(){
    fullscreen.classList.add("open");
})

closebutton.addEventListener("click",function(){
    fullscreen.classList.remove("open");
})

searchbar.addEventListener("input",function(){
    this.style.height="auto";
    this.style.height=this.scrollHeight + "px";
})