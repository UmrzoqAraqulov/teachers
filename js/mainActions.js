adding.addEventListener("click", function () {
  teacherModal.reset();
  modalTitle.textContent = "Adding Teacher";
  addTeacher.textContent = "Add Teacher";
});

teacherModal.addEventListener("submit", function (e) {
  e.preventDefault();
  let firstName = formElements.firstname.value;
  let lastName = formElements.lastName.value;
  let avatar = formElements.img.value;
  let groups = formElements.groups.value;
  let isMarried = formElements.isMarried.checked;
  let phoneNumber = formElements.phoneNumber.value;
  let email = formElements.email.value;
  const numberRegex=/^\+\d{12}$/;
  const isValidNumber = numberRegex.test(phoneNumber);
  console.log(isValidNumber, phoneNumber);
  if(!isValidNumber){
    alert("invalid phoneNumber! Enter valid phoneNumber");
    return;
  }
  let group = groups.split(",");
  let data = {
    firstName,
    lastName,
    avatar,
    group,
    isMarried,
    email,
    phoneNumber,
  };
  if (!selected) {
    console.log(true);
    axiosInstance.post("teacher", data).then((res) => {
      teacherModal.reset();
      getTeachers();
    });
  } else {
    console.log(true, data);
    axiosInstance.put(`teacher/${selected}`, data).then((res) => {
      teacherModal.reset();
      getTeachers();
    });
  }

  closeModal();
  selected = null;
});

function editTeacherInfo(id) {
  selected = id;
  modalTitle.textContent = "Editing Teacher";
  addTeacher.textContent = "Save";
  closeModal();
  axiosInstance(`teacher/${id}`).then((teacher) => {
    let data = teacher.data;
    formElements.firstname.value = data.firstName;
    formElements.lastName.value = data.lastName;
    formElements.img.value = data.avatar;
    formElements.groups.value = data.group.join(",");
    formElements.isMarried.checked = data.isMarried;
    formElements.phoneNumber.value = data.phoneNumber;
    formElements.email.value = data.email;
  });
}

async function deleteChangeTeacher(id) {
  let change = confirm(
    "Do you want to delete the data of the selected teacher?"
  );
  console.log(change);
  if (change) {
    await axiosInstance.delete(`teacher/${id}`);
    getTeachers();
  }
}

function closeModal() {
  modal.classList.toggle("modal-close");
}