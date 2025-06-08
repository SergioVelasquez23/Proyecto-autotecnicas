console.log("AFD cargado.");

// Matriz de adyacencia para validar tarjetas de crédito
const matrizTarjetaCredito = [
  { "\\d": 1 },
  { "\\d": 2 },
  { "\\d": 3 },
  { "\\d": 4 },
  { " ": 5 },
  { "\\d": 6 },
  { "\\d": 7 },
  { "\\d": 8 },
  { "\\d": 9 },
  { " ": 10 },
  { "\\d": 11 },
  { "\\d": 12 },
  { "\\d": 13 },
  { "\\d": 14 },
  { " ": 15 },
  { "\\d": 16 },
  { "\\d": 17 },
  { "\\d": 18 },
  { "\\d": 19 },
  { " ": 20 },
  { "\\d": 21 },
  { "\\d": 22 },
  { "/": 23 },
  { "\\d": 24 },
  { "\\d": 25 },
  { "\\d": 26 },
  { "\\d": 27 },
  { " ": 28 },
  { "\\d": 29 },
  { "\\d": 30 },
  { "\\d": 31 },
];

function validarTarjetaCredito(cadena) {
  console.log("Validando tarjeta de crédito:", cadena);
  let estado = 0;

  // Verificaciones preliminares
  if (cadena.length === 0) {
    return {
      valido: false,
      error: "Cadena vacía",
      errorPosicion: 0,
    };
  }

  // Verificación previa de formato completo para detectar errores semánticos temprano
  if (cadena.length >= 30) {
    const partes = cadena.split(" ");
    if (partes.length >= 5) {
      const fecha = partes[4];
      if (fecha && fecha.includes("/")) {
        const [mes, anio] = fecha.split("/").map(Number);

        if (!isNaN(mes) && (mes < 1 || mes > 12)) {
          return {
            valido: false,
            error: "Mes inválido (debe estar entre 01 y 12)",
            errorPosicion: cadena.indexOf(fecha),
          };
        }

        const anioActual = new Date().getFullYear();
        if (!isNaN(anio) && (anio < anioActual || anio > anioActual + 10)) {
          return {
            valido: false,
            error: `Año inválido (debe estar entre ${anioActual} y ${
              anioActual + 10
            })`,
            errorPosicion: cadena.indexOf(fecha) + 3,
          };
        }
      }

      // Verificar CVV si existe
      if (partes.length >= 6) {
        const cvv = partes[5];
        if (cvv && (cvv.length < 3 || cvv.length > 3)) {
          const errorMsg =
            cvv.length < 3
              ? "CVV debe tener 3 dígitos"
              : "CVV no puede tener más de 3 dígitos";
          return {
            valido: false,
            error: errorMsg,
            errorPosicion: cadena.indexOf(cvv),
          };
        }
      }
    }
  }

  for (let i = 0; i < cadena.length; i++) {
    const c = cadena[i];
    const transiciones = matrizTarjetaCredito[estado];

    if (!transiciones) {
      return {
        valido: false,
        error: "Formato demasiado largo",
        errorPosicion: i,
      };
    }

    const siguienteEstado = Object.keys(transiciones).find((key) =>
      new RegExp(key).test(c)
    );

    if (siguienteEstado) {
      estado = transiciones[siguienteEstado];
    } else {
      // Detectar tipos de errores específicos
      let errorMsg = "";
      if (c === "-") {
        errorMsg = "No se permiten guiones, use espacios como separadores";
      } else if (/[a-zA-Z]/.test(c)) {
        errorMsg = "No se permiten letras, solo números y espacios";
      } else if (estado === 23 && c !== "/" && /\d/.test(c)) {
        errorMsg = "Se esperaba '/' después del mes";
      } else if (Object.keys(transiciones).includes("\\d") && !/\d/.test(c)) {
        errorMsg = "Se esperaba un dígito";
      } else if (Object.keys(transiciones).includes(" ") && c !== " ") {
        errorMsg = "Se esperaba un espacio";
      } else {
        errorMsg = `Carácter inválido '${c}', se esperaba '${Object.keys(
          transiciones
        )
          .join(" o ")
          .replace("\\d", "dígito")
          .replace(" ", "espacio")}'`;
      }

      return {
        valido: false,
        error: errorMsg,
        errorPosicion: i,
      };
    }
  }

  if (estado === 31) {
    const partes = cadena.split(" ");

    // Validar número de tarjeta (debe tener exactamente 16 dígitos)
    const numeroTarjeta = partes.slice(0, 4).join("");
    if (numeroTarjeta.length !== 16 || !/^\d{16}$/.test(numeroTarjeta)) {
      return {
        valido: false,
        error: "El número de tarjeta debe tener exactamente 16 dígitos",
        errorPosicion: 0,
      };
    }

    // Validar fecha
    const fecha = partes[4];
    if (!fecha || !fecha.includes("/")) {
      return {
        valido: false,
        error: "Formato de fecha inválido, use MM/AAAA",
        errorPosicion: cadena.indexOf(partes[4]),
      };
    }

    const [mes, anio] = fecha.split("/").map(Number);

    if (isNaN(mes) || mes < 1 || mes > 12) {
      return {
        valido: false,
        error: "Mes inválido (debe estar entre 01 y 12)",
        errorPosicion: cadena.indexOf(fecha),
      };
    }

    const anioActual = new Date().getFullYear();
    if (isNaN(anio) || anio < anioActual || anio > anioActual + 10) {
      return {
        valido: false,
        error: `Año inválido (debe estar entre ${anioActual} y ${
          anioActual + 10
        })`,
        errorPosicion: cadena.indexOf(fecha) + 3,
      };
    }

    // Validar CVV
    const cvv = partes[5];
    if (!cvv) {
      return {
        valido: false,
        error: "CVV faltante",
        errorPosicion: cadena.length,
      };
    }

    if (cvv.length < 3) {
      return {
        valido: false,
        error: "CVV debe tener 3 dígitos",
        errorPosicion: cadena.indexOf(cvv),
      };
    }

    if (cvv.length > 3) {
      return {
        valido: false,
        error: "CVV no puede tener más de 3 dígitos",
        errorPosicion: cadena.indexOf(cvv) + 3,
      };
    }

    if (!/^\d{3}$/.test(cvv)) {
      return {
        valido: false,
        error: "CVV debe contener solo dígitos",
        errorPosicion: cadena.indexOf(cvv),
      };
    }

    return { valido: true };
  }

  // Detectar si la cadena está incompleta
  let errorMsg = "Formato incompleto";
  if (estado >= 0 && estado <= 19) {
    errorMsg = "Número de tarjeta incompleto";
  } else if (estado >= 20 && estado <= 27) {
    errorMsg = "Fecha de expiración incompleta";
  } else if (estado >= 28 && estado <= 30) {
    errorMsg = "CVV incompleto";
  }

  return {
    valido: false,
    error: errorMsg,
    errorPosicion: cadena.length,
  };
}

// Matriz de adyacencia para validar IPv4
// Estados: 0=inicio, 1-3=primer octeto, 4=primer punto, 5-7=segundo octeto,
// 8=segundo punto, 9-11=tercer octeto, 12=tercer punto, 13-15=cuarto octeto
const matrizIPv4 = [
  { "\\d": 1 }, // 0: inicio -> primer dígito del primer octeto
  { "\\d": 2, "\\.": 4 }, // 1: primer octeto (1 dígito) -> segundo dígito o punto
  { "\\d": 3, "\\.": 4 }, // 2: primer octeto (2 dígitos) -> tercer dígito o punto
  { "\\.": 4 }, // 3: primer octeto (3 dígitos) -> punto
  { "\\d": 5 }, // 4: primer punto -> primer dígito del segundo octeto
  { "\\d": 6, "\\.": 8 }, // 5: segundo octeto (1 dígito) -> segundo dígito o punto
  { "\\d": 7, "\\.": 8 }, // 6: segundo octeto (2 dígitos) -> tercer dígito o punto
  { "\\.": 8 }, // 7: segundo octeto (3 dígitos) -> punto
  { "\\d": 9 }, // 8: segundo punto -> primer dígito del tercer octeto
  { "\\d": 10, "\\.": 12 }, // 9: tercer octeto (1 dígito) -> segundo dígito o punto
  { "\\d": 11, "\\.": 12 }, // 10: tercer octeto (2 dígitos) -> tercer dígito o punto
  { "\\.": 12 }, // 11: tercer octeto (3 dígitos) -> punto
  { "\\d": 13 }, // 12: tercer punto -> primer dígito del cuarto octeto
  { "\\d": 14 }, // 13: cuarto octeto (1 dígito) -> segundo dígito
  { "\\d": 15 }, // 14: cuarto octeto (2 dígitos) -> tercer dígito
  {}, // 15: cuarto octeto (3 dígitos) -> estado final
];

function validarIPv4(cadena) {
  console.log("Validando IPv4:", cadena);
  let estado = 0;

  // Verificaciones preliminares
  if (cadena.length === 0) {
    return {
      valido: false,
      error: "Cadena vacía",
      errorPosicion: 0,
    };
  }

  if (cadena.startsWith(".")) {
    return {
      valido: false,
      error: "No puede comenzar con un punto",
      errorPosicion: 0,
    };
  }

  if (cadena.endsWith(".")) {
    return {
      valido: false,
      error: "No puede terminar con un punto",
      errorPosicion: cadena.length - 1,
    };
  }

  // Verificar dobles puntos
  if (cadena.includes("..")) {
    return {
      valido: false,
      error: "No se permiten puntos consecutivos",
      errorPosicion: cadena.indexOf(".."),
    };
  }

  // Verificar espacios
  if (cadena.includes(" ")) {
    return {
      valido: false,
      error: "No se permiten espacios en direcciones IP",
      errorPosicion: cadena.indexOf(" "),
    };
  }

  // Verificar comas (error común)
  if (cadena.includes(",")) {
    return {
      valido: false,
      error: "Use puntos como separadores, no comas",
      errorPosicion: cadena.indexOf(","),
    };
  }

  for (let i = 0; i < cadena.length; i++) {
    const c = cadena[i];
    const transiciones = matrizIPv4[estado];

    if (!transiciones) {
      return {
        valido: false,
        error: "Formato demasiado largo",
        errorPosicion: i,
      };
    }

    const siguienteEstado = Object.keys(transiciones).find((key) =>
      new RegExp(key).test(c)
    );

    if (siguienteEstado) {
      estado = transiciones[siguienteEstado];
    } else {
      // Detectar tipos de errores específicos
      let errorMsg = "";
      if (/[a-zA-Z]/.test(c)) {
        errorMsg = "No se permiten letras en direcciones IP";
      } else if (c === "-") {
        errorMsg = "No se permiten guiones en direcciones IP";
      } else if (Object.keys(transiciones).includes("\\d") && !/\d/.test(c)) {
        errorMsg = "Se esperaba un dígito";
      } else if (Object.keys(transiciones).includes("\\.") && c !== ".") {
        errorMsg = "Se esperaba un punto separador";
      } else {
        errorMsg = `Carácter inválido '${c}', se esperaba '${Object.keys(
          transiciones
        )
          .join(" o ")
          .replace("\\d", "dígito")
          .replace("\\.", "punto")}'`;
      }

      return {
        valido: false,
        error: errorMsg,
        errorPosicion: i,
      };
    }
  }

  // Estados válidos finales: 13 (1 dígito), 14 (2 dígitos), 15 (3 dígitos) para el cuarto octeto
  if (estado === 13 || estado === 14 || estado === 15) {
    const partes = cadena.split(".");

    if (partes.length !== 4) {
      return {
        valido: false,
        error: `Se esperaban 4 octetos, se encontraron ${partes.length}`,
        errorPosicion: 0,
      };
    }

    for (let i = 0; i < partes.length; i++) {
      const parte = partes[i];

      // Verificar que no esté vacío
      if (parte === "") {
        return {
          valido: false,
          error: `Octeto ${i + 1} está vacío`,
          errorPosicion:
            cadena.indexOf("..") >= 0
              ? cadena.indexOf("..")
              : cadena.split(".").slice(0, i).join(".").length,
        };
      }

      // Verificar que sea numérico
      if (!/^[0-9]+$/.test(parte)) {
        return {
          valido: false,
          error: `Octeto ${
            i + 1
          } ('${parte}') contiene caracteres no numéricos`,
          errorPosicion: cadena.indexOf(parte),
        };
      }

      // Verificar ceros a la izquierda (excepto para "0")
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

      // Verificar rango
      if (numero < 0) {
        return {
          valido: false,
          error: `Octeto ${i + 1} ('${parte}') no puede ser negativo`,
          errorPosicion: cadena.indexOf(parte),
        };
      }

      if (numero > 255) {
        return {
          valido: false,
          error: `Octeto ${
            i + 1
          } ('${parte}') está fuera de rango (máximo 255)`,
          errorPosicion: cadena.indexOf(parte),
        };
      }
    }

    return { valido: true };
  }

  // Detectar si la cadena está incompleta
  let errorMsg = "Formato incompleto";
  const partes = cadena.split(".");
  if (partes.length < 4) {
    errorMsg = `Faltan ${4 - partes.length} octeto(s)`;
  }

  return {
    valido: false,
    error: errorMsg,
    errorPosicion: cadena.length,
  };
}

window.validarTarjetaCredito = validarTarjetaCredito;
window.validarIPv4 = validarIPv4;
