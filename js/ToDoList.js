let addBtn = document.querySelector(".add");
let tasksBox = document.querySelector(".tasks");
let alert = document.querySelector(".alert");
let empty = document.querySelector(".empty");
let inputField = document.querySelector(".input");
let light = document.querySelector(".appearance");
let tasksCon = new Set();
/*Add Task*/
function addTask(taskName) {
  let task = document.createElement("div");
  let taskNameE = document.createElement("p");
  let dlt = document.createElement("button");
  dlt.innerHTML = "Remove";
  dlt.classList.add("delete");
  taskNameE.innerHTML = taskName;
  task.appendChild(taskNameE);
  task.appendChild(dlt);
  tasksBox.appendChild(task);
}
/*Add Task*/
//appearance
function appearanceType(c = "regular") {
  let headC = document.head.children;
  let link = document.createElement("link");
  link.setAttribute("rel", "styleSheet");
  link.setAttribute("href", "css/dark.css");
  if (c === "local") {
    if (localStorage.getItem("color") === "black") {
      document.head.appendChild(link);
    }
  } else {
    if (headC[headC.length - 1].getAttribute("href") === "css/dark.css") {
      headC[headC.length - 1].remove();
      localStorage.setItem("color", "white");
    } else {
      document.head.appendChild(link);
      localStorage.setItem("color", "black");
    }
  }
}
//Appearance
/*Local Storage*/
// For Tasks
if (localStorage.getItem("tasks")) {
  let savedTasks = JSON.parse(localStorage.getItem("tasks"));
  tasksCon = new Set(savedTasks);
  let size = savedTasks.length;
  for (let i = 0; i < size; i++) addTask(savedTasks[i]);
}
// For Tasks

//appearance
if (localStorage.getItem("color")) {
  appearanceType("local");
}
//Appearance
/*Local Storage*/

addBtn.onclick = function () {
  if (inputField.value !== "") {
    let TN = inputField.value;
    if (tasksCon.has(TN)) {
      if (empty.classList.contains("show")) empty.classList.remove("show");
      alert.classList.add("show");
    } else {
      if (alert.classList.contains("show")) alert.classList.remove("show");
      if (empty.classList.contains("show")) empty.classList.remove("show");
      tasksCon.add(TN);
      addTask(TN);
      window.localStorage.setItem("tasks", JSON.stringify([...tasksCon]));
      inputField.value = "";
    }
  } else {
    if (alert.classList.contains("show")) alert.classList.remove("show");
    empty.classList.add("show");
  }
};
/*Delete Task*/
addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    e.target.parentNode.remove();
    tasksCon.delete(e.target.parentNode.children[0].innerHTML);
    if (!tasksCon.size) window.localStorage.removeItem("tasks");
    else window.localStorage.setItem("tasks", JSON.stringify([...tasksCon]));
  }
});
/*Delete Task*/
//For Appearance
light.onclick = function () {
  appearanceType();
};
//For Appearance
