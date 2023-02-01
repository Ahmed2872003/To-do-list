const signinForm = document.getElementById("#signin");
const formAlert = document.querySelector(".form-alert");
const usernameInput = document.getElementById("username");
const passInput = document.getElementById("pass");
const loginBtn = document.getElementById("login");
const signupBtn = document.getElementById("signup");
const togglerInput = document.getElementById("toggleVisiblity");
loginBtn.onclick = async (event) => {
  event.preventDefault();
  const [username, password] = [usernameInput.value, passInput.value];
  try {
    const {
      data: { msg, token },
    } = await axios.post("/api/v1/user/signin", { username, password });

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    formAlert.innerHTML = msg;
    formAlert.classList.add("text-success");
    setTimeout(() => window.open("/home.html", "_self"), 1000);
  } catch (error) {
    formAlert.innerText = error.response.data.msg;
  }
  setTimeout(() => {
    formAlert.innerText = "";
    formAlert.remove("text-success");
  }, 2000);
};

signupBtn.onclick = async (event) => {
  event.preventDefault();
  const [username, password] = [usernameInput.value, passInput.value];
  try {
    const {
      data: { msg },
    } = await axios.post("/api/v1/user/signup", { username, password });
    formAlert.innerHTML = msg;
    formAlert.classList.add("text-success");
  } catch (error) {
    formAlert.innerHTML = error.response.data.msg;
  }
  setTimeout(() => {
    formAlert.innerText = "";
    formAlert.remove("text-success");
  }, 2000);
};
togglerInput.onclick = () => {
  passInput.type = passInput.type === "text" ? "password" : "text";
};
