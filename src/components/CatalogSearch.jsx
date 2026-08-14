import React, { useState, useMemo } from 'react';

// Muestra de datos representativos procesados desde Aspel
const SAMPLE_PRODUCTS = [
  {
    id: '1',
    sku: 'RAD-NIS-001',
    oem: '21410-1HK0A',
    title: 'Radiador de Agua Nissan Versa 1.6L',
    brand: 'Nissan',
    model: 'Versa',
    years: [2015, 2018, 2020, 2022],
    transmission: 'Automática / Estándar',
    material: 'Aluminio / Plástico',
    coreHeight: 400,
    coreWidth: 480,
    rows: 1,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '2',
    sku: 'RAD-CHEV-004',
    oem: '93382154',
    title: 'Radiador para Chevrolet Aveo 1.5L / 1.6L',
    brand: 'Chevrolet',
    model: 'Aveo',
    years: [2015, 2018, 2020],
    transmission: 'Estándar',
    material: 'Aluminio / Plástico',
    coreHeight: 380,
    coreWidth: 520,
    rows: 1,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '3',
    sku: 'RAD-FORD-012',
    oem: 'AB39-8005-AB',
    title: 'Radiador Carga Pesada Ford Ranger 2.2L / 3.2L Diesel',
    brand: 'Ford',
    model: 'Ranger',
    years: [2018, 2020, 2022],
    transmission: 'Automática',
    material: 'Aluminio Soldado',
    coreHeight: 550,
    coreWidth: 600,
    rows: 2,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'
  }
];

export default function CatalogSearch() {
  const [activeTab, setActiveTab] = useState('vehiculo');
  const [filters, setFilters] = useState({
    year: '',
    brand: '',
    model: '',
    height: '',
    width: '',
    rows: '',
    query: ''
  });

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter(product => {
      if (activeTab === 'vehiculo') {
        if (filters.year && !product.years.includes(Number(filters.year))) return false;
        if (filters.brand && product.brand !== filters.brand) return false;
        if (filters.model && product.model !== filters.model) return false;
      } else if (activeTab === 'medidas') {
        if (filters.height && product.coreHeight < Number(filters.height)) return false;
        if (filters.width && product.coreWidth < Number(filters.width)) return false;
        if (filters.rows && product.rows !== Number(filters.rows)) return false;
      } else if (activeTab === 'codigo') {
        const q = filters.query.toLowerCase().trim();
        if (q && !(product.sku.toLowerCase().includes(q) || product.oem.toLowerCase().includes(q) || product.title.toLowerCase().includes(q))) {
          return false;
        }
      }
      return true;
    });
  }, [filters, activeTab]);

  const handleReset = () => {
    setFilters({ year: '', brand: '', model: '', height: '', width: '', rows: '', query: '' });
  };

  return (
    <div className="w-full">
      {/* CARD DE CONTROLES DE BÚSQUEDA */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-10">
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('vehiculo')}
            className={`flex-1 min-w-40 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'vehiculo' ? 'bg-brand-navy text-white shadow' : 'bg-transparent text-slate-600 hover:bg-slate-200'
            }`}
          >
            🚗 Búsqueda por Vehículo
          </button>
          <button
            onClick={() => setActiveTab('medidas')}
            className={`flex-1 min-w-40 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'medidas' ? 'bg-brand-navy text-white shadow' : 'bg-transparent text-slate-600 hover:bg-slate-200'
            }`}
          >
            📏 Medidas de Núcleo
          </button>
          <button
            onClick={() => setActiveTab('codigo')}
            className={`flex-1 min-w-40 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'codigo' ? 'bg-brand-navy text-white shadow' : 'bg-transparent text-slate-600 hover:bg-slate-200'
            }`}
          >
            🏷️ No. Parte / OEM
          </button>
        </div>

        <div className="p-6 bg-white">
          {activeTab === 'vehiculo' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Año</label>
                <select
                  value={filters.year}
                  onChange={e => setFilters({ ...filters, year: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                >
                  <option value="">Todos los Años</option>
                  <option value="2022">2022</option>
                  <option value="2020">2020</option>
                  <option value="2018">2018</option>
                  <option value="2015">2015</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Marca</label>
                <select
                  value={filters.brand}
                  onChange={e => setFilters({ ...filters, brand: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                >
                  <option value="">Todas las Marcas</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Ford">Ford</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Modelo</label>
                <select
                  value={filters.model}
                  onChange={e => setFilters({ ...filters, model: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                >
                  <option value="">Todos los Modelos</option>
                  <option value="Versa">Versa</option>
                  <option value="Aveo">Aveo</option>
                  <option value="Ranger">Ranger</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'medidas' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Alto Mínimo (mm)</label>
                <input
                  type="number"
                  placeholder="Ej: 400"
                  value={filters.height}
                  onChange={e => setFilters({ ...filters, height: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ancho Mínimo (mm)</label>
                <input
                  type="number"
                  placeholder="Ej: 500"
                  value={filters.width}
                  onChange={e => setFilters({ ...filters, width: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Filas / Hileras</label>
                <select
                  value={filters.rows}
                  onChange={e => setFilters({ ...filters, rows: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                >
                  <option value="">Cualquiera</option>
                  <option value="1">1 Fila</option>
                  <option value="2">2 Filas</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'codigo' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Código Aspel / OEM / Equivalencia</label>
              <input
                type="text"
                placeholder="Ingrese SKU de Aspel o código OEM..."
                value={filters.query}
                onChange={e => setFilters({ ...filters, query: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm font-semibold"
              />
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-600">Mostrando {filteredProducts.length} productos</span>
            <button onClick={handleReset} className="text-theme-red font-bold hover:underline">
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* GRID DE RESULTADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md flex flex-col justify-between">
            <div className="relative h-48 bg-slate-900 overflow-hidden">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-90" />
              <span className="absolute top-3 left-3 bg-brand-navy text-white text-[10px] font-bold px-2.5 py-1 rounded">
                SKU: {p.sku}
              </span>
              <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-1 rounded">
                Stock: {p.stock} pzas
              </span>
            </div>

            <div className="p-5 grow flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-theme-red uppercase">{p.brand} • {p.model}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1 mb-3">{p.title}</h3>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1 mb-4">
                  <div className="flex justify-between"><span class="text-slate-500">OEM:</span><span className="font-bold">{p.oem}</span></div>
                  <div className="flex justify-between"><span class="text-slate-500">Núcleo:</span><span className="font-bold">{p.coreHeight} x {p.coreWidth} mm</span></div>
                  <div className="flex justify-between"><span class="text-slate-500">Transmisión:</span><span className="font-bold">{p.transmission}</span></div>
                </div>
              </div>

              <a
                href={`https://wa.me/527351948537?text=Hola%20RALUM%20S.A.,%20me%20interesa%20cotizar%20el%20radiador%20SKU:%20${p.sku}%20(OEM:%20${p.oem})`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-brand-navy hover:bg-brand-navy-accent text-white font-bold py-2.5 px-4 rounded-xl text-xs text-center transition block"
              >
                Cotizar por WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}