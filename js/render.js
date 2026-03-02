const columnasContainer = document.getElementById("columnas")

// ===== RENDER PRINCIPAL =====

function renderColumnas(materias) {
    columnasContainer.innerHTML = ""

    const porAnio = {}

    materias.forEach(m => {
        if (!porAnio[m.anio]) porAnio[m.anio] = []
        porAnio[m.anio].push(m)
    })

    Object.keys(porAnio).sort().forEach(anio => {
        const col = document.createElement("div")
        col.className = `columna anio-${anio}`

        const titulo = document.createElement("h2")
        titulo.textContent = `${anio}° año`
        col.appendChild(titulo)

        const subcols = document.createElement("div")
        subcols.className = "subcolumnas"

        const left = document.createElement("div")
        const right = document.createElement("div")
        left.className = "subcol"
        right.className = "subcol"

        porAnio[anio].forEach((materia, index) => {
            const nodo = document.createElement("div")
            nodo.className = "materia"
            nodo.dataset.id = materia.id
            nodo.textContent = materia.nombre

            nodo.onclick = () => {
                toggleMateria(materia.id)
                actualizarEstadosVisuales(materias)
                actualizarProgreso(materias)
            };

            (index % 2 === 0 ? left : right).appendChild(nodo)
        })

        subcols.appendChild(left)
        subcols.appendChild(right)
        col.appendChild(subcols)
        columnasContainer.appendChild(col)
    })
}

// ===== ACTUALIZACIONES VISUALES =====

function actualizarEstadosVisuales(materias) {
    materias.forEach(materia => {
        const nodo = document.querySelector(
            `.materia[data-id="${materia.id}"]`
        )
        if (!nodo) return

        nodo.className = "materia"

        const estado = estadoActivo()

        if (estaAprobada(materia, estado)) {
            nodo.classList.add("aprobada")
        } else if (estaHabilitada(materia, estado)) {
            nodo.classList.add("habilitada")
        } else {
            nodo.classList.add("bloqueada")
        }

        if (modo === "comparacion") {
            const yo = estadoPropio.aprobadas.includes(materia.id)
            const amigo = estadoAmigo.aprobadas.includes(materia.id)

            if (yo && amigo) nodo.classList.add("juntos")
            else if (amigo) nodo.classList.add("amigo")
        }
    })
}

// ===== PROGRESO =====

function actualizarProgreso(materias) {
    const { total, aprobadas, porcentaje } =
        calcularProgreso(materias, estadoPropio)

    document.getElementById("progreso-texto").textContent =
        `Progreso: ${porcentaje}% — ${aprobadas} / ${total}`

    document.getElementById("progreso-barra").style.width =
        `${porcentaje}%`
}
