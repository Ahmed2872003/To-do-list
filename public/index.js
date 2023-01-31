const signinForm = document.getElementById("#signin");
const fomrAlert = document.querySelector(".form-alert");
const usernameInput = document.getElementById("username");
const passInput = document.getElementById("pass");
addEventListener("submit", async (event) => {
  event.preventDefault();
  const [username, password] = [usernameInput.value, passInput.value];
  try {
    const {
      data: { msg, token },
    } = await axios.post("/api/v1/sign/signin", { username, password });

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    fomrAlert.innerHTML = msg;
    fomrAlert.classList.add("text-success");
    setTimeout(() => window.open("/home.html", "_self"), 600);
  } catch (error) {
    fomrAlert.innerText = error.response.data.msg;
  }
});
