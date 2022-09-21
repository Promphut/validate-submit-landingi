$.Thailand.setup({
  database:
    "https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/database/db.json",
});
$.Thailand({
  $search: $(".widget-form input[name='search']"),
  onDataFill: function (data) {
    var show =
      data.district +
      " » " +
      data.amphoe +
      " » " +
      data.province +
      " » " +
      data.zipcode;
    $(".widget-form input[name='district']").val(data.district);
    $(".widget-form input[name='amphoe']").val(data.amphoe);
    $(".widget-form input[name='province']").val(data.province);
    $(".widget-form input[name='zipcode']").val(data.zipcode);
    showAddressValue($, show);
  },
  onLoad: function () {
    var emp = $(".one-px");
    if (emp) emp.remove();
  },
  templates: {
    empty: " ",
    suggestion: function (data) {
      if (data.zipcode) {
        data.zipcode = " » " + data.zipcode;
      }
      return (
        '<div class="tt-highlight">' +
        data.district +
        " » " +
        data.amphoe +
        " » " +
        data.province +
        " » " +
        data.zipcode +
        "</div>"
      );
    },
  },
});
$(".widget-form input[name='search']").change(function () {
  var emp = $(".one-px");
  if (emp) emp.remove();
});
function showAddressValue($, data) {
  $(".widget-form input[name='search']").blur();
  $(".widget-form input[name='search']").val(data);
}
