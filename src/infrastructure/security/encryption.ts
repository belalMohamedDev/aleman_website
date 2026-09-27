/**
 * AES-256-CBC Decryption Utility
 * Decrypts server responses using native Web Crypto API
 */

const ENCRYPTION_KEY = 'MySuperSecretAESKeyForAlemanApp1';

let cachedCryptoKey: CryptoKey | null = null;

async function getCryptoKey(): Promise<CryptoKey> {
  if (cachedCryptoKey) return cachedCryptoKey;
  const encoder = new TextEncoder();
  // Ensure 32 bytes for AES-256
  const keyBytes = encoder.encode(ENCRYPTION_KEY.padEnd(32, ' ').slice(0, 32));
  cachedCryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-CBC' },
    false,
    ['decrypt']
  );
  return cachedCryptoKey;
}

export async function decryptPayload<T = any>(base64Data: string): Promise<T> {
  try {
    const binaryString = window.atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // First 16 bytes is IV
    const iv = bytes.slice(0, 16);
    const ciphertext = bytes.slice(16);

    const cryptoKey = await getCryptoKey();
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      cryptoKey,
      ciphertext
    );

    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedBuffer);
    return JSON.parse(jsonString) as T;
  } catch (err) {
    console.error('Failed to decrypt payload:', err);
    throw err;
  }
}
