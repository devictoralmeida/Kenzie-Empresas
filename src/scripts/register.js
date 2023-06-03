import { registerUser, red, green } from "./requests.js";
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

const redirectHome = () => {
  const buttons = document.querySelectorAll(".home");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      open("../../index.html", "_self");
    });
  });
};

const handleLogin = () => {
  const button = document.querySelector(".header__login-button");

  button.addEventListener("click", () => {
    open("../pages/login.html", "_self");
  });
};

const createUser = () => {
  const inputs = document.querySelectorAll("input");
  const addButton = document.querySelector(".register-button");
  let count = 0;
  let user = {};

  addButton.addEventListener("click", async (e) => {
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
      const data = await registerUser(user);

      user = {};

      inputs.forEach((input) => {
        input.value = "";
      });

      if (
        data.message !==
        "Email já cadastrado, por favor informe outro ou faça login"
      ) {
        setTimeout(() => {
          open("../pages/login.html", "_self");
        }, 1500);
      }
    }
  });
};

authentication();
createUser();
redirectHome();
handleLogin();
