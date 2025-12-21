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
    svg.innerHTML = ""

    materias.forEach(m => {
        const to = document.getElementById(m.id)
        if (!to) return

        const r2 = to.getBoundingClientRect()

        m.correlativas.forEach(c => {
            const from = document.getElementById(c)
            if (!from) return

            const r1 = from.getBoundingClientRect()

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
            line.setAttribute("x1", r1.right)
            line.setAttribute("y1", r1.top + r1.height / 2)
            line.setAttribute("x2", r2.left)
            line.setAttribute("y2", r2.top + r2.height / 2)
            line.setAttribute("stroke", "#aaa")
            line.setAttribute("stroke-width", "1.5")

            svg.appendChild(line)
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
