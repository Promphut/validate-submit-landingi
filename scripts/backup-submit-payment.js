(async function () {
  let eventData;
  if (conversion.hash) eventData = { eventID: "CR_" + conversion.hash };

  fbq(
    "track",
    "CompleteRegistration",
    {
      value: conversion.price || 0,
      currency: "THB",
    },
    eventData
  );

  const { ip } = await getIp();

  var {
    email,
    tel,
    fullName,
    course,
    seller,
    campaign,
    query,
    dealId,
    px,
    redirect_url,
    discountCode,
    callback_url,
  } = getDataFromLocalStorage();
  var courses = course ? course.split(",") : [];
  if (courses.length) {
    var cartItems = courses.map((c) => {
      return {
        product: c,
        quantity: 1,
      };
    });
    var data = {
      cartItems,
      userdata: {
        email: email,
        tel: tel || "",
        fullName: fullName || "",
      },
      cartTracking: {
        convertionId: conversion.hash || "",
        campaign: campaign || "",
        seller: seller || "",
        channel: "SGC",
        ip,
        utm_source: query.utm_source || "",
        utm_medium: query.utm_medium || "",
        utm_campaign: query.utm_campaign || "",
        utm_term: query.utm_term || "",
        utm_content: query.utm_content || "",
        customField1: dealId,
        customField2: px,
      },
      paymentSuccessRedirectUrl: `${redirect_url}?price=${
        conversion.price || 0
      }`,
      paymentSuccessCallbackUrl: callback_url,
    };
    if (callback_url) data.paymentSuccessCallbackUrl = callback_url;
    //console.log('data',data)
    //console.log({data})
    var url = await createCart(data);
    if (discountCode) url = `${url}?discountCode=${discountCode}`;
    window.location.replace(url);
  }
  function getDataFromLocalStorage() {
    var email = localStorage.getItem("email");
    var tel = localStorage.getItem("phone");
    var fullName = localStorage.getItem("name");
    var price = localStorage.getItem("price");
    var course = localStorage.getItem("course");
    var seller = localStorage.getItem("seller");
    var campaign = localStorage.getItem("campaign");
    var dealId = localStorage.getItem("deal_id");
    var px = localStorage.getItem("px");
    var redirect_url = localStorage.getItem("redirect_url");
    var callback_url = localStorage.getItem("callback_url");
    var discountCode = localStorage.getItem("discountCode");
    var query = JSON.parse(localStorage.getItem("params") || {});
    return {
      email,
      tel,
      fullName,
      course,
      seller,
      campaign,
      dealId,
      query,
      px,
      redirect_url,
      price,
      discountCode,
      callback_url,
    };
  }

  async function createCart(cart) {
    var { data } = await axios.post(
      "https://pay-api.futureskill.co/api/cart/create",
      cart,
      {
        headers: {
          Authorization:
            "Basic ODIzMjAyMzI4NzczNjEwNzA6cWdsTzA1YVZkdVl2RHF5eVdhQ2w=",
        },
      }
    );
    //console.log(data,'data response')
    return data.url;
  }

  async function getIp() {
    var { data } = await axios.get("https://www.cloudflare.com/cdn-cgi/trace");
    data = data
      .trim()
      .split("\n")
      .reduce(function (obj, pair) {
        pair = pair.split("=");
        return (obj[pair[0]] = pair[1]), obj;
      }, {});
    //console.log(data,'data response')
    return data;
  }
})();
