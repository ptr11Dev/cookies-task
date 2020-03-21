"use strict";

function _toArray(arr) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
    return Array.from(iter);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _createForOfIteratorHelper(o) {
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var it,
    normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

var proxyurl = "https://cors-anywhere.herokuapp.com/";
var url = "https://vendorlist.consensu.org/vendorlist.json";
var partnersList = document.querySelector(".partners");

var getData = function getData() {
  return fetch(proxyurl + url)
    .then(function(res) {
      return res.json();
    })
    .then(function(res) {
      return res.vendors;
    })
    .catch(function(err) {
      return console.log(err);
    });
};

var addVendor = function addVendor(vendor) {
  var partner = document.createElement("div");
  partner.classList.add("partner");
  var partnerName = document.createElement("p");
  partnerName.classList.add("partner__name");
  partnerName.innerText = vendor.name;
  var partnerLink = document.createElement("a");
  partnerLink.classList.add("partner__link");
  partnerLink.innerText = "Privacy Policy";
  partnerLink.setAttribute("href", "".concat(vendor.policyUrl));
  var checkbox = document.createElement("input");
  checkbox.classList.add("partner__permission");
  checkbox.type = "checkbox";
  checkbox.value = "".concat(vendor.name.replace(/[.,()\s&;\u2122]/g, ""));
  checkbox.checked = "true";
  partner.appendChild(partnerName);
  partner.appendChild(partnerLink);
  partner.appendChild(checkbox);
  partnersList.appendChild(partner);
};

var showAllVendors = function showAllVendors() {
  getData().then(function(vendors) {
    var _iterator = _createForOfIteratorHelper(vendors),
      _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var vendor = _step.value;
        addVendor(vendor);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
};

showAllVendors();

var getPermissions = function getPermissions() {
  var _document$querySelect = document.querySelectorAll(".partner__permission"),
    _document$querySelect2 = _toArray(_document$querySelect),
    vendorsList = _document$querySelect2.slice(0);

  return {
    allowedList: vendorsList
      .filter(function(vendor) {
        return vendor.checked === true;
      })
      .map(function(vendor) {
        return vendor.value;
      }),
    deniedList: vendorsList
      .filter(function(vendor) {
        return vendor.checked === false;
      })
      .map(function(vendor) {
        return vendor.value;
      })
  };
};

var maxCookieSize = 2500;
var maxCompanyNameLength = 200;

var splitCookies = function splitCookies(permissionsList, type, expiration) {
  var cookieNumber = 0;
  var newCookie;

  var extractData = function extractData(arg) {
    newCookie = permissionsList.slice(0, arg);
    permissionsList = permissionsList.slice(arg + 1, permissionsList.length);
    document.cookie = "allowed_"
      .concat(cookieNumber, "=")
      .concat(newCookie, " ")
      .concat(expiration);
    cookieNumber++;
  };

  while (permissionsList.length > maxCookieSize) {
    if (permissionsList.charAt(maxCookieSize) === "-") {
      extractData(maxCookieSize);
    } else {
      for (
        var i = maxCookieSize - 1;
        i > maxCookieSize - maxCompanyNameLength;
        i--
      ) {
        if (permissionsList.charAt(i) === "-") {
          extractData(i);
          i = maxCookieSize;
        }
      }
    }
  }

  document.cookie = ""
    .concat(type, "_")
    .concat(cookieNumber, "=")
    .concat(permissionsList, " ")
    .concat(expiration);
};

var setCookies = function setCookies() {
  var data = getPermissions();
  var cookieAllowed = data.allowedList.join("-");
  var cookieDenied = data.deniedList.join("-");
  var expiration = getDate();
  document.cookie = "accepted=true" + expiration;
  splitCookies(cookieAllowed, "allowed", expiration);
  splitCookies(cookieDenied, "denied", expiration);
};

var getDate = function getDate() {
  var actualDate = new Date();
  actualDate.setTime(actualDate.getTime() + 24 * 60 * 60 * 1000);
  return "; expires=".concat(actualDate.toGMTString());
};

acceptBtn.addEventListener("click", function() {
  modalOff();
  setCookies();
});
rejectBtn.addEventListener("click", function() {
  modalOff();
  var expiration = getDate();
  document.cookie = "allowed=false" + expiration;
  getDate();
});
