// ============================
// CONFIG
// ============================

let estado = {
    aprobadas: []
}

// ============================
// INIT
// ============================

fetch("materias.json")
    .then(res => res.json())
    .then(materias => {
        cargarEstado()
        renderColumnas(materias)
        actualizarEstadosVisuales(materias)
        actualizarProgreso(materias)
    })

// ============================
// ESTADO (localStorage)
// ============================

function guardarEstado() {
    localStorage.setItem("estadoMaterias", JSON.stringify(estado))
}

function cargarEstado() {
    const data = localStorage.getItem("estadoMaterias")
    if (data) estado = JSON.parse(data)
}

// ============================
// RENDER COLUMNAS + SUBCOLUMNAS
// ============================

function renderColumnas(materias) {
    const contenedor = document.getElementById("columnas")
    contenedor.innerHTML = ""

    const porAnio = agruparPorAnio(materias)

    Object.keys(porAnio)
        .sort((a, b) => a - b)
        .forEach(anio => {
            const col = document.createElement("div")
            col.className = "columna"

            const titulo = document.createElement("h2")
            titulo.textContent = `Año ${anio}`
            col.appendChild(titulo)

            const wrap = document.createElement("div")
            wrap.className = "anio-wrap"

            const colA = document.createElement("div")
            colA.className = "subcolumna"

            const colB = document.createElement("div")
            colB.className = "subcolumna"

            porAnio[anio]
                .sort((a, b) => peso(b, materias) - peso(a, materias))
                .forEach(m => {
                    const div = document.createElement("div")
                    div.className = `materia anio-${anio}`
                    div.id = m.id
                    div.textContent = m.nombre

                    div.addEventListener("click", () => {
                        if (estaHabilitada(m)) {
                            toggleAprobada(m.id, materias)
                        }
                    })

                    subcolumna(m, materias) === "B"
                        ? colB.appendChild(div)
                        : colA.appendChild(div)
                })

            wrap.appendChild(colA)
            wrap.appendChild(colB)
            col.appendChild(wrap)
            contenedor.appendChild(col)
        })
}

// ============================
// LÓGICA DE ESTADO
// ============================

function toggleAprobada(id, materias) {
    const idx = estado.aprobadas.indexOf(id)

    if (idx === -1) {
        estado.aprobadas.push(id)
    } else {
        estado.aprobadas.splice(idx, 1)
    }

    guardarEstado()
    actualizarEstadosVisuales(materias)
    actualizarProgreso(materias)
}

function estaHabilitada(materia) {
    return materia.correlativas.every(id =>
        estado.aprobadas.includes(id)
    )
}

function actualizarEstadosVisuales(materias) {
    materias.forEach(m => {
        const el = document.getElementById(m.id)
        if (!el) return

        el.classList.remove("aprobada", "habilitada", "bloqueada")

        if (estado.aprobadas.includes(m.id)) {
            el.classList.add("aprobada")
        } else if (estaHabilitada(m)) {
            el.classList.add("habilitada")
        } else {
            el.classList.add("bloqueada")
        }
    })
}

// ============================
// SUBCOLUMNAS (CORRELATIVAS INTERNAS)
// ============================

function tieneCorrelativasInternas(materia, materias) {
    return materia.correlativas.some(id => {
        const dep = materias.find(m => m.id === id)
        return dep && dep.anio === materia.anio
    })
}

function subcolumna(materia, materias) {
    return tieneCorrelativasInternas(materia, materias) ? "B" : "A"
}

// ============================
// HELPERS
// ============================

function agruparPorAnio(materias) {
    return materias.reduce((acc, m) => {
        if (!acc[m.anio]) acc[m.anio] = []
        acc[m.anio].push(m)
        return acc
    }, {})
}

function peso(materia, materias) {
    return materias.filter(m =>
        m.correlativas.includes(materia.id)
    ).length
}

// ============================
// RESET
// ============================

document.getElementById("reset-btn").addEventListener("click", () => {
    if (!confirm("¿Seguro que querés resetear todo el progreso?")) return

    estado.aprobadas = []
    guardarEstado()

    fetch("materias.json")
        .then(res => res.json())
        .then(materias => {
            actualizarEstadosVisuales(materias)
            actualizarProgreso(materias)
        })
})

// ============================
// PROGRESO
// ============================

function actualizarProgreso(materias) {
    const total = materias.length
    const aprobadas = estado.aprobadas.length
    const porcentaje = total === 0 ? 0 : Math.round((aprobadas / total) * 100)

    document.getElementById("progreso-texto").textContent =
        `Progreso: ${porcentaje}% — ${aprobadas} / ${total} materias aprobadas`

    document.getElementById("progreso-barra").style.width = `${porcentaje}%`
}
