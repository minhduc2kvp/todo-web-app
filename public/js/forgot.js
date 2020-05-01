$("#error").css({ display: "none" });

// LOG ERROR VALIDATE
function logError(message) {
  $("#error").text(message);
  $("#error").css({ display: "block" });
}

// CHECK ERROR
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.get("error")) {
  //   console.log(urlParams.get("error"));
  logError("Tên tài khoản không tồn tại !");
}
if (urlParams.get("password")) {
  //   console.log(urlParams.get("error"));

    switch(urlParams.get("password")){
        case 'false' : {
            logError("Mật khẩu không đúng.");
            break;
        }
        case 'true' : {
            logError("Hai mật khẩu không giống nhau !");
            break;
        }
        case 'short' : {
            logError("Mật khẩu phải chứa ít nhất một chữ số và độ dài nhỏ nhất là 8 ký tự");
            break;
        }
        default : {
            break;
        }
    }
}
