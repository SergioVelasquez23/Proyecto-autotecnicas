console.log("Renderer corregido cargado.");

const canvas = document.getElementById("canvas-universo");
const ctx = canvas.getContext("2d");
let tamCelda = 30; 

/**
 * Dibuja la matriz 
 */
function dibujarMatriz(matriz, universo) {
  const filas = matriz.length;
  const columnas = matriz[0].length;
  canvas.width = columnas * tamCelda;
  canvas.height = filas * tamCelda;

  console.log(`Canvas dimensiones: ${canvas.width}x${canvas.height}`);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar celdas base
  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      let valor = matriz[y][x];
      let tipo = detectarTipoCelda(x, y, universo);

      // Fondo de la celda
      ctx.fillStyle = obtenerColorFondo(tipo, valor);
      ctx.fillRect(x * tamCelda, y * tamCelda, tamCelda, tamCelda);
      
      // Borde de la celda
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.strokeRect(x * tamCelda, y * tamCelda, tamCelda, tamCelda);

      // Dibujar ícono
      dibujarIcono(ctx, x, y, tipo, valor);
    }
  }
}

/**
 * Dibuja el ícono 
 */
function dibujarIcono(ctx, x, y, tipo, valor) {
  const centroX = x * tamCelda + tamCelda / 2;
  const centroY = y * tamCelda + tamCelda / 2;
  
  ctx.font = `${tamCelda - 8}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  switch (tipo) {
    case "agujeroNegro":
      ctx.fillStyle = "#ffffff";
      ctx.fillText("🕳️", centroX, centroY);
      break;
    case "estrella":
      ctx.fillStyle = "#ffeb3b";
      ctx.fillText("⭐", centroX, centroY);
      break;
    case "portal":
      ctx.fillStyle = "#9c27b0";
      ctx.fillText("🚪", centroX, centroY);
      break;
    case "gusano":
      ctx.fillStyle = "#2196f3";
      ctx.fillText("🌀", centroX, centroY);
      break;
    case "recarga":
      ctx.fillStyle = "#4caf50";
      ctx.fillText("⚡", centroX, centroY);
      break;
    case "cargaExtra":
      ctx.fillStyle = "#ff9800";
      ctx.fillText("🔋", centroX, centroY);
      break;
    case "origen":
      ctx.fillStyle = "#00bcd4";
      ctx.fillText("🏠", centroX, centroY);
      break;
    case "destino":
      ctx.fillStyle = "#f44336";
      ctx.fillText("🎯", centroX, centroY);
      break;
    default:
      // Mostrar valor de energía para celdas normales
      if (valor > 5) {
        ctx.fillStyle = "#ff6b6b";
        ctx.font = `${tamCelda - 14}px Arial`;
        ctx.fillText(valor.toString(), centroX, centroY);
      } else if (valor > 3) {
        ctx.fillStyle = "#feca57";
        ctx.font = `${tamCelda - 14}px Arial`;
        ctx.fillText(valor.toString(), centroX, centroY);
      } else {
        ctx.fillStyle = "#48dbfb";
        ctx.font = `${tamCelda - 14}px Arial`;
        ctx.fillText(valor.toString(), centroX, centroY);
      }
      break;
  }
}

/**
 * Simula el movimiento de la nave 
 */
function simularMovimientoNave(ruta) {
  console.log("🚀 Iniciando simulación de movimiento de la nave", ruta);
  
  // Validar que la ruta existe y tiene contenido
  if (!ruta || ruta.length === 0) {
    console.error("❌ Ruta vacía o undefined");
    return;
  }

  let pasoActual = 0;
  let energiaActual = universoDatos.cargaInicial;

  // Actualizar UI inicial
  document.getElementById("energia-nave").textContent = energiaActual;
  console.log(`⚡ Energía inicial: ${energiaActual}`);

  // Función para dibujar un frame de la animación
  function dibujarFrame() {
    // Limpiar y redibujar el universo base
    dibujarMatriz(matrizEnergia, universoDatos);

    // Dibujar el camino recorrido hasta ahora
    if (pasoActual > 0) {
      dibujarCaminoRecorrido(ruta, pasoActual);
    }

    // Dibujar la nave en la posición actual
    const [x, y] = ruta[pasoActual];
    dibujarNaveAnimada(x, y, pasoActual);

    console.log(`📍 Paso ${pasoActual + 1}/${ruta.length}: Nave en (${x}, ${y})`);
  }

  // Función para avanzar al siguiente paso
  function siguientePaso() {
    if (pasoActual >= ruta.length - 1) {
      console.log("✅ Simulación completada");
      log("🎯 ¡Nave llegó al destino!");
      return; // Terminar animación
    }

    pasoActual++;
    const [x, y] = ruta[pasoActual];

    // Calcular gasto de energía (solo después del primer paso)
    const gastoBase = matrizEnergia[y][x];
    const gastoExtra = energiaExtra(x, y);
    const gastoTotal = gastoBase + gastoExtra;
    energiaActual -= gastoTotal;

    console.log(`💰 Gasto en (${x},${y}): ${gastoTotal} (base: ${gastoBase}, extra: ${gastoExtra})`);

    // Aplicar recarga si está disponible
    const multiplicadorRecarga = obtenerRecarga(x, y);
    if (multiplicadorRecarga > 1) {
      const energiaAnterior = energiaActual;
      energiaActual = Math.floor(energiaActual * multiplicadorRecarga);
      console.log(`⚡ Recarga aplicada: ${energiaAnterior} → ${energiaActual} (x${multiplicadorRecarga})`);
      log(`⚡ Energía recargada en (${x},${y}): x${multiplicadorRecarga}`);
    }

    // Actualizar UI
    document.getElementById("energia-nave").textContent = energiaActual;

    // Dibujar frame actual
    dibujarFrame();

    // Programar siguiente paso
    setTimeout(siguientePaso, 1000); // 1 segundo entre pasos
  }

  // Iniciar animación
  dibujarFrame(); // Dibujar posición inicial
  setTimeout(siguientePaso, 1000); // Comenzar movimiento después de 1 segundo
}

/**
 * Dibuja el camino 
 */
function dibujarCaminoRecorrido(ruta, pasoActual) {
  if (pasoActual < 1) return;

  ctx.save(); // Guardar estado del contexto
  
  // Configurar línea del camino
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 4]);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Dibujar líneas conectando los puntos
  for (let i = 0; i < pasoActual; i++) {
    const [x1, y1] = ruta[i];
    const [x2, y2] = ruta[i + 1];
    
    const centroX1 = x1 * tamCelda + tamCelda / 2;
    const centroY1 = y1 * tamCelda + tamCelda / 2;
    const centroX2 = x2 * tamCelda + tamCelda / 2;
    const centroY2 = y2 * tamCelda + tamCelda / 2;
    
    ctx.beginPath();
    ctx.moveTo(centroX1, centroY1);
    ctx.lineTo(centroX2, centroY2);
    ctx.stroke();
  }

  // Marcar puntos visitados
  ctx.fillStyle = "#00ff0080"; // Verde semitransparente
  for (let i = 0; i < pasoActual; i++) {
    const [x, y] = ruta[i];
    const centroX = x * tamCelda + tamCelda / 2;
    const centroY = y * tamCelda + tamCelda / 2;
    
    ctx.beginPath();
    ctx.arc(centroX, centroY, 6, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.restore(); // Restaurar estado del contexto
}

/**
 * Dibuja la nave con efecto de animación 
 */
function dibujarNaveAnimada(x, y, paso) {
  const centroX = x * tamCelda + tamCelda / 2;
  const centroY = y * tamCelda + tamCelda / 2;

  ctx.save(); // Guardar estado del contexto

  // Efecto de brillo pulsante
  const tiempo = Date.now() / 500;
  const brillo = 5 + Math.sin(tiempo) * 3;
  
  ctx.shadowColor = "#00ffff";
  ctx.shadowBlur = brillo;
  
  // Nave principal más grande
  ctx.font = `${tamCelda + 4}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🚀", centroX, centroY);
  
  // Resetear sombra para el número
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";

  // Mostrar número de paso con fondo
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.beginPath();
  ctx.arc(centroX + tamCelda/3, centroY - tamCelda/3, 8, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `${tamCelda - 18}px Arial`;
  ctx.fillText((paso + 1).toString(), centroX + tamCelda/3, centroY - tamCelda/3);

  ctx.restore(); // Restaurar estado del contexto
}

/**
 * Retorna el tipo de celda según las coordenadas
 */
function detectarTipoCelda(x, y, universo) {
  const match = (list, key = "") =>
    list.some((item) =>
      Array.isArray(item)
        ? item[0] === y && item[1] === x
        : item[key] && item[key][0] === y && item[key][1] === x
    );

  // Verificar en orden de prioridad
  if (universo.origen[0] === y && universo.origen[1] === x) return "origen";
  if (universo.destino[0] === y && universo.destino[1] === x) return "destino";
  if (match(universo.zonasRecarga)) return "recarga";
  if (match(universo.celdasCargaRequerida, "coordenada")) return "cargaExtra";
  if (match(universo.agujerosNegros)) return "agujeroNegro";
  if (match(universo.estrellasGigantes)) return "estrella";
  if (match(universo.portales, "desde")) return "portal";
  if (match(universo.agujerosGusano, "entrada")) return "gusano";
  
  return "normal";
}

/**
 * Devuelve color de fondo según tipo de celda
 */
function obtenerColorFondo(tipo, valor) {
  switch (tipo) {
    case "agujeroNegro":
      return "#1a1a1a";
    case "estrella":
      return "#fff3cd";
    case "portal":
      return "#e1d5f7";
    case "gusano":
      return "#d1ecf1";
    case "recarga":
      return "#d4edda";
    case "cargaExtra":
      return "#ffeaa7";
    case "origen":
      return "#bee5eb";
    case "destino":
      return "#f8d7da";
    default:
      // Gradiente basado en el costo de energía
      const intensidad = Math.min(valor / 10, 1);
      const r = Math.floor(50 + intensidad * 100);
      const g = Math.floor(50 + (1 - intensidad) * 100);
      const b = Math.floor(50 + (1 - intensidad) * 50);
      return `rgb(${r}, ${g}, ${b})`;
  }
}

/**
 * Dibuja el cohete en la posición inicial
 */
function dibujarCohete(x, y) {
  const centroX = x * tamCelda + tamCelda / 2;
  const centroY = y * tamCelda + tamCelda / 2;
  
  ctx.font = `${tamCelda - 2}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🚀", centroX, centroY);
}

// Funciones auxiliares para el backtracking
function energiaExtra(x, y) {
  if (!universoDatos || !universoDatos.celdasCargaRequerida) return 0;
  
  const celda = universoDatos.celdasCargaRequerida.find(
    (c) => c.coordenada[0] === y && c.coordenada[1] === x
  );
  return celda ? (celda.cargaGastada || 0) : 0;
}

function obtenerRecarga(x, y) {
  if (!universoDatos || !universoDatos.zonasRecarga) return 1;
  
  const zona = universoDatos.zonasRecarga.find(
    ([zy, zx, multiplicador]) => zy === y && zx === x
  );
  return zona ? zona[2] : 1;
}
