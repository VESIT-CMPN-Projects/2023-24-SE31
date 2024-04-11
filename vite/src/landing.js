let loginForm = document.querySelector(".login");
let loginPopper1 = document.querySelector(".landing-login-popper-1");
let loginPopper2 = document.querySelector(".landing-login-popper-2");

let signupForm = document.querySelector(".signup");
let signupPopper1 = document.querySelector(".landing-signup-popper-1");
let signupPopper2 = document.querySelector(".landing-signup-popper-2");

loginPopper1.onclick = loginPopper2.onclick = () => {
  loginForm.style.visibility = "visible";
}

signupPopper1.onclick = signupPopper2.onclick = () => {
  signupForm.style.visibility = "visible";
}

if (localStorage.getItem("phone") && localStorage.getItem("phone") != "") {
  window.location.pathname = "/home";
}
