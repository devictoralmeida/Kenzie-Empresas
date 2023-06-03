import {
  employeeData,
  getAllCompanies,
  getSector,
  readDepartmentById,
} from "./requests.js";

const authentication = () => {
  const token = localStorage.getItem("@kenzie:token");
  const isAdmin = JSON.parse(localStorage.getItem("@kenzie:admin"));

  if (!token) {
    open("./login.html", "_self");
  }

  if (token && isAdmin == true) {
    open("./admin-dashboard.html", "_self");
  }
};

const logout = () => {
  const button = document.querySelector(".header__logout-button");

  button.addEventListener("click", () => {
    localStorage.clear();
    open("./login.html", "_self");
  });
};

const renderEmployeeData = async () => {
  const employee = await employeeData();
  const userDataSection = document.querySelector(".user-data__container");
  userDataSection.innerHTML = "";

  const username = document.createElement("p");
  username.classList.add("username");
  username.innerText = employee.name;

  const mail = document.createElement("p");
  mail.classList.add("email");
  mail.innerText = employee.email;

  userDataSection.append(username, mail);
};

const renderEmployeeCompanyData = async () => {
  const employee = await employeeData();
  const container = document.querySelector(".user-company__container");
  const headerContainer = document.querySelector(".company__header");
  const employeesContainer = document.querySelector(
    ".company__employees-container"
  );

  if (employee.company_id == null && employee.department_id == null) {
    employeesContainer.innerHTML = "";
    headerContainer.style.display = "none";
    const noCompany = document.createElement("p");
    noCompany.classList.add("no-company");
    noCompany.innerText = "Você ainda não foi contratado";
    employeesContainer.appendChild(noCompany);
  } else {
    headerContainer.innerHTML = "";
    const text = document.createElement("p");
    const department = await readDepartmentById(employee.department_id);
    text.innerText = `${department.company.name} - ${department.name}`;
    headerContainer.append(text);

    renderEmployees(department.employees);
  }
};

const renderEmployees = async (employees) => {
  const employeesContainer = document.querySelector(
    ".company__employees-container"
  );
  employeesContainer.innerHTML = "";

  employees.forEach((employee) => {
    const card = document.createElement("li");
    card.classList.add("company__employee-name");
    card.innerText = employee.name;
    employeesContainer.append(card);
  });
};

authentication();
renderEmployeeData();
renderEmployeeCompanyData();
logout();
