const chatbot=document.querySelector(".ai_chatbot");
const fullscreen=document.querySelector(".ai_fullscreen");
const closebutton=document.querySelector(".ai_close");
const searchbar=document.querySelector(".searchbar");
const aioutput=document.querySelector(".aioutput");
const taskInput=document.getElementById("taskInput");
const addTask=document.querySelector(".start");
const taskList=document.querySelector(".taskList");

chatbot.addEventListener("click", function(){
    fullscreen.classList.add("open");
});

closebutton.addEventListener("click",function(){
    fullscreen.classList.remove("open");
});

searchbar.addEventListener("input",function(){
    this.style.height="auto";
    this.style.height=this.scrollHeight + "px";
});

searchbar.addEventListener("keydown",function(event){
    if (event.key === "Enter"){
        event.preventDefault();
        sendMessage();
    }
});

async function sendMessage(){
    const usertext=searchbar.value;
    if (usertext===""){
        alert("Value is empty");
        return;
    }
    aioutput.innerHTML="Thinking harder than you..."
    const sending=await fetch("/api/chat",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"},
        body:JSON.stringify({usertext: usertext

        })
    });

    const data=await sending.json();
    aimessage=data.choices[0].message.content;
    aioutput.innerHTML= aimessage;
};

taskInput.addEventListener("keydown",function(event){
    if (event.key === "Enter"){
        event.preventDefault();
        figureityourself();
    }

addTask.addEventListener("click",figureityourself);

function figureityourself(){
    const todotask=taskInput.value.trim();
    const li=document.createElement("li");
    li.textContent=todotask;
    li.addEventListener("click",function(){
    li.classList.toggle("completed");
    });
    taskList.appendChild(li);
    taskInput.value="";
    };
});

