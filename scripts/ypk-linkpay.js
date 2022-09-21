(function () {
  console.log("script init!");
  appendUserAgent();
  const deal_id = genDealID();
  $('input[name="deal_id"]').val(deal_id);
  const defaultPackage = $('input[name="defaultPackage"]').val();
  if (defaultPackage) {
    $('select[name="package"]').val(defaultPackage).change();
    let _defaultPackage = defaultPackage.split("/");
    $('input[name="course"]')
      .val(`${_defaultPackage[0]}/${_defaultPackage[0]}`)
      .change();
    $('input[name="price"]').val(_defaultPackage[1]).change();
    $('input[name="discountCode"]').val(_defaultPackage[2]).change();
  }
})();

function genDealID() {
  var d = new Date().toISOString().substring(0, 10);
  var dd = d.split("-").join("");
  var rand = Math.round(Math.random() * 1000000);
  return dd + rand;
}

function validatePhone($form) {
  let phone = $('input[subtype="phone"]', $form).val().trim();
  if (!phone) return true;
  phone = phone.replace(/(\s+|-|\+66|^66|^0)/g, "");
  // change +66 into 0
  $('input[subtype="phone"]', $form).val(phone);
  if (phone.length > 9 || phone.length < 8) return false;
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

$('select[name="package"]').on("change", function (e) {
  const package = $(this).val();
  let _package = package.split("/");
  $('input[name="course"]').val(`${_package[0]}/${_package[0]}`);
  $('input[name="price"]').val(_package[1]);
  $('input[name="discountCode"]').val(_package[2]);
});

$(document).on("click", 'button[type="submit"]', function (e) {
  let $form = $(this).closest("form");
  correctName($form);
  let email = $('input[name="email"]', $form).val().trim();
  let phone = $('input[name="phone"]', $form).val().trim();
  let name = $('input[subtype="name"]', $form).val().trim();
  let price = $('input[name="price"]', $form).val().trim();
  let _course = $('input[name="course"]', $form).val().trim();
  let selectedPackage = $('select[name="package"]').val().trim();
  let discountCode = $('input[name="discountCode"]', $form).val().trim();
  if (selectedPackage) {
    const splitPackage = selectedPackage.split("/");
    discountCode = splitPackage[2];
    price = splitPackage[1];
    _course = splitPackage[0];
  }
  let course = _course.split("/");
  let info = $('input[name="info"]', $form).val().trim().split("/");
  let dealId = $('input[name="deal_id"]', $form).val()
    ? $('input[name="deal_id"]', $form).val().trim()
    : "";
  let px = $('input[name="px"]', $form).val()
    ? $('input[name="px"]', $form).val().trim()
    : "";
  let orderbump = $('input[name="orderbump"]', $form);
  let orderbumpdetail = $('input[name="orderbumpdetail"]', $form).val();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  let redirect_url = $('input[name="redirect_url"]', $form).val().trim();
  let callback_url = $('input[name="callback_url"]', $form).val().trim();

  if (orderbump && orderbump.length && orderbump[0].checked) {
    course[0] += `,${orderbumpdetail.trim()}`;
  }
  localStorage.setItem("email", email);
  localStorage.setItem("phone", phone);
  localStorage.setItem("name", name);
  localStorage.setItem("price", price);
  localStorage.setItem("course", course[0]);
  localStorage.setItem("campaign", info[1]);
  localStorage.setItem("seller", info[0]);
  if (dealId) localStorage.setItem("deal_id", dealId);
  localStorage.setItem("px", px);
  localStorage.setItem("redirect_url", redirect_url);
  localStorage.setItem("callback_url", callback_url);
  localStorage.setItem("discountCode", discountCode);
  localStorage.setItem("params", JSON.stringify(params));
  let valid = blockSpam($form) && validatePhone($form);
  if (!valid) {
    alert("กรุณากรอกข้อมูลสำหรับติดต่อให้ถูกต้อง");
    return false;
  }
  return true;
});
