// LOAD AVATAR
function reloadAvatar() {
  const file = document.getElementById("file-avatar").files[0];
  const img = document.getElementById("avatar");
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      img.src = reader.result;
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }
}

// GET PARAMS URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let id = null;
if (urlParams.get("id")) {
  id = urlParams.get("id");

  // LOAD INFORMATION
  $.get(`api/user/${id}`, (data) => {
    data = data[0];
    $("#name").val(data.name);
    $("#username").val(data.username);
    $("#email").val(data.email);
    switch (data.gender) {
      case "male": {
        $("#male").prop("checked", true);
        break;
      }
      case "female": {
        $("#female").prop("checked", true);
        break;
      }
      case "other": {
        $("#other").prop("checked", true);
        break;
      }
      default: {
        break;
      }
    }
    $("#birthday").val(data.birthday);
    $("#avatar").attr({ src: data.avatar });
    return data;
  });
}

// VAR REGEX
const EMAIL_REGEX = new RegExp(
  "^[a-z][a-z0-9_.]{3,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$"
);
const NAME_REGEX = new RegExp("(?=.{2,})");

// VALIDATE DATA FUNCTION
function validateData(data, regex) {
  return data.match(regex);
}

// LOG ERROR VALIDATE
function logError(message) {
  $("#error").text(message);
  $("#error").css({ display: "block" });
}

// document ready
$(document).ready(() => {
  const user = {
    name: $("#name").val(),
    email: $("#email").val(),
    gender: $("input[name=gender]:checked").val(),
    birthday: $("#birthday").val(),
  };

  $("#form-register").submit((event) => {
    event.preventDefault();
    const name = $("#name").val();
    const email = $("#email").val();
    const gender = $("input[name=gender]:checked").val();
    const birthday = $("#birthday").val();
    const avatar = $("#file-avatar").val();

    if (name && email && gender && birthday) {
      let check = true; // true => update
      if (
        name === user.name &&
        email === user.email &&
        gender === user.gender &&
        birthday === user.birthday
      ) {
        check = false;
      }
      if (avatar) {
        check = true;
      }

      // update
      if (check) {
        let validate = true;

        if (!validateData(email, EMAIL_REGEX)) {
          validate = false;
          logError("Email không chính xác !!!");
        } else if (!validateData(name, NAME_REGEX)) {
          validate = false;
          logError("Độ dài của tên phải lớn hơn 1 ký tự");
        }

        if (validate) {
          let dataUpdate = null;
          if (avatar) {
            dataUpdate = {
              name: name,
              email: email,
              gender: gender,
              birthday: birthday,
              avatar: $("#avatar").attr("src"),
            };
          } else {
            dataUpdate = {
              name: name,
              email: email,
              gender: gender,
              birthday: birthday,
            };
          }

          // put
          $.ajax({
            url: `/api/user/${id}`,
            type: "PUT",
            dataType: "json",
            data: dataUpdate,
          }).done(function (data) {
            window.location.href = "/";
          });
        }
      } else {
        window.location.href = "/";
      }
    } else {
      logError("Chưa điền đủ thông tin...Vui lòng điền đầy đủ thông tin !!!");
    }
  });
});
