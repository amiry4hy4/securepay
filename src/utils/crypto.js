/**
 * Converts a hexadecimal string to a Uint8Array.
 * @param {string} hex - The hex string to convert.
 * @returns {Uint8Array} The resulting byte array.
 */
export function hexToBytes(hex) {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected a string');
  }
  if (hex.length % 2 !== 0) {
    throw new RangeError('Hex string must have an even length');
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Converts a Uint8Array to a hexadecimal string.
 * @param {Uint8Array} bytes - The byte array to convert.
 * @returns {string} The resulting hex string.
 */
export function bytesToHex(bytes) {
  if (!(bytes instanceof Uint8Array)) {
    throw new TypeError('Expected Uint8Array');
  }
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generates a random 16-byte salt and returns it as a 32-character hexadecimal string.
 * @returns {string} The hex-encoded salt.
 */
export function generateSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

/**
 * Hashes a password and salt using SHA-256 and returns the resulting hex string.
 * @param {string} password - The password to hash.
 * @param {string} salt - The salt to append to the password.
 * @returns {Promise<string>} A promise that resolves to the hex-encoded hash.
 */
export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(hashBuffer));
}

/**
 * Verifies an input password against a stored password hash and salt.
 * @param {string} inputPassword - The password to verify.
 * @param {string} storedHash - The stored SHA-256 hex hash.
 * @param {string} salt - The stored hex salt.
 * @returns {Promise<boolean>} A promise that resolves to true if the password matches, otherwise false.
 */
export async function verifyPassword(inputPassword, storedHash, salt) {
  const hash = await hashPassword(inputPassword, salt);
  return hash === storedHash;
}

/**
 * Generates an AES-256 key and returns it as a 64-character hexadecimal string.
 * @returns {Promise<string>} A promise that resolves to the hex-encoded key.
 */
export async function generateAESKey() {
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-CBC',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
  const rawKey = await crypto.subtle.exportKey('raw', key);
  return bytesToHex(new Uint8Array(rawKey));
}

/**
 * Encrypts plaintext data using AES-256-CBC with the provided hex key.
 * @param {string} plaintext - The plaintext string to encrypt.
 * @param {string} keyHex - The hex-encoded 256-bit AES key.
 * @returns {Promise<{ cipher: string, iv: string }>} A promise that resolves to an object containing the hex-encoded ciphertext and IV.
 */
export async function encryptData(plaintext, keyHex) {
  const keyBytes = hexToBytes(keyHex);
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-CBC' },
    false,
    ['encrypt']
  );

  const ivBytes = new Uint8Array(16);
  crypto.getRandomValues(ivBytes);

  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv: ivBytes
    },
    key,
    data
  );

  return {
    cipher: bytesToHex(new Uint8Array(encryptedBuffer)),
    iv: bytesToHex(ivBytes)
  };
}

/**
 * Decrypts AES-256-CBC encrypted ciphertext using the provided IV and hex key.
 * @param {string} cipherHex - The hex-encoded ciphertext.
 * @param {string} ivHex - The hex-encoded IV.
 * @param {string} keyHex - The hex-encoded 256-bit AES key.
 * @returns {Promise<string>} A promise that resolves to the decrypted plaintext string.
 * @throws {Error} Throws an error if decryption fails (e.g. invalid key or corrupted data).
 */
export async function decryptData(cipherHex, ivHex, keyHex) {
  try {
    const keyBytes = hexToBytes(keyHex);
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );

    const ivBytes = hexToBytes(ivHex);
    const cipherBytes = hexToBytes(cipherHex);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: ivBytes
      },
      key,
      cipherBytes
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    throw new Error('Decryption failed: ' + error.message, { cause: error });
  }
}
