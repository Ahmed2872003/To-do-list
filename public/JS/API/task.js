import "./axios.js";

import taskUtil from "../utils/task.js";

const getTasks = async () => {
  const { data } = await axios.get(
    `/tasks?publicKey=${btoa(window.CLIENT_PUBLIC_KEY)}`
  );

  const decData = await Promise.all(
    data.tasks.map((task) =>
      taskUtil.decryptTask(task, window.CLIENT_PRIVATE_KEY)
    )
  );

  data.tasks = decData;

  return data;
};

const getTask = async (id) => {
  const { data } = await axios.get(
    `/tasks/${id}?publicKey=${btoa(window.CLIENT_PUBLIC_KEY)}`
  );

  const decData = await taskUtil.decryptTask(
    data.task,
    window.CLIENT_PRIVATE_KEY
  );

  data.task = decData;

  return data;
};

const createTask = async (task) => {
  task = await taskUtil.encryptTask(task, window.SERVER_PUBLIC_KEY);

  await axios.post("/tasks", task);
};

const updateTask = async (id, newTaskData) => {
  const encryptedData = await taskUtil.encryptTask(
    newTaskData,
    window.SERVER_PUBLIC_KEY
  );

  await axios.patch(`/tasks/${id}`, encryptedData);
};

const deleteTask = async (taskId) => {
  await axios.delete(`/tasks/${taskId}`);
};

const deleteAllTasks = async () => {
  const { data } = await axios.delete("/tasks");

  return data;
};

export default {
  getTasks,
  getTask,
  createTask,
  deleteTask,
  deleteAllTasks,
  updateTask,
};
