let database = firebase.database().ref('/tasks');
const inputContain = document.querySelector(".inputContainer");
const addTaskB = document.querySelector(".taskButton");
const taskE = document.getElementById("task");
const contentE = document.getElementById("content");
const dayE = document.getElementById("day");
const submitTaskB = document.getElementById("submitButton");

let postTime = new Date();
let menu = false
let count = 0
let arr = []
let contain = [];
let contentArr = [];
let tc = 0;

inputContain.style.display = "none"
submitTaskB.style.display = "none"
addTaskB.innerText = "+"

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
        menu = true;
    } else {
        inputContain.style.display = "none";
        submitTaskB.style.display = "none";
        addTaskB.innerText = "+";
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
    const task = taskE.value;
    const content = contentE.value;
    const day = dayE.value;

    let postTime = new Date();
    taskE.value = "";
    contentE.value = "";
    dayE.value = "";

    let value = {
        TASK: task,
        CONTENT : content,
        DATE: day,
        COMPLETE: false,
        STARTSTOP: [1, 2, 3]
    }

    database.push(value);
    subTaskMenu();
}

console.log(database);
database.on("child_added", addTask);
let taskContain = document.querySelector(".taskContain")

function addTask(data) {
    const unit = data.val();
    console.log(unit);
    if (unit.COMPLETE === false) {
        const task = unit.TASK;
        const content = unit.CONTENT;
        const day = unit.DAY;

        let tempNewUnit = document.createElement("div");
        let tempNewTask = document.createElement("p");
        let tempNewContent = document.createElement("p");
        let tempNewDay = document.createElement("p");
        let tempEditButton = document.createElement("button");

        tempNewTask.innerText = task;
        tempNewContent.innerText = content;
        tempNewDay.innerText = day;
        tempEditButton.innerText = "Edit";

        tempNewUnit.appendChild(tempNewTask);
        taskContain.prepend(tempNewUnit);
        tempNewUnit.appendChild(tempNewContent);
        tempNewUnit.appendChild(tempNewDay);
        tempNewUnit.appendChild(tempEditButton);

        tempNewUnit.className = "newUnit";
        tempNewTask.className = "newTask new";
        tempNewContent.className = "newContent new";
        tempNewDay.className = "newDay new";
        tempEditButton.className = "editTask new button";

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
    let content = unitPath.querySelector(".newContent");
    let day = unitPath.querySelector(".newDay");

    let editInputContain = document.createElement("div");
    let editTaskInput = document.createElement("input");
    let editContentInput = document.createElement("input");
    let editDayInput = document.createElement("input");
    editDayInput.setAttribute("type", "date");

    let submitEdit = document.createElement("button");
    let deleteEdit = document.createElement("button");

    editTaskInput.placeholder = task.innerText;
    editContentInput.placeholder = content.innerText;
    editDayInput.placeholder = day.innerText;

    editTaskInput.className = "editIn";
    editContentInput.className = "editIn";
    editDayInput.className = "editIn";

    editInputContain.className = "dot3"
    submitEdit.className = "submitEdit"
    deleteEdit.className = "deleteEdit"

    submitEdit.innerText = "submit";
    deleteEdit.innerText = "X";

    editInputContain.appendChild(editTaskInput);
    editInputContain.appendChild(editContentInput);
    editInputContain.appendChild(editDayInput);
    editInputContain.appendChild(submitEdit);
    editInputContain.appendChild(deleteEdit);

    unitPath.parentNode.insertBefore(editInputContain, unitPath.nextSibling);

    submitEdit.addEventListener("click", function (event) {
        event.preventDefault();
        changeDB(data, {
            TASK: editTaskInput.value,
            CONTENT: editContentInput.value,
            DAY: editDayInput.value
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
    firebase.database().ref(id).set(obj);
    location.reload();
}