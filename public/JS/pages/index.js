import userAPI from "../API/user.js";
import keyAPI from "../API/key.js";

import loadKeys from "../utils/load-keys.js";

import "../utils/crypto.js";

const signinForm = document.getElementById("#signin");
const formAlert = document.querySelector(".form-alert");
const usernameInput = document.getElementById("username");
const passInput = document.getElementById("pass");
const loginBtn = document.getElementById("login");
const signupBtn = document.getElementById("signup");
const togglerInput = document.getElementById("toggleVisiblity");

const homePagePath = "../../pages/home.html";

const singleSigninCheck = async () => {
  try {
    const user = await userAPI.getUser();

    localStorage.setItem("username", user.username);

    window.location.href = "../../pages/home.html";
  } catch (error) {
    console.log(error);
  }
};

singleSigninCheck();

loginBtn.onclick = async (event) => {
  event.preventDefault();
  const [username, password] = [usernameInput.value, passInput.value];
  try {
    const resBody = await userAPI.signin({ username, password });

    const { publicKey: serverPublicKey } = await keyAPI.getServerPublickKey();

    localStorage.setItem("serverPublicKey", serverPublicKey);

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
    const resBody = await userAPI.signup({ username, password });

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
