import { login, red, green } from "./requests.js";
import { toast } from "./toast.js";

const authentication = () => {
  const token = localStorage.getItem("@kenzie:token");
  const isAdmin = JSON.parse(localStorage.getItem("@kenzie:admin"));

  if (token && isAdmin == true) {
    open("./admin-dashboard.html", "_self");
  } else if (token && isAdmin == false) {
    open("./employee-dashboard.html", "_self");
  }
};

const handleRegister = () => {
  const buttons = document.querySelectorAll(".register");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      open("../pages/register.html", "_self");
    });
  });
};

const redirectHome = () => {
  const button = document.querySelector(".header__home-button");

  button.addEventListener("click", () => {
    open("../../index.html", "_self");
  });
};

const handleLogin = async () => {
  const inputs = document.querySelectorAll("input");
  const loginButton = document.querySelector(".login-button");
  let count = 0;
  let user = {};

  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();

    inputs.forEach((input) => {
      if (input.value.trim() == "") {
        count++;
      }

      user[input.name] = input.value;
    });

    if (count != 0) {
      count = 0;
      toast(red, "Por favor preencha todos os campos do formulário");
    } else {
      const token = await login(user);
      toast(green, "Login realizado com sucesso");
      localStorage.setItem("@kenzie:token", JSON.stringify(token.authToken));
      localStorage.setItem("@kenzie:admin", token.isAdm);

      user = {};

      inputs.forEach((input) => {
        input.value = "";
      });

      setTimeout(() => {
        if (token.isAdm == true) {
          open("./admin-dashboard.html", "_self");
        } else {
          open("./employee-dashboard.html", "_self");
        }
      }, 1500);
    }
  });
};

authentication();
handleRegister();
handleLogin();
redirectHome();
