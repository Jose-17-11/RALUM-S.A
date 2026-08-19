import React, { useState, useMemo, useEffect } from 'react';
import { 
  FaWhatsapp, 
  FaSearch, 
  FaShareAlt, 
  FaTimes, 
  FaCheck, 
  FaFacebookF, 
  FaLink, 
  FaCar, 
  FaRulerCombined, 
  FaBarcode,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

import { SAMPLE_PRODUCTS } from '../data/products';

const ITEMS_PER_PAGE = 6;

export default function CatalogSearch() {
  const [activeTab, setActiveTab] = useState('vehiculo');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Estados de filtros
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');

  // Medidas y código/NIV
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [rows, setRows] = useState('');
  const [codeQuery, setCodeQuery] = useState('');

  // 1. SINCRONIZACIÓN DE URL (CARGA INICIAL Y BOTONES DEL NAVEGADOR)
  useEffect(() => {
    const syncProductFromUrl = () => {
      const path = window.location.pathname.replace(/^\/+/g, '').replace(/\/+$/g, '');
      if (path) {
        const match = SAMPLE_PRODUCTS.find(
          p => p.sku.toLowerCase() === path.toLowerCase() || p.niv?.toLowerCase() === path.toLowerCase()
        );
        if (match) {
          setSelectedProduct(match);
          setActiveImageIndex(0);
          return;
        }
      }
      setSelectedProduct(null);
    };

    syncProductFromUrl();
    window.addEventListener('popstate', syncProductFromUrl);
    return () => window.removeEventListener('popstate', syncProductFromUrl);
  }, []);

  // 2. CÁLCULO DE OPCIONES DISPONIBLES EN CASCADA
  const availableYears = useMemo(() => {
    let pool = SAMPLE_PRODUCTS;
    if (selectedBrand) pool = pool.filter(p => p.brand === selectedBrand);
    if (selectedModel) pool = pool.filter(p => p.model === selectedModel);
    if (selectedVersion) pool = pool.filter(p => p.version === selectedVersion);
    const yearsSet = new Set();
    pool.forEach(p => p.years.forEach(y => yearsSet.add(y)));
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [selectedBrand, selectedModel, selectedVersion]);

  const availableBrands = useMemo(() => {
    let pool = SAMPLE_PRODUCTS;
    if (selectedYear) pool = pool.filter(p => p.years.includes(Number(selectedYear)));
    if (selectedModel) pool = pool.filter(p => p.model === selectedModel);
    if (selectedVersion) pool = pool.filter(p => p.version === selectedVersion);
    return Array.from(new Set(pool.map(p => p.brand))).sort();
  }, [selectedYear, selectedModel, selectedVersion]);

  const availableModels = useMemo(() => {
    let pool = SAMPLE_PRODUCTS;
    if (selectedYear) pool = pool.filter(p => p.years.includes(Number(selectedYear)));
    if (selectedBrand) pool = pool.filter(p => p.brand === selectedBrand);
    if (selectedVersion) pool = pool.filter(p => p.version === selectedVersion);
    return Array.from(new Set(pool.map(p => p.model))).sort();
  }, [selectedYear, selectedBrand, selectedVersion]);

  const availableVersions = useMemo(() => {
    let pool = SAMPLE_PRODUCTS;
    if (selectedYear) pool = pool.filter(p => p.years.includes(Number(selectedYear)));
    if (selectedBrand) pool = pool.filter(p => p.brand === selectedBrand);
    if (selectedModel) pool = pool.filter(p => p.model === selectedModel);
    return Array.from(new Set(pool.map(p => p.version))).sort();
  }, [selectedYear, selectedBrand, selectedModel]);

  // Limpieza automática si la selección previa deja de existir en el pool
  useEffect(() => {
    if (selectedYear && !availableYears.includes(Number(selectedYear))) setSelectedYear('');
  }, [availableYears, selectedYear]);

  useEffect(() => {
    if (selectedBrand && !availableBrands.includes(selectedBrand)) setSelectedBrand('');
  }, [availableBrands, selectedBrand]);

  useEffect(() => {
    if (selectedModel && !availableModels.includes(selectedModel)) setSelectedModel('');
  }, [availableModels, selectedModel]);

  useEffect(() => {
    if (selectedVersion && !availableVersions.includes(selectedVersion)) setSelectedVersion('');
  }, [availableVersions, selectedVersion]);

  // 3. FILTRADO TOTAL DE PRODUCTOS
  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter(product => {
      if (activeTab === 'vehiculo') {
        if (selectedYear && !product.years.includes(Number(selectedYear))) return false;
        if (selectedBrand && product.brand !== selectedBrand) return false;
        if (selectedModel && product.model !== selectedModel) return false;
        if (selectedVersion && product.version !== selectedVersion) return false;
      } else if (activeTab === 'medidas') {
        if (height && product.coreHeight < Number(height)) return false;
        if (width && product.coreWidth < Number(width)) return false;
        if (rows && product.rows !== Number(rows)) return false;
      } else if (activeTab === 'codigo') {
        const q = codeQuery.toLowerCase().trim();
        if (q) {
          const matchSku = product.sku?.toLowerCase().includes(q);
          const matchOem = product.oem?.toLowerCase().includes(q);
          const matchNiv = product.niv?.toLowerCase().includes(q);
          const matchTitle = product.title?.toLowerCase().includes(q);
          if (!matchSku && !matchOem && !matchNiv && !matchTitle) return false;
        }
      }
      return true;
    });
  }, [activeTab, selectedYear, selectedBrand, selectedModel, selectedVersion, height, width, rows, codeQuery]);

  // Resetear a la página 1 cuando cambie cualquier filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedYear, selectedBrand, selectedModel, selectedVersion, height, width, rows, codeQuery]);

  // 4. LÓGICA DE PAGINACIÓN
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const catalogElement = document.getElementById('buscador');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReset = () => {
    setSelectedYear('');
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedVersion('');
    setHeight('');
    setWidth('');
    setRows('');
    setCodeQuery('');
    setCurrentPage(1);
  };

  // 5. CONTROLADORES DE MODAL Y URL
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setShowShareMenu(false);
    setCopiedLink(false);
    window.history.pushState({ sku: product.sku }, '', `/${product.sku}`);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setShowShareMenu(false);
    window.history.pushState({}, '', '/#buscador');
  };

  const getProductShareUrl = (product) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/${product.sku}`;
  };

  const handleCopyLink = (product) => {
    navigator.clipboard.writeText(getProductShareUrl(product));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full" id="buscador">
      {/* CARD DE CONTROLES DE BÚSQUEDA */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-10">
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('vehiculo')}
            className={`flex-1 min-w-40 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'vehiculo' ? 'bg-brand-navy text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FaCar className="text-theme-red" /> Búsqueda por Vehículo
          </button>
          <button
            onClick={() => setActiveTab('codigo')}
            className={`flex-1 min-w-40 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'codigo' ? 'bg-brand-navy text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FaBarcode className="text-theme-red" /> No. Parte / OEM / NIV
          </button>
          <button
            onClick={() => setActiveTab('medidas')}
            className={`flex-1 min-w-40 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'medidas' ? 'bg-brand-navy text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FaRulerCombined className="text-theme-red" /> Medidas de Núcleo
          </button>
        </div>

        <div className="p-6 bg-white">
          {/* TAB 1: VEHÍCULO EN CASCADA */}
          {activeTab === 'vehiculo' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">1. Año</label>
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-theme-red focus:outline-none"
                >
                  <option value="">Todos los Años ({availableYears.length})</option>
                  {availableYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">2. Marca</label>
                <select
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-theme-red focus:outline-none"
                >
                  <option value="">Todas las Marcas ({availableBrands.length})</option>
                  {availableBrands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">3. Modelo</label>
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-theme-red focus:outline-none"
                >
                  <option value="">Todos los Modelos ({availableModels.length})</option>
                  {availableModels.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">4. Versión / Motor</label>
                <select
                  value={selectedVersion}
                  onChange={e => setSelectedVersion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-theme-red focus:outline-none"
                >
                  <option value="">Todas las Versiones ({availableVersions.length})</option>
                  {availableVersions.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: NIV / OEM / SKU */}
          {activeTab === 'codigo' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Búsqueda Rápida por NIV, OEM o Clave
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej: 3N1CN7AP5FL (NIV), 21410-1HK0A (OEM) o RAD-NIS-001..."
                  value={codeQuery}
                  onChange={e => setCodeQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 pl-10 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-theme-red focus:outline-none"
                />
                <FaSearch className="absolute left-3.5 top-4 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Ingresa el Número de Identificación Vehicular (NIV / VIN) o la clave del radiador para localización directa.
              </p>
            </div>
          )}

          {/* TAB 3: MEDIDAS DE NÚCLEO */}
          {activeTab === 'medidas' && (
            <div className="text-brand-navy-light grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Alto Mínimo (mm)</label>
                <input
                  type="number"
                  placeholder="Ej: 400"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold focus:ring-2 focus:ring-theme-red focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ancho Mínimo (mm)</label>
                <input
                  type="number"
                  placeholder="Ej: 500"
                  value={width}
                  onChange={e => setWidth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold focus:ring-2 focus:ring-theme-red focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Filas / Hileras</label>
                <select
                  value={rows}
                  onChange={e => setRows(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold focus:ring-2 focus:ring-theme-red focus:outline-none"
                >
                  <option value="">Cualquiera</option>
                  <option value="1">1 Fila</option>
                  <option value="2">2 Filas</option>
                </select>
              </div>
            </div>
          )}

          {/* BARRA INFERIOR DE ESTADO */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-600">
              Mostrando <strong className="text-slate-900">{filteredProducts.length}</strong> productos compatibles
            </span>
            <button 
              onClick={handleReset} 
              className="text-theme-red font-bold hover:underline transition"
            >
              Limpiar Todos los Filtros
            </button>
          </div>
        </div>
      </div>

      {/* GRID DE RESULTADOS (PAGINADOS) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-medium text-base mb-2">No se encontraron radiadores con los criterios seleccionados.</p>
          <button onClick={handleReset} className="text-theme-red font-bold text-sm hover:underline">
            Restablecer búsqueda
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map(p => (
              <div 
                key={p.id} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => handleOpenModal(p)}
              >
                <div className="relative h-52 bg-slate-900 overflow-hidden">
                  <img 
                    src={p.images[0]} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" 
                  />
                  <span className="absolute top-3 left-3 bg-brand-navy text-white text-[10px] font-bold px-2.5 py-1 rounded shadow">
                    SKU: {p.sku}
                  </span>
                  <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded shadow">
                    Stock: {p.stock} pzas
                  </span>
                </div>

                <div className="p-5 grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-theme-red uppercase tracking-wider">
                        {p.brand} • {p.model}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{p.version}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-3 group-hover:text-theme-red transition-colors line-clamp-2">
                      {p.title}
                    </h3>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">OEM:</span>
                        <span className="font-bold text-slate-800">{p.oem}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">NIV Ref:</span>
                        <span className="font-bold text-slate-800">{p.niv}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Núcleo:</span>
                        <span className="font-bold text-slate-800">{p.coreHeight} x {p.coreWidth} mm ({p.rows} fila)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(p);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-xs text-center transition"
                    >
                      Ver Detalle
                    </button>
                    <a
                      href={`https://wa.me/527351948537?text=Hola%20RALUM%20S.A.,%20me%20interesa%20cotizar%20el%20radiador%20SKU:%20${p.sku}%20(OEM:%20${p.oem})`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-brand-navy hover:bg-theme-red text-white font-bold py-2.5 px-3 rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5"
                    >
                      <FaWhatsapp /> Cotizar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* BARRA DE PAGINACIÓN ESTILO MERCADO LIBRE */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">
                Página <strong className="text-slate-900">{currentPage}</strong> de <strong className="text-slate-900">{totalPages}</strong> (Mostrando {paginatedProducts.length} de {filteredProducts.length} productos)
              </span>

              <div className="flex items-center gap-1.5">
                {/* Botón Anterior */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                    currentPage === 1 
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100 active:scale-95'
                  }`}
                  aria-label="Página anterior"
                >
                  <FaChevronLeft className="w-3 h-3" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                {/* Lista de números de página */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                      currentPage === pageNumber
                        ? 'bg-theme-red text-white shadow-md shadow-theme-red/30 scale-105'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* Botón Siguiente */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                    currentPage === totalPages 
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100 active:scale-95'
                  }`}
                  aria-label="Página siguiente"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL DETALLE ESTILO MERCADO LIBRE */}
      {selectedProduct && (
        <div 
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
          >
            {/* Header del Modal */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 px-6 flex justify-between items-center z-10">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {selectedProduct.brand} &gt; {selectedProduct.model} &gt; {selectedProduct.version}
              </span>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Contenido Principal */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Columna Izquierda: Galería de Imágenes */}
              <div className="space-y-4">
                <div className="h-72 sm:h-80 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200">
                  <img
                    src={selectedProduct.images[activeImageIndex]}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Miniaturas */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        activeImageIndex === idx ? 'border-theme-red ring-2 ring-theme-red/30' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Columna Derecha: Especificaciones Técnicas y Acciones */}
              <div className="flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded">
                      Disponible ({selectedProduct.stock} pzas)
                    </span>
                    <span className="text-xs text-slate-400">SKU: {selectedProduct.sku}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-4">
                    {selectedProduct.title}
                  </h2>

                  {/* Tabla de Ficha Técnica */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                      Ficha Técnica
                    </h4>
                    <div className="flex justify-between"><span className="text-slate-500">Número OEM:</span><span className="font-bold text-slate-800">{selectedProduct.oem}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">NIV Identificador:</span><span className="font-bold text-slate-800">{selectedProduct.niv}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Años Compatibles:</span><span className="font-bold text-slate-800">{selectedProduct.years.join(', ')}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Material de Núcleo:</span><span className="font-bold text-slate-800">{selectedProduct.material}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Dimensiones de Núcleo:</span><span className="font-bold text-slate-800">{selectedProduct.coreHeight} x {selectedProduct.coreWidth} mm</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Transmisión:</span><span className="font-bold text-slate-800">{selectedProduct.transmission}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Filas de Enfriamiento:</span><span className="font-bold text-slate-800">{selectedProduct.rows} Hileras</span></div>
                  </div>
                </div>

                {/* Acciones: Cotizar y Compartir */}
                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/527351948537?text=Hola%20RALUM%20S.A.,%20quisiera%20cotizar%20este%20producto:%0A-%20*${selectedProduct.title}*%0A-%20*SKU:*%20${selectedProduct.sku}%0A-%20*OEM:*%20${selectedProduct.oem}%0A-%20*NIV:*%20${selectedProduct.niv}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    Cotizar Directo por WhatsApp
                  </a>

                  {/* Menú para Compartir */}
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs text-center transition flex items-center justify-center gap-2"
                    >
                      <FaShareAlt /> Compartir este Radiador
                    </button>

                    {showShareMenu && (
                      <div className="absolute bottom-12 left-0 right-0 bg-white border border-slate-200 rounded-xl p-3 shadow-xl flex justify-around gap-2 animate-fadeIn z-20">
                        {/* WhatsApp */}
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Mira este radiador en RALUM S.A.: ${selectedProduct.title} (SKU: ${selectedProduct.sku})\n${getProductShareUrl(selectedProduct)}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition"
                        >
                          <FaWhatsapp /> WhatsApp
                        </a>

                        {/* Facebook */}
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getProductShareUrl(selectedProduct))}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                        >
                          <FaFacebookF /> Facebook
                        </a>

                        {/* Copiar Enlace */}
                        <button
                          onClick={() => handleCopyLink(selectedProduct)}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition"
                        >
                          {copiedLink ? <FaCheck className="text-emerald-600" /> : <FaLink />}
                          {copiedLink ? '¡Copiado!' : 'Copiar'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}