const contenedorMapaConsulta = document.getElementById("mapaConsulta");
const detalleMapaConsulta = document.getElementById("detalleMapaConsulta");

const origenNexTransit = {
  nombre: "NexTransit - CABA",
  lat: -34.6037,
  lng: -58.3816
};

const coordenadasDestinos = {
  "Neuquén": { lat: -38.9516, lng: -68.0591 },
  "Cipolletti": { lat: -38.9339, lng: -67.9903 },
  "General Roca": { lat: -39.0333, lng: -67.5833 },
  "Añelo": { lat: -38.3544, lng: -68.7884 },
  "Bahía Blanca": { lat: -38.7183, lng: -62.2663 },
  "CABA": { lat: -34.6158, lng: -58.4333 },
  "Pilar": { lat: -34.4587, lng: -58.9142 },
  "Quilmes": { lat: -34.7203, lng: -58.2545 },
  "Gral. San Martín": { lat: -34.5744, lng: -58.5344 },
  "Interior del país": { lat: -34.8222, lng: -58.5358 },
  "Rosario": { lat: -32.9442, lng: -60.6505 },
  "Córdoba": { lat: -31.4201, lng: -64.1888 },
  "Mendoza": { lat: -32.8895, lng: -68.8458 },
  "Tucumán": { lat: -26.8083, lng: -65.2176 }
};

let mapaConsulta = null;
let marcadorOrigen = null;
let marcadorDestino = null;
let lineaRecorrido = null;
let solicitudRutaActiva = 0;

function crearMarcadorCircular(latitud, longitud, color, texto) {
  return L.circleMarker([latitud, longitud], {
    radius: 8,
    color: "#ffffff",
    weight: 2,
    fillColor: color,
    fillOpacity: 1
  }).bindPopup(texto);
}

function iniciarMapaConsulta() {
  if (!contenedorMapaConsulta || typeof L === "undefined") {
    if (detalleMapaConsulta) {
      detalleMapaConsulta.innerHTML = "<p>No se pudo cargar el mapa en este momento.</p>";
    }

    return;
  }

  mapaConsulta = L.map("mapaConsulta", {
    attributionControl: false
  }).setView([origenNexTransit.lat, origenNexTransit.lng], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18
  }).addTo(mapaConsulta);

  marcadorOrigen = crearMarcadorCircular(
    origenNexTransit.lat,
    origenNexTransit.lng,
    "#073b63",
    "Origen: NexTransit"
  ).addTo(mapaConsulta);
}

function obtenerEtiquetaUbicacionMapa(recorrido) {
  let etiqueta = "Dársena o sector";

  if (recorrido.transporte === "Ruta Sur") {
    etiqueta = "Dársena asignada";
  } else if (recorrido.sector.startsWith("Plataforma")) {
    etiqueta = "Plataforma asignada";
  }

  return etiqueta;
}

function obtenerTipoOperacionMapa(recorrido) {
  let tipoOperacion = "";

  if (recorrido.transporte === "López Logística") {
    tipoOperacion = `<p class="dato-mapa"><strong>Tipo de operación:</strong> ${recorrido.sector.replace("Sector de ", "")}</p>`;
  }

  return tipoOperacion;
}

function actualizarDetalleMapa(recorrido, estadoRecorrido) {
  const etiquetaUbicacion = obtenerEtiquetaUbicacionMapa(recorrido);
  const tipoOperacion = obtenerTipoOperacionMapa(recorrido);

  detalleMapaConsulta.innerHTML = `
    <h3>Detalle visual del recorrido</h3>
    <p><span class="badge-transporte">${recorrido.transporte}</span></p>
    <p class="dato-mapa"><strong>Destino:</strong> ${recorrido.destino}</p>
    <p class="dato-mapa"><strong>Transporte:</strong> ${recorrido.transporte}</p>
    <p class="dato-mapa"><strong>${etiquetaUbicacion}:</strong> ${recorrido.sector}</p>
    ${tipoOperacion}
    <p class="dato-mapa"><strong>Tiempo estimado de viaje:</strong> ${recorrido.tiempo}</p>
    <p class="dato-mapa"><strong>Costo estimado:</strong> ${recorrido.costo}</p>
    <p class="dato-mapa"><strong>Estado del recorrido:</strong> ${estadoRecorrido}</p>
    <p class="recomendacion-operativa"><strong>Recomendación:</strong> ${recorrido.recomendacion}</p>
  `;
}

function obtenerEstadoRecorridoMapa(recorrido, tipo) {
  if (recorrido.transporte === "Ruta Sur" && tipo === "principal") {
    return "Recorrido estimado hacia el sur argentino";
  }

  if (recorrido.transporte === "Ruta Sur") {
    return "Recorrido aproximado disponible hacia el sur argentino";
  }

  if (recorrido.transporte === "TransRuta" && recorrido.destino === "Interior del país" && tipo === "principal") {
    return "Recorrido estimado con coordinación al interior del país";
  }

  if (recorrido.transporte === "TransRuta" && recorrido.destino === "Interior del país") {
    return "Recorrido aproximado disponible con coordinación al interior del país";
  }

  if (recorrido.transporte === "TransRuta" && tipo === "principal") {
    return "Recorrido estimado para cobertura CABA/GBA";
  }

  if (recorrido.transporte === "TransRuta") {
    return "Recorrido aproximado disponible para cobertura CABA/GBA";
  }

  if (recorrido.transporte === "López Logística" && tipo === "principal") {
    return "Recorrido estimado para operación nacional";
  }

  if (recorrido.transporte === "López Logística") {
    return "Recorrido aproximado disponible para operación nacional";
  }

  if (tipo === "principal") {
    return "Recorrido estimado por rutas principales";
  }

  return "Recorrido aproximado disponible";
}

function limpiarMapaConsulta() {
  if (marcadorDestino) {
    marcadorDestino.remove();
    marcadorDestino = null;
  }

  if (lineaRecorrido) {
    lineaRecorrido.remove();
    lineaRecorrido = null;
  }
}

function obtenerRutaReal(origen, destino) {
  const url = `https://router.project-osrm.org/route/v1/driving/${origen.lng},${origen.lat};${destino.lng},${destino.lat}?overview=full&geometries=geojson`;

  return fetch(url)
    .then(function (respuesta) {
      if (!respuesta.ok) {
        throw new Error("No se pudo obtener el recorrido.");
      }

      return respuesta.json();
    })
    .then(function (datos) {
      if (!datos.routes || datos.routes.length === 0) {
        throw new Error("No hay recorrido disponible.");
      }

      return datos.routes[0].geometry;
    });
}

function dibujarRutaReal(geojson) {
  lineaRecorrido = L.geoJSON(geojson, {
    style: {
      color: "#1f6f9f",
      weight: 5,
      opacity: 0.9
    }
  }).addTo(mapaConsulta);

  mapaConsulta.fitBounds(lineaRecorrido.getBounds(), {
    padding: [35, 35]
  });
}

function dibujarRutaRespaldo(origen, destino) {
  lineaRecorrido = L.polyline(
    [
      [origen.lat, origen.lng],
      [destino.lat, destino.lng]
    ],
    {
      color: "#1f6f9f",
      weight: 5,
      opacity: 0.75,
      dashArray: "8 8"
    }
  ).addTo(mapaConsulta);

  mapaConsulta.fitBounds(lineaRecorrido.getBounds(), {
    padding: [35, 35]
  });
}

function actualizarMapaConsulta(recorrido) {
  if (!mapaConsulta || !detalleMapaConsulta) {
    return;
  }

  solicitudRutaActiva += 1;
  const solicitudActual = solicitudRutaActiva;
  const destino = coordenadasDestinos[recorrido.destino];

  if (!destino) {
    detalleMapaConsulta.innerHTML = "<p>No hay coordenadas disponibles para este destino.</p>";
    return;
  }

  limpiarMapaConsulta();

  marcadorDestino = crearMarcadorCircular(
    destino.lat,
    destino.lng,
    "#2c8c7c",
    `Destino: ${recorrido.destino}`
  ).addTo(mapaConsulta);

  detalleMapaConsulta.innerHTML = `
    <h3>Detalle visual del recorrido</h3>
    <p>Calculando recorrido estimado hacia ${recorrido.destino}...</p>
  `;

  obtenerRutaReal(origenNexTransit, destino)
    .then(function (geojson) {
      if (solicitudActual !== solicitudRutaActiva) {
        return;
      }

      dibujarRutaReal(geojson);
      actualizarDetalleMapa(recorrido, obtenerEstadoRecorridoMapa(recorrido, "principal"));
    })
    .catch(function () {
      if (solicitudActual !== solicitudRutaActiva) {
        return;
      }

      dibujarRutaRespaldo(origenNexTransit, destino);
      actualizarDetalleMapa(recorrido, obtenerEstadoRecorridoMapa(recorrido, "respaldo"));
      detalleMapaConsulta.innerHTML += "<p class=\"estado-error\">Recorrido estimado disponible. Si no se muestra el trazado completo, verificar la conexión.</p>";
    });
}

iniciarMapaConsulta();
