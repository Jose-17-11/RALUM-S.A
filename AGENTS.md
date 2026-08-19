# Contexto del Proyecto: RALUM S.A.

Landing page y catálogo digital interactivo para venta y taller de radiadores automotrices e industriales.

## Stack Tecnológico
- **Framework:** Astro (Static Output / Cloudflare Adapter)
- **UI / Interactividad:** React + Vanilla JS
- **Estilos:** Tailwind CSS
- **Iconos:** react-icons (FaWhatsapp, FaSearch, FaCar, etc.)
- **Despliegue:** Cloudflare Pages / Workers

## Estructura Clave de Archivos
- `src/data/products.js`: Base de datos centralizada de radiadores (SKU, OEM, NIV, años, medidas, stock).
- `src/components/Header.astro`: Navbar fijo con líneas de atención, logo y botón de cotización WhatsApp.
- `src/components/QuickSearchBar.jsx`: Buscador predictivo multi-token con autocompletado en tiempo real.
- `src/components/Hero.astro`: Carrusel responsivo en Vanilla JS con soporte táctil (touch-swipe) y autoplay.
- `src/components/CatalogSearch.jsx`: Catálogo con filtros en cascada (Año/Marca/Modelo), búsqueda por NIV/OEM, modal estilo Mercado Libre, paginación (6 items) y sincronización de URL (`history.pushState`).
- `src/components/Servicios.astro`: Grid de 4 servicios clave (paneles, aluminio, A/C, tanques) con enlaces directos a WhatsApp.
- `src/pages/[sku].astro`: Rutas dinámicas estáticas para SEO y Open Graph metadata por producto.
- `src/pages/index.astro`: Vista principal que ensambla la landing.

## Instrucciones y Rol Actual
- **Objetivo Principal:** Documentar el proyecto agregando comentarios técnicos claros en español a los componentes existentes y enriquecer el archivo `README.md`.
- **Reglas de Documentación:**
  - Explicar la lógica de negocio (filtros en cascada, sincronización de rutas `history.pushState`, tokenización predictiva).
  - No modificar la lógica ni alterar el diseño visual existente.
  - Mantener comentarios concisos tipo JSDoc o bloques descriptivos al inicio de funciones clave.
- **Commits:** Seguir el estándar Conventional Commits (`docs: ...`, `refactor: ...`).

## Comandos de Desarrollo
- Iniciar servidor: `pnpm run dev` (o `astro dev --background`)
- Compilar: `pnpm run build`
- Despliegue: `pnpm run deploy`