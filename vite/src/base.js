import { login, signup } from "./accounts.js";
import districts from "./districts.json";

const loginForm = document.querySelector(".login");
const loginPopper = document.querySelector(".login-popper");
const loginSubmit = loginForm.querySelector("button");

const signupForm = document.querySelector(".signup");
const signupPopper = document.querySelector(".signup-popper");
const signupSubmit = signupForm.querySelector("button");

const logoutButton = document.querySelector(".logout");

document.querySelector("select").innerHTML = Object.keys(districts).map((key, i) =>
  `<option value="${i}">${key}</option>`
).join('');

if (localStorage.getItem("phone") && localStorage.getItem("phone") != "") {
  document.querySelector(".if-logged").style.display = "flex";
  document.querySelector(".else-logged").style.display = "none";
} else {
  document.querySelector(".else-logged").style.display = "flex";
  document.querySelector(".if-logged").style.display = "none";
}

loginPopper.addEventListener('click', () => {
  signupForm.style.visibility = "hidden";
  signupForm.querySelector(".wrong").style.visibility = "hidden";
  loginForm.style.visibility = "visible";
});

signupPopper.addEventListener('click', () => {
  loginForm.style.visibility = "hidden";
  loginForm.querySelector(".wrong").style.visibility = "hidden";
  signupForm.style.visibility = "visible";
});

window.addEventListener('keydown', e => {
  if (e.key !== "Escape") return;
  loginForm.style.visibility = "hidden";
  loginForm.querySelector(".wrong").style.visibility = "hidden";
  signupForm.style.visibility = "hidden";
  signupForm.querySelector(".wrong").style.visibility = "hidden";
});

loginSubmit.addEventListener('click', async () => {
  const phoneNumberInput = loginForm.querySelector("#phone-number");
  const passwordInput = loginForm.querySelector("#password");

  console.log("Phone Number:", phoneNumberInput.value);
  console.log("Password:", passwordInput.value);

  try {
    const res = await login({
      phone: phoneNumberInput.value,
      password: passwordInput.value,
    });

    console.log(res);

    if (res === -1) {
      loginForm.querySelector(".wrong").style.visibility = "visible";
      return;
    }

    localStorage.setItem("phone", phoneNumberInput.value);
    localStorage.setItem("password", passwordInput.value);

    const userData = await fetch("/userdata/" + phoneNumberInput.value).then(res => res.json());
    localStorage.setItem("district", userData.district);

    window.location.pathname = "/home";
  } catch (error) {
    console.error('Error during login:', error);
    loginForm.querySelector(".wrong").style.visibility = "visible";
  }
});

signupSubmit.addEventListener('click', async () => {
  const phoneNumberInput = signupForm.querySelector("#phone-number");
  const selectInput = signupForm.querySelector("select");
  const passwordInput = signupForm.querySelector("#password");

  try {
    const res = await signup({
      phone: phoneNumberInput.value,
      district: selectInput.value,
      password: passwordInput.value,
    });

    console.log(res);

    // if (res === -1) {
    //   signupForm.querySelector(".wrong").style.visibility = "visible";
    //   return;
    // }

    localStorage.setItem("phone", phoneNumberInput.value);
    localStorage.setItem("password", passwordInput.value);
    localStorage.setItem("district", selectInput.value);

    window.location.pathname = "/home";
  } catch (error) {
    console.error('Error during signup:', error);
    signupForm.querySelector(".wrong").style.visibility = "visible";
  }
});

logoutButton.onclick = () => {
  localStorage.removeItem("phone");
  localStorage.removeItem("district");
  localStorage.removeItem("password");
  window.location.pathname = "/";
}

if (!localStorage.getItem("phone") && window.location.pathname != "/") {
  window.location.pathname = "/";
}
