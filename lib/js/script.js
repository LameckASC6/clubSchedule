let database = firebase.database().ref('/tasks');
const inputContain = document.querySelector(".inputContainer");
const addTaskB = document.querySelector(".taskButton");
const loginButton = document.querySelector(".loginButton");
const taskE = document.getElementById("task");
const timeE = document.getElementById("time");
const dayE = document.getElementById("day");
const signOutButton = document.querySelector(".signOutButton");
const submitTaskB = document.getElementById("submitButton");
let taskContain = document.querySelector(".taskContain") 
const align = document.querySelector(".align");
let count = 0
let arr = []
let timeArr = [];
let tc = 0;

let postTime = new Date();
let menu = false
let contain = [];

inputContain.style.display = "none"
submitTaskB.style.display = "none"
addTaskB.innerText = "+"

const admin = "admin";
let user = sessionStorage.getItem('user');

signOutButton.addEventListener('click', signOut);

function signOut(){
    sessionStorage.setItem('user', null);
    window.location.href = "index.html";
}

if(user == admin){
    loginButton.remove();

} else {
    addTaskB.remove();
    signOutButton.remove();
}

loginButton.addEventListener('click', function(event){
    event.preventDefault();
    window.location = "login.html";
})
//Add Task Button Opening and closing task menu//
if (!menu) addTaskB.addEventListener("click", addTaskMenu);
if (menu) {
    addTaskB.addEventListener("click", subTaskMenu);
}

submitTaskB.addEventListener("click", updateDB);
function addTaskMenu(event) {
    if (!menu) {
        event.preventDefault();
        inputContain.style.display = "inline";
        submitTaskB.style.display = "block";
        addTaskB.innerText = "-";
        taskContain.style.height = "42.6vh"
        menu = true;
    } else {
        inputContain.style.display = "none";
        submitTaskB.style.display = "none";
        addTaskB.innerText = "+";
        taskContain.style.height = "69vh"
        menu = false
    }
}

function subTaskMenu(event) {
    // event.preventDefault();
    inputContain.style.display = "none";
    submitTaskB.style.display = "none";
    addTaskB.innerText = "+";
    menu = false;
}

function updateDB(event) {
    event.preventDefault();
    let task = taskE.value;
    let time = timeE.value;
    let day = dayE.value;


    taskE.value = "";
    timeE.value = "";
    dayE.value = "";

    let value = {
        TIME: time,
        DAY: day,
        TASK: task,
        COMPLETE: false,
    }

    contain.push(value);
    database.push(value);
    subTaskMenu();
}

console.log(database);
database.on("child_added", addTask);

function addTask(data) {
    const unit = data.val();
    console.log(unit);
    
    if (unit.COMPLETE === false) {
        const task = unit.TASK;
        const time = unit.TIME;
        const day = unit.DAY;

        let tempNewUnit = document.createElement("div");
        let tempNewTime = document.createElement("p");
        let tempNewDay = document.createElement("p");
        let tempNewTask = document.createElement("p");
        let tempEditButton = document.createElement("button");

        tempNewTime.innerText = time;
        tempNewDay.innerText = day;
        tempNewTask.innerText = task;
        tempEditButton.innerText = "Edit";

        tempNewUnit.appendChild(tempNewTime);
        taskContain.prepend(tempNewUnit);
        tempNewUnit.appendChild(tempNewDay);
        tempNewUnit.appendChild(tempNewTask);
        tempNewUnit.appendChild(tempEditButton);

        tempNewUnit.className = "newUnit";
        tempNewTask.className = "newTask new";
        tempNewTime.className = "newTime new";
        tempNewDay.className = "newDay new";
        tempEditButton.className = "editTask new button";

        if(user == admin){
            loginButton.remove();
        } else {
            addTaskB.remove();
            tempEditButton.remove();
        }

        const editButton = document.getElementsByClassName("editTask");
        editButton[0].addEventListener("click", function (event) {
            nextEl = event.path[1].nextSibling
            if (nextEl.classList == undefined || !nextEl.classList.contains('dot3')) {
                changeTask(event, data);
            }
        });
    }
}

function changeTask(event, data) {
    unitPath = event.path[1];
    let task = unitPath.querySelector(".newTask");
    let time = unitPath.querySelector(".newTime");
    let day = unitPath.querySelector(".newDay");

    let editInputContain = document.createElement("div");
    let editTaskInput = document.createElement("input");
    let editTimeInput = document.createElement("input");
    let editDayInput = document.createElement("input");
    editDayInput.setAttribute("type", "date");
    editTimeInput.setAttribute("type", "time");

    let submitEdit = document.createElement("button");
    let deleteEdit = document.createElement("button");
    let deleteTask = document.createElement("button");

    editTaskInput.placeholder = task.innerText;
    editTimeInput.placeholder = time.innerText;
    editDayInput.placeholder = day.innerText;

    editTaskInput.className = "editIn";
    editTimeInput.className = "editIn";
    editDayInput.className = "editIn";

    editInputContain.className = "dot3"
    submitEdit.className = "submitEdit"
    deleteEdit.className = "deleteEdit"
    deleteTask.className = "deleteTask"

    submitEdit.innerText = "SUBMIT";
    deleteEdit.innerText = "X";
    deleteTask.innerText = "DELETE";

    editInputContain.appendChild(editTaskInput);
    editInputContain.appendChild(editTimeInput);
    editInputContain.appendChild(editDayInput);
    editInputContain.appendChild(submitEdit);
    editInputContain.appendChild(deleteEdit);
    editInputContain.appendChild(deleteTask);

    unitPath.parentNode.insertBefore(editInputContain, unitPath.nextSibling);

    submitEdit.addEventListener("click", function (event) {
        event.preventDefault();
        if(editDayInput.value == ""){
            editDayInput.value = day.innerText;
        }
        if(editTimeInput.value == ""){
            editTimeInput.value = time.innerText;
        }
        if(editTaskInput.value == ""){
            editTaskInput.value = task.innerText;
        }
        changeDB(data, {
            TASK: editTaskInput.value,
            TIME: editTimeInput.value,
            DAY: editDayInput.value,
            COMPLETE: false
        });
    });
    deleteTask.addEventListener("click", function (event){
        event.preventDefault();
        changeDB(data, {
            TASK: editTaskInput.value,
            TIME: editTimeInput.value,
            DAY: editDayInput.value,
            COMPLETE: true
        });
    });
    deleteEdit.addEventListener("click", subEdit);
}

function subEdit(event) {
    event.preventDefault();
    unitPath = event.path[1].parentNode;
    let editInputContain = unitPath.querySelector(".dot3");
    editInputContain.remove();
}

function changeDB(data, obj) {
    const id = data.key;
    console.log(obj)
    firebase.database().ref(`/tasks/${id}`).set(obj);
    location.reload();
}