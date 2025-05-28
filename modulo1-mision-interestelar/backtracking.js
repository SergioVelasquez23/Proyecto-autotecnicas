// Lógica del algoritmo de backtracking corregida
console.log("Backtracking corregido cargado.");

let rutaFinal = []; // Ruta final encontrada
let energia = 0;
let visitados = [];

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
  log(`🚀 Iniciando búsqueda desde (${origenX}, ${origenY}) hacia (${universoDatos.destino[1]}, ${universoDatos.destino[0]})`);
  log(`⚡ Energía inicial: ${energia}`);

  const exito = buscarCamino(origenX, origenY, energia, []);

  if (exito) {
    log("🚀 ¡Ruta encontrada!");
    log(`📍 Ruta: ${rutaFinal.map(([x, y]) => `(${x},${y})`).join(' -> ')}`);
    document.getElementById("btn-siguiente").disabled = false;
    simularMovimientoNave(rutaFinal);
  } else {
    log("❌ No se encontró ninguna ruta válida.");
    // Intentar búsqueda con más información de debug
    log("🔍 Iniciando búsqueda con debug...");
    buscarCaminoDebug(origenX, origenY, energia, [], 0);
  }
});

/**
 * Algoritmo recursivo de backtracking corregido
 */
function buscarCamino(x, y, energiaActual, ruta) {
  // Verificar límites de la matriz
  if (x < 0 || y < 0 || y >= matrizEnergia.length || x >= matrizEnergia[0].length) {
    return false;
  }

  // Verificar si ya hemos visitado esta celda en esta ruta
  if (visitados[y][x]) {
    return false;
  }

  // Verificar si es agujero negro
  if (esAgujeroNegro(x, y)) {
    return false;
  }

  // Calcular energía necesaria
  const gastoBase = matrizEnergia[y][x];
  const gastoExtra = energiaExtra(x, y);
  const gastoTotal = gastoBase + gastoExtra;

  // Verificar si tenemos suficiente energía
  if (energiaActual < gastoTotal) {
    return false;
  }

  // Marcar como visitado
  visitados[y][x] = true;
  ruta.push([x, y]);

  // Calcular energía restante después del gasto
  let energiaRestante = energiaActual - gastoTotal;

  // Aplicar zona de recarga (multiplicador)
  const multiplicadorRecarga = obtenerRecarga(x, y);
  if (multiplicadorRecarga > 0) {
    energiaRestante = Math.floor(energiaRestante * multiplicadorRecarga);
  }

  // Verificar si hemos llegado al destino
  const [destY, destX] = universoDatos.destino;
  if (x === destX && y === destY) {
    rutaFinal = [...ruta];
    return true;
  }

  // Probar agujero de gusano primero (puede ser más eficiente)
  const destinoGusano = usarGusano(x, y);
  if (destinoGusano && !visitados[destinoGusano[1]][destinoGusano[0]]) {
    if (buscarCamino(destinoGusano[0], destinoGusano[1], energiaRestante, [...ruta])) {
      return true;
    }
  }

  // Probar portal
  const destinoPortal = usarPortal(x, y);
  if (destinoPortal && !visitados[destinoPortal[1]][destinoPortal[0]]) {
    if (buscarCamino(destinoPortal[0], destinoPortal[1], energiaRestante, [...ruta])) {
      return true;
    }
  }

  // Movimientos normales (arriba, abajo, izquierda, derecha)
  const direcciones = [
    [0, -1], // arriba
    [0, 1],  // abajo
    [-1, 0], // izquierda
    [1, 0]   // derecha
  ];

  for (let [dx, dy] of direcciones) {
    const nuevaX = x + dx;
    const nuevaY = y + dy;
    
    if (buscarCamino(nuevaX, nuevaY, energiaRestante, [...ruta])) {
      return true;
    }
  }

  // Backtrack: desmarcar visitado y quitar de la ruta
  visitados[y][x] = false;
  ruta.pop();

  return false;
}

/**
 * Versión con debug para diagnosticar problemas
 */
function buscarCaminoDebug(x, y, energiaActual, ruta, profundidad) {
  if (profundidad > 10) return false; // Evitar demasiada recursión en debug

  if (x < 0 || y < 0 || y >= matrizEnergia.length || x >= matrizEnergia[0].length) {
    return false;
  }

  if (visitados[y][x]) return false;
  if (esAgujeroNegro(x, y)) return false;

  const gastoBase = matrizEnergia[y][x];
  const gastoExtra = energiaExtra(x, y);
  const gastoTotal = gastoBase + gastoExtra;

  log(`🔍 Explorando (${x},${y}) - Energía: ${energiaActual}, Gasto: ${gastoTotal}`);

  if (energiaActual < gastoTotal) {
    log(`❌ Energía insuficiente en (${x},${y})`);
    return false;
  }

  visitados[y][x] = true;
  ruta.push([x, y]);

  let energiaRestante = energiaActual - gastoTotal;
  const multiplicadorRecarga = obtenerRecarga(x, y);
  if (multiplicadorRecarga > 0) {
    energiaRestante = Math.floor(energiaRestante * multiplicadorRecarga);
    log(`⚡ Recarga en (${x},${y}) - Nueva energía: ${energiaRestante}`);
  }

  const [destY, destX] = universoDatos.destino;
  if (x === destX && y === destY) {
    log(`🎯 ¡Destino alcanzado en (${x},${y})!`);
    rutaFinal = [...ruta];
    return true;
  }

  // Solo probar algunas direcciones en modo debug
  const direcciones = [[1, 0], [0, 1]]; // Solo derecha y abajo para simplificar
  
  for (let [dx, dy] of direcciones) {
    const nuevaX = x + dx;
    const nuevaY = y + dy;
    
    if (buscarCaminoDebug(nuevaX, nuevaY, energiaRestante, [...ruta], profundidad + 1)) {
      return true;
    }
  }

  visitados[y][x] = false;
  ruta.pop();
  return false;
}

// -------------- FUNCIONES AUXILIARES CORREGIDAS -----------------

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
    return [gusano.salida[1], gusano.salida[0]]; // [x, y]
  }
  return null;
}

function usarPortal(x, y) {
  const portal = universoDatos.portales.find(
    (p) => p.desde[0] === y && p.desde[1] === x
  );
  if (portal) {
    return [portal.hasta[1], portal.hasta[0]]; // [x, y]
  }
  return null;
}