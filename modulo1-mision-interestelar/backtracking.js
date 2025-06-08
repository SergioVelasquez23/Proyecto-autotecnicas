console.log("Backtracking mejorado cargado.");

let rutaFinal = [];
let energia = 0;
let visitados = [];
let contadorLlamadas = 0;
let agujerosNegrosDestruidos = [];
let agujerosGusanoUsados = [];
let estrellasProcesadas = [];

document.getElementById("btn-iniciar").addEventListener("click", () => {
  // Limpiar el área de mensajes al inicio
  const logContainer = document.getElementById("log");
  if (logContainer) {
    logContainer.innerHTML = "";
  }

  if (!universoDatos || !matrizEnergia) {
    log("❌ Error: Datos del universo no cargados");
    return;
  }

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
  
  mostrarInfoUniverso();

  let exito = false;
  
  try {
    // Evaluar necesidad de recarga
    const necesitaRecarga = evaluarNecesidadRecarga(origenX, origenY, destinoX, destinoY, energia);
    
    if (necesitaRecarga) {
      log("🔋 Energía insuficiente detectada. Buscando ruta con recarga estratégica...");
      exito = buscarCaminoConRecarga(origenX, origenY, destinoX, destinoY, energia);
    } else {
      log("⚡ Energía suficiente. Buscando ruta directa...");
      exito = buscarCamino(origenX, origenY, energia, []);
    }

    // Mostrar resultado
    if (exito && rutaFinal && rutaFinal.length > 0) {
      log("🎉 ¡RUTA ENCONTRADA!");
      log(`📍 Ruta completa: ${rutaFinal.map(([x, y]) => `(${x},${y})`).join(' → ')}`);
      log(`📊 Total de pasos: ${rutaFinal.length}`);
      log(`🔢 Llamadas realizadas: ${contadorLlamadas}`);
      
      // Habilitar botón siguiente
      const btnSiguiente = document.getElementById("btn-siguiente");
      if (btnSiguiente) {
        btnSiguiente.disabled = false;
      }
      
      // Validar y simular
      if (validarRuta(rutaFinal)) {
        setTimeout(() => {
          if (typeof simularMovimientoNave === 'function') {
            simularMovimientoNave(rutaFinal);
          } else {
            log("⚠️ Función simularMovimientoNave no encontrada");
          }
        }, 500);
      }
    } else {
      log("❌ NO SE ENCONTRÓ NINGUNA RUTA VÁLIDA");
      log(`🔢 Total de llamadas realizadas: ${contadorLlamadas}`);
      mostrarEstrategiaAlternativa();
      
      // Mostrar información adicional para debugging
      log("🔍 INFORMACIÓN DE DEBUG:");
      log(`- Origen: (${origenX}, ${origenY})`);
      log(`- Destino: (${destinoX}, ${destinoY})`);
      log(`- Energía inicial: ${energia}`);
      log(`- Matriz de energía dimensiones: ${matrizEnergia.length}x${matrizEnergia[0]?.length}`);
      
      rutaFinal = [];
    }
  } catch (error) {
    log(`❌ Error durante la búsqueda: ${error.message}`);
    console.error("Error completo:", error);
    rutaFinal = [];
  }
});


function log(mensaje) {
  console.log(mensaje);
  
  // Intentar mostrar en el contenedor de logs
  let logContainer = document.getElementById("log");
  
  // Si no existe, intentar crearlo o buscar alternativas
  if (!logContainer) {
    logContainer = document.querySelector(".log") || 
                   document.querySelector("#output") ||
                   document.querySelector(".output") ||
                   document.querySelector("#resultado");
    
    // Si aún no existe, crear uno básico
    if (!logContainer) {
      logContainer = document.createElement("div");
      logContainer.id = "log";
      logContainer.style.cssText = `
        border: 1px solid #ccc;
        padding: 10px;
        margin: 10px 0;
        background: #f9f9f9;
        font-family: monospace;
        max-height: 300px;
        overflow-y: auto;
      `;
      
      // Intentar agregarlo después del botón iniciar
      const btnIniciar = document.getElementById("btn-iniciar");
      if (btnIniciar && btnIniciar.parentNode) {
        btnIniciar.parentNode.insertBefore(logContainer, btnIniciar.nextSibling);
      } else {
        document.body.appendChild(logContainer);
      }
    }
  }
  
  if (logContainer) {
    const p = document.createElement("p");
    p.textContent = mensaje;
    p.style.margin = "2px 0";
    logContainer.appendChild(p);
    logContainer.scrollTop = logContainer.scrollHeight;
  }
}


function buscarCamino(x, y, energiaActual, ruta, visitados = new Set()) {
  contadorLlamadas++;
  
  // Prevenir bucles infinitos
  if (contadorLlamadas > 10000) {
    log("⚠️ Límite de llamadas alcanzado");
    return false;
  }

  // Verificar límites
  if (x < 0 || y < 0 || y >= matrizEnergia.length || x >= matrizEnergia[0].length) {
    return false;
  }

  const [destinoY, destinoX] = universoDatos.destino;
  const posicionKey = `${x},${y}`;
  
  // Verificar si ya visitamos esta posición
  if (visitados.has(posicionKey)) {
    return false;
  }

  // Agregar posición actual a la ruta
  const nuevaRuta = [...ruta, [x, y]];
  
  // ¡VERIFICAR DESTINO PRIMERO!
  if (x === destinoX && y === destinoY) {
    rutaFinal = [...nuevaRuta];
    log(`🎯 ¡Destino alcanzado en (${x},${y})!`);
    return true;
  }

  // Verificar agujero negro
  if (esAgujeroNegroActivo(x, y)) {
    if (!intentarDestruirAgujeroNegro(x, y)) {
      return false;
    }
  }

  // Calcular gasto de energía
  const gastoBase = matrizEnergia[y][x];
  const gastoExtra = energiaExtra(x, y);
  const gastoTotal = gastoBase + gastoExtra;

  // Verificar energía suficiente
  if (energiaActual < gastoTotal) {
    return false;
  }

  // Verificar carga mínima
  if (!cumpleCargaMinima(x, y, energiaActual)) {
    return false;
  }

  // Marcar como visitado
  const nuevosVisitados = new Set(visitados);
  nuevosVisitados.add(posicionKey);

  // Calcular energía restante
  let energiaRestante = energiaActual - gastoTotal;

  // Aplicar recarga si existe
  const multiplicadorRecarga = obtenerRecarga(x, y);
  if (multiplicadorRecarga > 1) {
    const energiaAnterior = energiaRestante;
    energiaRestante = Math.floor(energiaRestante * multiplicadorRecarga);
    log(`⚡ Recarga en (${x},${y}): ${energiaAnterior} → ${energiaRestante}`);
  }

  // Probar teletransportes
  const destinoGusano = usarGusano(x, y);
  if (destinoGusano && !nuevosVisitados.has(`${destinoGusano[0]},${destinoGusano[1]}`)) {
    log(`🌀 Gusano: (${x},${y}) → (${destinoGusano[0]},${destinoGusano[1]})`);
    if (buscarCamino(destinoGusano[0], destinoGusano[1], energiaRestante, nuevaRuta, nuevosVisitados)) {
      return true;
    }
  }

  const destinoPortal = usarPortal(x, y);
  if (destinoPortal && !nuevosVisitados.has(`${destinoPortal[0]},${destinoPortal[1]}`)) {
    log(`🚪 Portal: (${x},${y}) → (${destinoPortal[0]},${destinoPortal[1]})`);
    if (buscarCamino(destinoPortal[0], destinoPortal[1], energiaRestante, nuevaRuta, nuevosVisitados)) {
      return true;
    }
  }

  // Movimientos normales (ordenados por heurística)
  const direcciones = obtenerDireccionesOrdenadas(x, y, destinoX, destinoY);

  for (let [dx, dy] of direcciones) {
    const nuevaX = x + dx;
    const nuevaY = y + dy;
    
    if (buscarCamino(nuevaX, nuevaY, energiaRestante, nuevaRuta, nuevosVisitados)) {
      return true;
    }
  }

  return false;
}


function buscarCaminoConRecarga(origenX, origenY, destinoX, destinoY, energiaInicial) {
  const mejorEstacion = encontrarMejorEstacionRecarga(origenX, origenY, destinoX, destinoY, energiaInicial);
  
  if (!mejorEstacion) {
    log("🔋 No se encontró estación de recarga accesible");
    return buscarCamino(origenX, origenY, energiaInicial, []);
  }

  log(`🎯 Estación objetivo: (${mejorEstacion.x}, ${mejorEstacion.y}) - Mult: ${mejorEstacion.multiplicador}`);
  
  // Reiniciar estado para búsqueda a estación
  agujerosGusanoUsados = [];
  estrellasProcesadas = [];
  contadorLlamadas = 0;
  
  // Buscar ruta a la estación
  if (buscarCamino(origenX, origenY, energiaInicial, [])) {
    const rutaAEstacion = [...rutaFinal];
    log(`✅ Ruta a estación: ${rutaAEstacion.map(([x, y]) => `(${x},${y})`).join(' → ')}`);
    
    // Calcular energía en la estación
    let energiaEnEstacion = energiaInicial;
    for (let i = 1; i < rutaAEstacion.length; i++) {
      const [x, y] = rutaAEstacion[i];
      energiaEnEstacion -= (matrizEnergia[y][x] + energiaExtra(x, y));
    }
    
    // Aplicar recarga
    energiaEnEstacion = Math.floor(energiaEnEstacion * mejorEstacion.multiplicador);
    log(`⚡ Energía después de recarga: ${energiaEnEstacion}`);
    
    // Reiniciar para segunda búsqueda
    rutaFinal = [];
    agujerosGusanoUsados = [];
    const visitadosEstacion = new Set();
    rutaAEstacion.forEach(([x, y]) => visitadosEstacion.add(`${x},${y}`));
    
    // Buscar desde estación a destino
    if (buscarCamino(mejorEstacion.x, mejorEstacion.y, energiaEnEstacion, rutaAEstacion, visitadosEstacion)) {
      log("✅ Ruta completa con recarga encontrada");
      return true;
    }
  }
  
  log("❌ Estrategia de recarga falló");
  return false;
}

// Resto de funciones auxiliares (sin cambios significativos)...

function validarRuta(ruta) {
  if (!ruta || ruta.length === 0) {
    log("❌ Validación: Ruta vacía");
    return false;
  }

  const [origenY, origenX] = universoDatos.origen;
  const [destinoY, destinoX] = universoDatos.destino;

  const [inicioX, inicioY] = ruta[0];
  if (inicioX !== origenX || inicioY !== origenY) {
    log(`❌ Validación: Inicio incorrecto. Esperado: (${origenX},${origenY}), Actual: (${inicioX},${inicioY})`);
    return false;
  }

  const [finX, finY] = ruta[ruta.length - 1];
  if (finX !== destinoX || finY !== destinoY) {
    log(`❌ Validación: Final incorrecto. Esperado: (${destinoX},${destinoY}), Actual: (${finX},${finY})`);
    return false;
  }

  log("✅ Validación: Ruta válida");
  return true;
}

function evaluarNecesidadRecarga(origenX, origenY, destinoX, destinoY, energiaInicial) {
  const distanciaMinima = Math.abs(destinoX - origenX) + Math.abs(destinoY - origenY);
  
  let costoPromedio = 0;
  let totalCeldas = 0;
  
  for (let y = 0; y < matrizEnergia.length; y++) {
    for (let x = 0; x < matrizEnergia[0].length; x++) {
      costoPromedio += matrizEnergia[y][x];
      totalCeldas++;
    }
  }
  costoPromedio = Math.ceil(costoPromedio / totalCeldas);
  
  const energiaEstimada = distanciaMinima * costoPromedio * 1.2;
  
  log(`📏 Distancia mínima: ${distanciaMinima}`);
  log(`💰 Costo promedio: ${costoPromedio}`);
  log(`⚡ Energía estimada: ${energiaEstimada}`);
  
  return energiaInicial < energiaEstimada;
}

function encontrarMejorEstacionRecarga(origenX, origenY, destinoX, destinoY, energiaInicial) {
  if (!universoDatos.zonasRecarga || universoDatos.zonasRecarga.length === 0) {
    return null;
  }
  
  let mejorEstacion = null;
  let mejorPuntuacion = -1;
  
  for (let [y, x, multiplicador] of universoDatos.zonasRecarga) {
    const distanciaAEstacion = Math.abs(x - origenX) + Math.abs(y - origenY);
    const distanciaADestino = Math.abs(destinoX - x) + Math.abs(destinoY - y);
    
    const energiaEstimada = distanciaAEstacion * 3;
    if (energiaEstimada > energiaInicial) continue;
    
    const puntuacion = multiplicador * 100 + (1000 / (distanciaAEstacion + distanciaADestino + 1));
    
    if (puntuacion > mejorPuntuacion) {
      mejorPuntuacion = puntuacion;
      mejorEstacion = { x, y, multiplicador };
    }
  }
  
  return mejorEstacion;
}

function mostrarInfoUniverso() {
  log(`🕳️ Agujeros negros: ${universoDatos.agujerosNegros?.length || 0}`);
  log(`⭐ Estrellas gigantes: ${universoDatos.estrellasGigantes?.length || 0}`);
  log(`🌀 Agujeros de gusano: ${universoDatos.agujerosGusano?.length || 0}`);
  log(`🚪 Portales: ${universoDatos.portales?.length || 0}`);
  log(`⚡ Zonas de recarga: ${universoDatos.zonasRecarga?.length || 0}`);
  log(`🔋 Celdas con carga extra: ${universoDatos.celdasCargaRequerida?.length || 0}`);
}

function mostrarEstrategiaAlternativa() {
  log("💡 SUGERENCIAS PARA ENCONTRAR RUTA:");
  log("• Verificar energía inicial suficiente");
  log("• Usar estrellas para destruir agujeros negros");
  log("• Aprovechar zonas de recarga");
  log("• Utilizar gusanos y portales");
  log("• Verificar que origen y destino sean válidos");
}

// Funciones auxiliares
function crearMatrizBooleana(filas, columnas) {
  return Array.from({ length: filas }, () => Array(columnas).fill(false));
}

function energiaExtra(x, y) {
  const celda = universoDatos.celdasCargaRequerida?.find(
    (c) => c.coordenada[0] === y && c.coordenada[1] === x
  );
  return celda ? (celda.cargaGastada || 0) : 0;
}

function obtenerRecarga(x, y) {
  const zona = universoDatos.zonasRecarga?.find(
    ([zy, zx]) => zy === y && zx === x
  );
  return zona ? zona[2] : 1;
}

function usarGusano(x, y) {
  const gusano = universoDatos.agujerosGusano?.find(
    (g) => g.entrada[0] === y && g.entrada[1] === x
  );
  
  if (gusano) {
    const gusanoKey = `${x},${y}`;
    if (!agujerosGusanoUsados.includes(gusanoKey)) {
      agujerosGusanoUsados.push(gusanoKey);
      return [gusano.salida[1], gusano.salida[0]];
    }
  }
  return null;
}

function usarPortal(x, y) {
  const portal = universoDatos.portales?.find(
    (p) => p.desde[0] === y && p.desde[1] === x
  );
  return portal ? [portal.hasta[1], portal.hasta[0]] : null;
}

function esAgujeroNegroActivo(x, y) {
  const esAgujeroNegro = universoDatos.agujerosNegros?.some(([ay, ax]) => ay === y && ax === x);
  if (!esAgujeroNegro) return false;
  
  return !agujerosNegrosDestruidos.some(([dx, dy]) => dx === x && dy === y);
}

function intentarDestruirAgujeroNegro(x, y) {
  const direcciones = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (let [dx, dy] of direcciones) {
    const estrellaX = x + dx;
    const estrellaY = y + dy;
    
    const hayEstrella = universoDatos.estrellasGigantes?.some(([ey, ex]) => 
      ey === estrellaY && ex === estrellaX
    );
    
    if (hayEstrella) {
      const estrellaKey = `${estrellaX},${estrellaY}`;
      if (!estrellasProcesadas.includes(estrellaKey)) {
        agujerosNegrosDestruidos.push([x, y]);
        estrellasProcesadas.push(estrellaKey);
        log(`💥 Agujero negro destruido en (${x},${y})`);
        return true;
      }
    }
  }
  
  return false;
}

function cumpleCargaMinima(x, y, energiaActual) {
  const celda = universoDatos.celdasCargaRequerida?.find(
    (c) => c.coordenada[0] === y && c.coordenada[1] === x
  );
  
  return !celda || !celda.cargaMinima || energiaActual >= celda.cargaMinima;
}

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