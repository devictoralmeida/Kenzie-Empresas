import { getAllCompanies, getSector, getCompanyBySector } from "./requests.js";
import { toast } from "./toast.js";

const authentication = () => {
  const token = localStorage.getItem("@kenzie:token");
  const isAdmin = JSON.parse(localStorage.getItem("@kenzie:admin"));

  if (token && isAdmin == true) {
    open("./src/pages/admin-dashboard.html", "_self");
  } else if (token && isAdmin == false) {
    open("./src/pages/employee-dashboard.html", "_self");
  }
};

const handleLogin = () => {
  const button = document.querySelector(".header__login-button");

  button.addEventListener("click", () => {
    open("./src/pages/login.html", "_self");
  });
};

const handleRegister = () => {
  const button = document.querySelector(".header__register-button");

  button.addEventListener("click", () => {
    open("./src/pages/register.html", "_self");
  });
};

const renderSectors = async () => {
  const selectInput = document.querySelector(".select-input");
  const sectors = await getSector();

  const CompaniesAll = document.createElement("option");
  CompaniesAll.innerText = "Todas os setores";
  CompaniesAll.value = "all";
  selectInput.append(CompaniesAll);

  sectors.forEach((item) => {
    const option = document.createElement("option");
    option.innerText = item.name;
    option.value = item.name;
    selectInput.append(option);
  });

  selectInput.addEventListener("change", async (e) => {
    if (e.target.value == "all") {
      renderCompanies(true);
    } else {
      const sectorName = e.target.value;
      const companies = await getCompanyBySector(sectorName);
      renderCompanies(false, companies);
    }
  });
};

const renderCompanies = async (firstTime, array = []) => {
  const container = document.querySelector(".companies__container");
  container.innerHTML = "";

  if (firstTime) {
    const companies = await getAllCompanies();

    companies.forEach(async (item) => {
      const card = await createCard(item);
      container.append(card);
    });
  } else {
    array.forEach(async (company) => {
      const card = await createCard(company);
      container.append(card);
    });
  }
};

const createCard = async (item) => {
  const company = document.createElement("li");
  company.classList.add("company__item");

  const companyName = document.createElement("p");
  companyName.innerText = `Empresa ${item.name}`;

  const companySector = document.createElement("span");
  companySector.classList.add("sector");

  const allSectors = await getSector();
  const filteredSector = allSectors.find((sector) => {
    return sector.id == item.category_id;
  });

  companySector.innerText = filteredSector.name;

  company.append(companyName, companySector);
  return company;
};

authentication();
handleLogin();
handleRegister();
renderSectors();
renderCompanies(true);
