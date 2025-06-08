console.log("Validator cargado.");

function identificarYValidar(linea, index) {
  const resultadoTarjeta = window.validarTarjetaCredito(linea);
  const resultadoIPv4 = window.validarIPv4(linea);

  if (resultadoTarjeta.valido) {
    return {
      valido: true,
      mensaje: `Línea ${index + 1}: Tarjeta válida`,
      original: linea,
      tipo: "Tarjeta de Crédito",
    };
  } else if (resultadoIPv4.valido) {
    return {
      valido: true,
      mensaje: `Línea ${index + 1}: IPv4 válida`,
      original: linea,
      tipo: "Dirección IPv4",
    };
  } else {
    // Mejorar la detección del tipo de dato
    let tipoDetectado, errorInfo;

    // Detección más precisa basada en patrones
    const tieneEspaciosYBarra = linea.includes(" ") && linea.includes("/");
    const tienePuntosYNumeros =
      /^\d+\.\d+(\.\d+)*\.?\d*$/.test(linea.replace(/[^0-9.]/g, "")) &&
      linea.includes(".");
    const soloNumerosYEspacios = /^[\d\s\/]+$/.test(linea);
    const tieneFormatoTarjeta =
      /^\d{4}[\s-]\d{4}[\s-]\d{4}[\s-]\d{4}/.test(linea) ||
      (linea.length > 20 && soloNumerosYEspacios);

    // Priorizar IPv4 si tiene puntos y números
    if (tienePuntosYNumeros && !tieneEspaciosYBarra) {
      tipoDetectado = "Dirección IPv4";
      errorInfo = resultadoIPv4;
    }
    // Detectar tarjeta si tiene formato característico
    else if (
      tieneFormatoTarjeta ||
      tieneEspaciosYBarra ||
      soloNumerosYEspacios
    ) {
      tipoDetectado = "Tarjeta de Crédito";
      errorInfo = resultadoTarjeta;
    }
    // Caso especial: cadenas con puntos que pueden ser IPv4 malformadas
    else if (linea.includes(".")) {
      tipoDetectado = "Dirección IPv4";
      errorInfo = resultadoIPv4;
    }
    // Por defecto, usar el que tenga menor posición de error
    else {
      if (resultadoTarjeta.errorPosicion <= resultadoIPv4.errorPosicion) {
        tipoDetectado = "Tarjeta de Crédito";
        errorInfo = resultadoTarjeta;
      } else {
        tipoDetectado = "Dirección IPv4";
        errorInfo = resultadoIPv4;
      }
    }

    return {
      valido: false,
      mensaje: `Línea ${index + 1}: ${tipoDetectado} inválida`,
      original: linea,
      tipo: tipoDetectado,
      error: errorInfo.error || "Error desconocido",
      errorPosicion: errorInfo.errorPosicion,
    };
  }
}

function validarArchivo(lineas) {
  const resultados = { validas: [], invalidas: [] };

  lineas.forEach((linea, index) => {
    const resultado = identificarYValidar(linea, index);
    if (resultado.valido) {
      resultados.validas.push(resultado);
    } else {
      resultados.invalidas.push(resultado);
    }
  });

  return resultados;
}

window.validarArchivo = validarArchivo;
