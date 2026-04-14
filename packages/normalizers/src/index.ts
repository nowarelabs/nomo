/**
 * noware-normalizers - BaseNormalizer
 * 
 * Standard Gauge: Normalizer (middleware)
 * 
 * Connection: Used by controllers to normalize input
 */

export interface Normalizer<T = unknown> {
  normalize(data: unknown): T;
}