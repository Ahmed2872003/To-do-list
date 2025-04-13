import userService from "../services/user.js";

const signinForm = document.getElementById("#signin");
const formAlert = document.querySelector(".form-alert");
const usernameInput = document.getElementById("username");
const passInput = document.getElementById("pass");
const loginBtn = document.getElementById("login");
const signupBtn = document.getElementById("signup");
const togglerInput = document.getElementById("toggleVisiblity");

const homePagePath = "../../pages/home.html";

const singleSigninCheck = async () => {
  if (localStorage.getItem("username")) window.open(homePagePath, "_self");
};

singleSigninCheck();

loginBtn.onclick = async (event) => {
  event.preventDefault();
  const [username, password] = [usernameInput.value, passInput.value];
  try {
    const resBody = await userService.signin({ username, password });

    formAlert.textContent = resBody.msg;
    formAlert.classList.add("text-success");
    setTimeout(() => window.open(homePagePath, "_self"), 1000);
  } catch (error) {
    formAlert.textContent = error.response.data.msg;
  }
  setTimeout(() => {
    formAlert.textContent = "";
    formAlert.classList.remove("text-success");
  }, 2000);
};

signupBtn.onclick = async (event) => {
  event.preventDefault();
  const [username, password] = [usernameInput.value, passInput.value];
  try {
    const resBody = await userService.signup({ username, password });

    formAlert.textContent = resBody.msg;
    formAlert.classList.add("text-success");
  } catch (error) {
    formAlert.innerHTML = `${error.response.data.msg}<br />${
      error.response.data.reason || ""
    }`;
  }
  setTimeout(() => {
    formAlert.textContent = "";
    formAlert.classList.remove("text-success");
  }, 2000);
};

togglerInput.onclick = () => {
  passInput.type = passInput.type === "text" ? "password" : "text";
};
