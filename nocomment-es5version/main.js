"use strict";

var popup = document.querySelector(".popup");
var mainContainer = document.querySelector(".main");
var acceptBtn = document.querySelector(".accept");
var rejectBtn = document.querySelector(".reject");

var modalOn = function modalOn() {
  document.body.classList.add("lockBody");
  mainContainer.style.filter = "blur(3px)";
};

var modalOff = function modalOff() {
  popup.classList.remove("active");
  document.body.classList.remove("lockBody");
  document.body.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
  mainContainer.style.filter = "";
}; //listeners

document.addEventListener("DOMContentLoaded", function() {
  if (document.cookie === "") {
    popup.classList.add("active");
    popup.classList.contains("active") ? modalOn() : null;
  }
});
