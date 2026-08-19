/**
 * @fileoverview Datos estáticos de los servicios especializados de RALUM S.A.
 *
 * Cada objeto del arreglo representa una tarjeta de servicio en la sección
 * "Servicios" de la landing page. Separar esta data del componente permite
 * actualizar el catálogo de servicios sin tocar la lógica de presentación.
 *
 * @typedef {Object} Servicio
 * @property {string} id          - Identificador único del servicio (usado como key).
 * @property {string} title       - Nombre del servicio mostrado como título de tarjeta.
 * @property {string} subtitle    - Subtítulo descriptivo del alcance del servicio.
 * @property {string} description - Descripción completa del servicio ofrecido.
 * @property {string[]} features  - Lista de 3 características o beneficios clave.
 * @property {Function} icon      - Componente de icono de react-icons para la tarjeta.
 * @property {string} badge       - Etiqueta de categoría/posicionamiento del servicio.
 */

import { FaTools, FaSnowflake, FaCogs, FaShieldAlt } from 'react-icons/fa';

/** @type {Servicio[]} */
export const SERVICIOS = [
  {
    id: 'paneles',
    title: 'Radiadores y Paneles',
    subtitle: 'Línea Automotriz, Carga Pesada y Maquinaria',
    description:
      'Venta, diagnóstico y reemplazo de radiadores completos y panales de enfriamiento para autos particulares, flotillas y tractocamiones.',
    features: [
      'Ajuste directo OEM',
      'Panales en cobre-latón y aluminio',
      'Garantía contra fugas y defectos',
    ],
    icon: FaTools,
    badge: 'Alta Demanda',
  },
  {
    id: 'aluminio',
    title: 'Radiadores 100% Aluminio',
    subtitle: 'Soldadura TIG y Alto Rendimiento',
    description:
      'Diseño y fabricación de radiadores íntegramente soldados en aluminio de alta disipación térmica. Ideales para proyectos especiales, uso rudo y carreras.',
    features: [
      '100% libre de tapas plásticas',
      'Mayor capacidad de refrigeración',
      'Resistencia extrema a presión y vibración',
    ],
    icon: FaCogs,
    badge: 'Especialidad RALUM',
  },
  {
    id: 'aire-acondicionado',
    title: 'Aire Acondicionado Automotriz',
    subtitle: 'Climatización y Sistemas Térmicos',
    description:
      'Diagnóstico integral, recarga de gas refrigerante, detección de fugas, condensadores y evaporadores para mantener la cabina de tu auto siempre fresca.',
    features: [
      'Carga de gas ecológico',
      'Revisión y cambio de condensadores',
      'Mantenimiento preventivo y correctivo',
    ],
    icon: FaSnowflake,
    badge: 'Confort y Rendimiento',
  },
  {
    id: 'tanques',
    title: 'Tanques de Aluminio para Radiador',
    subtitle: 'Sustitución de Tapas de Plástico Rotas',
    description:
      'Eliminamos las fallas comunes de fisuras en tapas plásticas fabricando e instalando tanques (tapas) a la medida en aluminio soldado de alta resistencia.',
    features: [
      'Reparación definitiva de por vida',
      'Fabricación con tomas exactas',
      'Pruebas hidrostáticas de presión',
    ],
    icon: FaShieldAlt,
    badge: 'Solución Definitiva',
  },
];
