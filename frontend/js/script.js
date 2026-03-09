const API = "http://localhost:5000/api";

/* ---------------- REGISTER ---------------- */

async function register() {

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const res = await fetch(`${API}/auth/register`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({name,email,password})

});

const data = await res.json();

alert("Registration successful");

window.location="login.html";

}


/* ---------------- LOGIN ---------------- */

async function login(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const res = await fetch(`${API}/auth/login`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({email,password})

});

const data = await res.json();

if(data.token){

localStorage.setItem("token",data.token);

window.location="dashboard.html";

}else{

alert("Login failed");

}

}


/* ---------------- LOGOUT ---------------- */

function logout(){

localStorage.removeItem("token");

window.location="login.html";

}


/* ---------------- CREATE PROJECT ---------------- */

async function createProject(){

const name = document.getElementById("projectName").value;

const token = localStorage.getItem("token");

await fetch(`${API}/projects`,{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({name})

});

alert("Project created");

loadProjects();

}


/* ---------------- LOAD PROJECTS ---------------- */

async function loadProjects(){

const token = localStorage.getItem("token");

const res = await fetch(`${API}/projects`,{

headers:{
Authorization:`Bearer ${token}`
}

});

const projects = await res.json();

const list = document.getElementById("projectList");

if(!list) return;

list.innerHTML="";

projects.forEach(p=>{

const li = document.createElement("li");

li.innerHTML = `
${p.name}
<button onclick="loadTasks('${p._id}')">View Tasks</button>
`;

list.appendChild(li);

});

}


/* ---------------- CREATE TASK ---------------- */

async function createTask(){

const title = document.getElementById("taskTitle").value;
const projectId = document.getElementById("projectId").value;

const token = localStorage.getItem("token");

await fetch(`${API}/tasks`,{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
title,
projectId
})

});

alert("Task created");

loadTasks(projectId);

}


/* ---------------- LOAD TASKS ---------------- */

async function loadTasks(projectId){

const token = localStorage.getItem("token");

const res = await fetch(`${API}/tasks?projectId=${projectId}`,{

headers:{
Authorization:`Bearer ${token}`
}

});

const tasks = await res.json();

const list = document.getElementById("taskList");

list.innerHTML="";

tasks.forEach(t=>{

const li = document.createElement("li");

li.innerHTML = `
${t.title}
<button onclick="deleteTask('${t._id}','${projectId}')">Delete</button>
`;

list.appendChild(li);

});

}


/* ---------------- DELETE TASK ---------------- */

async function deleteTask(taskId,projectId){

const token = localStorage.getItem("token");

await fetch(`${API}/tasks/${taskId}`,{

method:"DELETE",

headers:{
Authorization:`Bearer ${token}`
}

});

loadTasks(projectId);

}