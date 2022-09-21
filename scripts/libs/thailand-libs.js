($.Thailand = function (o) {
  "use strict";
  o = $.extend({}, $.Thailand.defaults, o);
  function n(e) {
    var r,
      t = [],
      a = [],
      c = [];
    return (
      e.lookup &&
        e.words &&
        ((t = e.lookup.split("|")), (a = e.words.split("|")), (e = e.data)),
      (r = function (e) {
        return (
          "number" == typeof e && (e = t[e]),
          e.replace(/[A-Z]/gi, function (e) {
            var t = e.charCodeAt(0);
            return a[t < 97 ? t - 65 : 26 + t - 97];
          })
        );
      }),
      e.map(function (i) {
        var o = 1;
        3 === i.length && (o = 2),
          i[o].map(function (n) {
            n[o].map(function (a) {
              (a[o] = a[o] instanceof Array ? a[o] : [a[o]]),
                a[o].map(function (e) {
                  var t = {
                    district: r(a[0]),
                    amphoe: r(n[0]),
                    province: r(i[0]),
                    zipcode: e,
                  };
                  2 === o &&
                    ((t.district_code = a[1] || !1),
                    (t.amphoe_code = n[1] || !1),
                    (t.province_code = i[1] || !1)),
                    c.push(t);
                });
            });
          });
      }),
      c
    );
  }
  var l = function (e, t, a) {
    for (
      var n,
        i,
        o,
        r = 0,
        c = 0,
        s = 0,
        p = (e += "").length,
        d = (t += "").length,
        h = 0;
      h < p;
      h += 1
    )
      for (n = 0; n < d; n += 1) {
        for (
          i = 0;
          h + i < p && n + i < d && e.charAt(h + i) === t.charAt(n + i);

        )
          i += 1;
        s < i && ((s = i), (r = h), (c = n));
      }
    return (
      (o = s) &&
        (r && c && (o += l(e.substr(0, c), t.substr(0, c), !1)),
        r + s < p &&
          c + s < d &&
          (o += l(e.substr(r + s, p - r - s), t.substr(c + s, d - c - s), !1))),
      !1 === a
        ? o
        : e === t
        ? 100
        : d < p
        ? Math.floor((o / p) * 100)
        : Math.floor((o / d) * 100)
    );
  };
  !(function (a) {
    var e,
      t = o.database_type.toLowerCase();
    switch (
      ("json" !== t && "zip" !== t && (t = o.database.split(".").pop()), t)
    ) {
      case "json":
        $.getJSON(o.database, function (e) {
          a(new JQL(n(e)));
        }).fail(function (e) {
          throw new Error('File "' + o.database + '" is not exists.');
        });
        break;
      case "zip":
        o.zip_worker_path ||
          $("script").each(function () {
            var e = this.src.split("/");
            "zip.js" === e.pop() && (zip.workerScriptsPath = e.join("/") + "/");
          }),
          ((e = new XMLHttpRequest()).responseType = "blob"),
          (e.onreadystatechange = function () {
            if (4 === e.readyState) {
              if (200 !== e.status)
                throw new Error('File "' + o.database + '" is not exists.');
              zip.createReader(new zip.BlobReader(e.response), function (e) {
                e.getEntries(function (e) {
                  e[0].getData(new zip.BlobWriter(), function (e) {
                    var t = new FileReader();
                    (t.onload = function () {
                      a(new JQL(n(JSON.parse(t.result))));
                    }),
                      t.readAsText(e);
                  });
                });
              });
            }
          }),
          e.open("GET", o.database),
          e.send();
        break;
      default:
        throw new Error(
          'Unknown database type: "' +
            o.database_type +
            '". Please define database_type explicitly (json or zip)'
        );
    }
  })(function (i) {
    $.Thailand.DB = i;
    var a,
      n,
      e = {
        empty: " ",
        suggestion: function (e) {
          return e && e.district
            ? (e.zipcode && (e.zipcode = " » " + e.zipcode),
              "<div>" +
                e.district +
                " » " +
                e.amphoe +
                " » " +
                e.province +
                e.zipcode +
                "</div>")
            : '<div class="one-px"></div>';
        },
      };
    for (a in o)
      -1 < a.indexOf("$") &&
        "$search" !== a &&
        o.hasOwnProperty(a) &&
        o[a] &&
        o[a]
          .typeahead(
            { hint: !0, highlight: !0, minLength: 1 },
            {
              limit: o.autocomplete_size,
              templates: e,
              source: function (e, t) {
                var a = [],
                  n = this.$el.data("field");
                try {
                  a = i
                    .select("*")
                    .where(n)
                    .match("^" + e)
                    .orderBy(n)
                    .fetch();
                } catch (e) {}
                t(a);
              },
              display: function (e) {
                return e[this.$el.data("field")];
              },
            }
          )
          .parent()
          .find(".tt-dataset")
          .data("field", a.replace("$", ""));
    for (a in (o.$search &&
      o.$search.typeahead(
        { hint: !0, highlight: !0, minLength: 2 },
        {
          limit: o.autocomplete_size,
          templates: e,
          source: function (t, e) {
            var a = [];
            try {
              a = new JQL(
                a
                  .concat(i.select("*").where("zipcode").match(t).fetch())
                  .concat(i.select("*").where("province").match(t).fetch())
                  .concat(i.select("*").where("amphoe").match(t).fetch())
                  .concat(i.select("*").where("district").match(t).fetch())
                  .map(function (e) {
                    return JSON.stringify(e);
                  })
                  .filter(function (e, t, a) {
                    return a.indexOf(e) == t;
                  })
                  .map(function (e) {
                    return (
                      ((e = JSON.parse(e)).likely = [
                        5 * l(t, e.district),
                        3 * l(t, e.amphoe.replace(/^เมือง/, "")),
                        l(t, e.province),
                        l(t, e.zipcode),
                      ].reduce(function (e, t) {
                        return Math.max(e, t);
                      })),
                      e
                    );
                  })
              )
                .select("*")
                .orderBy("likely desc")
                .fetch();
            } catch (t) {}
            e(a);
          },
          display: function (e) {
            return "";
          },
        }
      ),
    o))
      -1 < a.indexOf("$") &&
        o.hasOwnProperty(a) &&
        o[a] &&
        o[a]
          .bind("typeahead:select typeahead:autocomplete", function (e, t) {
            for (a in o)
              (n = a.replace("$", "")),
                -1 < a.indexOf("$") &&
                  o.hasOwnProperty(a) &&
                  o[a] &&
                  t[n] &&
                  o[a].typeahead("val", t[n]).trigger("change");
            "function" == typeof o.onDataFill &&
              (delete t.likely, o.onDataFill(t));
          })
          .blur(function () {
            this.value || $(this).parent().find(".tt-dataset").html("");
          });
    "function" == typeof o.onLoad && o.onLoad(),
      "function" == typeof o.onComplete && o.onComplete();
  });
}),
  ($.Thailand.defaults = {
    database:
      "https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/database/db.json",
    database_type: "auto",
    zip_worker_path: !1,
    autocomplete_size: 20,
    onLoad: function () {},
    onDataFill: function () {},
    $district: !1,
    $district_code: !1,
    $amphoe: !1,
    $amphoe_code: !1,
    $province: !1,
    $province_code: !1,
    $zipcode: !1,
    $search: !1,
  }),
  ($.Thailand.setup = function (e) {
    $.extend($.Thailand.defaults, e);
  });
