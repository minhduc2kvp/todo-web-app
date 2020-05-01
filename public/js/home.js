// CREATE NEW ITEM
$("#menu-pc li.option.create").click(() => {
  $("#modal-item").css({ display: "block" });
});
$("#modal-item .modal-content .close").click(() => {
  closeModal();
});
$(window).click((event) => {
  if (event.target == document.getElementById("modal-item")) {
    closeModal();
  }
});

function closeModal() {
  $("#modal-item").css({ display: "none" });
  $("#error-item").css({ display: "none" });
  $("#form-item #name").val(null);
  $("#form-item #deadline").val(null);
  $("#form-item #id").val(null);
}

function logErr(err) {
  $("#error-item").css({ display: "block" });
  $("#error-item").text(err);
}

// FORM SUBMIT
$("#form-item").submit((event) => {
  event.preventDefault();
  const name = $("#form-item #name").val();
  const deadline = $("#form-item #deadline").val();
  const id = $("#form-item #id").val();

  if (name && deadline) {
    if (id) {
      $.ajax({
        url: `/api/item/${id}`,
        type: "PUT",
        data: { name: name, deadline: deadline },
      }).done(async (data) => {
        closeModal();
        await loadItem();
      });
    } else {
      $.ajax({
        url: `/api/item`,
        type: "POST",
        data: { name: name, deadline: deadline },
      }).done(async (data) => {
        closeModal();
        await loadItem();
      });
    }
  } else {
    logErr("Thông tin chưa đủ !!!");
  }
});

// LOAD ITEM
async function loadItem() {
  $.get("/api/item", (data) => {
    let output = "";
    data.forEach((item) => {
      output += `<li class="item" data-id="${item._id}">
      <div class="infor">
        <div class="name" style="color : ${item.colorStyle};${item.check ? 'text-decoration: line-through;' : ''}">${item.name}</div>
        <div class="deadline">${item.deadline}</div>
        <input type="password" class="change-color" value="${item.colorStyle}" style="background-color: ${item.colorStyle};color: white;">
      </div>
      <div class="option">
        <input type="checkbox" name="job" class="check" data-id="${item._id}" ${item.check ? 'checked' : ''} />
        <i class="fas fa-pencil-alt update"></i>
        <i class="fas fa-trash-alt delete"></i>
      </div>
    </li>`;
    });
    $("#list-item").html(output);
    // SET UP CHANGE COLOR
    $(".change-color").spectrum({
      color: "royalblue",
      showInput: false,
      showPaletteOnly: true,
    });
    $(".change-color").change(function () {
      $(this).css({ backgroundColor: $(this).val() });
      $(this)
        .parent()
        .siblings(".name")
        .css({ color: $(this).val() });
    });

    // UPDATE FUNCITON
    $("#list-item .item .option .update").click(async function () {
      const id = $(this).siblings("input").attr("data-id");
      $.get(`/api/item/${id}`, (data) => {
        $("#modal-item #form-item #id").val(data._id);
        $("#modal-item #form-item #name").val(data.name);
        $("#modal-item #form-item #deadline").val(data.deadline);
      });
      $("#modal-item").css({ display: "block" });
    });

    // DELETE ITEM
    $("#list-item .item .option .delete").click(function () {
      const id = $(this).siblings("input").attr("data-id");
      $.ajax({
        url: `/api/item/${id}`,
        type: "DELETE"
      }).done(loadItem());
    });

    // UPDATE CHECK ITEM
    $("#list-item .item .option .check").change(function () {
      const id = $(this).attr("data-id");
      const check = $(this).prop('checked');
      if(check){
        $(this).parent().prev().children('.name').css({textDecoration : 'line-through'});
      }else{
        $(this).parent().prev().children('.name').css({textDecoration : 'none'});
      }
      $.ajax({
        url: `/api/item/${id}`,
        type: "PUT",
        data: { check : check}
      });
    });
      
    // UPDATE COLOR ITEM
    $(".change-color").change(function () {
      const id = $(this).parents('.item').attr("data-id");
      const color = $(this).val();
      $.ajax({
        url: `/api/item/${id}`,
        type: "PUT",
        data: { colorStyle : color}
      });
    });
  });
}

$(document).ready(async () => {
  await $.get('/api/profile-user', (data) => {
    $('#user a.avatar,a.name').attr({href : `/profile?id=${data._id}`});
    $('#user a.name').text(data.name)
    $('#user a.avatar img').attr({src : data.avatar});
  });
  await loadItem();

  setInterval(() =>{
    if(!$('#list-item').text()){
      $('#list-item').text(' ');
    }
  },2000);
});
