# 🎓 Mapa de Correlativas

Aplicación web interactiva para visualizar el plan de estudios de una carrera universitaria y gestionar el progreso personal en base a correlativas.

---

## ✨ Funcionalidades

- Visualización de materias organizadas por año
- Marcado de materias como aprobadas
- Habilitación automática según correlativas
- Cálculo de progreso en porcentaje
- Barra de progreso animada
- Botón para reiniciar el progreso

Todo funciona dinámicamente en el navegador, sin necesidad de backend.

---

## 🧠 ¿Cómo funciona?

Las materias están definidas en el archivo `materias.json`.

Cada materia tiene la siguiente estructura:

```json
{
  "id": "programacion_avanzada",
  "nombre": "Programacion avanzada",
  "anio": 3,
  "correlativas": ["paradigmas_de_programacion", "bases_de_datos_aplicada"]
}
```
---

## 📁 Estructura del Proyecto

/index.html
/css/styles.css
/js/data.js
/js/state.js
/js/render.js
/js/main.js

### Descripción

- `data.js` → Define las materias y sus correlativas.
- `state.js` → Maneja el estado del usuario y LocalStorage.
- `render.js` → Renderiza las materias en pantalla.
- `main.js` → Inicializa la aplicación.
- `styles.css` → Estilos visuales y colores por año.

---
