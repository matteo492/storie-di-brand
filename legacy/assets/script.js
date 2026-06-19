// Nav: shrink/border on scroll + mobile menu
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const links = document.querySelector(".nav__links");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 30);
});

burger?.addEventListener("click", () => {
  links.classList.toggle("open");
});

links?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => links.classList.remove("open"))
);
