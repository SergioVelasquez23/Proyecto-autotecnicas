// Eliminar el uso de require y ajustar el archivo para que funcione en el navegador
// Las funciones validarTarjetaCredito y validarCURP ya están disponibles en el ámbito global
console.log("Validator cargado.");

function identificarYValidar(linea, index) {
  const regexTarjeta = /^\d{4} \d{4} \d{4} \d{4} \d{2}\/\d{4} \d{3}$/;
  const regexIPv4 =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

  if (regexTarjeta.test(linea)) {
    const resultadoTarjeta = window.validarTarjetaCredito(linea);
    if (resultadoTarjeta.valido) {
      console.log(`Línea ${index + 1}: Tarjeta válida`);
    } else {
      console.log(`Línea ${index + 1}: Inválida - ${resultadoTarjeta.error}`);
    }
  } else if (regexIPv4.test(linea)) {
    const resultadoIPv4 = window.validarIPv4(linea);
    if (resultadoIPv4.valido) {
      console.log(`Línea ${index + 1}: IPv4 válida`);
    } else {
      console.log(`Línea ${index + 1}: Inválida - ${resultadoIPv4.error}`);
    }
  } else {
    console.log(
      `Línea ${index + 1}: Inválida - No coincide con ningún formato esperado`
    );
  }
}

function validarArchivo(lineas) {
  lineas.forEach((linea, index) => {
    identificarYValidar(linea, index);
  });
}

// Se comenta la llamada a la función validarArchivo ya que ahora se manejará en el script HTML
// validarArchivo("cadenas.txt");

window.validarArchivo = validarArchivo;
