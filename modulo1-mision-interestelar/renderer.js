// renderer.js - Versión completa
console.log("Renderer completo cargado.");

const canvas = document.getElementById("canvas-universo");
const ctx = canvas.getContext("2d");
let tamCelda = 30; 

/**
 * Dibuja la matriz del universo con íconos mejorados
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
 * Dibuja el ícono correspondiente para cada tipo de celda
 */
function dibujarIcono(ctx, x, y, tipo, valor) {
  const centroX = x * tamCelda + tamCelda / 2;
  const centroY = y * tamCelda + tamCelda / 2;
  
  ctx.font = `${tamCelda - 8}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  switch (tipo) {
    case "agujeroNegro":
      ctx.fillText("🕳️", centroX, centroY);
      break;
    case "estrella":
      ctx.fillText("⭐", centroX, centroY);
      break;
    case "portal":
      ctx.fillText("🚪", centroX, centroY);
      break;
    case "gusano":
      ctx.fillText("🌀", centroX, centroY);
      break;
    case "recarga":
      ctx.fillText("⚡", centroX, centroY);
      break;
    case "cargaExtra":
      ctx.fillText("🔋", centroX, centroY);
      break;
    case "origen":
      ctx.fillText("🏠", centroX, centroY);
      break;
    case "destino":
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
 * Simula el movimiento de la nave paso a paso 
 */
function simularMovimientoNave(ruta) {
  console.log("Iniciando simulación de movimiento de la nave", ruta);
  let i = 0;
  let energiaActual = universoDatos.cargaInicial;

  document.getElementById("energia-nave").textContent = energiaActual;

  const intervalo = setInterval(() => {
    if (i >= ruta.length) {
      console.log("Simulación completada");
      clearInterval(intervalo);
      log("✅ Animación completada!");
      return;
    }

    // Redibuja el universo
    dibujarMatriz(matrizEnergia, universoDatos);

    // Dibujar ruta recorrida
    if (i > 0) {
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      
      for (let j = 0; j < i; j++) {
        const [x1, y1] = ruta[j];
        const [x2, y2] = ruta[j + 1] || ruta[j];
        
        if (j < i - 1) {
          const centroX1 = x1 * tamCelda + tamCelda / 2;
          const centroY1 = y1 * tamCelda + tamCelda / 2;
          const centroX2 = x2 * tamCelda + tamCelda / 2;
          const centroY2 = y2 * tamCelda + tamCelda / 2;
          
          ctx.beginPath();
          ctx.moveTo(centroX1, centroY1);
          ctx.lineTo(centroX2, centroY2);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);
    }

    const [x, y] = ruta[i];
    console.log(`Nave en posición: (${x}, ${y})`);

    // Calcular energía
    if (i > 0) {
      const gastoBase = matrizEnergia[y][x];
      const gastoExtra = energiaExtra(x, y);
      const gastoTotal = gastoBase + gastoExtra;
      energiaActual -= gastoTotal;

      // Aplicar recarga si está disponible
      const multiplicadorRecarga = obtenerRecarga(x, y);
      if (multiplicadorRecarga > 1) {
        energiaActual = Math.floor(energiaActual * multiplicadorRecarga);
        log(`⚡ Energía recargada en (${x},${y}): x${multiplicadorRecarga}`);
      }
    }

    document.getElementById("energia-nave").textContent = energiaActual;

    // Dibujar la nave con animación
    dibujarNaveAnimada(x, y, i);

    i++;
  }, 800); // Más lento para mejor visualización
}

/**
 * Dibuja la nave con efecto de animación
 */
function dibujarNaveAnimada(x, y, paso) {
  const centroX = x * tamCelda + tamCelda / 2;
  const centroY = y * tamCelda + tamCelda / 2;

  // Efecto de brillo
  ctx.shadowColor = "#00ffff";
  ctx.shadowBlur = 10;
  
  // Nave principal
  ctx.font = `${tamCelda - 2}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🚀", centroX, centroY);
  
  // Resetear sombra
  ctx.shadowBlur = 0;

  // Mostrar número de paso
  ctx.fillStyle = "#ffffff";
  ctx.font = `${tamCelda - 18}px Arial`;
  ctx.fillText((paso + 1).toString(), centroX, centroY + tamCelda - 8);
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
  if (match(universo.agujerosNegros)) return "agujeroNegro";
  if (match(universo.estrellasGigantes)) return "estrella";
  if (match(universo.portales, "desde")) return "portal";
  if (match(universo.agujerosGusano, "entrada")) return "gusano";
  if (match(universo.zonasRecarga)) return "recarga";
  if (match(universo.celdasCargaRequerida, "coordenada")) return "cargaExtra";
  
  return "normal";
}

/**
 * Devuelve color de fondo según tipo de celda
 */
function obtenerColorFondo(tipo, valor) {
  switch (tipo) {
    case "agujeroNegro":
      return "#000000";
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