import taskService from "../services/task.js";

import loadKeys from "../utils/load-keys.js";

const taskIDDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const taskCompletedDOM = document.querySelector(".task-edit-completed");
const editFormDOM = document.querySelector(".single-task-form");
const editBtnDOM = document.querySelector(".task-edit-btn");
const formAlertDOM = document.querySelector(".form-alert");
const loadingCover = document.querySelector(".loading-cover");
const params = window.location.search;
const id = new URLSearchParams(params).get("id");
let tempName;

loadKeys()
  .then(() => {
    loadingCover.style.display = "none";
    startTaskScript();
  })
  .catch((err) => console.log(err));

function startTaskScript() {
  const showTask = async () => {
    try {
      const resBody = await taskService.getTask(id);

      const { _id: taskID, completed, name } = resBody.task;

      taskIDDOM.textContent = taskID;
      taskNameDOM.value = name;
      tempName = name;
      if (completed) {
        taskCompletedDOM.checked = true;
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          window.location.href = "../../pages/forbidden.html";
        }
      }
      console.log(error);
    }
  };

  showTask();

  editFormDOM.addEventListener("submit", async (e) => {
    editBtnDOM.textContent = "Loading...";
    e.preventDefault();
    try {
      const taskName = taskNameDOM.value;
      const taskCompleted = taskCompletedDOM.checked;

      await taskService.updateTask(id, {
        name: taskName,
        completed: taskCompleted,
      });

      formAlertDOM.style.display = "block";
      formAlertDOM.textContent = `success, edited task`;
      formAlertDOM.classList.add("text-success");
    } catch (error) {
      console.error(error);
      taskNameDOM.value = tempName;
      formAlertDOM.style.display = "block";
      formAlertDOM.innerHTML = `error, please try again`;
    }
    editBtnDOM.textContent = "Edit";
    setTimeout(() => {
      formAlertDOM.style.display = "none";
      formAlertDOM.classList.remove("text-success");
    }, 3000);
  });
}
