
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
  // console.log(urlParams.get("error"));
  switch(urlParams.get("error")){
    case 'true' : {
      logError("Tên tài khoản hoặc mật khẩu không chính xác !");
      break;
    }
    case 'forgot' : {
      logError("Mật khẩu đã được gửi vào email của bạn, đọc email để lấy mật khẩu.");
      break;
    }
    case 'password' : {
      logError("Mật khẩu đã được thay đổi.");
      break;
    }
    default : {
      break;
    }
  }
  
}