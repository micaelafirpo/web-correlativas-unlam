// ===== REGLAS =====

function estaAprobada(materia, estado) {
    return estado.aprobadas.includes(materia.id)
}

function estaHabilitada(materia, estado) {
    if (estaAprobada(materia, estado)) return true

    return materia.correlativas.every(id =>
        estado.aprobadas.includes(id)
    )
}

function habilitadaParaAmbos(materia) {
    return materia.correlativas.every(id =>
        estadoPropio.aprobadas.includes(id) &&
        estadoAmigo.aprobadas.includes(id)
    )
}

// ===== PROGRESO =====

function calcularProgreso(materias, estado) {
    const total = materias.length
    const aprobadas = estado.aprobadas.length
    const porcentaje = total === 0
        ? 0
        : Math.round((aprobadas / total) * 100)

    return {
        total,
        aprobadas,
        porcentaje
    }
}
