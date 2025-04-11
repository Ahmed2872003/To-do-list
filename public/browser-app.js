import "./utils/axios.js";
import logout from "./utils/user/logout.js";

const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");
const signoutBtn = document.getElementById("signoutBtn");
const username = document.getElementById("username");
const authorization = `Bearer ${localStorage.getItem("token")}`;
const contentBar = document.getElementById("content");
const menu = document.querySelector(".menu");
const closeBtn = document.querySelector(".fa-xmark");
const deleteAccountBtn = document.getElementById("deleteAccount");
const deleteAllTasksBtn = document.getElementById("deleteAllTasks");
// open, close content bar
menu.onclick = () => {
  content.classList.add("show");
};
closeBtn.onclick = () => {
  content.classList.remove("show");
};

// add success message in formAlert
const successsMsg = (msg) => {
  taskInputDOM.value = "";
  formAlertDOM.classList.add("text-success");
  formAlertDOM.textContent = msg;
};
// add failure message in formAlert
const failureMsg = (msg) => {
  formAlertDOM.classList.remove("text-success");
  formAlertDOM.innerHTML = msg;
};
// remove  message in formAlert
const removeMsg = () => {
  setTimeout(() => {
    formAlertDOM.textContent = "";
  }, 3000);
};
// delete Account
deleteAccountBtn.onclick = async () => {
  if (confirm("Are you sure that you want to delete your account")) {
    try {
      await axios.delete("/user");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.open("/", "_self");
    } catch (error) {
      formAlertDOM.innerText = error.response.data.msg;
      removeMsg();
    }
  }
};
// add username in header
username.innerText = localStorage.getItem("username");

// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = "visible";
  try {
    const {
      data: { tasks },
    } = await axios.get("/tasks");
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = "hidden";
      return;
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name } = task;
        return `<div class="single-task ${completed && "task-completed"}">
<h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
<div class="task-links">



<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`;
      })
      .join("");
    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = "hidden";
};

showTasks();

// delete task /api/tasks/:id

tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.parentElement.dataset.id;
    try {
      await axios.delete(`/tasks/${id}`);
      showTasks();
    } catch (error) {
      console.log(error);
    }
  }
  loadingDOM.style.visibility = "hidden";
});

// form

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = taskInputDOM.value;

  try {
    await axios.post("/tasks", { name });
    showTasks();
    successsMsg(`success, task added`);
  } catch (error) {
    failureMsg(error.response.data.msg);
  }
  removeMsg();
});

// signout button

signoutBtn.onclick = () => {
  logout();
};

// deleteAllTasksBtn
deleteAllTasksBtn.onclick = async () => {
  if (confirm("Are you sure that you want to delete all tasks")) {
    try {
      const {
        data: { msg },
      } = await axios.delete("/tasks");
      successsMsg(msg);
      showTasks();
    } catch (err) {
      failureMsg(err.response.data.msg);
    }
    removeMsg();
  }
};
