import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BrewService } from '../brew.service';
import { BrewProfile, EspressoResults, ExtractionResult } from '../brew_profile';
import { Observable, Subscription, interval, takeWhile, } from 'rxjs';
import { Expression } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild("visualisation") visualisationContainer?: any;

  espressoParams = {
    dose: 18,
    yieldAmount: 36,
    tampingPressure: 30,
    machinePressure: 9,
    preInfusionPressure: 2,
    preInfusionDuration: 5,
    grindSizeFactor: 0.65
  };

  extractionResults: EspressoResults[] = [];
  public extractionSubscription: Subscription | undefined;

  liveExtraction: EspressoResults;

  shouldAnimate = false;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.stopExtraction();
  }

  startExtraction(): void {
    this.stopExtraction(); // Stop any ongoing extraction before starting a new one

    // Randomize grind size factor with a randomness between 0.65 and 0.676
    this.espressoParams.grindSizeFactor = this.espressoParams.grindSizeFactor * (Math.random() * (1.04 - 1) + 1);

    this.shouldAnimate = true;

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

      this.liveExtraction = {
        flowRate,
        extractionTime: elapsedSeconds,
        pressure: currentPressure,
        currentYield
      };

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
      this.shouldAnimate = false;
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
    // For simplicity, you can use a linear model for now and adjust it based on grind size
    const minPressure = 1; // Minimum pressure (in bars) for any flow
    const maxFlowRate = 2.0; // Maximum flow rate (mL/s) at max pressure
    const slope = maxFlowRate / (this.espressoParams.machinePressure - minPressure); // Adjust as needed

    // Adjust flow rate based on grind size factor (finer grind = slower flow)
    return Math.max(0, slope * (pressure - minPressure) * this.espressoParams.grindSizeFactor); // Ensure flow rate is non-negative
  }
}