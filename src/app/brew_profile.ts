export interface BrewProfile {
    brewTemp: number;
    brewPressure: number;
    pre_infusion: number;
    yield: number;
    dose: number;
  }

export interface ExtractionResult {
  flowRate: number;
  extractionTime: number;
  pressure: number;
}

export interface EspressoResults {
  flowRate: number;
  extractionTime: number;
  pressure: number; // Pressure is now in bars
  currentYield: number;
}