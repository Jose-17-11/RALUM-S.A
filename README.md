# RALUM S.A. - Catálogo Digital y Landing Page

Sitio web corporativo y catálogo dinámico para taller especializado en venta, fabricación y reparación de radiadores automotrices, equipo pesado y maquinaria industrial.

---

## 🚀 Características Principales

- **Buscador Predictivo Rápido (`QuickSearchBar.jsx`):** Autocompletado multi-token en tiempo real que localiza piezas por marca, modelo, motor, código OEM o número NIV.
- **Catálogo Inteligente en Cascada (`CatalogSearch.jsx`):**
  - Filtros interdependientes estrictos (Año ➔ Marca ➔ Modelo ➔ Versión).
  - Búsqueda técnica por medidas de núcleo (alto, ancho, filas).
  - Paginación dinámica estilo Mercado Libre (6 productos por página).
  - Modal flotante con galería fotográfica, ficha técnica y botón de compartir en redes.
  - Sincronización de URL vía `window.history.pushState` sin recargar la página.
- **Carrusel Hero Responsivo (`Hero.astro`):** Carrusel en Vanilla JS con soporte para deslizamiento táctil (*touch swipe*) en móviles y temporizador automático.
- **Sección de Servicios Especializados (`Servicios.astro`):** Paneles, radiadores 100% aluminio soldado, aire acondicionado y fabricación de tanques de aluminio.
- **SEO Dinámico y Open Graph (`[sku].astro`):** Generación de tarjetas sociales con imagen y descripción específica al compartir cualquier pieza por WhatsApp o Facebook.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Astro](https://astro.build/) (Static Site Generation con soporte Cloudflare)
- **UI & Estado:** [React](https://react.dev/) + React Icons
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Despliegue:** Cloudflare Pages / Workers

---

## 📂 Estructura del Proyecto

```text
├── src/
│   ├── assets/              # Logotipos e imágenes institucionales
│   ├── components/
│   │   ├── Header.astro     # Navbar con líneas telefónicas y botón WhatsApp
│   │   ├── QuickSearchBar.jsx # Motor de búsqueda predictiva
│   │   ├── Hero.astro       # Carrusel principal
│   │   ├── CatalogSearch.jsx# Catálogo y modal interactivo
│   │   ├── Servicios.astro  # Tarjetas de servicios técnicos
│   │   ├── Nosotros.astro   # Información sobre el taller y experiencia
│   │   ├── Contacto.astro   # Formulario, horarios y ubicación
│   │   └── Footer.astro     # Pie de página y enlaces legales
│   ├── data/
│   │   └── products.js      # Fuente central de datos de inventario
│   ├── layouts/
│   │   └── Layout.astro     # Plantilla base con Open Graph y metadatos SEO
│   └── pages/
│       ├── index.astro      # Página de inicio
│       └── [sku].astro      # Rutas dinámicas estáticas por producto
├── public/                  # Archivos estáticos y favicon
├── astro.config.mjs         # Configuración de Astro y adaptadores
└── package.json