document.addEventListener("DOMContentLoaded", () => {
  const btnModulo1 = document.getElementById("modulo1");
  const btnModulo2 = document.getElementById("modulo2");

  btnModulo1.addEventListener("click", () => {
    window.location.href = "modulo1-mision-interestelar/index.html";
  });

  btnModulo2.addEventListener("click", () => {
    window.location.href = "modulo2-sintaxis-galactica/index.html";
  });
});
