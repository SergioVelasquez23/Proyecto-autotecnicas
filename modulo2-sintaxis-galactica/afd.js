// Implementación del AFD
console.log("AFD cargado.");

// Revisar y ajustar validación de tarjeta de crédito
function validarTarjetaCredito(cadena) {
  console.log("Validando tarjeta de crédito:", cadena);
  const regex = /^\d{4} \d{4} \d{4} \d{4} \d{2}\/\d{4} \d{3}$/;
  if (!regex.test(cadena)) {
    console.log("Error: No coincide con el formato esperado.");
    return { valido: false, error: "Formato inválido" };
  }

  const partes = cadena.split(" ");
  if (partes.length !== 6) {
    console.log("Error: La cadena no tiene el número correcto de partes.");
    return { valido: false, error: "Formato inválido" };
  }

  const tarjeta = partes.slice(0, 4).join(" ");
  const fecha = partes[4];
  const cvv = partes[5];
  console.log("Tarjeta:", tarjeta, "Fecha:", fecha, "CVV:", cvv);

  const [mes, anio] = fecha.split("/").map(Number);
  console.log("Mes:", mes, "Año:", anio);

  if (mes < 1 || mes > 12) {
    console.log("Error: Mes fuera de rango.");
    return { valido: false, error: "Mes inválido" };
  }
  if (cvv.length !== 3) {
    console.log("Error: CVV no tiene 3 dígitos.");
    return { valido: false, error: "CVV inválido" };
  }

  return { valido: true };
}

// AFD para validar direcciones IPv4
function validarIPv4(cadena) {
  console.log("Validando IPv4:", cadena);
  const regex =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;
  if (!regex.test(cadena)) {
    console.log("Error: No coincide con el formato esperado.");
    return { valido: false, error: "Formato inválido" };
  }

  const octetos = cadena.split(".").map(Number);
  for (const octeto of octetos) {
    if (octeto < 0 || octeto > 255) {
      console.log("Error: Octeto fuera de rango.");
      return { valido: false, error: "Octeto fuera de rango" };
    }
  }

  return { valido: true };
}

// Exportar funciones al ámbito global para el navegador
window.validarTarjetaCredito = validarTarjetaCredito;
window.validarIPv4 = validarIPv4;
