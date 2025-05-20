// renderer.js
console.log("Renderer cargado.");
const naveImg = new Image();
const canvas = document.getElementById("canvas-universo");
const ctx = canvas.getContext("2d");

let tamCelda = 25; // Tamaño en píxeles de cada celda

/**
 * Dibuja la matriz del universo con base en los datos cargados
 * @param {number[][]} matriz - Matriz de energía
 * @param {object} universo - JSON con coordenadas especiales
 */
function dibujarMatriz(matriz, universo) {
  const filas = matriz.length;
  const columnas = matriz[0].length;
  canvas.width = columnas * tamCelda;
  canvas.height = filas * tamCelda;

  console.log(`Canvas dimensiones: ${canvas.width}x${canvas.height}`); // Debug
  console.log(`Tamaño de celda: ${tamCelda}`); // Debug

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      let valor = matriz[y][x];
      let tipo = detectarTipoCelda(x, y, universo);

      ctx.fillStyle = obtenerColorPorTipo(tipo, valor);
      ctx.fillRect(x * tamCelda, y * tamCelda, tamCelda, tamCelda);
      ctx.strokeStyle = "#222";
      ctx.strokeRect(x * tamCelda, y * tamCelda, tamCelda, tamCelda);
    }
  }
}

/**
 * Dibuja el camino de la nave paso a paso
 * @param {Array} ruta - Array de coordenadas [[x,y],[x,y],...]
 */
function dibujarRuta(ruta, color = "yellow") {
  ruta.forEach(([x, y], i) => {
    setTimeout(() => {
      ctx.fillStyle = color;
      ctx.fillRect(x * tamCelda + 5, y * tamCelda + 5, tamCelda - 10, tamCelda - 10);
    }, i * 150);
  });
}
/**
 * Simula el movimiento de la nave paso a paso
 * @param {Array} ruta - Lista de [x, y]
 */
function simularMovimientoNave(ruta) {
  console.log("Iniciando simulación de movimiento de la nave", ruta); // Debug
  let i = 0;

  const intervalo = setInterval(() => {
    if (i >= ruta.length) {
      console.log("Simulación completada"); // Debug
      clearInterval(intervalo);
      return;
    }

    // Redibuja el universo
    dibujarMatriz(matrizEnergia, universoDatos);

    const [x, y] = ruta[i];
    console.log(`Dibujando nave en posición: (${x}, ${y})`); // Debug

    // Dibuja la nave con el emoji
    ctx.clearRect(x * tamCelda, y * tamCelda, tamCelda, tamCelda); // Limpia la celda antes de dibujar
    ctx.font = `${tamCelda - 5}px Arial`; // Ajusta el tamaño de la fuente al tamaño de la celda
    ctx.textAlign = "center"; // Centra el emoji horizontalmente
    ctx.textBaseline = "middle"; // Centra el emoji verticalmente
    console.log(`Dibujando emoji en (${x * tamCelda + tamCelda / 2}, ${y * tamCelda + tamCelda / 2})`);
    ctx.fillText("⭐", x * tamCelda + tamCelda / 2, y * tamCelda + tamCelda / 2);

    i++;
  }, 250);
}

/**
 * Dibuja el cohete en una posición específica
 * @param {number} x - Coordenada X de la celda
 * @param {number} y - Coordenada Y de la celda
 */
function dibujarCohete(x, y) {
  ctx.clearRect(x * tamCelda, y * tamCelda, tamCelda, tamCelda); // Limpia la celda antes de dibujar
  ctx.font = `${tamCelda - 5}px Arial`; // Ajusta el tamaño de la fuente al tamaño de la celda
  ctx.textAlign = "center"; // Centra el emoji horizontalmente
  ctx.textBaseline = "middle"; // Centra el emoji verticalmente
  ctx.fillText("🚀", x * tamCelda + tamCelda / 2, y * tamCelda + tamCelda / 2);
}

/**
 * Retorna el tipo de celda según las coordenadas
 */
function detectarTipoCelda(x, y, universo) {
  const match = (list, key = "") =>
    list.some(item => 
      Array.isArray(item) ? item[0] === y && item[1] === x : item[key][0] === y && item[key][1] === x
    );

  if (match(universo.agujerosNegros)) return "agujeroNegro";
  if (match(universo.estrellasGigantes)) return "estrella";
  if (match(universo.portales, "desde")) return "portal";
  if (match(universo.agujerosGusano, "entrada")) return "gusano";
  if (match(universo.zonasRecarga)) return "recarga";
  if (match(universo.celdasCargaRequerida, "coordenada")) return "cargaExtra";
  if (universo.origen[0] === y && universo.origen[1] === x) return "origen";
  if (universo.destino[0] === y && universo.destino[1] === x) return "destino";
  return "normal";
}

/**
 * Devuelve color según tipo de celda
 */
function obtenerColorPorTipo(tipo, valor) {
  switch (tipo) {
    case "agujeroNegro": return "#000";
    case "estrella": return "#f1c40f";
    case "portal": return "#9b59b6";
    case "gusano": return "#1abc9c";
    case "recarga": return "#2ecc71";
    case "cargaExtra": return "#e67e22";
    case "origen": return "#3498db";
    case "destino": return "#e74c3c";
    default:
      return `rgba(255,255,255,${valor / 10})`; // normal con opacidad según gasto
  }
}
