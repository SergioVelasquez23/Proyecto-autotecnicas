// Lógica del algoritmo de backtracking completo
console.log("Backtracking completo cargado.");

let rutaFinal = []; // Ruta final encontrada
let energia = 0;
let visitados = [];
let contadorLlamadas = 0;
let agujerosNegrosDestruidos = []; // Para tracking de agujeros negros destruidos
let agujerosGusanoUsados = []; // Para tracking de gusanos ya usados
let estrellasProcesadas = []; // Para evitar usar la misma estrella múltiples veces


document.getElementById("btn-iniciar").addEventListener("click", () => {
  if (!universoDatos || !matrizEnergia) return;

  // Reiniciar todas las variables de estado
  energia = universoDatos.cargaInicial;
  visitados = crearMatrizBooleana(
    universoDatos.matriz.filas,
    universoDatos.matriz.columnas
  );
  rutaFinal = [];
  contadorLlamadas = 0;
  agujerosNegrosDestruidos = [];
  agujerosGusanoUsados = [];
  estrellasProcesadas = [];

  const [origenY, origenX] = universoDatos.origen;
  const [destinoY, destinoX] = universoDatos.destino;
  
  log(`🚀 Iniciando búsqueda desde (${origenX}, ${origenY}) hacia (${destinoX}, ${destinoY})`);
  log(`⚡ Energía inicial: ${energia}`);
  log(`🌌 Tamaño del universo: ${universoDatos.matriz.filas} x ${universoDatos.matriz.columnas}`);
  
  // Mostrar información del universo
  mostrarInfoUniverso();

  const exito = buscarCamino(origenX, origenY, energia, [], new Set());

  if (exito) {
    log("🚀 ¡Ruta encontrada!");
    log(`📍 Ruta completa: ${rutaFinal.map(([x, y]) => `(${x},${y})`).join(' → ')}`);
    log(`📊 Total de pasos: ${rutaFinal.length}`);
    document.getElementById("btn-siguiente").disabled = false;
    setTimeout(() => simularMovimientoNave(rutaFinal), 500);
  } else {
    log("❌ No se encontró ninguna ruta válida.");
    log(`🔢 Total de llamadas realizadas: ${contadorLlamadas}`);
    mostrarEstrategiaAlternativa();
  }
});


function mostrarInfoUniverso() {
  log(`🕳️ Agujeros negros: ${universoDatos.agujerosNegros.length}`);
  log(`⭐ Estrellas gigantes: ${universoDatos.estrellasGigantes.length}`);
  log(`🌀 Agujeros de gusano: ${universoDatos.agujerosGusano.length}`);
  log(`🚪 Portales: ${universoDatos.portales.length}`);
  log(`⚡ Zonas de recarga: ${universoDatos.zonasRecarga.length}`);
  log(`🔋 Celdas con carga extra requerida: ${universoDatos.celdasCargaRequerida.length}`);
}


function buscarCamino(x, y, energiaActual, ruta, visitadosEnRuta) {
  contadorLlamadas++;
  
  // Evitar bucles infinitos
  if (contadorLlamadas > 50000) {
    log("⚠️ Límite de llamadas alcanzado. Optimizando búsqueda...");
    return false;
  }

  // Verificar límites de la matriz
  if (x < 0 || y < 0 || y >= matrizEnergia.length || x >= matrizEnergia[0].length) {
    return false;
  }

  // Crear clave única para esta posición
  const posicionKey = `${x},${y}`;
  
  // Verificar si ya visitamos esta posición en esta ruta específica
  if (visitadosEnRuta.has(posicionKey)) {
    return false;
  }

  // Verificar si es agujero negro (y no ha sido destruido)
  if (esAgujeroNegroActivo(x, y)) {
    // Intentar destruir con estrella gigante adyacente
    if (intentarDestruirAgujeroNegro(x, y)) {
      log(`💥 Agujero negro en (${x},${y}) destruido por estrella gigante!`);
    } else {
      return false; // No se puede pasar
    }
  }

  // Verificar si hemos llegado al destino
  const [destY, destX] = universoDatos.destino;
  if (x === destX && y === destY) {
    ruta.push([x, y]);
    rutaFinal = [...ruta];
    log(`🎯 ¡Destino alcanzado en (${x},${y})!`);
    return true;
  }

  // Calcular energía necesaria
  const gastoBase = matrizEnergia[y][x];
  const gastoExtra = energiaExtra(x, y);
  const gastoTotal = gastoBase + gastoExtra;

  // Verificar si tenemos suficiente energía
  if (energiaActual < gastoTotal) {
    return false;
  }

  // Verificar carga mínima requerida
  if (!cumpleCargaMinima(x, y, energiaActual)) {
    return false;
  }

  // Crear nuevos conjuntos para esta rama de búsqueda
  const nuevosVisitados = new Set(visitadosEnRuta);
  nuevosVisitados.add(posicionKey);
  
  // Agregar a la ruta
  const nuevaRuta = [...ruta, [x, y]];

  // Calcular energía restante después del gasto
  let energiaRestante = energiaActual - gastoTotal;

  // Aplicar zona de recarga
  const multiplicadorRecarga = obtenerRecarga(x, y);
  if (multiplicadorRecarga > 1) {
    const energiaAnterior = energiaRestante;
    energiaRestante = Math.floor(energiaRestante * multiplicadorRecarga);
    log(`⚡ Recarga en (${x},${y}): ${energiaAnterior} → ${energiaRestante}`);
  }

  // Probar agujero de gusano (consumible, una sola vez)
  const destinoGusano = usarGusano(x, y);
  if (destinoGusano && !nuevosVisitados.has(`${destinoGusano[0]},${destinoGusano[1]}`)) {
    log(`🌀 Usando agujero de gusano: (${x},${y}) → (${destinoGusano[0]},${destinoGusano[1]})`);
    if (buscarCamino(destinoGusano[0], destinoGusano[1], energiaRestante, nuevaRuta, nuevosVisitados)) {
      return true;
    }
  }

  // Probar portal
  const destinoPortal = usarPortal(x, y);
  if (destinoPortal && !nuevosVisitados.has(`${destinoPortal[0]},${destinoPortal[1]}`)) {
    log(`🚪 Usando portal: (${x},${y}) → (${destinoPortal[0]},${destinoPortal[1]})`);
    if (buscarCamino(destinoPortal[0], destinoPortal[1], energiaRestante, nuevaRuta, nuevosVisitados)) {
      return true;
    }
  }

  // Movimientos normales ordenados por proximidad al destino
  const direcciones = obtenerDireccionesOrdenadas(x, y, destX, destY);

  for (let [dx, dy] of direcciones) {
    const nuevaX = x + dx;
    const nuevaY = y + dy;
    
    if (buscarCamino(nuevaX, nuevaY, energiaRestante, nuevaRuta, nuevosVisitados)) {
      return true;
    }
  }

  return false;
}


function esAgujeroNegroActivo(x, y) {
  const esAgujeroNegro = universoDatos.agujerosNegros.some(([ay, ax]) => ay === y && ax === x);
  if (!esAgujeroNegro) return false;
  
  const estaDestruido = agujerosNegrosDestruidos.some(([dx, dy]) => dx === x && dy === y);
  return !estaDestruido;
}

/**
 * Intenta destruir un agujero negro usando una estrella gigante adyacente
 */
function intentarDestruirAgujeroNegro(x, y) {
  const direccionesAdyacentes = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (let [dx, dy] of direccionesAdyacentes) {
    const estrellaX = x + dx;
    const estrellaY = y + dy;
    
    // Verificar si hay una estrella gigante adyacente
    const hayEstrella = universoDatos.estrellasGigantes.some(([ey, ex]) => 
      ey === estrellaY && ex === estrellaX
    );
    
    if (hayEstrella) {
      const estrellaKey = `${estrellaX},${estrellaY}`;
      
      // Verificar si esta estrella ya fue usada
      if (!estrellasProcesadas.includes(estrellaKey)) {
        agujerosNegrosDestruidos.push([x, y]);
        estrellasProcesadas.push(estrellaKey);
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Verifica si se cumple la carga mínima requerida para entrar a una celda
 */
function cumpleCargaMinima(x, y, energiaActual) {
  const celda = universoDatos.celdasCargaRequerida.find(
    (c) => c.coordenada[0] === y && c.coordenada[1] === x
  );
  
  if (celda && celda.cargaMinima) {
    return energiaActual >= celda.cargaMinima;
  }
  
  return true; // No hay restricción de carga mínima
}

/**
 * Ordena las direcciones por proximidad al destino (heurística A*)
 */
function obtenerDireccionesOrdenadas(x, y, destX, destY) {
  const direcciones = [
    [0, -1], // arriba
    [0, 1],  // abajo
    [-1, 0], // izquierda
    [1, 0]   // derecha
  ];

  return direcciones
    .map(([dx, dy]) => {
      const nuevaX = x + dx;
      const nuevaY = y + dy;
      const distancia = Math.abs(nuevaX - destX) + Math.abs(nuevaY - destY);
      return { direccion: [dx, dy], distancia };
    })
    .sort((a, b) => a.distancia - b.distancia)
    .map(item => item.direccion);
}

/**
 * Muestra estrategias alternativas cuando no se encuentra solución
 */
function mostrarEstrategiaAlternativa() {
  log("💡 Sugerencias para encontrar una ruta:");
  log("• Verificar que hay suficiente energía inicial");
  log("• Usar estrellas gigantes para destruir agujeros negros");
  log("• Aprovechar zonas de recarga estratégicamente");
  log("• Utilizar agujeros de gusano para saltos largos");
}

// -------------- FUNCIONES AUXILIARES -----------------

function crearMatrizBooleana(filas, columnas) {
  return Array.from({ length: filas }, () => Array(columnas).fill(false));
}

function energiaExtra(x, y) {
  const celda = universoDatos.celdasCargaRequerida.find(
    (c) => c.coordenada[0] === y && c.coordenada[1] === x
  );
  return celda ? (celda.cargaGastada || 0) : 0;
}

function obtenerRecarga(x, y) {
  const zona = universoDatos.zonasRecarga.find(
    ([zy, zx, multiplicador]) => zy === y && zx === x
  );
  return zona ? zona[2] : 1;
}

function usarGusano(x, y) {
  const gusano = universoDatos.agujerosGusano.find(
    (g) => g.entrada[0] === y && g.entrada[1] === x
  );
  
  if (gusano) {
    const gusanoKey = `${x},${y}`;
    // Verificar si ya fue usado (se consumen al usarse)
    if (!agujerosGusanoUsados.includes(gusanoKey)) {
      agujerosGusanoUsados.push(gusanoKey);
      return [gusano.salida[1], gusano.salida[0]]; // [x, y]
    }
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