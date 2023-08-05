// when you click on add task for the first time without login

const loginWindow = document.getElementById("loginWindow");
const addTaskBtn = document.getElementById("addTask");
const tasksDiv = document.getElementById("tasks");
const form = document.querySelector("form");


// preventing default behaviour of form

form.addEventListener("submit", (event)=>{
    event.preventDefault()
    onSubmit()
})

let allTaskData = []

// API addresses 

const CreateAPI = "https://todoapi-five.vercel.app/task/create"; 
const GetAPI = "https://todoapi-five.vercel.app/task/get"; 
const UpdateAPI = "https://todoapi-five.vercel.app/task/update"; 
const DeleteAPI = "https://todoapi-five.vercel.app/task/delete"; 

// functions


// api functions

const apiCall = (method, API) =>{

    const token = localStorage.getItem("authToken");
    const headers = {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
    }

    if(method== "post"){
        const taskName = document.getElementById("taskName");
        const rawData = `{"name": "${taskName.value}"}`; // JSON data as a string
        let  response = fetch(API, {
            "method" : method,
            "headers": headers,
            body: rawData
        }).then(response=>response.json()).catch(e=>console.log(e))

    }
    else if(method=="put"){
        apiCall("get", GetAPI).then(data=>{
            allTaskData = data
        })
        let  response = fetch(API, {
            "method" : method,
            headers,
            body: JSON.stringify(allTaskData)
        }).then(response=>response.json()).catch(e=>console.log(e))
        return response;
    }
    else{
        let  response = fetch(API, {
            "method" : method,
            headers,
        }).then(response=>response.json()).catch(e=>console.log(e))
        return response;
    }

    
}

// rendering on load page function

const renderOnLoad = () =>{
    if(localStorage.getItem("authToken")){
        document.getElementById("noUserUL").classList.add("d-none");
        document.getElementById("userUL").classList.remove("d-none");
        document.getElementById("userDropdown").innerHTML = localStorage.getItem("userName")
        apiCall("get", GetAPI).then(data=>{
            allTaskData = data
            document.getElementById("deletingTask").classList.add("d-none")
            data.map((task, index)=>renderTasks(task, index)
            )
        })
    }
    else{
        try{
            document.getElementById("userUL").classList.add("d-none");
            document.getElementById("noUserUL").classList.remove("d-none");
            const allTasks = JSON.parse(localStorage.getItem("tasks")).taskList
            console.log(allTasks)
            allTasks.map((task, index)=>renderTasks(task, index))
        }catch(err){
            console.log("no task found")
        }
    }
}

// rendertasks function works when you need to render all tasks according to your needs

const renderTasks = (tasks, index) =>{
  
    tasksDiv.classList.remove("d-none");
    const newDiv = document.createElement("div");
    newDiv.className = "d-flex gap-4 mt-2 border-bottom pb-3";
    newDiv.setAttribute("id", "taskDiv")
    newDiv.innerHTML = `<input type="checkbox" name="isTaskCompleted" onclick="deleteTasks(${index})" id="" class="align-self-baseline mt-2">
    <div>
      <h4>${tasks.name}</h4>
    </div>`;
    tasksDiv.appendChild(newDiv);
}

// deletetasks functions delete the tasks and re-render tasks 

const deleteTasks = (index) =>{
    const deleteTaskAudio = new Audio("https://cdn.pixabay.com/download/audio/2023/02/28/audio_52ccaf1a85.mp3?filename=click-button-140881.mp3");
    deleteTaskAudio.play()
    const allTasks = document.querySelectorAll("#taskDiv")

    if(localStorage.getItem("authToken")){
        allTasks.forEach((element)=>{
            element.remove()
        })
        document.getElementById("deletingTask").classList.remove("d-none")
        allTaskData.splice(index,1)
        apiCall("put", UpdateAPI).then(()=>{
            renderOnLoad()
        })
    }
    else{
        const Tasks = JSON.parse(localStorage.getItem("tasks")).taskList
        Tasks.splice(index,1)
        console.log(index)
        localStorage.removeItem("tasks")
        localStorage.setItem("tasks", JSON.stringify({"taskList": Tasks}))
        allTasks.forEach((element)=>{
            element.remove()
        })
        renderOnLoad()
    }
}

// onSubmit function works when the forms gets called, it checks weather the user is local user or if the user is loggin in via api

const onSubmit = () => {
    let isLoggedLocally = false;
    const taskName = document.getElementById("taskName");
    const taskData = {name: taskName.value};
    const submitTaskAudio = new Audio("https://cdn.pixabay.com/download/audio/2022/10/30/audio_6634b0add4.mp3?filename=click-124467.mp3")
    submitTaskAudio.play()
    if(localStorage.getItem("authToken")){
        apiCall("post", CreateAPI)
        renderTasks(taskData, allTaskData.length)
        allTaskData.push(taskData)
    }
    else if(localStorage.getItem("taskInitiated")==null) {
        submitTaskAudio.pause()
        loginWindow.click();
        localStorage.setItem("taskInitiated", true);
        isLoggedLocally = true
    }
    else{
        if(localStorage.getItem("tasks")){
            const previousTasks = JSON.parse(localStorage.getItem("tasks")).taskList
            localStorage.setItem("tasks", JSON.stringify({"taskList": [...previousTasks, {name: taskData.name}]}))
        }
        else{
            localStorage.setItem("tasks", JSON.stringify({"taskList": [{name: taskData.name}]}))
        }
        renderTasks(taskData, JSON.parse(localStorage.getItem("tasks")).taskList.length-1)
    }
    if(isLoggedLocally==false){
        taskName.value = "";
    }
};

// renderOnLoad function call reders the tasks when the page get refreshed or loads for the first time
renderOnLoad()


// login and logout option click handler

const logout = document.getElementById("logout");
const login = document.getElementById("login");

logout.onclick = ()=>{
    localStorage.removeItem("authToken");
}

login.onclick = ()=>{
    localStorage.removeItem("authToken");
}

//onclick event logout

try{
    document.getElementById("logout").onclick = ()=>{
        localStorage.removeItem("taskInitiated");
        localStorage.removeItem("authToken")
        window.location.url= "./index.html"
    }
}catch{
    console.log("logout not exists")
}

