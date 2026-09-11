import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaSearch, FaTimes, FaCar, FaArrowRight } from 'react-icons/fa';
import { SAMPLE_PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80';

export default function QuickSearchBar({ initialProducts = null }) {
  const [productsList] = useState(() => {
    return Array.isArray(initialProducts) && initialProducts.length > 0
      ? initialProducts
      : FALLBACK_PRODUCTS;
  });

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Motor de Búsqueda Predictiva Multi-Token
  const searchResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery || cleanQuery.length < 2) return [];

    const tokens = cleanQuery.split(/\s+/).filter(Boolean);

    return productsList.filter((product) => {
      const brandsStr = (product.brands || []).join(' ');
      const modelsStr = (product.models || []).join(' ');
      const motorsStr = (product.motors || []).join(' ');
      const yearsStr = (product.years || []).join(' ');

      const searchableText = `
        ${product.title || ''} 
        ${brandsStr} 
        ${modelsStr} 
        ${motorsStr}
        ${product.iss || ''} 
        ${yearsStr} 
        ${product.transmission || ''} 
        ${product.measures || ''}
      `.toLowerCase();

      return tokens.every((token) => searchableText.includes(token));
    }).slice(0, 6);
  }, [query, productsList]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleSelectProduct(searchResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectProduct = (product) => {
    setIsOpen(false);
    setQuery('');
    window.location.href = `/${product.iss}`;
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white border-b border-slate-800/80 py-3.5 px-4 sm:px-6 lg:px-8 relative z-40">
      <div ref={containerRef} className="max-w-4xl mx-auto relative">
        
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center gap-2">
            <FaSearch className="w-4 h-4 text-theme-red" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              if (query.trim().length >= 2) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Escribe auto, modelo, motor, código DPI o medidas (ej: Chevy 1.6, Ranger 85-94, 1046R...)"
            className="w-full bg-white text-brand-navy-accent placeholder-slate-400 text-xs sm:text-sm font-medium pl-11 pr-24 py-3 sm:py-3.5 rounded-xl border border-slate-700/80 focus:border-theme-red focus:ring-2 focus:ring-theme-red/20 focus:outline-none shadow-inner transition"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
                aria-label="Limpiar búsqueda"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="hidden sm:inline-block bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700">
              ESC para cerrar
            </span>
          </div>
        </div>

        {isOpen && query.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-slate-900 animate-fadeIn">
            
            <div className="bg-slate-100/90 px-4 py-2 border-b border-slate-200 flex justify-between items-center text-[11px] font-bold text-slate-500">
              <span>Sugerencias directas ({searchResults.length})</span>
              <span>Usa las flechas ↑ ↓ y Enter</span>
            </div>

            {searchResults.length > 0 ? (
              <ul className="divide-y divide-slate-100 max-h-84 sm:max-h-96 overflow-y-auto">
                {searchResults.map((product, idx) => {
                  const displayBrand = product.brands && product.brands.length > 0 ? product.brands.join(', ') : 'Multimarca';
                  const displayModel = product.models && product.models.length > 0 ? product.models.join(', ') : '';
                  const displayYears = product.years && product.years.length > 0 
                    ? `${product.years[0]} - ${product.years[product.years.length - 1]}`
                    : '';
                  const mainImage = product.images && product.images.length > 0 ? product.images[0] : DEFAULT_IMAGE;

                  return (
                    <li key={product.id || product.iss || idx}>
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3.5 transition ${
                          selectedIndex === idx ? 'bg-slate-100/80' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200">
                          <img
                            src={mainImage}
                            alt={product.title}
                            onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="grow min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-theme-red/10 text-theme-red rounded-md truncate max-w-[200px]">
                              {displayBrand}
                            </span>
                            {displayModel && (
                              <span className="text-[10px] text-slate-400 font-semibold truncate">
                                {displayModel}
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {product.title}
                          </h4>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
                            <span>
                              <strong className="text-slate-700">ISS:</strong> {product.iss}
                            </span>
                            {displayYears && (
                              <>
                                <span>•</span>
                                <span>
                                  <strong className="text-slate-700">Años:</strong> {displayYears}
                                </span>
                              </>
                            )}
                            {product.measures && (
                              <>
                                <span>•</span>
                                <span>
                                  <strong className="text-slate-700">Medidas:</strong> {product.measures}
                                </span>
                              </>
                            )}
                            <span>•</span>
                            <span>
                              <strong className="text-slate-700">A/C:</strong> {product.hasAC ? 'SÍ' : 'NO'}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-slate-400 group-hover:text-theme-red pl-2">
                          <FaArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-6 text-center text-slate-500 space-y-2">
                <p className="text-xs sm:text-sm font-semibold">
                  No se encontraron radiadores que coincidan con "<span className="text-slate-800 font-bold">{query}</span>"
                </p>
                <p className="text-[11px] text-slate-400">
                  Prueba buscando por marca (ej: <em>Chevrolet</em>), modelo, código DPI o medidas.
                </p>
              </div>
            )}

            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-center">
              <a
                href="#buscador"
                onClick={() => setIsOpen(false)}
                className="text-theme-red hover:underline text-xs font-bold inline-flex items-center gap-1.5"
              >
                <FaCar className="w-3 h-3" /> Ver todos los filtros avanzados en el catálogo
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}