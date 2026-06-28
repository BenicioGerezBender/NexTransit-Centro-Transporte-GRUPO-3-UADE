const condicionesActuales = document.getElementById("condicionesActuales");
const calidadAmbiental = document.getElementById("calidadAmbiental");

const urlCondiciones = "https://api.open-meteo.com/v1/forecast?latitude=-34.6037&longitude=-58.3816&current=temperature_2m,wind_speed_10m,precipitation,weather_code&timezone=America%2FArgentina%2FBuenos_Aires";
const urlCalidadAmbiental = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=-34.6037&longitude=-58.3816&current=pm2_5,pm10,european_aqi&timezone=America%2FArgentina%2FBuenos_Aires";

function formatearDato(valor, unidad) {
  const numero = Number(valor);

  if (Number.isFinite(numero)) {
    if (unidad) {
      return `${numero.toLocaleString("es-AR", { maximumFractionDigits: 1 })} ${unidad}`;
    }

    return numero.toLocaleString("es-AR", { maximumFractionDigits: 1 });
  }

  return "No disponible";
}

function obtenerRecomendacionClima(precipitacion, viento) {
  let recomendacion = "Condiciones normales para operar dentro de la central.";

  if (precipitacion > 0) {
    recomendacion = "Hay precipitaciones. Se recomienda circular con precaución dentro de la central.";
  } else if (viento >= 35) {
    recomendacion = "Viento elevado. Revisar sujeción de carga antes de salir.";
  }

  return recomendacion;
}

function obtenerRecomendacionAmbiental(indiceAmbiental) {
  const indice = Number(indiceAmbiental);
  let recomendacion = "Calidad ambiental adecuada para operar con normalidad.";

  if (!Number.isFinite(indice)) {
    recomendacion = "No hay información ambiental completa. Revisar novedades antes de permanecer al aire libre.";
  } else if (indice >= 80) {
    recomendacion = "Calidad ambiental desfavorable. Evitar permanencia prolongada en exteriores.";
  } else if (indice >= 50) {
    recomendacion = "Calidad ambiental moderada. Se recomienda limitar esperas prolongadas al aire libre.";
  }

  return recomendacion;
}

function mostrarCondiciones(datos) {
  const condiciones = datos.current;
  const temperatura = condiciones.temperature_2m;
  const viento = condiciones.wind_speed_10m;
  const precipitacion = condiciones.precipitation;
  const recomendacion = obtenerRecomendacionClima(precipitacion, viento);

  condicionesActuales.innerHTML = `
    <h3>Condiciones actuales</h3>
    <p class="dato-condicion"><strong>Temperatura:</strong> ${formatearDato(temperatura, "°C")}</p>
    <p class="dato-condicion"><strong>Viento:</strong> ${formatearDato(viento, "km/h")}</p>
    <p class="dato-condicion"><strong>Precipitación:</strong> ${formatearDato(precipitacion, "mm")}</p>
    <p class="recomendacion-operativa"><strong>Recomendación para conductores:</strong> ${recomendacion}</p>
  `;
}

function mostrarCalidadAmbiental(datos) {
  const calidad = datos.current;
  const pm25 = calidad.pm2_5;
  const pm10 = calidad.pm10;
  const indiceAmbiental = calidad.european_aqi;
  const recomendacion = obtenerRecomendacionAmbiental(indiceAmbiental);

  calidadAmbiental.innerHTML = `
    <h3>Calidad ambiental</h3>
    <p class="dato-condicion"><strong>PM2.5:</strong> ${formatearDato(pm25, "µg/m³")}</p>
    <p class="dato-condicion"><strong>PM10:</strong> ${formatearDato(pm10, "µg/m³")}</p>
    <p class="dato-condicion"><strong>Índice ambiental:</strong> ${formatearDato(indiceAmbiental, "")}</p>
    <p class="recomendacion-operativa"><strong>Recomendación para permanencia en exteriores:</strong> ${recomendacion}</p>
  `;
}

function mostrarError(contenedor, titulo) {
  contenedor.innerHTML = `
    <h3>${titulo}</h3>
    <p class="estado-error">No se pudo cargar esta información en este momento. Intentá nuevamente más tarde.</p>
  `;
}

if (condicionesActuales) {
  fetch(urlCondiciones)
    .then(function (respuesta) {
      if (!respuesta.ok) {
        throw new Error("Condiciones no disponibles.");
      }

      return respuesta.json();
    })
    .then(function (datos) {
      mostrarCondiciones(datos);
    })
    .catch(function () {
      mostrarError(condicionesActuales, "Condiciones actuales");
    });
}

if (calidadAmbiental) {
  fetch(urlCalidadAmbiental)
    .then(function (respuesta) {
      if (!respuesta.ok) {
        throw new Error("Calidad ambiental no disponible.");
      }

      return respuesta.json();
    })
    .then(function (datos) {
      mostrarCalidadAmbiental(datos);
    })
    .catch(function () {
      mostrarError(calidadAmbiental, "Calidad ambiental");
    });
}
