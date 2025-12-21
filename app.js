let materias = []
let aprobadas = JSON.parse(localStorage.getItem("aprobadas")) || []

fetch("materias.json")
    .then(res => res.json())
    .then(data => {
        materias = data
        render()
    })
    .catch(err => {
        console.error("Error cargando materias.json", err)
    })


const mapa = document.getElementById("mapa")
const svg = document.getElementById("lineas")

function estaHabilitada(m) {
    return m.correlativas.every(c => aprobadas.includes(c))
}

function toggleMateria(id) {
    if (aprobadas.includes(id)) {
        aprobadas = aprobadas.filter(m => m !== id)
    } else {
        aprobadas.push(id)
    }
    localStorage.setItem("aprobadas", JSON.stringify(aprobadas))
    render()
}

function render() {
    mapa.innerHTML = ""
    svg.innerHTML = ""

    const porAnio = {}
    materias.forEach(m => {
        if (!porAnio[m.anio]) porAnio[m.anio] = []
        porAnio[m.anio].push(m)
    })

    Object.keys(porAnio).forEach(anio => {
        const col = document.createElement("div")
        col.className = `columna anio-${anio}`
        col.innerHTML = `<h2>Año ${anio}</h2>`

        porAnio[anio].forEach(m => {
            const div = document.createElement("div")
            div.className = "materia"
            div.id = m.id
            div.textContent = m.nombre

            if (estaHabilitada(m)) div.classList.add("habilitada")
            if (aprobadas.includes(m.id)) div.classList.add("aprobada")

            div.dataset.tooltip =
                m.correlativas.length
                    ? "Correlativas:\n- " + m.correlativas.join("\n- ")
                    : "Sin correlativas"

            div.onclick = () => {
                if (estaHabilitada(m) || aprobadas.includes(m.id)) {
                    toggleMateria(m.id)
                    div.classList.add("animar")
                }
            }

            col.appendChild(div)
        })

        mapa.appendChild(col)
    })

    dibujarLineas()
}

function dibujarLineas() {
    const rectSvg = svg.getBoundingClientRect()

    materias.forEach(m => {
        const destino = document.getElementById(m.id)
        if (!destino) return

        const r2 = destino.getBoundingClientRect()

        m.correlativas.forEach(c => {
            const origen = document.getElementById(c)
            if (!origen) return

            const r1 = origen.getBoundingClientRect()

            const x1 = r1.right - rectSvg.left
            const y1 = r1.top + r1.height / 2 - rectSvg.top
            const x2 = r2.left - rectSvg.left
            const y2 = r2.top + r2.height / 2 - rectSvg.top

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
            line.setAttribute("x1", x1)
            line.setAttribute("y1", y1)
            line.setAttribute("x2", x2)
            line.setAttribute("y2", y2)
            line.setAttribute("stroke", "#999")
            line.setAttribute("stroke-width", "2")

            svg.appendChild(line)
        })
    })
}

document.getElementById("reset").onclick = () => {
    aprobadas = []
    localStorage.removeItem("aprobadas")
    render()
}

render()
