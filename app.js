let materias = []
let aprobadas = JSON.parse(localStorage.getItem("aprobadas")) || []

/* Layout */
const ANCHO_ANIO = 400        // bloque por año
const OFFSET_X = 80
const OFFSET_Y = 80
const ESPACIADO_Y = 90

const NODO_ANCHO = 140
const SUBCOL_GAP = 40        // espacio entre subcolumnas


/* Cargar materias */
fetch("materias.json")
    .then(res => res.json())
    .then(data => {
        materias = data
        calcularPosiciones()
        render()
    })

/* Posiciones fijas por año */
function calcularPosiciones() {
    const porAnio = {}

    materias.forEach(m => {
        if (!porAnio[m.anio]) {
            porAnio[m.anio] = { izq: 0, der: 0 }
        }

        // asignación determinística: primero llena izq, luego der
        const col = porAnio[m.anio].izq <= porAnio[m.anio].der ? "izq" : "der"

        const baseX = OFFSET_X + (m.anio - 1) * ANCHO_ANIO

        const xIzq = baseX
        const xDer = baseX + NODO_ANCHO + SUBCOL_GAP

        m.x = col === "izq" ? xIzq : xDer
        m.y = OFFSET_Y + porAnio[m.anio][col] * ESPACIADO_Y

        porAnio[m.anio][col]++
    })
}




/* Habilitación */
function estaHabilitada(materia) {
    return materia.correlativas.every(c => aprobadas.includes(c))
}

/* Toggle aprobar */
function toggleMateria(id) {
    if (aprobadas.includes(id)) {
        aprobadas = aprobadas.filter(m => m !== id)
    } else {
        aprobadas.push(id)
    }

    localStorage.setItem("aprobadas", JSON.stringify(aprobadas))
    render()
}

/* Render nodos */
function renderNodos() {
    const cont = document.getElementById("nodes")
    cont.innerHTML = ""

    materias.forEach(m => {
        const div = document.createElement("div")
        div.className = `nodo a${m.anio}`
        div.id = m.id
        div.textContent = m.nombre

        div.style.left = `${m.x}px`
        div.style.top = `${m.y}px`

        if (estaHabilitada(m)) div.classList.add("habilitada")
        if (aprobadas.includes(m.id)) div.classList.add("aprobada")

        div.onclick = () => {
            if (estaHabilitada(m) || aprobadas.includes(m.id)) {
                toggleMateria(m.id)
            }
        }

        cont.appendChild(div)
    })
}

/* Render flechas */
function renderFlechas() {
    const svg = document.getElementById("edges")
    const container = document.getElementById("grafo-container")
    svg.innerHTML = ""

    const contRect = container.getBoundingClientRect()

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
    defs.innerHTML = `
    <marker id="arrow"
      markerWidth="8"
      markerHeight="8"
      refX="8"
      refY="4"
      orient="auto"
      markerUnits="strokeWidth">
      <path d="M0,0 L0,8 L8,4 z" fill="#999"/>
    </marker>
  `
    svg.appendChild(defs)

    materias.forEach(m => {
        const to = document.getElementById(m.id)
        if (!to) return

        const r2 = to.getBoundingClientRect()

        m.correlativas.forEach(c => {
            const from = document.getElementById(c)
            if (!from) return

            const r1 = from.getBoundingClientRect()

            const x1 = r1.left + r1.width - contRect.left
            const y1 = r1.top + r1.height / 2 - contRect.top
            const x2 = r2.left - contRect.left
            const y2 = r2.top + r2.height / 2 - contRect.top

            const sameYear = from.classList.contains(`a${m.anio}`)

            let d

            if (sameYear) {
                // curva vertical elegante
                const midY = (y1 + y2) / 2
                d = `
          M ${x1} ${y1}
          C ${x1 + 40} ${y1},
            ${x2 - 40} ${midY},
            ${x2} ${y2}
        `
            } else {
                const dx = (x2 - x1) * 0.6
                d = `
          M ${x1} ${y1}
          C ${x1 + dx} ${y1},
            ${x2 - dx} ${y2},
            ${x2} ${y2}
        `
            }

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
            path.setAttribute("d", d)
            path.setAttribute("fill", "none")
            path.setAttribute("stroke", "#999")
            path.setAttribute("stroke-width", "1.2")
            path.setAttribute("stroke-linecap", "round")
            path.setAttribute("marker-end", "url(#arrow)")
            path.setAttribute("opacity", "0.7")

            svg.appendChild(path)
        })
    })
}



/* Render general */
function render() {
    renderNodos()
    renderFlechas()
}

/* Reset */
document.getElementById("reset").onclick = () => {
    aprobadas = []
    localStorage.removeItem("aprobadas")
    render()
}
