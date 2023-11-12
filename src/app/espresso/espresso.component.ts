import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';

interface EspressoResults {
  flowRate: number;
  extractionTime: number;
  pressure: number; // Pressure is now in bars
  currentYield: number;
}

@Component({
  selector: 'app-espresso',
  templateUrl: './espresso.component.html',
  styleUrls: ['./espresso.component.scss']
})
export class EspressoComponent implements OnInit, OnDestroy {
  espressoParams = {
    dose: 18,
    yieldAmount: 36, // Target yield amount
    tampingPressure: 30,
    machinePressure: 9, // Initial pressure in bars (representing 9 bars)
    preInfusionPressure: 2, // Pressure during pre-infusion (default is 2 bars)
    preInfusionDuration: 5, // Pre-infusion duration in seconds (default is 5 seconds)
  };

  extractionResults: EspressoResults[] = [];
  public extractionSubscription: Subscription | undefined;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stopExtraction();
  }

  startExtraction(): void {
    this.stopExtraction(); // Stop any ongoing extraction before starting a new one

    this.extractionResults = [];
    const brewSteps = 100; // Number of steps for brew time
    const brewStepDuration = this.calculateMaxBrewTime() / brewSteps;

    let currentPressure = this.espressoParams.machinePressure;
    let currentYield = 0;
    let elapsedSeconds = 0;

    const interval$ = interval(brewStepDuration * 1000);

    // Target pressure (in bars)
    const targetPressure = 9; // 9 bars, adjust as needed

    this.extractionSubscription = interval$.subscribe(() => {
      // Calculate maxBrewTime just before using it
      const maxBrewTime = this.calculateMaxBrewTime();

      // Calculate flow rate with a more realistic model
      const flowRate = this.calculateFlowRate(currentPressure);

      currentYield += flowRate * brewStepDuration;
      elapsedSeconds += brewStepDuration;

      // Calculate pressure adjustment to maintain target pressure
      let pressureError = targetPressure - currentPressure;
      let pressureAdjustment = 0.1 * pressureError; // Proportional controller (adjust as needed)

      // Check if in the pre-infusion phase
      if (elapsedSeconds < this.espressoParams.preInfusionDuration) {
        pressureError = this.espressoParams.preInfusionPressure - currentPressure;
        pressureAdjustment = 0.1 * pressureError; // Adjust to pre-infusion pressure
      }

      // Adjust current pressure based on the pressure adjustment
      currentPressure += pressureAdjustment;

      this.extractionResults.push({
        flowRate,
        extractionTime: elapsedSeconds,
        pressure: currentPressure,
        currentYield
      });

      // Updated condition: Stop extraction when the target yield is reached
      if (currentYield >= this.espressoParams.yieldAmount) {
        this.stopExtraction(); // Stop if the target yield is reached
      }
    });
  }

  stopExtraction(): void {
    if (this.extractionSubscription) {
      this.extractionSubscription.unsubscribe();
      this.extractionSubscription = undefined;
    }
  }

  // Calculate the maximum brew time based on desired yield
  calculateMaxBrewTime(): number {
    return this.espressoParams.yieldAmount / this.calculateFlowRate(this.espressoParams.machinePressure);
  }

  // Calculate flow rate based on a more realistic model
  calculateFlowRate(pressure: number): number {
    // Implement a more realistic flow rate model here
    // This could involve equations and constants related to your espresso machine, coffee grounds, and grind size
    // For simplicity, you can use a linear model for now
    const minPressure = 1; // Minimum pressure (in bars) for any flow
    const maxFlowRate = 2.0; // Maximum flow rate (mL/s) at max pressure
    const slope = maxFlowRate / (this.espressoParams.machinePressure - minPressure); // Adjust as needed

    return Math.max(0, slope * (pressure - minPressure)); // Ensure flow rate is non-negative
  }
}
