const pagination = document.querySelector(".pagination");
const cardTeacher = document.querySelector(".card-row");
const teacherModal = document.querySelector(".teacherModal");
let addTeacher = document.querySelector(".addTeacher");
let modalTitle = document.querySelector("#modal-title");
const modal = document.querySelector(".modal");
let adding = document.querySelector(".adding");
const input = document.querySelector(".input");
const sortByLastName = document.querySelector("#sortByLastName");
const sortByIsMarried = document.querySelector("#sortByIsMarried");

const formElements = teacherModal.elements;
let search = "";
const LIMIT = 7;
let page = new URLSearchParams(location.search).get("page") || 1;
let sortedLastname = "asc";
//new URLSearchParams(location.search).get.page ||
let selected = null;

function getDataTeachers({
  avatar,
  lastName,
  firstName,
  isMarried,
  email,
  phoneNumber,
  id,
}) {
  return `
      <div class="card">
        <div class="card-content">
          <img src="${avatar}" alt="Teacher Img">
          <h3 class="card-title">${firstName} ${lastName}</h3>
          <div class="teachar-info">
            <p class="card-para">Email: <span>${email}</span></p>
            <p class="card-para">Phone: <span>${phoneNumber}</span></p>
            <p class="card-para">isMaried: ${isMarried ? "✅" : "❌"} </p>
          </div>
          <div class="btns">
            <a href="students.html?teacher=${id}" class="teacherStudents" >View Students</a>
            <button class="editTeacherInfo" onclick="editTeacherInfo(${id})">Edit</button>
            <button class="deleteTeacherInfo" onclick="deleteChangeTeacher(${id})">Delete</button>
        </div>
        </div>
      </div>
      `;
}

function getPagination(url) {
  axiosInstance(url)
    .then((res) => {
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
    })
    .catch((err) => {
      alert(err);
    });
}

function getTeachers(val = null) {

  let url = `teacher${
    val ? "?" + val + "&" : "?"
  }page=${page}&limit=${LIMIT}&sortby=lastName&order=${sortedLastname}&firstName=${search}`;

  axiosInstance(url).then((teachers) => {
    // let teachersObj = teachers.data;

    getPagination(`teacher${val ? "?" + val + "&" : "?"}firstName=${search}`);

    cardTeacher.innerHTML = "";

    teachers.data.map((teacher) => {
      cardTeacher.innerHTML += getDataTeachers(teacher);
    });
  });
}

function getPage(p) {
  page = p;
  location.replace(`index.html?page=${p}`);
  getTeachers();
}

getTeachers();

sortByIsMarried.addEventListener("change", function (e) {
  e.preventDefault();
  if (this.value === "all") {
    getTeachers();
  } else if (this.value === "true") {
    getTeachers("isMarried=true");
  } else {
    getTeachers("isMarried=false");
  }
});

sortByLastName.addEventListener("change", function () {
  let val = this.value != "all" ? this.value : "";
  if (val) {
    sortedLastname = val;
  }
  getTeachers();
});

input.addEventListener("keyup", function () {
  search = this.value;
  getTeachers();
});
