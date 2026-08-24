// src/data/api.js
import { SAMPLE_PRODUCTS as FALLBACK_PRODUCTS } from './products.js';

const WEBHOOK_URL = 'https://ralumsa.agencia1711.shop/webhook/ralumsa-data';

export async function getProducts() {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Evitar que la petición se quede en caché durante desarrollo
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    console.log('✅ Webhook disponible, datos obtenidos:', data);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    
    return FALLBACK_PRODUCTS;
  } catch (error) {
    console.warn('⚠️ Webhook no disponible, usando fallback:', error.message);
    return FALLBACK_PRODUCTS;
  }
}