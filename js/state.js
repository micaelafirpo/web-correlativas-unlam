// ===== ESTADO GLOBAL =====

let modo = "personal" // "personal" | "comparacion"

let estadoPropio = {
    aprobadas: []
}

let estadoAmigo = {
    aprobadas: []
}

// ===== HELPERS =====

function estadoActivo() {
    return modo === "personal" ? estadoPropio : estadoAmigo
}

// ===== LOCAL STORAGE =====

function guardarEstadoPropio() {
    localStorage.setItem(
        "estadoMateriasPropio",
        JSON.stringify(estadoPropio)
    )
}

function cargarEstadoPropio() {
    const data = localStorage.getItem("estadoMateriasPropio")
    if (data) {
        estadoPropio = JSON.parse(data)
    }
}

// ===== MUTACIONES =====

function toggleMateria(id) {
    const estado = estadoActivo()

    if (estado.aprobadas.includes(id)) {
        estado.aprobadas = estado.aprobadas.filter(m => m !== id)
    } else {
        estado.aprobadas.push(id)
    }

    if (modo === "personal") {
        guardarEstadoPropio()
    }
}

function resetearEstadoPropio() {
    estadoPropio.aprobadas = []
    guardarEstadoPropio()
}
