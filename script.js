const chatbot=document.querySelector(".ai_chatbot");
const fullscreen=document.querySelector(".ai_fullscreen");
const closebutton=document.querySelector(".ai_close");
const searchbar=document.querySelector(".searchbar");
const aioutput=document.querySelector(".aioutput");
const taskInput=document.getElementById("taskInput");
const addTask=document.querySelector(".start");
const taskList=document.querySelector(".taskList");


function saveTasks(){
    const tasks=[]
    document.querySelectorAll(".taskList li").forEach(li => {
        tasks.push({
            text: li.textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("todoTasks", JSON.stringify(tasks));

}

function createTaskElement(text,isCompleted){
    const li=document.createElement("li");
    li.textContent=text;
    if (isCompleted){
        li.classList.add("completed");
    };
    let holdTimer;
    let isHolding=false;

    function startHold(){
        isHolding=false;
        holdTimer=setTimeout(() => {
            isHolding=true;
            li.remove();
            saveTasks();
        },600);
    }
    function cancelHold(){
        clearTimeout(holdTimer);
    }

    li.addEventListener("mousedown",startHold);
    li.addEventListener("mouseup",cancelHold);
    li.addEventListener("mouseleave",cancelHold);

    li.addEventListener("touchstart",startHold);
    li.addEventListener("touchend",cancelHold);
    li.addEventListener("touchcancel",cancelHold);
  
    li.addEventListener("click", function(){
        if (!isHolding){
            li.classList.toggle("completed");
            saveTasks();
        }
    });
    taskList.appendChild(li);
}


function loadTasks(){
    const saved=localStorage.getItem("todoTasks");
    if (saved){
        const tasks=JSON.parse(saved);
        tasks.forEach(task => {
            createTaskElement(task.text,task.completed);
        });
    }
}


function figureityourself(){
    const todotask=taskInput.value.trim();
    if (todotask === "'") return;
    createTaskElement(todotask,false);
    saveTasks();
    taskInput.value="";
}


document.addEventListener("DOMContentLoaded", loadTasks);

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
});

addTask.addEventListener("click",figureityourself);

