// data from url (using proxy CORS workaround)

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "https://vendorlist.consensu.org/vendorlist.json";

const partnersList = document.querySelector(".partners");

const getData = () => {
  return fetch(proxyurl + url)
    .then(res => res.json())
    .then(res => res.vendors)
    .catch(err => console.log(err));
};

const addVendor = vendor => {
  const partner = document.createElement("div");
  partner.classList.add("partner");

  const partnerName = document.createElement("p");
  partnerName.classList.add("partner__name");
  partnerName.innerText = vendor.name;

  const partnerLink = document.createElement("a");
  partnerLink.classList.add("partner__link");
  partnerLink.innerText = "Privacy Policy";
  partnerLink.setAttribute("href", `${vendor.policyUrl}`);

  const checkbox = document.createElement("input");
  checkbox.classList.add("partner__permission");
  checkbox.type = "checkbox";
  checkbox.value = `${vendor.name.replace(/[.,()\s&;\u2122]/g, "")}`;
  checkbox.checked = "true";

  partner.appendChild(partnerName);
  partner.appendChild(partnerLink);
  partner.appendChild(checkbox);
  partnersList.appendChild(partner);
};

const showAllVendors = () => {
  getData().then(vendors => {
    for (const vendor of vendors) {
      addVendor(vendor);
    }
  });
};

showAllVendors();

const getPermissions = () => {
  const [...vendorsList] = document.querySelectorAll(".partner__permission");

  return {
    allowedList: vendorsList
      .filter(vendor => vendor.checked === true)
      .map(vendor => vendor.value),

    deniedList: vendorsList
      .filter(vendor => vendor.checked === false)
      .map(vendor => vendor.value)
  };
};

const maxCookieSize = 2500;
const maxCompanyNameLength = 200;

const splitCookies = (permissionsList, type, expiration) => {
  let cookieNumber = 0;
  let newCookie;

  const extractData = arg => {
    newCookie = permissionsList.slice(0, arg);
    permissionsList = permissionsList.slice(arg + 1, permissionsList.length);

    document.cookie = `allowed_${cookieNumber}=${newCookie} ${expiration}`;
    cookieNumber++;
  };

  while (permissionsList.length > maxCookieSize) {
    if (permissionsList.charAt(maxCookieSize) === "-") {
      extractData(maxCookieSize);
    } else {
      for (
        let i = maxCookieSize - 1;
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

  //create last cookie
  document.cookie = `${type}_${cookieNumber}=${permissionsList} ${expiration}`;
};

const setCookies = () => {
  const data = getPermissions();
  let cookieAllowed = data.allowedList.join("-");
  let cookieDenied = data.deniedList.join("-");

  let expiration = getDate();

  document.cookie = "accepted=true" + expiration;

  splitCookies(cookieAllowed, "allowed", expiration);
  splitCookies(cookieDenied, "denied", expiration);
};

const getDate = () => {
  let actualDate = new Date();
  actualDate.setTime(actualDate.getTime() + 24 * 60 * 60 * 1000);

  return `; expires=${actualDate.toGMTString()}`;
};

acceptBtn.addEventListener("click", () => {
  modalOff();

  setCookies();
});

rejectBtn.addEventListener("click", () => {
  modalOff();
  let expiration = getDate();
  document.cookie = "allowed=false" + expiration;
  getDate();
});
