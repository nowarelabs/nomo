/**
 * noware-validators - BaseValidator
 * 
 * Standard Gauge: Validator (middleware)
 * 
 * Connection: Used by controllers to validate input
 */

export interface Validator<T = unknown> {
  validate(data: unknown): T;
}