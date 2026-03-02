let materiasGlobal = []

// ===== INIT =====

fetch("materias.json")
    .then(res => res.json())
    .then(materias => {
        materiasGlobal = materias
        cargarEstadoPropio()
        renderColumnas(materiasGlobal)
        actualizarEstadosVisuales(materiasGlobal)
        actualizarProgreso(materiasGlobal)
    })

// ===== BOTONES =====

document.getElementById("reset-btn").onclick = () => {
    if (!confirm("¿Seguro que querés resetear tu progreso?")) return
    resetearEstadoPropio()
    actualizarEstadosVisuales(materiasGlobal)
    actualizarProgreso(materiasGlobal)
}

document.getElementById("modo-personal").onclick = () => {
    modo = "personal"
    actualizarEstadosVisuales(materiasGlobal)
}

document.getElementById("modo-compartido").onclick = () => {
    modo = "comparacion"
    actualizarEstadosVisuales(materiasGlobal)
}
