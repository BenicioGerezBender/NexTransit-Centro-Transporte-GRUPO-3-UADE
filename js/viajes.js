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
    destino: "Córdoba",
    transporte: "TransService",
    sector: "Plataforma 1",
    tiempo: "7 horas",
    costo: "$150.000"
  },
  {
    destino: "Rosario",
    transporte: "TransService",
    sector: "Plataforma 2",
    tiempo: "4 horas",
    costo: "$95.000"
  },
  {
    destino: "Mendoza",
    transporte: "López Logística",
    sector: "Sector de carga refrigerada",
    tiempo: "12 horas",
    costo: "$240.000"
  },
  {
    destino: "Mar del Plata",
    transporte: "López Logística",
    sector: "Sector de carga seca",
    tiempo: "5 horas 30 minutos",
    costo: "$120.000"
  }
];

function obtenerRecomendacion(servicio) {
  let recomendacion = "";

  if (servicio === "descanso") {
    recomendacion = "Usar el área de descanso, duchas y estacionamiento antes de continuar el viaje.";
  } else if (servicio === "carga") {
    recomendacion = "Pasar por Coordinación para revisar la documentación de carga.";
  } else if (servicio === "soporte") {
    recomendacion = "Solicitar atención en la oficina de información para revisar rutas y salidas.";
  }

  return recomendacion;
}

if (formularioConsulta) {
  formularioConsulta.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const destino = document.getElementById("destino").value;
    const servicio = document.getElementById("servicio").value;

    const recorridoElegido = recorridos.find(function (recorrido) {
      return recorrido.destino === destino;
    });

    const recomendacion = obtenerRecomendacion(servicio);

    if (!recorridoElegido || recomendacion === "") {
      resultadoConsulta.innerHTML = "<h3>Resultado de la consulta</h3><p>Seleccioná un destino y un tipo de servicio.</p>";
      return;
    }

    resultadoConsulta.innerHTML = `
      <h3>Resultado de la consulta</h3>
      <p><strong>Destino:</strong> ${recorridoElegido.destino}</p>
      <p><strong>Transporte integrado asignado:</strong> ${recorridoElegido.transporte}</p>
      <p><strong>Sector, plataforma o dársena asignada:</strong> ${recorridoElegido.sector}</p>
      <p><strong>Tiempo estimado de viaje:</strong> ${recorridoElegido.tiempo}</p>
      <p><strong>Costo estimado:</strong> ${recorridoElegido.costo}</p>
      <p><strong>Recomendación para el conductor:</strong> ${recomendacion}</p>
    `;
  });
}
