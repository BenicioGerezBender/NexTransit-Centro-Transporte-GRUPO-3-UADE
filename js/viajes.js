const formularioConsulta = document.getElementById("formularioConsulta");
const resultadoConsulta = document.getElementById("resultadoConsulta");

// Datos simulados. Pueden reemplazarse por información real del proyecto.
const recorridos = [
  {
    destino: "Neuquén",
    transporte: "Ruta Sur",
    sector: "Dársena 2",
    tiempo: "14 horas",
    costo: "$210.000"
  },
  {
    destino: "Cipolletti",
    transporte: "Ruta Sur",
    sector: "Dársena 2",
    tiempo: "13 horas 30 minutos",
    costo: "$200.000"
  },
  {
    destino: "General Roca",
    transporte: "Ruta Sur",
    sector: "Dársena 3",
    tiempo: "14 horas 30 minutos",
    costo: "$220.000"
  },
  {
    destino: "Añelo",
    transporte: "Ruta Sur",
    sector: "Dársena 4",
    tiempo: "16 horas",
    costo: "$250.000"
  },
  {
    destino: "Bahía Blanca",
    transporte: "Ruta Sur",
    sector: "Dársena 5",
    tiempo: "8 horas 30 minutos",
    costo: "$180.000"
  },
  {
    destino: "CABA",
    transporte: "TransRuta",
    sector: "Plataforma 1",
    tiempo: "45 minutos",
    costo: "$35.000"
  },
  {
    destino: "Pilar",
    transporte: "TransRuta",
    sector: "Plataforma 2",
    tiempo: "1 hora 20 minutos",
    costo: "$55.000"
  },
  {
    destino: "Quilmes",
    transporte: "TransRuta",
    sector: "Plataforma 1",
    tiempo: "50 minutos",
    costo: "$38.000"
  },
  {
    destino: "Gral. San Martín",
    transporte: "TransRuta",
    sector: "Plataforma 3",
    tiempo: "1 hora",
    costo: "$42.000"
  },
  {
    destino: "Interior del país",
    transporte: "TransRuta",
    sector: "Coordinación logística",
    tiempo: "A coordinar",
    costo: "Consultar"
  },
  {
    destino: "Rosario",
    transporte: "López Logística",
    sector: "Sector de carga seca",
    tiempo: "4 horas",
    costo: "$95.000"
  },
  {
    destino: "Córdoba",
    transporte: "López Logística",
    sector: "Sector de carga seca",
    tiempo: "7 horas",
    costo: "$150.000"
  },
  {
    destino: "Mendoza",
    transporte: "López Logística",
    sector: "Sector de carga refrigerada",
    tiempo: "12 horas",
    costo: "$240.000"
  },
  {
    destino: "Tucumán",
    transporte: "López Logística",
    sector: "Sector de carga controlada",
    tiempo: "14 horas",
    costo: "$270.000"
  }
];

function obtenerRecomendacionLopez(recorrido) {
  let recomendacion = "Dirigite al sector asignado y verificá documentación, carga y condiciones de la unidad antes de salir.";

  if (recorrido.sector === "Sector de carga seca") {
    recomendacion = "Verificá documentación, embalaje y sector asignado antes de iniciar el recorrido.";
  } else if (recorrido.sector === "Sector de carga refrigerada") {
    recomendacion = "Controlá temperatura, documentación y estado de la unidad antes de salir a ruta.";
  } else if (recorrido.sector === "Sector de carga controlada") {
    recomendacion = "Confirmá habilitación, documentación y condiciones de seguridad antes del despacho.";
  }

  return recomendacion;
}

function obtenerRecomendacion(servicio, recorrido) {
  let recomendacion = "";

  if (recorrido && recorrido.transporte === "Ruta Sur") {
    if (servicio === "descanso") {
      recomendacion = "Si tenés espera previa, usá los servicios de NexTransit antes de dirigirte a la dársena asignada.";
    } else if (servicio === "carga") {
      recomendacion = "Dirigite a la dársena asignada y verificá documentación, carga y recorrido antes de salir hacia el sur argentino.";
    } else if (servicio === "soporte") {
      recomendacion = "Consultá en la oficina de información y confirmá la dársena asignada antes de salir a ruta.";
    }
  } else if (recorrido && recorrido.transporte === "TransRuta" && recorrido.destino === "Interior del país") {
    if (servicio === "descanso") {
      recomendacion = "Usá el área de descanso si tenés espera previa y confirmá la coordinación antes del despacho.";
    } else if (servicio === "carga") {
      recomendacion = "Confirmá la coordinación en la oficina de información y verificá documentación antes del despacho.";
    } else if (servicio === "soporte") {
      recomendacion = "Solicitá asistencia en la oficina de información para revisar coordinación, documentación y salida.";
    }
  } else if (recorrido && recorrido.transporte === "TransRuta") {
    if (servicio === "descanso") {
      recomendacion = "Si tenés espera previa, usá estacionamiento y servicios antes de pasar por la plataforma asignada.";
    } else if (servicio === "carga") {
      recomendacion = "Dirigite a la plataforma asignada y verificá el estado de la carga antes de la salida.";
    } else if (servicio === "soporte") {
      recomendacion = "Consultá en la oficina de información el estado del recorrido y la plataforma asignada.";
    }
  } else if (recorrido && recorrido.transporte === "López Logística") {
    if (servicio === "descanso") {
      recomendacion = "Si tenés espera previa, usá los servicios de NexTransit antes de pasar por el sector indicado.";
    } else if (servicio === "carga") {
      recomendacion = obtenerRecomendacionLopez(recorrido);
    } else if (servicio === "soporte") {
      recomendacion = "Solicitá asistencia en la oficina de información y verificá condiciones de carga antes de salir.";
    }
  } else if (servicio === "descanso") {
    recomendacion = "Usar el área de descanso, duchas y estacionamiento antes de continuar el viaje.";
  } else if (servicio === "carga") {
    recomendacion = "Pasar por Coordinación para revisar la documentación de carga.";
  } else if (servicio === "soporte") {
    recomendacion = "Solicitar atención en la oficina de información para revisar rutas y salidas.";
  }

  return recomendacion;
}

function obtenerProximosPasos(recorrido) {
  if (recorrido.transporte === "Ruta Sur") {
    return [
      "Verificá que el transporte asignado sea Ruta Sur.",
      `Dirigite a ${recorrido.sector}.`,
      "Si tenés espera previa, usá los servicios de NexTransit.",
      "Revisá documentación, carga y recorrido antes de salir hacia el sur argentino."
    ];
  }

  if (recorrido.transporte === "TransRuta") {
    return [
      "Verificá que el transporte asignado sea TransRuta.",
      `Dirigite a ${recorrido.sector}.`,
      "Confirmá documentación, carga y horario de salida.",
      "Aprovechá los servicios de NexTransit durante la espera previa al despacho."
    ];
  }

  if (recorrido.transporte === "López Logística") {
    return [
      "Verificá que el transporte asignado sea López Logística.",
      `Dirigite al sector indicado: ${recorrido.sector}.`,
      "Revisá documentación y condiciones de la carga.",
      "Si tenés espera previa, usá los servicios de NexTransit.",
      "Confirmá el recorrido antes de salir a ruta."
    ];
  }

  return [
    "Verificá tu transporte integrado asignado.",
    `Dirigite a ${recorrido.sector}.`,
    "Si tenés espera previa, usá estacionamiento, baños, duchas o área de descanso.",
    "Antes de salir, revisá documentación, recorrido y recomendación operativa."
  ];
}

function generarListaPasos(pasos) {
  let contenido = "";

  pasos.forEach(function (paso) {
    contenido += `<li>${paso}</li>`;
  });

  return contenido;
}

function obtenerEtiquetaSector(sector) {
  let etiqueta = "Sector asignado";

  if (sector.startsWith("Dársena")) {
    etiqueta = "Dársena asignada";
  } else if (sector.startsWith("Plataforma")) {
    etiqueta = "Plataforma asignada";
  }

  return etiqueta;
}

if (formularioConsulta) {
  formularioConsulta.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const destino = document.getElementById("destino").value;
    const servicio = document.getElementById("servicio").value;

    const recorridoElegido = recorridos.find(function (recorrido) {
      return recorrido.destino === destino;
    });

    const recomendacion = obtenerRecomendacion(servicio, recorridoElegido);

    if (!recorridoElegido || recomendacion === "") {
      resultadoConsulta.innerHTML = "<h3>Instrucciones para tu viaje</h3><p>Seleccioná tu destino y tipo de servicio para recibir instrucciones operativas antes de salir a ruta.</p>";
      return;
    }

    const etiquetaSector = obtenerEtiquetaSector(recorridoElegido.sector);
    const proximosPasos = obtenerProximosPasos(recorridoElegido);

    resultadoConsulta.innerHTML = `
      <h3>Instrucciones para tu viaje</h3>
      <div class="viaje-asignado">
        <h4>Tu viaje asignado</h4>
        <p class="dato-principal"><strong>Destino:</strong> ${recorridoElegido.destino}</p>
        <p class="dato-principal"><strong>Transporte integrado asignado:</strong> ${recorridoElegido.transporte}</p>
        <p class="dato-darsena-destacado"><strong>${etiquetaSector}:</strong> ${recorridoElegido.sector}</p>
        <p class="dato-principal"><strong>Tiempo estimado de viaje:</strong> ${recorridoElegido.tiempo}</p>
        <p class="dato-principal"><strong>Costo estimado:</strong> ${recorridoElegido.costo}</p>
        <p class="recomendacion-operativa"><strong>Recomendación operativa:</strong> ${recomendacion}</p>
      </div>

      <div class="proximos-pasos">
        <h4>Próximos pasos</h4>
        <ol>
          ${generarListaPasos(proximosPasos)}
        </ol>
      </div>

      <div class="acciones-resultado">
        <a class="boton" href="mapa.html">Ver mapa de la central</a>
        <a class="boton boton-secundario" href="servicios.html">Ver servicios disponibles</a>
        <a class="boton boton-secundario" href="#monitoreo-camiones">Ver mapa operativo</a>
      </div>
    `;

    if (typeof actualizarMapaConsulta === "function") {
      actualizarMapaConsulta({
        destino: recorridoElegido.destino,
        transporte: recorridoElegido.transporte,
        sector: recorridoElegido.sector,
        tiempo: recorridoElegido.tiempo,
        costo: recorridoElegido.costo,
        recomendacion: recomendacion
      });
    }
  });
}
