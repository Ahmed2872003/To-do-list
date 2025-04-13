import "../API/axios.js";

const getTasks = async () => {
  const { data } = await axios.get("/tasks");

  return data;
};

const getTask = async (id) => {
  const { data } = await axios.get(`/tasks/${id}`);

  return data;
};

const createTask = async (task) => {
  await axios.post("/tasks", task);
};

const updateTask = async (id, newTaskData) => {
  const { data } = await axios.patch(`/tasks/${id}`, newTaskData);

  return data;
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
