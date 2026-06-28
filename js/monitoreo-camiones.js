const mapaOperativoContenedor = document.getElementById("mapaOperativoCamiones");
const panelCamionesOperativo = document.getElementById("panelCamiones");

const baseNexTransit = {
  nombre: "NexTransit CABA",
  lat: -34.6037,
  lng: -58.3816
};

const camionesOperativos = [
  {
    empresa: "Ruta Sur",
    patente: "RS-204-AR",
    destino: "Neuquén",
    carga: "Insumos industriales",
    darsena: "Dársena 2",
    avance: 8,
    velocidad: 4,
    color: "#1f6f9f",
    ruta: [
      [-34.6037, -58.3816],
      [-35.9000, -61.9000],
      [-37.2000, -65.3000],
      [-38.9516, -68.0591]
    ]
  },
  {
    empresa: "Ruta Sur",
    patente: "RS-118-AR",
    destino: "Bahía Blanca",
    carga: "Carga comercial",
    darsena: "Dársena 5",
    avance: 26,
    velocidad: 3,
    color: "#1f6f9f",
    ruta: [
      [-34.6037, -58.3816],
      [-35.9000, -59.8000],
      [-37.2000, -61.1000],
      [-38.7183, -62.2663]
    ]
  },
  {
    empresa: "TransRuta",
    patente: "TR-214-BA",
    destino: "CABA",
    carga: "Distribución urbana",
    darsena: "Plataforma 1",
    avance: 42,
    velocidad: 5,
    color: "#2c8c7c",
    ruta: [
      [-34.6037, -58.3816],
      [-34.6070, -58.3950],
      [-34.6100, -58.4150],
      [-34.6158, -58.4333]
    ]
  },
  {
    empresa: "TransRuta",
    patente: "TR-508-BA",
    destino: "Quilmes",
    carga: "Carga general",
    darsena: "Plataforma 2",
    avance: 67,
    velocidad: 2,
    color: "#2c8c7c",
    ruta: [
      [-34.6037, -58.3816],
      [-34.6400, -58.3400],
      [-34.6800, -58.2900],
      [-34.7203, -58.2545]
    ]
  },
  {
    empresa: "TransRuta",
    patente: "TR-332-BA",
    destino: "Interior del país",
    carga: "Logística integral",
    darsena: "Coordinación logística",
    avance: 54,
    velocidad: 3,
    color: "#2c8c7c",
    ruta: [
      [-34.6037, -58.3816],
      [-34.6700, -58.4300],
      [-34.7450, -58.4800],
      [-34.8222, -58.5358]
    ]
  },
  {
    empresa: "López Logística",
    patente: "LL-330-AR",
    destino: "Mendoza",
    carga: "Carga refrigerada",
    darsena: "Sector de carga refrigerada",
    avance: 79,
    velocidad: 4,
    color: "#d9872b",
    ruta: [
      [-34.6037, -58.3816],
      [-34.3000, -61.8000],
      [-33.7000, -65.0000],
      [-32.8895, -68.8458]
    ]
  },
  {
    empresa: "López Logística",
    patente: "LL-902-AR",
    destino: "Rosario",
    carga: "Carga seca",
    darsena: "Sector de carga seca",
    avance: 93,
    velocidad: 3,
    color: "#d9872b",
    ruta: [
      [-34.6037, -58.3816],
      [-34.0000, -59.1000],
      [-33.5000, -59.8000],
      [-32.9442, -60.6505]
    ]
  },
  {
    empresa: "López Logística",
    patente: "LL-746-AR",
    destino: "Tucumán",
    carga: "Carga controlada",
    darsena: "Sector de carga controlada",
    avance: 31,
    velocidad: 4,
    color: "#d9872b",
    ruta: [
      [-34.6037, -58.3816],
      [-32.9000, -60.8000],
      [-29.8000, -63.2000],
      [-26.8083, -65.2176]
    ]
  }
];

let mapaOperativoCamiones = null;
let marcadorBaseOperativa = null;

function obtenerEstadoCamion(avance) {
  let estado = "Preparando salida";

  if (avance >= 16 && avance <= 70) {
    estado = "En ruta";
  } else if (avance >= 71 && avance <= 90) {
    estado = "Próximo a destino";
  } else if (avance >= 91 && avance <= 99) {
    estado = "En descarga";
  }

  return estado;
}

function obtenerClaseEstadoCamion(estado) {
  let clase = "estado-preparando";

  if (estado === "En ruta") {
    clase = "estado-en-ruta";
  } else if (estado === "Próximo a destino") {
    clase = "estado-proximo";
  } else if (estado === "En descarga") {
    clase = "estado-descarga";
  }

  return clase;
}

function obtenerRecomendacionOperativa(empresa) {
  let recomendacion = "Revisar estado de la unidad antes de continuar.";

  if (empresa === "Ruta Sur") {
    recomendacion = "Verificar descanso del conductor y documentación antes del próximo tramo.";
  } else if (empresa === "TransRuta") {
    recomendacion = "Verificar documentación y coordinación de salida antes del despacho.";
  } else if (empresa === "López Logística") {
    recomendacion = "Controlar documentación, condiciones de carga y estado de la unidad antes de salir a ruta.";
  }

  return recomendacion;
}

function calcularPosicionEnRuta(ruta, avance) {
  const progreso = avance / 100;
  const cantidadTramos = ruta.length - 1;
  const tramoDecimal = progreso * cantidadTramos;
  let tramoActual = Math.floor(tramoDecimal);

  if (tramoActual >= cantidadTramos) {
    tramoActual = cantidadTramos - 1;
  }

  const puntoInicio = ruta[tramoActual];
  const puntoFinal = ruta[tramoActual + 1];
  const avanceTramo = tramoDecimal - tramoActual;

  const lat = puntoInicio[0] + (puntoFinal[0] - puntoInicio[0]) * avanceTramo;
  const lng = puntoInicio[1] + (puntoFinal[1] - puntoInicio[1]) * avanceTramo;

  return [lat, lng];
}

function crearIconoCamion(empresa) {
  const iniciales = empresa
    .split(" ")
    .map(function (palabra) {
      return palabra.charAt(0);
    })
    .join("");

  return L.divIcon({
    className: "icono-camion-operativo",
    html: `<span>${iniciales}</span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

function actualizarTooltipCamion(camion) {
  const estado = obtenerEstadoCamion(camion.avance);

  camion.marcador.bindTooltip(
    `
      <strong>${camion.empresa}</strong><br>
      ${camion.patente}<br>
      Destino: ${camion.destino}<br>
      Estado: ${estado}<br>
      Avance: ${camion.avance}%
    `,
    {
      direction: "top",
      offset: [0, -12]
    }
  );
}

function crearTarjetaOperativa(camion) {
  const estado = obtenerEstadoCamion(camion.avance);
  const claseEstado = obtenerClaseEstadoCamion(estado);
  const recomendacion = obtenerRecomendacionOperativa(camion.empresa);

  return `
    <article class="camion-card">
      <div class="camion-encabezado">
        <span class="empresa-badge">${camion.empresa}</span>
        <span class="estado-badge ${claseEstado}">${estado}</span>
      </div>
      <h3>${camion.patente}</h3>
      <p class="dato-camion"><strong>Destino:</strong> ${camion.destino}</p>
      <p class="dato-camion"><strong>Carga:</strong> ${camion.carga}</p>
      <p class="dato-camion"><strong>Dársena o sector:</strong> ${camion.darsena}</p>
      <p class="dato-camion"><strong>Avance del recorrido:</strong> ${camion.avance}%</p>
      <div class="barra-avance">
        <progress class="barra-avance-interna ${claseEstado}" value="${camion.avance}" max="100">${camion.avance}%</progress>
      </div>
      <p class="recomendacion-camion"><strong>Recomendación operativa:</strong> ${recomendacion}</p>
    </article>
  `;
}

function actualizarPanelCamiones() {
  if (!panelCamionesOperativo) {
    return;
  }

  let contenido = "";

  camionesOperativos.forEach(function (camion) {
    contenido += crearTarjetaOperativa(camion);
  });

  panelCamionesOperativo.innerHTML = contenido;
}

function iniciarMapaOperativo() {
  if (!mapaOperativoContenedor || typeof L === "undefined") {
    if (panelCamionesOperativo) {
      panelCamionesOperativo.innerHTML = "<p>No se pudo cargar el mapa operativo en este momento.</p>";
    }

    return;
  }

  mapaOperativoCamiones = L.map("mapaOperativoCamiones", {
    attributionControl: false
  }).setView([baseNexTransit.lat, baseNexTransit.lng], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18
  }).addTo(mapaOperativoCamiones);

  marcadorBaseOperativa = L.circleMarker([baseNexTransit.lat, baseNexTransit.lng], {
    radius: 9,
    color: "#ffffff",
    weight: 2,
    fillColor: "#073b63",
    fillOpacity: 1
  }).bindTooltip("Base NexTransit").addTo(mapaOperativoCamiones);

  camionesOperativos.forEach(function (camion) {
    L.polyline(camion.ruta, {
      color: camion.color,
      weight: 4,
      opacity: 0.75
    }).addTo(mapaOperativoCamiones);

    const posicion = calcularPosicionEnRuta(camion.ruta, camion.avance);

    camion.marcador = L.marker(posicion, {
      icon: crearIconoCamion(camion.empresa)
    }).addTo(mapaOperativoCamiones);

    actualizarTooltipCamion(camion);
  });

  const puntos = [[baseNexTransit.lat, baseNexTransit.lng]];

  camionesOperativos.forEach(function (camion) {
    camion.ruta.forEach(function (punto) {
      puntos.push(punto);
    });
  });

  mapaOperativoCamiones.fitBounds(puntos, {
    padding: [25, 25]
  });

  actualizarPanelCamiones();
}

function moverCamionesOperativos() {
  if (!mapaOperativoCamiones) {
    return;
  }

  camionesOperativos.forEach(function (camion) {
    camion.avance += camion.velocidad;

    if (camion.avance >= 100) {
      camion.avance = 0;
    }

    const posicion = calcularPosicionEnRuta(camion.ruta, camion.avance);
    camion.marcador.setLatLng(posicion);
    actualizarTooltipCamion(camion);
  });

  actualizarPanelCamiones();
}

iniciarMapaOperativo();

if (mapaOperativoContenedor) {
  setInterval(moverCamionesOperativos, 3000);
}
