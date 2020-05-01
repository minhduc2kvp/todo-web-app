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

// VAR REGEX
const EMAIL_REGEX = new RegExp(
  "^[a-z][a-z0-9_.]{3,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$"
);
const PASSWORD_REGEX = new RegExp("(?=.*[a-z])(?=.*[0-9])(?=.{8,})");
const NAME_REGEX = new RegExp("(?=.{2,})");
const USERNAME_REGEX = new RegExp("(?=.{5,})");

// VALIDATE DATA FUNCTION
function validateData(data, regex) {
  return data.match(regex);
}

// LOG ERROR VALIDATE
function logError(message) {
  $("#error").text(message);
  $("#error").css({ display: "block" });
}

// FORM SUBMIT
$("#form-register").submit((event) => {
  event.preventDefault();

  const name = $("#name").val();
  const username = $("#username").val();
  const password = $("#password").val();
  const password2 = $("#password2").val();
  const email = $("#email").val();
  const gender = $("input[name=gender]:checked").val();
  const birthday = $("#birthday").val();
  const avatar = $("#file-avatar").val();

  if (name && username && password && email && gender && birthday) {
    let validate = true;

    if (!validateData(email, EMAIL_REGEX)) {
      validate = false;
      logError("Email không chính xác !!!");
    } else if (!validateData(password, PASSWORD_REGEX)) {
      validate = false;
      logError(
        "Mật khẩu phải chứa ít nhất một chữ số và độ dài nhỏ nhất là 8 ký tự"
      );
    } else if (!validateData(name, NAME_REGEX)) {
      validate = false;
      logError("Độ dài của tên phải lớn hơn 1 ký tự");
    } else if (!validateData(username, USERNAME_REGEX)) {
      validate = false;
      logError("Độ dài của tên tài khoản phải lớn hơn 4 ký tự");
    }else if(!(password === password2)){
      validate = false;
      logError("Hai mật khẩu khôn giống nhau !!");
    }

    // IF VALIDATE SUCCESS
    if (validate) {
      logError('Đang xử lý...xin chờ...');
      let user = null;
      if (avatar) {
        user = {
          name: name,
          username: username,
          password: password,
          email: email,
          gender: gender,
          birthday: birthday,
          avatar: $('#avatar').attr('src'),
        };
      } else {
        user = {
          name: name,
          username: username,
          password: password,
          email: email,
          gender: gender,
          birthday: birthday,
        };
      }

      // everything is done => post data
      const urlRegister = "/register";
      $.post(urlRegister, user, (data) => {
        if (data === "error") {
          logError("Tên tài khoản đã tồn tại !!");
        } else {
          $("#error").css({ display: "none" });
          window.location.href = "/login";
          console.log(data);
        }
      });
    }
  } else {
    logError("Chưa điền đủ thông tin...Vui lòng điền đầy đủ thông tin !!!");
  }
});
