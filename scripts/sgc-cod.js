function validatePhone($form) {
  let phone = $('input[subtype="phone"]', $form).val().trim();
  if (!phone) return true;
  phone = phone.replace(/(\s+|-|\+66|^66|^0)/g, "");
  // change +66 into 0
  $('input[subtype="phone"]', $form).val(phone);
  if (phone.length > 9 || phone.length < 8) return false;
  return true;
}
function validateAddr($form) {
  let addr = $('input[name="address"]', $form).val().trim();
  if (!addr) return true;
  //if(addr.length<6) return false;
  return true;
}
function correctName($form) {
  let name = $('input[subtype="name"]', $form).val().trim();
  if (!name) return;
  name = name
    .replace(/^(นาย|นางสาว|น.ส.|ด.ช.|นาง|คุณ |เด็กชาย|เด็กหญิง)/g, "")
    .replace(/\s\s+/g, " ")
    .trim();
  $('input[subtype="name"]', $form).val(name);
}
function blockSpam($form) {
  let email = $('input[name="email"]', $form).val().trim();
  if (RegExp("charan.p").test(email)) return false;
  return true;
}
function correctAddr($form) {
  let addr = $('input[name="address"]', $form).val().trim();
  if (!addr) return;
  addr = addr.replace(/\s\s+/g, " ").trim();
  $('input[name="address"]', $form).val(addr);
}
function checkValidAddress() {
  let district = $(".widget-form input[name='district']").val();
  let ampoe = $(".widget-form input[name='amphoe']").val();
  let province = $(".widget-form input[name='province']").val();
  let zipcode = $(".widget-form input[name='zipcode']").val();
  let search = $(".widget-form input[name='search']").val();
  if (search && (!district || !ampoe || !province || !zipcode)) {
    let addr = search.split(" » ");
    if (addr.length == 4) {
      let district = $(".widget-form input[name='district']").val(addr[0]);
      let ampoe = $(".widget-form input[name='amphoe']").val(addr[1]);
      let province = $(".widget-form input[name='province']").val(addr[2]);
      let zipcode = $(".widget-form input[name='zipcode']").val(addr[3]);
      return true;
    } else {
      alert("กรุณาพิมพ์ชื่อตำบลของคุณให้ถูกต้อง");
      return false;
    }
  } else if (!search && (!district || !ampoe || !province || !zipcode)) {
    alert("กรุณาพิมพ์ชื่อตำบลของคุณให้ถูกต้อง");
    return false;
  } else {
    return true;
  }
  return true;
}

//Append User Agent and Url for server to use
function appendUserAgent() {
  let l = location,
    $px = $("input[name='px']");
  if (!$px || !PXID) return false;
  $px.val(
    PXID +
      "|" +
      navigator.userAgent +
      "|" +
      l.protocol +
      "//" +
      l.host +
      l.pathname
  );
}
$(function () {
  appendUserAgent();
});

$(document).on("click", 'button[type="submit"]', function (e) {
  let $form = $(this).closest("form");
  correctName($form);
  correctAddr($form);
  let validAddr = checkValidAddress();
  let valid =
    blockSpam($form) &&
    validatePhone($form) &&
    validateAddr($form) &&
    validAddr;
  if (!valid) {
    alert("กรุณากรอกข้อมูลสำหรับติดต่อให้ถูกต้อง");
    return false;
  }
  return true;
});
