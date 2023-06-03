import {
  getAllCompanies,
  readCompanyById,
  red,
  readAllDepartments,
  readDepartmentById,
  readAllEmployees,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  updateEmployee,
  deleteEmployee,
  employeesOutOfWork,
  hireEmployee,
  dismissEmployee,
} from "./requests.js";

import { toast } from "./toast.js";

const authentication = () => {
  const token = localStorage.getItem("@kenzie:token");
  const isAdmin = JSON.parse(localStorage.getItem("@kenzie:admin"));

  if (!token) {
    open("./login.html", "_self");
  }

  if (token && isAdmin == false) {
    open("./employee-dashboard.html", "_self");
  }
};

// const handleEvents = () => {
//   setTimeout(() => {
//     //handleEditEmployee();
//     //handleDeleteEmployee();
//     //handleDeleteDepartment();
//     handleViewDepartment();
//     // handleEditDepartment();
//   }, 1000);
// };

const logout = () => {
  const button = document.querySelector(".header__logout-button");

  button.addEventListener("click", () => {
    localStorage.clear();
    open("./login.html", "_self");
  });
};

const showDepartmentsDash = async () => {
  const container = document.querySelector(".departments__container");
  container.innerHTML = "";
  const allDepartments = await readAllDepartments();
  const allCompanies = await getAllCompanies();
  renderDepartments(allDepartments, allCompanies);

  // setTimeout(() => {
  //   //handleDeleteDepartment();
  //   //handleViewDepartment();
  //   //handleEditDepartment();
  // }, 1000);
};

const handleSelectCompanies = async () => {
  const selectInput = document.querySelector(".select-input");
  const allCompanies = await getAllCompanies();

  const CompaniesAll = document.createElement("option");
  CompaniesAll.innerText = "Todas as empresas";
  CompaniesAll.value = "all";
  selectInput.append(CompaniesAll);

  allCompanies.forEach((company) => {
    const option = document.createElement("option");
    option.innerText = company.name;
    option.value = company.id;
    selectInput.appendChild(option);
  });

  selectInput.addEventListener("change", async (e) => {
    if (e.target.value == "all") {
      showDepartmentsDash()
    } else {
      const companyId = e.target.value;
      const company = await readCompanyById(companyId);
      renderDepartments(company.departments, allCompanies);
      showEmployeeDash();
    }
  });
};

const handleCreateDepartment = () => {
  const openModalButton = document.querySelector(".create-company-button");
  const modal = document.querySelector(".modal-create-department__container");

  openModalButton.addEventListener("click", async () => {
    const allCompanies = await getAllCompanies();
    let newDepartment = {};
    let count = 0;
    modal.showModal();
    modal.insertAdjacentHTML(
      "afterbegin",
      `
      <img src="../assets/close.svg" alt="Close button" class="close-modal">
      <div class="modal-create__controller">
        <h1 class="modal-title">Criar Departamento</h1>
        <form class="form-create__container">
          <input type="text" name="name" class="department-name department-add" required placeholder="Nome do departamento">
          <input type="text" name="description" class="description department-add" required placeholder="Descrição">
          <select name="company_id" class="select-input-create-modal department-add">
            <option selected disabled>
              Selecionar empresa
            </option>
          </select>
          <button type="submit" class="submit-button">Criar</button>
        </form>
      </div>
    `
    );

    const selectInput = document.querySelector(".select-input-create-modal");
    const inputs = document.querySelectorAll(".department-add");
    const form = document.querySelector(".form-create__container");
    const closeButton = document.querySelector(
      ".modal-create-department__container .close-modal"
    );

    allCompanies.forEach((company) => {
      const option = document.createElement("option");
      option.innerText = company.name;
      option.value = company.id;
      selectInput.appendChild(option);
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      inputs.forEach((input) => {
        if (input.value.trim() === "") {
          count++;
        }

        newDepartment[input.name] = input.value;
      });

      if (count != 0) {
        count = 0;
        toast(red, "Por favor, preencha todos os dados");
      } else {
        await createDepartment(newDepartment);

        inputs.forEach((input) => {
          input.value = "";
        });

        newDepartment = {};
        showDepartmentsDash();
        modal.close();
        modal.innerHTML = "";
      }
    });

    closeButton.addEventListener("click", () => {
      modal.close();
      modal.innerHTML = "";
    });
  });
};

// const closeModal = (modal) => {
//   const closeModal = document.querySelectorAll(".close-modal");
//   closeModal.forEach((button) => {
//     button.addEventListener("click", () => {
//       modal.close();
//       //location.reload()
//     });
//   });
// };

const renderDepartments = (array, allCompanies) => {
  const container = document.querySelector(".departments__container");
  container.innerHTML = "";

  if (array.length == 0) {
    const noDepartment = document.createElement("p");
    noDepartment.classList.add("no-department");
    noDepartment.innerText = `Não há nenhum departamento cadastrado para a empresa selecionada`;
    container.append(noDepartment);
  } else {
    array.forEach((depart) => {
      const correctCompany = allCompanies.find(
        (company) => company.id == depart.company_id
      );
      const card = createDepartmentCard(depart, correctCompany);
      container.append(card);
    });
  }

  // setTimeout(() => {
  //   handleDeleteDepartment();
  //   handleViewDepartment();
  //   handleEditDepartment()
  // }, 1000);
};

const createDepartmentCard = (department, company) => {
  const item = document.createElement("li");
  item.classList.add("department__item");

  const departmentInfosContainer = document.createElement("div");
  departmentInfosContainer.classList.add("department__infos");

  const name = document.createElement("p");
  name.classList.add("department-name-item");
  name.innerText = department.name;

  const description = document.createElement("p");
  description.classList.add("department-description-item");
  description.innerText = department.description;

  const companyTitle = document.createElement("p");
  companyTitle.classList.add("department-company");
  companyTitle.innerText = company.name;

  const departmentIconsContainer = document.createElement("div");
  departmentIconsContainer.classList.add("department__icons");

  const eye = document.createElement("img");
  eye.classList.add("view-department");
  eye.src = "../assets/eye.svg";
  eye.alt = "Visualizar departamento";
  // eye.dataset.departmentId = department.id;
  // eye.dataset.departmentDescription = department.description;
  // eye.dataset.departmentName = department.name;
  // eye.dataset.companyName = company.name;
  // eye.dataset.companyId = company.id;

  eye.addEventListener("click", () => {
    handleViewDepartment(
      department.id,
      department.name,
      department.description,
      company.name
    );
  });

  const pen = document.createElement("img");
  pen.classList.add("edit-department");
  pen.src = "../assets/pen.svg";
  pen.alt = "Editar departamento";
  // pen.dataset.departmentId = department.id;
  // pen.dataset.departmentDescription = department.description;
  // pen.dataset.departmentName = department.name;
  // pen.dataset.companyName = company.name;
  // pen.dataset.companyId = company.id;

  pen.addEventListener("click", () =>
    editDepartment(department.id, department.description)
  );

  const trash = document.createElement("img");
  trash.classList.add("remove-department");
  trash.src = "../assets/trash.svg";
  trash.alt = "Apagar departamento";
  // trash.dataset.departmentId = department.id;
  // trash.dataset.name = department.name;

  trash.addEventListener("click", () => {
    deleteDepartmentModal(department.name, department.id);
  });

  departmentInfosContainer.append(name, description, companyTitle);
  departmentIconsContainer.append(eye, pen, trash);
  item.append(departmentInfosContainer, departmentIconsContainer);

  return item;
};

const showEmployeeDash = async () => {
  const container = document.querySelector(".users__container");
  container.innerHTML = "";
  const allEmployees = await readAllEmployees();
  const allCompanies = await getAllCompanies();
  renderEmployees(allEmployees, allCompanies);

  // setTimeout(() => {
  //   handleEditEmployee();
  //   handleDeleteEmployee();
  // }, 1000);
};

const renderEmployees = (array, allCompanies) => {
  const container = document.querySelector(".users__container");
  container.innerHTML = "";

  if (array.length == 0) {
    const emptyUsers = document.createElement("h1");
    emptyUsers.innerText = `Não há nenhum funcionário cadastrado no sistema`;
    container.append(emptyUsers);
  } else {
    array.forEach((employee) => {
      if (employee.company_id == null) {
        const card = createUnemployedCard(employee);
        container.append(card);
      } else {
        const correctCompany = allCompanies.find(
          (company) => company.id == employee.company_id
        );
        const card = createEmployeeCard(employee, correctCompany.name);
        container.append(card);
      }
    });
  }
};

const createEmployeeCard = (employee, company) => {
  const item = document.createElement("li");
  item.classList.add("user__item");

  const userInfosContainer = document.createElement("div");
  userInfosContainer.classList.add("user__infos");

  const username = document.createElement("p");
  username.classList.add("user-name");
  username.innerText = employee.name;

  const companyName = document.createElement("p");
  companyName.classList.add("user-company");
  companyName.innerText = company;

  const userIconsContainer = document.createElement("div");
  userIconsContainer.classList.add("user__icons");

  const pen = document.createElement("img");
  pen.classList.add("edit-employee");
  pen.src = "../assets/pen.svg";
  pen.alt = "Editar funcionário";
  // pen.dataset.employeeId = employee.id;

  pen.addEventListener("click", () => {
    handleEditEmployee(employee.id);
  });

  const trash = document.createElement("img");
  trash.classList.add("remove-employee");
  trash.src = "../assets/trash.svg";
  trash.alt = "Deletar funcionário";
  // trash.dataset.employeeId = employee.id;
  // trash.dataset.name = employee.name;

  trash.addEventListener("click", () => {
    handleDeleteEmployee(employee.name, employee.id);
  });

  userInfosContainer.append(username, companyName);
  userIconsContainer.append(pen, trash);
  item.append(userInfosContainer, userIconsContainer);

  return item;
};

const createUnemployedCard = (employee) => {
  const item = document.createElement("li");
  item.classList.add("user__item");

  const userInfosContainer = document.createElement("div");
  userInfosContainer.classList.add("user__infos");

  const username = document.createElement("p");
  username.classList.add("user-name");
  username.innerText = employee.name;

  const companyName = document.createElement("p");
  companyName.classList.add("user-company");
  companyName.innerText = `O funcionário está desempregado`;

  const userIconsContainer = document.createElement("div");
  userIconsContainer.classList.add("user__icons");

  const pen = document.createElement("img");
  pen.classList.add("edit-employee");
  pen.src = "../assets/pen.svg";
  pen.alt = "Editar funcionário";
  // pen.dataset.employeeId = employee.id;

  pen.addEventListener("click", () => {
    handleEditEmployee(employee.id);
  });

  const trash = document.createElement("img");
  trash.classList.add("remove-employee");
  trash.src = "../assets/trash.svg";
  trash.alt = "Deletar funcionário";
  // trash.dataset.employeeId = employee.id;
  // trash.dataset.name = employee.name;

  trash.addEventListener("click", () => {
    handleDeleteEmployee(employee.name, employee.id);
  });

  userInfosContainer.append(username, companyName);
  userIconsContainer.append(pen, trash);
  item.append(userInfosContainer, userIconsContainer);

  return item;
};

// const handleEditDepartment = () => {
//   const modal = document.querySelector(".modal-edit-department__container");
//   const input = document.querySelector(".form-edit-department");
//   const editButtons = document.querySelectorAll(".edit-department");
//   const editForm = document.querySelector(".form-edit-department__container");
//   closeModal(modal);
//   console.log("to na função");

//   editButtons.forEach((button) => {
//     button.addEventListener("click", (e) => {
//       modal.showModal();

//       console.log("to no forEach");

//       let newDescription = {};

//       let departmentId = e.target.dataset.departmentId;
//       let departmentDescription = e.target.dataset.departmentDescription;
//       input.setAttribute("placeholder", departmentDescription);

//       editForm.addEventListener("submit", async (event) => {
//         event.preventDefault();

//         console.log("to no form");

//         if (input.value.trim() == "") {
//           toast(red, "Por favor, preencha todos os campos abaixo");
//         } else {
//           newDescription[input.name] = input.value;
//           await updateDepartment(departmentId, newDescription);
//           input.value = "";
//           newDescription = {};

//           // setTimeout(() => {
//           //   location.reload()
//           // }, 1500)
//           showDepartmentsDash();
//           modal.close();
//         }
//       });
//     });
//   });
// };

const editDepartment = (departmentId, departmentDescription) => {
  const modal = document.querySelector(".modal-edit-department__container");

  modal.insertAdjacentHTML(
    "afterbegin",
    `
    <img src="../assets/close.svg" alt="Close button" class="close-modal">
    <div class="modal-edit-depart__controller">
      <h1 class="modal-title">Editar Departamento</h1>
      <form class="form-edit-department__container">
        <textarea name="description" class="form-edit-department"></textarea>
      </form>
      <button class="submit-edit-department-button">Salvar</button>
    </div>
  `
  );

  const input = document.querySelector(".form-edit-department");
  const submitButton = document.querySelector(".submit-edit-department-button");
  const closeButton = document.querySelector(
    ".modal-edit-department__container > .close-modal"
  );

  input.setAttribute("placeholder", departmentDescription);

  modal.showModal();

  let newDescription = {};

  closeButton.addEventListener("click", () => {
    modal.close();
    modal.innerHTML = "";
  });

  submitButton.addEventListener("click", async () => {
    if (input.value.trim() == "") {
      toast(red, "Por favor, preencha todos os campos abaixo");
    } else {
      newDescription[input.name] = input.value;
      await updateDepartment(departmentId, newDescription);
      input.value = "";
      newDescription = {};
      showDepartmentsDash();
      modal.close();
      modal.innerHTML = "";
    }
  });
};

// const handleDeleteDepartment = () => {
//   const modal = document.querySelector(".modal-remove-department__container");
//   const removeButtons = document.querySelectorAll(".remove-department");
//   const formDelete = document.querySelector(
//     ".form-remove-department__container"
//   );

//   closeModal(modal);

//   removeButtons.forEach((button) => {
//     button.addEventListener("click", (e) => {
//       modal.showModal();
//       const text = document.querySelector(".modal-remove-depart__title");
//       let departmentId = e.target.dataset.departmentId;
//       let name = e.target.dataset.name;
//       text.innerHTML = `Realmente deseja remover
//       o
//       <br>
//       Departamento ${name}
//       <br>
//       e demitir seus funcionários?`;

//       formDelete.addEventListener("submit", async (event) => {
//         event.preventDefault();

//         await deleteDepartment(departmentId);

//         setTimeout(() => {
//           location.reload();
//         }, 1500);
//       });
//     });
//   });
// };

const deleteDepartmentModal = (departmentName, departmentId) => {
  const modal = document.querySelector(".modal-remove-department__container");
  modal.showModal();

  modal.insertAdjacentHTML(
    "afterbegin",
    `
    <img src="../assets/close.svg" alt="Close button" class="close-modal">
    <div class="modal-remove-depart__controller">
      <h1 class="modal-remove-depart__title">Realmente deseja remover 
      o 
      <br>
      Departamento ${departmentName} 
      <br>
      e demitir seus funcionários?</h1>
      <button class="submit-remove-department-button">Remover</button>
    </div>
  `
  );

  const removeButton = document.querySelector(
    ".submit-remove-department-button"
  );

  removeButton.addEventListener("click", async () => {
    await deleteDepartment(departmentId);
    showDepartmentsDash();
    modal.close();
    modal.innerHTML = "";
  });

  const closeButton = document.querySelector(
    ".modal-remove-department__container .close-modal"
  );

  closeButton.addEventListener("click", () => {
    modal.close();
    modal.innerHTML = "";
  });
};

// const handleEditEmployee = () => {
//   const modal = document.querySelector(".modal-edit-employee__container");
//   const editButons = document.querySelectorAll(".edit-employee");
//   const editEmployeeForm = document.querySelector(
//     ".form-edit-employee__container"
//   );
//   const inputs = document.querySelectorAll(
//     ".form-edit-employee__container input"
//   );
//   closeModal(modal);

//   let updateEmployeeData = {};
//   let count = 0;

//   editButons.forEach((button) => {
//     button.addEventListener("click", (e) => {
//       modal.showModal();
//       let employeeID = e.target.dataset.employeeId;

//       editEmployeeForm.addEventListener("submit", async (event) => {
//         event.preventDefault();
//         inputs.forEach((input) => {
//           if (input.value.trim() == "") {
//             count++;
//           }

//           updateEmployeeData[input.name] = input.value;
//         });

//         if (count != 0) {
//           count = 0;
//           toast(red, "Por favor, preencha todos os campos abaixo");
//         } else {
//           await updateEmployee(employeeID, updateEmployeeData);

//           inputs.forEach((input) => {
//             input.value = "";
//           });

//           setTimeout(() => {
//             location.reload();
//           }, 1500);

//           updateEmployeeData = {};
//         }
//       });
//     });
//   });
// };

const handleEditEmployee = (employeeId) => {
  let updateEmployeeData = {};
  let count = 0;

  const modal = document.querySelector(".modal-edit-employee__container");
  modal.showModal();
  modal.insertAdjacentHTML(
    "afterbegin",
    `
    <img src="../assets/close.svg" alt="Close button" class="close-modal">
    <div class="modal-edit-employee__controller">
      <h1 class="modal-title">Editar Usuário</h1>
      <form class="form-edit-employee__container">
        <input type="text" name="name" class="employee-name" required placeholder="Nome">
        <input type="email" name="email" class="employee-mail" required placeholder="E-mail">
      </form>
      <button class="submit-edit-employee-button">Salvar</button>
    </div>
  `
  );

  const editButton = document.querySelector(".submit-edit-employee-button");
  const inputs = document.querySelectorAll(
    ".modal-edit-employee__container input"
  );
  const closeButton = document.querySelector(
    ".modal-edit-employee__container .close-modal"
  );

  editButton.addEventListener("click", async () => {
    inputs.forEach((input) => {
      if (input.value.trim() == "") {
        count++;
      }

      updateEmployeeData[input.name] = input.value;
    });

    if (count != 0) {
      count = 0;
      toast(red, "Por favor, preencha todos os campos abaixo");
    } else {
      await updateEmployee(employeeId, updateEmployeeData);

      inputs.forEach((input) => {
        input.value = "";
      });

      updateEmployeeData = {};

      showEmployeeDash();
      modal.close();
      modal.innerHTML = "";
    }
  });

  closeButton.addEventListener("click", () => {
    modal.close();
    modal.innerHTML = "";
  });
};

// const handleDeleteEmployee = () => {
//   const modal = document.querySelector(".modal-remove-employee__container");
//   const deleteForm = document.querySelector(".modal-remove-employee-form");
//   const removeButtons = document.querySelectorAll(".remove-employee");

//   closeModal(modal);

//   removeButtons.forEach((button) => {
//     button.addEventListener("click", (e) => {
//       modal.showModal();
//       const text = document.querySelector(".modal-remove-employee__title");
//       let name = e.target.dataset.name;
//       let employeeId = e.target.dataset.employeeId;
//       text.innerHTML = `Realmente deseja remover
//       o
//       <br>
//       usuário ${name} ?`;

//       deleteForm.addEventListener("submit", async (event) => {
//         event.preventDefault();
//         await deleteEmployee(employeeId);

//         setTimeout(() => {
//           location.reload();
//         }, 1000);
//       });
//     });
//   });
// };

const handleDeleteEmployee = (employeeName, employeeId) => {
  const modal = document.querySelector(".modal-remove-employee__container");
  modal.showModal();

  modal.insertAdjacentHTML(
    "afterbegin",
    `
      <img src="../assets/close.svg" alt="Close button" class="close-modal">
      <div class="modal-remove-employee__controller">
        <h1 class="modal-remove-employee__title">Realmente deseja remover 
        o 
        <br>
        Usuário ${employeeName}?</h1>
        <button class="submit-remove-employee-button">Remover</button>
      </div>
    `
  );

  const removeButton = document.querySelector(
    ".modal-remove-employee__container button"
  );

  removeButton.addEventListener("click", async () => {
    await deleteEmployee(employeeId);
    showEmployeeDash();
    modal.close();
    modal.innerHTML = "";
  });

  const closeButton = document.querySelector(
    ".modal-remove-employee__container .close-modal"
  );

  closeButton.addEventListener("click", () => {
    modal.close();
    modal.innerHTML = "";
  });
};

// const handleViewDepartment = () => {
//   const modal = document.querySelector(".modal-view-department__container");
//   const openButtons = document.querySelectorAll(".view-department");
//   const inputSelect = document.querySelector(".select-input-view-modal");
//   const submitForm = document.querySelector(".form-view__container");
//   closeModal(modal);

//   openButtons.forEach((button) => {
//     button.addEventListener("click", async (e) => {
//       modal.showModal();

//       handleModalEmployeeSelect();

//       let body = {
//         department_id: null,
//       };

//       let departmentID = e.target.dataset.departmentId;
//       let departmentName = e.target.dataset.departmentName;
//       let departmentDescription = e.target.dataset.departmentDescription;
//       let companyName = e.target.dataset.companyName;

//       let h1 = document.querySelector(".modal-view__controller h1");
//       h1.innerText = departmentName;

//       let h2 = document.querySelector(".modal-view__controller h2");
//       h2.innerText = departmentDescription;

//       let h3 = document.querySelector(".modal-view__controller h3");
//       h3.innerText = companyName;

//       const department = await readDepartmentById(departmentID);
//       const employees = department.employees;
//       renderEmployeesByDepartment(employees, departmentID, companyName);

//       submitForm.addEventListener("submit", async (event) => {
//         event.preventDefault();
//         body.department_id = departmentID;
//         await hireEmployee(inputSelect.value, body);
//         //handleModalEmployeeSelect();
//         //renderEmployeesByDepartment(employees, departmentID, companyName);
//         //handleViewDepartment()

//         setTimeout(() => {
//           location.reload();
//         }, 1500);
//       });
//     });
//   });
// };

const handleViewDepartment = async (
  departmentId,
  departmentName,
  departmentDescription,
  companyName
) => {
  let employees = await getEmployeesByDepartmentId(departmentId);
  const modal = document.querySelector(".modal-view-department__container");

  let body = {
    department_id: departmentId,
  };

  modal.showModal();

  handleModalEmployeeSelect();

  modal.insertAdjacentHTML(
    "afterbegin",
    `
    <img src="../assets/close.svg" alt="Close button" class="close-modal">
    <div class="modal-view__controller">
      <h1 class="modal-title">${departmentName}</h1>
      <h2>${departmentDescription}</h2>
      <h3>${companyName}</h3>
      <form class="form-view__container">
        <select class="select-input-view-modal">
          <option selected disabled>
            Selecionar usuário
          </option>
        </select>
        <button class="submit-view-employee-button">Contratar</button>
      </form>
      <ul class="employees__container"></ul>
    </div>
  `
  );

  renderEmployeesByDepartment(employees, departmentId, companyName);

  const inputSelect = document.querySelector(".select-input-view-modal");
  const submitForm = document.querySelector(".form-view__container");
  const closeButton = document.querySelector(
    ".modal-view-department__container .close-modal"
  );

  submitForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (inputSelect.value == "Selecionar usuário") {
      toast(red, "Por favor, selecione um funcionário para ser contratado");
    } else {
      await hireEmployee(inputSelect.value, body);
      handleModalEmployeeSelect();
      let newEmployees = await getEmployeesByDepartmentId(departmentId);
      renderEmployeesByDepartment(newEmployees, departmentId, companyName);
      await showEmployeeDash();
    }
  });

  closeButton.addEventListener("click", () => {
    showEmployeeDash();
    modal.close();
    modal.innerHTML = "";
  });
};

const renderEmployeesByDepartment = (employees, departmentID, companyName) => {
  const container = document.querySelector(".employees__container");
  container.innerHTML = "";

  if (employees.length === 0) {
    const noEmployee = document.createElement("h1");
    noEmployee.innerText = `Não há nenhum funcionário cadastrado para o departamento selecionado`;
    container.append(noEmployee);
  } else {
    employees.forEach((employee) => {
      const card = createModalEmployeeCard(employee, companyName, departmentID);
      container.append(card);
    });
  }
};

const createModalEmployeeCard = (employee, companyName, departmentID) => {
  const card = document.createElement("li");
  card.classList.add("employee__card");

  const username = document.createElement("h1");
  username.innerText = employee.name;

  const company = document.createElement("p");
  company.innerText = companyName;

  const button = document.createElement("button");
  button.classList.add("fire-employee");
  button.innerText = "Desligar";

  button.addEventListener("click", () => {
    handleDeleteEmployeeByDepartment(employee.id, companyName, departmentID);
  });

  card.append(username, company, button);
  return card;
};

// const handleDeleteEmployeeByDepartment = () => {
//   const fireEmployeeButtons = document.querySelectorAll(".fire-employee");

//   fireEmployeeButtons.forEach((button) => {
//     button.addEventListener("click", async (e) => {
//       e.preventDefault();
//       let employeeId = e.target.dataset.employeeId;
//       // let company = e.target.dataset.companyName;
//       // let idDepartment = e.target.dataset.departmentId;
//       await dismissEmployee(employeeId);
//       //toast(green, data.message);
//       // renderEmployeesByDepartment(idDepartment, company);
//       // handleModalEmployeeSelect();
//       //showEmployeeDash();

//       setTimeout(() => {
//         location.reload();
//       }, 1500);
//     });
//   });
// };

const handleDeleteEmployeeByDepartment = async (
  employeeId,
  companyName,
  departmentID
) => {
  await dismissEmployee(employeeId);
  handleModalEmployeeSelect();
  const newEmployees = await getEmployeesByDepartmentId(departmentID);
  renderEmployeesByDepartment(newEmployees, departmentID, companyName);
};

const handleModalEmployeeSelect = async () => {
  const employeesOutWork = await employeesOutOfWork();
  const inputSelect = document.querySelector(".select-input-view-modal");
  inputSelect.innerHTML = "";
  const defaultOption = document.createElement("option");

  defaultOption.setAttribute("selected", true);
  defaultOption.setAttribute("disabled", true);
  defaultOption.innerText = "Selecionar usuário";
  inputSelect.append(defaultOption);

  employeesOutWork.forEach((employee) => {
    const option = document.createElement("option");
    option.innerText = employee.name;
    option.value = employee.id;
    inputSelect.append(option);
  });
};

const getEmployeesByDepartmentId = async (departmentId) => {
  const getDepartmentById = await readDepartmentById(departmentId);
  const employees = getDepartmentById.employees;
  return employees;
};

authentication();
showDepartmentsDash();
showEmployeeDash();
handleSelectCompanies();
logout();
handleCreateDepartment();
