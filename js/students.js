const cardStudent = document.querySelector(".card-row");
const teacherModal = document.querySelector(".teacherModal");
let addTeacher = document.querySelector(".addTeacher");
let modalTitle = document.querySelector("#modal-title");
const modal = document.querySelector(".modal");
let adding = document.querySelector(".adding");
const input = document.querySelector(".input");
const pagination = document.querySelector(".pagination");
const formElements = teacherModal.elements;
let search = "";
let sortedByAge = "";

const sortByTeacher = document.querySelector("#sortByIsMarried");
const sortByage = document.querySelector("#sortByLastName");

const LIMIT = 2;
let page = 1;

let selected = null;

let teacherId = new URLSearchParams(location.search).get("teacher") || 1;
let url = `teacher/${teacherId}/students`;

function mappingTeacher() {
  axiosInstance("teacher").then((res) => {
    res.data.map((el) => {
      sortByTeacher.innerHTML += `
          <option value="${el.id}" ${
        teacherId === el.id ? "selected" : ""
      } style="background:rgb(2, 156, 143);">
            ${el.firstName}
          </option>
        `;
    });
  });
}
mappingTeacher();

function getPagination(urll) {
  axiosInstance(urll).then((res) => {
    let pages = Math.ceil(res.data.length / LIMIT);
    let item = "";
    if (pages > 1) {
      if (page == 1) {
        item = `<li class="page-item" onclick="getPage(${--page})" > <button class="page-link disabled" disabled>Previos</button>
            </li>`;
      } else {
        item = `<li class="page-item" onclick="getPage(${--page})"> <button class="page-link">Previos</button>
           </li>`;
      }
      page++;

      for (let i = 1; i <= pages; i++) {
        item += `<li class="page-item  ${i === page ? "Active" : ""}">
          <button class="page-link" onclick="getPage(${i})">${i}</button>
          </li>`;
      }

      if (page == pages) {
        item += `<li class="page-item" onclick="getPage(${++page})" > <button class="page-link disabled" disabled>next</button>
           </li>`;
      } else {
        item += `<li class="page-item" onclick="getPage(${++page})"> <button class="page-link" >Next</button>
            </li>`;
      }
      page--;

      pagination.innerHTML = item;
    }
  });
}

function getDataStudent({
  id,
  firstName,
  lastName,
  avatar,
  isWork,
  age,
  email,
  phoneNumber,
}) {
  return `
      <div class="card">
        <div class="card-content">
          <img src="${avatar}" alt="Teacher Img">
          <h3 class="card-title">${firstName} ${lastName}</h3>
          <div class="teachar-info">
            <p class="card-para">Email: <span>${email}</span></p>
            <p class="card-para">Phone: <span>${phoneNumber}</span></p>
            <p class="card-para">isWork: ${isWork ? "✅" : "❌"} </p>
            <p class="card-para">age: ${age} </p>
          </div>
          <div class="btns">
            <button class="editTeacherInfo" onclick="editTeacherInfo(${id})">Edit</button>
            <button class="deleteTeacherInfo" onclick="deleteChangeTeacher(${id})">Delete</button>
        </div>
        </div>
      </div>
      `;
}

function getStudents(val = null) {
  let url1 = `?page=${page}&limit=${LIMIT}&sortby=age&order=${sortedByAge}&firstName=${search}`;
  cardStudent.innerHTML = "";
  axiosInstance(url + url1).then((students) => {
    cardStudent.innerHTML = "";

    getPagination(url + `?firstName=${search}`);

    students.data.map((student) => {
      cardStudent.innerHTML += getDataStudent(student);
    });
  });
}

getStudents();

sortByage.addEventListener("change", function () {
  let val = this.value != "all" ? this.value : "";
  if (val) {
    sortedByAge = val;
  }
  getStudents();
});

sortByTeacher.addEventListener("change", function () {
  teacherId = this.value;
  location.replace(`students.html?teacher=${teacherId}`);
  getStudents();
});

input.addEventListener("keyup", function () {
  search = this.value;
  getStudents();
});

adding.addEventListener("click", function (e) {
  e.preventDefault();
  teacherModal.reset();
  modalTitle.textContent = "Adding Student";
  addTeacher.textContent = "Add Student";
});

function getPage(p) {
  page = p;
  location.replace(`students.html?teacher=${teacherId}&page=${p}`);
  getStudents();
}

function closeModal() {
  modal.classList.toggle("modal-close");
}

teacherModal.addEventListener("submit", function (e) {
  e.preventDefault();
  let firstName = formElements.firstname.value;
  let lastName = formElements.lastName.value;
  let avatar = formElements.img.value;
  let age = formElements.groups.value;
  let isWork = formElements.isMarried.checked;
  let phoneNumber = formElements.phoneNumber.value;
  let email = formElements.email.value;
  const numberRegex = /^\+\d{12}$/;
  const isValidNumber = numberRegex.test(phoneNumber);
  if (!isValidNumber) {
    alert("invalid phoneNumber! Enter valid phoneNumber");
    return;
  }
  let data = {
    firstName,
    lastName,
    avatar,
    age,
    isWork,
    email,
    phoneNumber,
  };
  if (!selected) {
    axiosInstance.post(url, data).then((res) => {
      console.log(12);
      teacherModal.reset();
      getStudents();
    });
  } else {
    axiosInstance.put(`${url}/${selected}`, data).then((res) => {
      teacherModal.reset();
      getStudents();
    });
  }

  closeModal();
  selected = null;
});

function editTeacherInfo(id,e) {
  selected = id;
  modalTitle.textContent = "Editing Student";
  addTeacher.textContent = "Save";
  closeModal();
  axiosInstance(`${url}/${id}`).then((student) => {
    let data = student.data;
    formElements.firstname.value = data.firstName;
    formElements.lastName.value = data.lastName;
    formElements.img.value = data.avatar;
    formElements.groups.value = data.age;
    formElements.isMarried.checked = data.isWork;
    formElements.phoneNumber.value = data.phoneNumber;
    formElements.email.value = data.email;
  });
  e.preventDefault();
}

async function deleteChangeTeacher(id) {
  let change = confirm(
    "Do you want to delete the data of the selected teacher?"
  );
  if (change) {
    await axiosInstance.delete(`${url}/${id}`);
    getStudents();
  }
}
