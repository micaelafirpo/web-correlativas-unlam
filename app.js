let materias = []
let aprobadas = JSON.parse(localStorage.getItem("aprobadas")) || []

/* Layout */
const ANCHO_ANIO = 260
const OFFSET_X = 60
const OFFSET_Y = 80
const ESPACIADO_Y = 70

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
    const contador = {}

    materias.forEach(m => {
        if (!contador[m.anio]) contador[m.anio] = 0

        m.x = OFFSET_X + (m.anio - 1) * ANCHO_ANIO
        m.y = OFFSET_Y + contador[m.anio] * ESPACIADO_Y

        contador[m.anio]++
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

    // Definición de flecha
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
    defs.innerHTML = `
    <marker id="arrow" markerWidth="10" markerHeight="10"
      refX="10" refY="3"
      orient="auto"
      markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#aaa"/>
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

            // Coordenadas relativas al contenedor
            const x1 = r1.right - contRect.left
            const y1 = r1.top + r1.height / 2 - contRect.top
            const x2 = r2.left - contRect.left
            const y2 = r2.top + r2.height / 2 - contRect.top

            const dx = (x2 - x1) * 0.5

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
            path.setAttribute(
                "d",
                `M ${x1} ${y1}
         C ${x1 + dx} ${y1},
           ${x2 - dx} ${y2},
           ${x2} ${y2}`
            )

            path.setAttribute("fill", "none")
            path.setAttribute("stroke", "#aaa")
            path.setAttribute("stroke-width", "1.5")
            path.setAttribute("marker-end", "url(#arrow)")

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
