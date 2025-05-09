import "../API/axios.js";
import userAPI from "../API/user.js";
import accountAPI from "../API/account.js";
import taskService from "../API/task.js";

import loadKeys from "../utils/load-keys.js";

const tasksDOM = document.querySelector(".tasks");
const loadingTextDOM = document.querySelector(".loading-text");
const loadingCover = document.querySelector(".loading-cover");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");
const signoutBtn = document.getElementById("signoutBtn");
const username = document.getElementById("username");
const menu = document.querySelector(".menu");
const closeBtn = document.querySelector(".fa-xmark");
const deleteAccountBtn = document.getElementById("deleteAccount");
const deleteAllTasksBtn = document.getElementById("deleteAllTasks");

let nOfTasks = 0;

loadKeys()
  .then(() => {
    loadingCover.style.visibility = "hidden";
    startHomeScript();
  })
  .catch((err) => console.log(err));

function startHomeScript() {
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
        await accountAPI.removeAccount();
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
    loadingTextDOM.style.visibility = "visible";
    try {
      const resBody = await taskService.getTasks();

      nOfTasks = resBody.tasks.length;

      if (resBody.tasks.length < 1) {
        tasksDOM.innerHTML =
          '<h5 class="empty-list">No tasks in your list</h5>';
        loadingTextDOM.style.visibility = "hidden";
        return;
      }
      const allTasks = resBody.tasks
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
    loadingTextDOM.style.visibility = "hidden";
  };

  showTasks();

  // delete task /api/tasks/:id

  tasksDOM.addEventListener("click", async (e) => {
    const el = e.target;
    if (el.parentElement.classList.contains("delete-btn")) {
      loadingTextDOM.style.visibility = "visible";
      const id = el.parentElement.dataset.id;

      try {
        // console.log(id);

        await taskService.deleteTask(id);

        el.closest(".single-task").remove();

        nOfTasks--;

        if (nOfTasks === 0)
          tasksDOM.innerHTML =
            '<h5 class="empty-list">No tasks in your list</h5>';
      } catch (error) {
        console.log(error);
      }
    }
    loadingTextDOM.style.visibility = "hidden";
  });

  // Add task

  formDOM.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await taskService.createTask({ name: formData.get("name") });

      showTasks();
      successsMsg(`success, task added`);
    } catch (error) {
      if (error.response) failureMsg(error.response.data.msg);
      else console.log(error);
    }
    removeMsg();
  });

  // signout button

  signoutBtn.onclick = async () => {
    await userAPI.logout();
  };

  // deleteAllTasksBtn
  deleteAllTasksBtn.onclick = async () => {
    if (confirm("Are you sure that you want to delete all tasks")) {
      try {
        const resBody = await taskService.deleteAllTasks();
        successsMsg(resBody.msg);
        showTasks();
      } catch (err) {
        failureMsg(err.response.data.msg);
      }
      removeMsg();
    }
  };
}
