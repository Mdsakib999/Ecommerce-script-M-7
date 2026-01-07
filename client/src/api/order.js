// src/api/orders.js (helper)
import api from './axios'; // axios instance with baseURL
import { getAuth } from "firebase/auth";

/**
 * placeOrder - posts an order to backend, returns created order data
 * Throws an Error with a helpful message on failure.
 */
export async function placeOrder(orderItems, shippingAddress = null, paymentMethod = 'None') {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    // Let caller decide what to do (redirect to login, show modal, etc.)
    throw new Error('User not logged in');
  }

  try {
    // Force refresh so backend sees a fresh token
    const idToken = await currentUser.getIdToken(/* forceRefresh */ true);

    const body = { orderItems, shippingAddress, paymentMethod };

    const resp = await api.post('/api/orders', body, {
      headers: { Authorization: `Bearer ${idToken}` },
      // axios will set Content-Type: application/json automatically for an object body
    });
    return resp.data;
  } catch (err) {
    // Normalize message so UI can display something meaningful
    const serverMsg = err.response?.data?.message || err.response?.data?.error || err.response?.data || null;

    // Build an Error with extra context
    const message = serverMsg
      ? `Failed to place order: ${serverMsg}`
      : err.message || 'Failed to place order';

    // Optionally attach original response for debugging
    const e = new Error(message);
    e.original = err;
    throw e;
  }
}
