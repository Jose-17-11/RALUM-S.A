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

import { SAMPLE_PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';

const ITEMS_PER_PAGE = 6;
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80';

export default function CatalogSearch({ initialProducts = null }) {
  
  // Inicializar con la prop si existe, o con fallback
  const [productsList, setProductsList] = useState(() => {
    return Array.isArray(initialProducts) && initialProducts.length > 0 
      ? initialProducts 
      : FALLBACK_PRODUCTS;
  });

  // Si Astro le pasa la data fresca de n8n, actualizar el estado
  useEffect(() => {
    if (Array.isArray(initialProducts) && initialProducts.length > 0) {
      setProductsList(initialProducts);
    }
  }, [initialProducts]);

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
  const [selectedMotor, setSelectedMotor] = useState('');

  // Medidas y código/ISS
  const [measuresQuery, setMeasuresQuery] = useState('');
  const [rows, setRows] = useState('');
  const [codeQuery, setCodeQuery] = useState('');

  // 1. SINCRONIZACIÓN DE URL (CARGA INICIAL Y BOTONES DEL NAVEGADOR)
  useEffect(() => {
    const syncProductFromUrl = () => {
      const path = window.location.pathname.replace(/^\/+/g, '').replace(/\/+$/g, '');
      if (path) {
        const match = productsList.find(
          p => (p.sku && p.sku.toLowerCase() === path.toLowerCase()) || 
               (p.iss && p.iss.toLowerCase() === path.toLowerCase())
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
  }, [productsList]);

  // 2. CÁLCULO DE OPCIONES DISPONIBLES EN CASCADA
  const availableYears = useMemo(() => {
    let pool = productsList;
    if (selectedBrand) pool = pool.filter(p => (p.brands || [p.brand]).includes(selectedBrand));
    if (selectedModel) pool = pool.filter(p => (p.models || [p.model]).includes(selectedModel));
    if (selectedMotor) pool = pool.filter(p => (p.motors || []).includes(selectedMotor));
    
    const yearsSet = new Set();
    pool.forEach(p => (p.years || []).forEach(y => yearsSet.add(y)));
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [productsList, selectedBrand, selectedModel, selectedMotor]);

  const availableBrands = useMemo(() => {
    let pool = productsList;
    if (selectedYear) pool = pool.filter(p => (p.years || []).includes(Number(selectedYear)));
    if (selectedModel) pool = pool.filter(p => (p.models || [p.model]).includes(selectedModel));
    if (selectedMotor) pool = pool.filter(p => (p.motors || []).includes(selectedMotor));
    
    const brandsSet = new Set();
    pool.forEach(p => (p.brands || [p.brand]).filter(Boolean).forEach(b => brandsSet.add(b)));
    return Array.from(brandsSet).sort();
  }, [productsList, selectedYear, selectedModel, selectedMotor]);

  const availableModels = useMemo(() => {
    let pool = productsList;
    if (selectedYear) pool = pool.filter(p => (p.years || []).includes(Number(selectedYear)));
    if (selectedBrand) pool = pool.filter(p => (p.brands || [p.brand]).includes(selectedBrand));
    if (selectedMotor) pool = pool.filter(p => (p.motors || []).includes(selectedMotor));
    
    const modelsSet = new Set();
    pool.forEach(p => (p.models || [p.model]).filter(Boolean).forEach(m => modelsSet.add(m)));
    return Array.from(modelsSet).sort();
  }, [productsList, selectedYear, selectedBrand, selectedMotor]);

  const availableMotors = useMemo(() => {
    let pool = productsList;
    if (selectedYear) pool = pool.filter(p => (p.years || []).includes(Number(selectedYear)));
    if (selectedBrand) pool = pool.filter(p => (p.brands || [p.brand]).includes(selectedBrand));
    if (selectedModel) pool = pool.filter(p => (p.models || [p.model]).includes(selectedModel));
    
    const motorsSet = new Set();
    pool.forEach(p => (p.motors || []).filter(Boolean).forEach(m => motorsSet.add(m)));
    return Array.from(motorsSet).sort();
  }, [productsList, selectedYear, selectedBrand, selectedModel]);

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
    if (selectedMotor && !availableMotors.includes(selectedMotor)) setSelectedMotor('');
  }, [availableMotors, selectedMotor]);

  // 3. FILTRADO TOTAL DE PRODUCTOS
  const filteredProducts = useMemo(() => {
    return productsList.filter(product => {
      if (activeTab === 'vehiculo') {
        if (selectedYear && !(product.years || []).includes(Number(selectedYear))) return false;
        if (selectedBrand && !(product.brands || [product.brand]).includes(selectedBrand)) return false;
        if (selectedModel && !(product.models || [product.model]).includes(selectedModel)) return false;
        if (selectedMotor && !(product.motors || []).includes(selectedMotor)) return false;
      } else if (activeTab === 'medidas') {
        if (measuresQuery && !product.measures?.toLowerCase().includes(measuresQuery.toLowerCase().trim())) return false;
        if (rows && product.rows !== Number(rows)) return false;
      } else if (activeTab === 'codigo') {
        const q = codeQuery.toLowerCase().trim();
        if (q) {
          const matchSku = product.sku?.toLowerCase().includes(q);
          const matchIss = product.iss?.toLowerCase().includes(q);
          const matchOem = product.oem?.toLowerCase().includes(q);
          const matchTitle = product.title?.toLowerCase().includes(q);
          if (!matchSku && !matchIss && !matchOem && !matchTitle) return false;
        }
      }
      return true;
    });
  }, [productsList, activeTab, selectedYear, selectedBrand, selectedModel, selectedMotor, measuresQuery, rows, codeQuery]);

  // Resetear a página 1 con cambios de filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedYear, selectedBrand, selectedModel, selectedMotor, measuresQuery, rows, codeQuery]);

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
    setSelectedMotor('');
    setMeasuresQuery('');
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
    const targetSku = product.sku || product.iss;
    if (targetSku) {
      window.history.pushState({ sku: targetSku }, '', `/${targetSku}`);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setShowShareMenu(false);
    window.history.pushState({}, '', '/#buscador');
  };

  const getProductShareUrl = (product) => {
    if (typeof window === 'undefined') return '';
    const targetSku = product.sku || product.iss || '';
    return `${window.location.origin}/${targetSku}`;
  };

  const handleCopyLink = (product) => {
    navigator.clipboard.writeText(getProductShareUrl(product));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Helper para obtener las imágenes seguras de un producto
  const getSafeImages = (product) => {
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      const validImages = product.images.filter(img => typeof img === 'string' && img.trim().length > 0);
      if (validImages.length > 0) return validImages;
    }
    return [DEFAULT_IMAGE];
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
            <FaBarcode className="text-theme-red" /> No. Parte / ISS / Clave
          </button>
          <button
            onClick={() => setActiveTab('medidas')}
            className={`flex-1 min-w-40 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'medidas' ? 'bg-brand-navy text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FaRulerCombined className="text-theme-red" /> Medidas de Panal
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">4. Motor</label>
                <select
                  value={selectedMotor}
                  onChange={e => setSelectedMotor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-theme-red focus:outline-none"
                >
                  <option value="">Todos los Motores ({availableMotors.length})</option>
                  {availableMotors.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: ISS / CLAVE */}
          {activeTab === 'codigo' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Búsqueda Rápida por Código ISS o Clave
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej: 1046R, 1061R, 1300149R..."
                  value={codeQuery}
                  onChange={e => setCodeQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 pl-10 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-theme-red focus:outline-none"
                />
                <FaSearch className="absolute left-3.5 top-4 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Ingresa el código ISS de catálogo para localización directa.
              </p>
            </div>
          )}

          {/* TAB 3: MEDIDAS */}
          {activeTab === 'medidas' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Medidas de Panal (pulgadas)</label>
                <input
                  type="text"
                  placeholder="Ej: 26 1/4, 18, 24..."
                  value={measuresQuery}
                  onChange={e => setMeasuresQuery(e.target.value)}
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

      {/* GRID DE RESULTADOS */}
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
            {paginatedProducts.map(p => {
              const safeImages = getSafeImages(p);
              const mainImg = safeImages[0];

              return (
                <div 
                  key={p.id || p.sku || p.iss} 
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => handleOpenModal(p)}
                >
                  <div className="relative h-52 bg-slate-900 overflow-hidden">
                    <img 
                      src={mainImg} 
                      alt={p.title || 'Radiador automotriz'} 
                      onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" 
                    />
                    <span className="absolute top-3 left-3 bg-brand-navy text-white text-[10px] font-bold px-2.5 py-1 rounded shadow">
                      ISS: {p.iss || p.sku}
                    </span>
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded shadow">
                      Stock: {p.stock || 10} pzas
                    </span>
                  </div>

                  <div className="p-5 grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-theme-red uppercase tracking-wider">
                          {p.brands && p.brands.length > 0 ? p.brands.join(', ') : p.brand}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-3 group-hover:text-theme-red transition-colors line-clamp-2">
                        {p.title}
                      </h3>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Modelos:</span>
                          <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">
                            {p.models && p.models.length > 0 ? p.models.join(', ') : (p.model || 'N/A')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Motores:</span>
                          <span className="font-bold text-slate-800">
                            {p.motors && p.motors.length > 0 ? p.motors.join(', ') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Medidas:</span>
                          <span className="font-bold text-slate-800">{p.measures || 'Estándar'} ({p.rows || 1} fila)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">A/C:</span>
                          <span className={`font-bold ${p.hasAC ? 'text-emerald-600' : 'text-slate-600'}`}>
                            {p.hasAC ? 'SÍ' : 'NO'}
                          </span>
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
                        href={`https://wa.me/527351948537?text=Hola%20RALUM%20S.A.,%20me%20interesa%20cotizar%20el%20radiador%20ISS:%20${p.iss || p.sku}`}
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
              );
            })}
          </div>

          {/* BARRA DE PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">
                Página <strong className="text-slate-900">{currentPage}</strong> de <strong className="text-slate-900">{totalPages}</strong> ({filteredProducts.length} radiadores en total)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                    currentPage === 1 
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100 active:scale-95'
                  }`}
                >
                  <FaChevronLeft className="w-3 h-3" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

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

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                    currentPage === totalPages 
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100 active:scale-95'
                  }`}
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL DETALLE */}
      {selectedProduct && (() => {
        const modalImages = getSafeImages(selectedProduct);
        const currentModalImg = modalImages[activeImageIndex] || modalImages[0];

        return (
          <div 
            onClick={handleCloseModal}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 p-4 px-6 flex justify-between items-center z-10">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {selectedProduct.brands ? selectedProduct.brands.join(' / ') : selectedProduct.brand} &gt; {selectedProduct.model || ''}
                </span>
                <button
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Galería */}
                <div className="space-y-4">
                  <div className="h-72 sm:h-80 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200">
                    <img
                      src={currentModalImg}
                      alt={selectedProduct.title || 'Detalle radiador'}
                      onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Miniaturas sólo si hay más de 1 imagen */}
                  {modalImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {modalImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                            activeImageIndex === idx ? 'border-theme-red ring-2 ring-theme-red/30' : 'border-slate-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img 
                            src={img} 
                            alt="" 
                            onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                            className="w-full h-full object-cover" 
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ficha Técnica */}
                <div className="flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded">
                        Disponible ({selectedProduct.stock || 10} pzas)
                      </span>
                      <span className="text-xs text-slate-400">ISS: {selectedProduct.iss || selectedProduct.sku}</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-4">
                      {selectedProduct.title}
                    </h2>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs">
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                        Ficha Técnica
                      </h4>
                      <div className="flex justify-between"><span className="text-slate-500">Marcas:</span><span className="font-bold text-slate-800">{selectedProduct.brands?.join(', ') || selectedProduct.brand}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Modelos:</span><span className="font-bold text-slate-800">{selectedProduct.models?.join(', ') || selectedProduct.model || 'N/A'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Motores:</span><span className="font-bold text-slate-800">{selectedProduct.motors?.join(', ') || 'N/A'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Años Compatibles:</span><span className="font-bold text-slate-800">{selectedProduct.years?.join(', ') || 'Varios'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Medidas de Panal:</span><span className="font-bold text-slate-800">{selectedProduct.measures || 'Estándar'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Transmisión:</span><span className="font-bold text-slate-800">{selectedProduct.transmission}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Filas / Hileras:</span><span className="font-bold text-slate-800">{selectedProduct.rows || 1}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Aire Acondicionado:</span><span className="font-bold text-slate-800">{selectedProduct.hasAC ? 'SÍ' : 'NO'}</span></div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <a
                      href={`https://wa.me/527351948537?text=Hola%20RALUM%20S.A.,%20quisiera%20cotizar%20este%20producto:%0A-%20*${selectedProduct.title}*%0A-%20*ISS:*%20${selectedProduct.iss || selectedProduct.sku}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm text-center transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                      Cotizar Directo por WhatsApp
                    </a>

                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs text-center transition flex items-center justify-center gap-2"
                      >
                        <FaShareAlt /> Compartir este Radiador
                      </button>

                      {showShareMenu && (
                        <div className="absolute bottom-12 left-0 right-0 bg-white border border-slate-200 rounded-xl p-3 shadow-xl flex justify-around gap-2 animate-fadeIn z-20">
                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Mira este radiador en RALUM S.A.: ${selectedProduct.title} (ISS: ${selectedProduct.iss || selectedProduct.sku})\n${getProductShareUrl(selectedProduct)}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition"
                          >
                            <FaWhatsapp /> WhatsApp
                          </a>

                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getProductShareUrl(selectedProduct))}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                          >
                            <FaFacebookF /> Facebook
                          </a>

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
        );
      })()}
    </div>
  );
}