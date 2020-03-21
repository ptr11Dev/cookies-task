//variables
const popup = document.querySelector(".popup");
const mainContainer = document.querySelector(".main");
const acceptBtn = document.querySelector(".accept");
const rejectBtn = document.querySelector(".reject");

//functions

const modalOn = () => {
  document.body.classList.add("lockBody");
  mainContainer.style.filter = "blur(3px)";
};

const modalOff = () => {
  popup.classList.remove("active");

  document.body.classList.remove("lockBody");
  document.body.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
  mainContainer.style.filter = "";
};

//listeners
document.addEventListener("DOMContentLoaded", () => {
  if (document.cookie === "") {
    popup.classList.add("active");

    popup.classList.contains("active") ? modalOn() : null;
  }
});
