console.log("AFD cargado - Versión con ramificaciones completas.");

// ===============================================
// AFD COMPLETO PARA TARJETAS DE CRÉDITO
// ===============================================

// Estados especiales
const ESTADOS = {
  INICIAL: 0,
  ERROR_GENERAL: -1,
  ERROR_CARACTER_INVALIDO: -2,
  ERROR_FORMATO: -3,
  ERROR_LONGITUD: -4,
  ERROR_SEMANTICO: -5,
  ACEPTACION: 31,
};

// Matriz de transiciones COMPLETA para tarjetas de crédito
// Cada estado tiene transiciones para TODOS los caracteres posibles
const matrizTarjetaCredito = [
  // Estado 0: Esperando primer dígito
  {
    "\\d": 1,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estado 1: Primer dígito del primer grupo
  {
    "\\d": 2,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estado 2: Segundo dígito del primer grupo
  {
    "\\d": 3,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estado 3: Tercer dígito del primer grupo
  {
    "\\d": 4,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estado 4: Cuarto dígito del primer grupo
  {
    "\\d": ESTADOS.ERROR_LONGITUD, // No puede haber más de 4 dígitos
    " ": 5, // Espacio obligatorio
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estado 5: Después del primer espacio
  {
    "\\d": 6,
    " ": ESTADOS.ERROR_FORMATO, // Doble espacio
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estados 6-9: Segundo grupo (4 dígitos)
  {
    "\\d": 7,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": 8,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": 9,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": ESTADOS.ERROR_LONGITUD,
    " ": 10, // Segundo espacio obligatorio
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estados 10-19: Continúa similar para los grupos 3 y 4...
  // (Por brevedad, muestro la estructura completa)

  // Estado 10: Después del segundo espacio
  {
    "\\d": 11,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estados 11-14: Tercer grupo (4 dígitos)
  {
    "\\d": 12,
    " ": ESTADOS.ERROR_FORMATO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": 13,
    " ": ESTADOS.ERROR_FORMATO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": 14,
    " ": ESTADOS.ERROR_FORMATO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": ESTADOS.ERROR_LONGITUD,
    " ": 15,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estado 15: Después del tercer espacio
  {
    "\\d": 16,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estados 16-19: Cuarto grupo (4 dígitos)
  {
    "\\d": 17,
    " ": ESTADOS.ERROR_FORMATO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": 18,
    " ": ESTADOS.ERROR_FORMATO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": 19,
    " ": ESTADOS.ERROR_FORMATO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": ESTADOS.ERROR_LONGITUD,
    " ": 20,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estado 20: Después del cuarto espacio (esperando fecha)
  {
    "\\d": 21,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estados 21-22: Mes (2 dígitos)
  {
    "\\d": 22,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": ESTADOS.ERROR_LONGITUD, // Mes no puede tener 3 dígitos
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": 23, // Barra obligatoria
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estado 23: Después de la barra
  {
    "\\d": 24,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estados 24-27: Año (4 dígitos)
  {
    "\\d": 25,
    " ": ESTADOS.ERROR_FORMATO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": 26,
    " ": ESTADOS.ERROR_FORMATO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": 27,
    " ": ESTADOS.ERROR_FORMATO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": ESTADOS.ERROR_LONGITUD,
    " ": 28,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estado 28: Después del espacio (esperando CVV)
  {
    "\\d": 29,
    " ": ESTADOS.ERROR_FORMATO,
    "\\.": ESTADOS.ERROR_CARACTER_INVALIDO,
    "/": ESTADOS.ERROR_CARACTER_INVALIDO,
    "[a-zA-Z]": ESTADOS.ERROR_CARACTER_INVALIDO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },

  // Estados 29-31: CVV (3 dígitos)
  {
    "\\d": 30,
    " ": ESTADOS.ERROR_FORMATO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": 31,
    " ": ESTADOS.ERROR_FORMATO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
  {
    "\\d": ESTADOS.ERROR_LONGITUD, // CVV no puede tener más de 3 dígitos
    " ": ESTADOS.ERROR_FORMATO,
    default: ESTADOS.ERROR_CARACTER_INVALIDO,
  },
];

// ===============================================
// FUNCIÓN DE VALIDACIÓN CON AFD COMPLETO
// ===============================================

function validarTarjetaCredito(cadena) {
  console.log("Validando tarjeta de crédito con AFD completo:", cadena);

  let estado = ESTADOS.INICIAL;
  let historialEstados = [estado]; // Para debugging/visualización

  // Verificaciones preliminares
  if (cadena.length === 0) {
    return {
      valido: false,
      error: "Cadena vacía",
      errorPosicion: 0,
      estadoFinal: estado,
      historial: historialEstados,
    };
  }

  // Procesar cada carácter
  for (let i = 0; i < cadena.length; i++) {
    const caracter = cadena[i];

    // Si ya estamos en estado de error, mantener el error
    if (estado < 0) {
      break;
    }

    const transiciones = matrizTarjetaCredito[estado];
    if (!transiciones) {
      estado = ESTADOS.ERROR_GENERAL;
      break;
    }

    // Buscar transición válida
    let siguienteEstado = null;
    let transicionEncontrada = false;

    for (const [patron, destino] of Object.entries(transiciones)) {
      if (patron === "default") continue;

      try {
        if (new RegExp(patron).test(caracter)) {
          siguienteEstado = destino;
          transicionEncontrada = true;
          break;
        }
      } catch (e) {
        // Error en regex, continuar
        continue;
      }
    }

    // Si no se encontró transición específica, usar default
    if (!transicionEncontrada) {
      siguienteEstado = transiciones.default || ESTADOS.ERROR_CARACTER_INVALIDO;
    }

    estado = siguienteEstado;
    historialEstados.push(estado);

    // Si llegamos a un estado de error, generar mensaje específico
    if (estado < 0) {
      return generarErrorTarjeta(estado, caracter, i, historialEstados);
    }
  }

  // Verificar estado final
  if (estado === ESTADOS.ACEPTACION) {
    // Validaciones semánticas adicionales
    const validacionSemantica = validarSemanticaTarjeta(cadena);
    if (!validacionSemantica.valido) {
      return {
        ...validacionSemantica,
        historial: historialEstados,
      };
    }

    return {
      valido: true,
      historial: historialEstados,
      mensaje: "Tarjeta de crédito válida",
    };
  }

  // Estado incompleto
  return {
    valido: false,
    error: generarMensajeIncompleto(estado),
    errorPosicion: cadena.length,
    estadoFinal: estado,
    historial: historialEstados,
  };
}

// ===============================================
// FUNCIONES AUXILIARES PARA MANEJO DE ERRORES
// ===============================================

function generarErrorTarjeta(estadoError, caracter, posicion, historial) {
  let mensajeError = "";

  switch (estadoError) {
    case ESTADOS.ERROR_CARACTER_INVALIDO:
      if (/[a-zA-Z]/.test(caracter)) {
        mensajeError = `Carácter inválido '${caracter}': no se permiten letras`;
      } else if (caracter === "-") {
        mensajeError = "No se permiten guiones, use espacios como separadores";
      } else if (caracter === ".") {
        mensajeError = "No se permiten puntos en tarjetas de crédito";
      } else {
        mensajeError = `Carácter inválido '${caracter}'`;
      }
      break;

    case ESTADOS.ERROR_FORMATO:
      mensajeError = `Error de formato en posición ${posicion}: se esperaba un carácter diferente`;
      break;

    case ESTADOS.ERROR_LONGITUD:
      mensajeError = "Error de longitud: demasiados dígitos en el grupo actual";
      break;

    default:
      mensajeError = "Error de formato no especificado";
  }

  return {
    valido: false,
    error: mensajeError,
    errorPosicion: posicion,
    estadoFinal: estadoError,
    historial: historial,
    transicionesDisponibles: obtenerTransicionesDisponibles(
      historial[historial.length - 2] || 0
    ),
  };
}

function generarMensajeIncompleto(estado) {
  if (estado >= 0 && estado <= 4) return "Primer grupo de dígitos incompleto";
  if (estado >= 5 && estado <= 9) return "Segundo grupo de dígitos incompleto";
  if (estado >= 10 && estado <= 14) return "Tercer grupo de dígitos incompleto";
  if (estado >= 15 && estado <= 19) return "Cuarto grupo de dígitos incompleto";
  if (estado >= 20 && estado <= 22) return "Mes de expiración incompleto";
  if (estado === 23) return "Año de expiración faltante";
  if (estado >= 24 && estado <= 27) return "Año de expiración incompleto";
  if (estado === 28) return "CVV faltante";
  if (estado >= 29 && estado <= 30) return "CVV incompleto";

  return "Formato incompleto";
}

function obtenerTransicionesDisponibles(estado) {
  const transiciones = matrizTarjetaCredito[estado];
  if (!transiciones) return [];

  return Object.keys(transiciones)
    .filter((k) => k !== "default")
    .map((k) =>
      k.replace("\\d", "dígito").replace(" ", "espacio").replace("/", "barra")
    );
}

function validarSemanticaTarjeta(cadena) {
  const partes = cadena.split(" ");

  // Validar fecha
  const fecha = partes[4];
  const [mes, anio] = fecha.split("/").map(Number);

  if (mes < 1 || mes > 12) {
    return {
      valido: false,
      error: "Mes inválido (debe estar entre 01 y 12)",
      errorPosicion: cadena.indexOf(fecha),
    };
  }

  const anioActual = new Date().getFullYear();
  if (anio < anioActual || anio > anioActual + 10) {
    return {
      valido: false,
      error: `Año inválido (debe estar entre ${anioActual} y ${
        anioActual + 10
      })`,
      errorPosicion: cadena.indexOf(fecha) + 3,
    };
  }

  return { valido: true };
}

// ===============================================
// AFD COMPLETO PARA IPv4
// ===============================================

const ESTADOS_IPV4 = {
  INICIAL: 0,
  ACEPTACION_1: 13, // 1 dígito en último octeto
  ACEPTACION_2: 14, // 2 dígitos en último octeto
  ACEPTACION_3: 15, // 3 dígitos en último octeto
  ERROR_CARACTER: -1,
  ERROR_FORMATO: -2,
  ERROR_RANGO: -3,
  ERROR_CEROS: -4,
};

const matrizIPv4Completa = [
  // Estado 0: Inicio
  {
    "\\d": 1,
    "\\.": ESTADOS_IPV4.ERROR_FORMATO,
    " ": ESTADOS_IPV4.ERROR_CARACTER,
    "[a-zA-Z]": ESTADOS_IPV4.ERROR_CARACTER,
    default: ESTADOS_IPV4.ERROR_CARACTER,
  },

  // Estado 1: Primer dígito del primer octeto
  {
    "\\d": 2,
    "\\.": 4,
    " ": ESTADOS_IPV4.ERROR_CARACTER,
    "[a-zA-Z]": ESTADOS_IPV4.ERROR_CARACTER,
    default: ESTADOS_IPV4.ERROR_CARACTER,
  },

  // Estado 2: Segundo dígito del primer octeto
  {
    "\\d": 3,
    "\\.": 4,
    " ": ESTADOS_IPV4.ERROR_CARACTER,
    "[a-zA-Z]": ESTADOS_IPV4.ERROR_CARACTER,
    default: ESTADOS_IPV4.ERROR_CARACTER,
  },

  // Estado 3: Tercer dígito del primer octeto
  {
    "\\d": ESTADOS_IPV4.ERROR_FORMATO, // Máximo 3 dígitos
    "\\.": 4,
    " ": ESTADOS_IPV4.ERROR_CARACTER,
    "[a-zA-Z]": ESTADOS_IPV4.ERROR_CARACTER,
    default: ESTADOS_IPV4.ERROR_CARACTER,
  },

  // Estados similares para los octetos 2, 3 y 4...
  // (Continúa con la misma estructura)

  // Estado 4: Primer punto
  {
    "\\d": 5,
    "\\.": ESTADOS_IPV4.ERROR_FORMATO,
    " ": ESTADOS_IPV4.ERROR_CARACTER,
    "[a-zA-Z]": ESTADOS_IPV4.ERROR_CARACTER,
    default: ESTADOS_IPV4.ERROR_CARACTER,
  },

  // Estados 5-7: Segundo octeto
  { "\\d": 6, "\\.": 8, default: ESTADOS_IPV4.ERROR_CARACTER },
  { "\\d": 7, "\\.": 8, default: ESTADOS_IPV4.ERROR_CARACTER },
  {
    "\\d": ESTADOS_IPV4.ERROR_FORMATO,
    "\\.": 8,
    default: ESTADOS_IPV4.ERROR_CARACTER,
  },

  // Estado 8: Segundo punto
  {
    "\\d": 9,
    "\\.": ESTADOS_IPV4.ERROR_FORMATO,
    default: ESTADOS_IPV4.ERROR_CARACTER,
  },

  // Estados 9-11: Tercer octeto
  { "\\d": 10, "\\.": 12, default: ESTADOS_IPV4.ERROR_CARACTER },
  { "\\d": 11, "\\.": 12, default: ESTADOS_IPV4.ERROR_CARACTER },
  {
    "\\d": ESTADOS_IPV4.ERROR_FORMATO,
    "\\.": 12,
    default: ESTADOS_IPV4.ERROR_CARACTER,
  },

  // Estado 12: Tercer punto
  {
    "\\d": 13,
    "\\.": ESTADOS_IPV4.ERROR_FORMATO,
    default: ESTADOS_IPV4.ERROR_CARACTER,
  },

  // Estados 13-15: Cuarto octeto (estados de aceptación)
  {
    "\\d": 14,
    "\\.": ESTADOS_IPV4.ERROR_FORMATO,
    default: ESTADOS_IPV4.ERROR_CARACTER,
  },
  {
    "\\d": 15,
    "\\.": ESTADOS_IPV4.ERROR_FORMATO,
    default: ESTADOS_IPV4.ERROR_CARACTER,
  },
  {
    "\\d": ESTADOS_IPV4.ERROR_FORMATO,
    "\\.": ESTADOS_IPV4.ERROR_FORMATO,
    default: ESTADOS_IPV4.ERROR_CARACTER,
  },
];

function validarIPv4(cadena) {
  console.log("Validando IPv4 con AFD completo:", cadena);

  let estado = ESTADOS_IPV4.INICIAL;
  let historialEstados = [estado];

  if (cadena.length === 0) {
    return {
      valido: false,
      error: "Cadena vacía",
      errorPosicion: 0,
      historial: historialEstados,
    };
  }

  // Procesar cada carácter
  for (let i = 0; i < cadena.length; i++) {
    const caracter = cadena[i];

    if (estado < 0) break;

    const transiciones = matrizIPv4Completa[estado];
    if (!transiciones) {
      estado = ESTADOS_IPV4.ERROR_FORMATO;
      break;
    }

    let siguienteEstado = null;
    let transicionEncontrada = false;

    for (const [patron, destino] of Object.entries(transiciones)) {
      if (patron === "default") continue;

      try {
        if (new RegExp(patron).test(caracter)) {
          siguienteEstado = destino;
          transicionEncontrada = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!transicionEncontrada) {
      siguienteEstado = transiciones.default || ESTADOS_IPV4.ERROR_CARACTER;
    }

    estado = siguienteEstado;
    historialEstados.push(estado);

    if (estado < 0) {
      return generarErrorIPv4(estado, caracter, i, historialEstados);
    }
  }

  // Verificar estados de aceptación
  if (
    estado === ESTADOS_IPV4.ACEPTACION_1 ||
    estado === ESTADOS_IPV4.ACEPTACION_2 ||
    estado === ESTADOS_IPV4.ACEPTACION_3
  ) {
    // Validación semántica de rangos
    const validacionSemantica = validarSemanticaIPv4(cadena);
    if (!validacionSemantica.valido) {
      return {
        ...validacionSemantica,
        historial: historialEstados,
      };
    }

    return {
      valido: true,
      historial: historialEstados,
      mensaje: "Dirección IPv4 válida",
    };
  }

  return {
    valido: false,
    error: "Dirección IPv4 incompleta",
    errorPosicion: cadena.length,
    estadoFinal: estado,
    historial: historialEstados,
  };
}

function generarErrorIPv4(estadoError, caracter, posicion, historial) {
  let mensajeError = "";

  switch (estadoError) {
    case ESTADOS_IPV4.ERROR_CARACTER:
      if (/[a-zA-Z]/.test(caracter)) {
        mensajeError = `Carácter inválido '${caracter}': no se permiten letras en IPv4`;
      } else if (caracter === " ") {
        mensajeError = "No se permiten espacios en direcciones IPv4";
      } else if (caracter === ",") {
        mensajeError = "Use puntos como separadores, no comas";
      } else {
        mensajeError = `Carácter inválido '${caracter}' en dirección IPv4`;
      }
      break;

    case ESTADOS_IPV4.ERROR_FORMATO:
      mensajeError = "Error de formato: estructura IPv4 incorrecta";
      break;

    default:
      mensajeError = "Error no especificado en IPv4";
  }

  return {
    valido: false,
    error: mensajeError,
    errorPosicion: posicion,
    estadoFinal: estadoError,
    historial: historial,
  };
}

function validarSemanticaIPv4(cadena) {
  const partes = cadena.split(".");

  for (let i = 0; i < partes.length; i++) {
    const parte = partes[i];

    // Verificar ceros a la izquierda
    if (parte.length > 1 && parte.startsWith("0")) {
      return {
        valido: false,
        error: `Octeto ${
          i + 1
        } ('${parte}') no puede tener ceros a la izquierda`,
        errorPosicion: cadena.indexOf(parte),
      };
    }

    const numero = Number(parte);
    if (numero > 255) {
      return {
        valido: false,
        error: `Octeto ${i + 1} ('${parte}') está fuera de rango (máximo 255)`,
        errorPosicion: cadena.indexOf(parte),
      };
    }
  }

  return { valido: true };
}

// ===============================================
// FUNCIÓN DE VISUALIZACIÓN DEL AFD
// ===============================================

function visualizarAFD(historial, tipo) {
  console.log(`\n=== Historial de Estados - ${tipo} ===`);
  console.log("Camino recorrido:", historial.join(" → "));

  if (historial[historial.length - 1] < 0) {
    console.log("❌ Estado final: ERROR");
  } else {
    console.log("✅ Estado final: VÁLIDO");
  }
}

// Exportar funciones
window.validarTarjetaCredito = validarTarjetaCredito;
window.validarIPv4 = validarIPv4;
window.visualizarAFD = visualizarAFD;
window.ESTADOS = ESTADOS;
window.ESTADOS_IPV4 = ESTADOS_IPV4;

console.log("AFD completo cargado con ramificaciones y estados de error ✅");
