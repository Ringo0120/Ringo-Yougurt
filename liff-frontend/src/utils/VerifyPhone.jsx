const TAIWAN_MOBILE_REGEX = /^09\d{8}$/;

/**
 * Verify Taiwan mobile number: must be 10 digits and start with 09.
 * @param {string | number} input
 * @returns {boolean}
 */
export default function verifyPhone(input) {
  const value = String(input ?? "").trim();
  return TAIWAN_MOBILE_REGEX.test(value);
}
