// src/data/api.js
import { SAMPLE_PRODUCTS as FALLBACK_PRODUCTS } from './products.js';

const WEBHOOK_URL = 'https://n8n.ralumsa.com/webhook/ralumsa-data';

export async function getProducts() {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
    
    if (Array.isArray(data) && data.length > 0) {
      return data.map(item => ({
        id: String(item.id || item.iss || item.sku || ''),
        iss: String(item.iss || item.sku || '').trim(),
        title: item.title || `Radiador ${item.brand || (item.brands ? item.brands[0] : '')} ${item.model || (item.models ? item.models[0] : '')}`.trim(),
        brands: Array.isArray(item.brands) ? item.brands : (item.brand ? [item.brand] : []),
        models: Array.isArray(item.models) ? item.models : (item.model ? [item.model] : []),
        motors: Array.isArray(item.motors) ? item.motors : (item.motor ? [item.motor] : []),
        years: Array.isArray(item.years) ? item.years : [],
        transmission: item.transmission || 'No especificada',
        measures: item.measures || '',
        rows: item.rows || 1,
        hasAC: Boolean(item.hasAC),
        images: Array.isArray(item.images) && item.images.length > 0 ? item.images : []
      }));
    }
    
    return FALLBACK_PRODUCTS;
  } catch (error) {
    console.warn('⚠️ Webhook no disponible, usando fallback:', error.message);
    return FALLBACK_PRODUCTS;
  }
}