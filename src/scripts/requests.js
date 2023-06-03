import { toast } from "./toast.js";

const baseURL = "http://localhost:3333";

const token = JSON.parse(localStorage.getItem("@kenzie:token")) || "";

const requestHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export const red = "#df1545";
export const green = "#36B37E";

export const getAllCompanies = async () => {
  const companies = await fetch(`${baseURL}/companies/readAll`, {
    method: "GET",
  }).then(async (res) => {
    if (res.ok) {
      return await res.json();
    } else {
      const response = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return response;
    }
  });

  return companies;
};

export const getSector = async () => {
  const sectors = await fetch(`${baseURL}/categories/readAll`, {
    method: "GET",
  }).then(async (res) => {
    const categories = await res.json();
    return categories;
  });

  return sectors;
};

export const login = async (user) => {
  const response = await fetch(`${baseURL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then(async (res) => {
    if (res.ok) {
      return await res.json();
    } else {
      const response = await res.json();
      toast(red, response.message);
      return response;
    }
  });

  return response;
};

export const getCompanyBySector = async (categoryName) => {
  const category = await fetch(
    `${baseURL}/companies/readByCategory/${categoryName}`,
    {
      method: "GET",
    }
  ).then(async (res) => {
    if (res.ok) {
      return await res.json();
    } else {
      const response = await res.json();
      toast(red, "Categoria inválida");
      return response;
    }
  });

  return category;
};

export const registerUser = async (user) => {
  const data = await fetch(`${baseURL}/employees/create`, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(user),
  }).then(async (res) => {
    if (res.ok) {
      toast(green, "Usuário cadastrado com sucesso");
      return await res.json();
    } else {
      const response = await res.json();
      toast(red, response.message);
      return response;
    }
  });

  return data;
};

export const employeeData = async () => {
  const employee = await fetch(`${baseURL}/employees/profile`, {
    method: "GET",
    headers: requestHeaders,
  }).then(async (res) => {
    if (res.ok) {
      return await res.json();
    }
  });

  return employee;
};

// Admin protected Routes

export const readAllEmployees = async () => {
  const employees = await fetch(`${baseURL}/employees/readAll`, {
    method: "GET",
    headers: requestHeaders,
  }).then(async (res) => {
    if (res.ok) {
      return await res.json();
    } else {
      const response = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return response;
    }
  });

  return employees;
};

export const employeesOutOfWork = async () => {
  const employees = await fetch(`${baseURL}/employees/outOfWork`, {
    method: "GET",
    headers: requestHeaders,
  }).then(async (res) => {
    if (res.ok) {
      return await res.json();
    } else {
      const data = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return data;
    }
  });

  return employees;
};

export const updateEmployee = async (employeeID, employeeNewData) => {
  const employee = await fetch(
    `${baseURL}/employees/updateEmployee/${employeeID}`,
    {
      method: "PATCH",
      headers: requestHeaders,
      body: JSON.stringify(employeeNewData),
    }
  ).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      toast(green, "Funcionário atualizado com sucesso");
      return data;
    } else {
      const data = await res.json();
      toast(red, "Nome de usuário ou e-mail já cadastrados, tente novamente");
      return data;
    }
  });

  return employee;
};

export const deleteEmployee = async (employeeID) => {
  const employee = await fetch(
    `${baseURL}/employees/deleteEmployee/${employeeID}`,
    {
      method: "DELETE",
      headers: requestHeaders,
    }
  ).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      toast(green, data.message);
      return data;
    } else {
      const data = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return data;
    }
  });

  return employee;
};

export const hireEmployee = async (employeeID, departmentID) => {
  const employee = await fetch(
    `${baseURL}/employees/hireEmployee/${employeeID}`,
    {
      method: "PATCH",
      headers: requestHeaders,
      body: JSON.stringify(departmentID),
    }
  ).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      toast(green, data.message);
      return data;
    } else {
      const data = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return data;
    }
  });

  return employee;
};

export const dismissEmployee = async (employeeID) => {
  const employee = await fetch(
    `${baseURL}/employees/dismissEmployee/${employeeID}`,
    {
      method: "PATCH",
      headers: requestHeaders,
    }
  ).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      toast(green, data.message);
      return data;
    } else {
      const data = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return data;
    }
  });

  return employee;
};

export const readCompanyById = async (companyId) => {
  const company = await fetch(`${baseURL}/companies/readById/${companyId}`, {
    method: "GET",
    headers: requestHeaders,
  }).then(async (res) => {
    if (res.ok) {
      return await res.json();
    } else {
      const response = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return response;
    }
  });

  return company;
};

// DEPARTMENT

export const createDepartment = async (departmentData) => {
  const department = await fetch(`${baseURL}/departments/create`, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(departmentData),
  }).then(async (res) => {
    if (res.ok) {
      toast(green, "Departamento criado com sucesso");
      return await res.json();
    } else {
      const data = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return data;
    }
  });

  return department;
};

export const readAllDepartments = async () => {
  const departments = await fetch(`${baseURL}/departments/readAll`, {
    method: "GET",
    headers: requestHeaders,
  }).then(async (res) => {
    if (res.ok) {
      return await res.json();
    } else {
      const data = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return data;
    }
  });

  return departments;
};

export const readDepartmentById = async (departmentID) => {
  const department = await fetch(
    `${baseURL}/departments/readById/${departmentID}`,
    {
      method: "GET",
      headers: requestHeaders,
    }
  ).then(async (res) => {
    if (res.ok) {
      return await res.json();
    } else {
      const data = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return data;
    }
  });

  return department;
};

export const readDepartmentsByCompanyId = async (companyID) => {
  const departments = await fetch(
    `${baseURL}/departments/readByCompany/${companyID}`,
    {
      method: "GET",
      headers: requestHeaders,
    }
  ).then(async (res) => {
    if (res.ok) {
      return await res.json();
    } else {
      const data = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return data;
    }
  });

  return departments;
};

export const updateDepartment = async (departmentID, newDepartmentInfos) => {
  const department = await fetch(
    `${baseURL}/departments/update/${departmentID}`,
    {
      method: "PATCH",
      headers: requestHeaders,
      body: JSON.stringify(newDepartmentInfos),
    }
  ).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      toast(green, data.message);
      return data;
    } else {
      const data = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return data;
    }
  });

  return department;
};

export const deleteDepartment = async (departmentID) => {
  const department = await fetch(
    `${baseURL}/departments/delete/${departmentID}`,
    {
      method: "DELETE",
      headers: requestHeaders,
    }
  ).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      toast(green, data.message);
      return data;
    } else {
      const data = await res.json();
      toast(red, "Algo deu errado, tente novamente mais tarde");
      return data;
    }
  });

  return department;
};
