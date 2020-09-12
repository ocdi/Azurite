import { createHmac } from "crypto";

export function newEtag(): string {
  // Etag should match ^"0x[A-F0-9]{15,}"$
  // Date().getTime().toString(16) only has 11 digital
  // so multiply a number between 70000-100000, can get a 16 based 15+ digital number
  return (
    '"0x' +
    (new Date().getTime() * Math.round(Math.random() * 30000 + 70000))
      .toString(16)
      .toUpperCase() +
    '"'
  );
}

/**
 * Generates a hash signature for an HTTP request or for a SAS.
 *
 * @param {string} stringToSign
 * @param {key} key
 * @returns {string}
 */
export function computeHMACSHA256(stringToSign: string, key: Buffer): string {
  return createHmac("sha256", key)
    .update(stringToSign, "utf8")
    .digest("base64");
}

/**
 * Rounds a date off to seconds.
 *
 * @export
 * @param {Date} date
 * @param {boolean} [withMilliseconds=true] If true, YYYY-MM-DDThh:mm:ss.fffffffZ will be returned;
 *                                          If false, YYYY-MM-DDThh:mm:ssZ will be returned.
 * @returns {string} Date string in ISO8061 format, with or without 7 milliseconds component
 */
export function truncatedISO8061Date(
  date: Date,
  withMilliseconds: boolean = true
): string {
  // Date.toISOString() will return like "2018-10-29T06:34:36.139Z"
  const dateString = date.toISOString();

  return withMilliseconds
    ? dateString.substring(0, dateString.length - 1) + "0000" + "Z"
    : dateString.substring(0, dateString.length - 5) + "Z";
}
