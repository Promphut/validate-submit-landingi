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
  const getItems = [
    "email",
    "tel",
    "fullName",
    "course",
    "seller",
    "campaign",
    "dealId",
    "query",
    "px",
    "redirect_url",
    "price",
    "discountCode",
    "callback_url",
  ];
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
  } = getDataFromLocalStorage(getItems);
  const redirectQuery = new URLSearchParams({
    dealId,
    email,
    fullName,
    price,
    discountCode,
  }).toString();
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
      paymentSuccessRedirectUrl: `${redirect_url}?${redirectQuery}`,
      paymentSuccessCallbackUrl: callback_url,
    };
    if (callback_url) data.paymentSuccessCallbackUrl = callback_url;
    var url = await createCart(data);
    if (discountCode) url = `${url}?discountCode=${discountCode}`;
    window.location.replace(url);
  }

  function getDataFromLocalStorage(getItems) {
    const returnData = {};
    getItems.map((item) => {
      const data = localStorage.getItem(item);
      returnData[item] = data;
    });
    return returnData;
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
    return data;
  }
})();
