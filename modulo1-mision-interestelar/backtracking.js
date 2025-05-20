// Lógica del algoritmo de backtracking
console.log("Backtracking cargado.");

let rutaFinal = []; // Ruta final encontrada
let energia = 0;
let visitados = [];
let usadoGusano = new Set();
let usadoPortal = new Set();

/**
 * Inicia la simulación de la nave con backtracking
 */
document.getElementById("btn-iniciar").addEventListener("click", () => {
  if (!universoDatos || !matrizEnergia) return;

  energia = universoDatos.cargaInicial;
  visitados = crearMatrizBooleana(
    universoDatos.matriz.filas,
    universoDatos.matriz.columnas
  );
  rutaFinal = [];

  const [origenY, origenX] = universoDatos.origen;
  const exito = buscarCamino(origenX, origenY, energia, []);

  if (exito) {
    log("🚀 ¡Ruta encontrada!");
    document.getElementById("btn-siguiente").disabled = false;
    simularMovimientoNave(rutaFinal);
  } else {
    log("❌ No se encontró ninguna ruta válida.");
  }
});

/**
 * Algoritmo recursivo de backtracking
 */
function buscarCamino(x, y, energiaActual, ruta) {
  // Limites de la matriz
  if (
    x < 0 ||
    y < 0 ||
    y >= matrizEnergia.length ||
    x >= matrizEnergia[0].length
  )
    return false;
  if (visitados[y][x]) return false;

  // Verificar si es agujero negro
  if (esAgujeroNegro(x, y)) return false;

  // Energía necesaria extra
  const extra = energiaExtra(x, y);
  if (energiaActual < extra) return false;

  // Energía al pasar por la celda
  const gasto = matrizEnergia[y][x];
  let energiaRestante = energiaActual - gasto;

  if (energiaRestante < 0) return false;

  // Aplicar zona de recarga
  const recarga = obtenerRecarga(x, y);
  if (recarga > 0) {
    energiaRestante = energiaRestante * recarga;
  }

  ruta.push([x, y]);
  visitados[y][x] = true;

  // Verificar destino
  const [destY, destX] = universoDatos.destino;
  if (x === destX && y === destY) {
    rutaFinal = [...ruta];
    return true;
  }

  // Posibles movimientos (arriba, abajo, izq, der)
  const dirs = [
    [0, -1], // arriba
    [0, 1], // abajo
    [-1, 0], // izquierda
    [1, 0], // derecha
  ];

  for (let [dx, dy] of dirs) {
    if (buscarCamino(x + dx, y + dy, energiaRestante, [...ruta])) return true;
  }

  // Usar agujero de gusano
  const destinoGusano = usarGusano(x, y);
  if (destinoGusano) {
    if (
      buscarCamino(destinoGusano[0], destinoGusano[1], energiaRestante, [
        ...ruta,
      ])
    )
      return true;
  }

  // Usar portal
  const destinoPortal = usarPortal(x, y);
  if (destinoPortal) {
    if (
      buscarCamino(destinoPortal[0], destinoPortal[1], energiaRestante, [
        ...ruta,
      ])
    )
      return true;
  }

  return false;
}

// -------------- FUNCIONES AUXILIARES -----------------

function crearMatrizBooleana(filas, columnas) {
  return Array.from({ length: filas }, () => Array(columnas).fill(false));
}

function esAgujeroNegro(x, y) {
  return universoDatos.agujerosNegros.some(([ay, ax]) => ay === y && ax === x);
}

function energiaExtra(x, y) {
  const celda = universoDatos.celdasCargaRequerida.find(
    (c) => c.coordenada[0] === y && c.coordenada[1] === x
  );
  return celda ? celda.cargaGastada : 0;
}

function obtenerRecarga(x, y) {
  const zona = universoDatos.zonasRecarga.find(
    ([zy, zx]) => zy === y && zx === x
  );
  return zona ? zona[2] : 0;
}

function usarGusano(x, y) {
  const gusano = universoDatos.agujerosGusano.find(
    (g) => g.entrada[0] === y && g.entrada[1] === x
  );
  if (gusano) {
    const key = `${x},${y}`;
    if (!usadoGusano.has(key)) {
      usadoGusano.add(key);
      return [gusano.salida[1], gusano.salida[0]];
    }
  }
  return null;
}

function usarPortal(x, y) {
  const portal = universoDatos.portales.find(
    (p) => p.desde[0] === y && p.desde[1] === x
  );
  if (portal) {
    const key = `${x},${y}`;
    if (!usadoPortal.has(key)) {
      usadoPortal.add(key);
      return [portal.hasta[1], portal.hasta[0]];
    }
  }
  return null;
}
