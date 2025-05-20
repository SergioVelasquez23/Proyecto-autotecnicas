// universo.js
console.log("Universo cargado.");

let universoDatos = null; // Aquí se guardan todos los datos del JSON
let matrizEnergia = null; // Matriz con valores del 1 al 10 (gasto por celda)

/**
 * Carga un archivo .json desde input file
 */
document.getElementById("btn-cargar").addEventListener("click", () => {
  const input = document.getElementById("input-json");
  const archivo = input.files[0];

  if (!archivo) {
    alert("Por favor selecciona un archivo JSON.");
    return;
  }

  const lector = new FileReader();

  lector.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);
      universoDatos = json;
      matrizEnergia = json.matrizInicial;

      dibujarMatriz(matrizEnergia, universoDatos);

      // Dibuja el cohete en la posición inicial
      const [origenY, origenX] = universoDatos.origen;
      dibujarCohete(origenX, origenY);

      document.getElementById("btn-iniciar").disabled = false;

      log("✅ Universo cargado correctamente.");
      document.getElementById("energia-nave").textContent =
        universoDatos.cargaInicial;
    } catch (err) {
      alert("Error al leer el JSON. Asegúrate de que el formato sea válido.");
      console.error(err);
    }
  };

  lector.readAsText(archivo);
});

/**
 * Escribe un mensaje en la consola de interfaz
 */
function log(mensaje) {
  const logDiv = document.getElementById("log");
  const p = document.createElement("p");
  p.textContent = mensaje;
  logDiv.appendChild(p);
}
