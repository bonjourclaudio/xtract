import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import * as p5 from 'p5';
import { EspressoResults } from '../brew_profile';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.scss']
})
export class VisualComponent implements OnDestroy, OnChanges {
  @Input() liveExtraction: EspressoResults; // Input data from EspressoComponent
  @Input() goalYield: number;
  @Input() animate: boolean;
  @Input() container: any;

  private p5: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['liveExtraction']) {
      if (this.p5) {
        this.p5.remove();
      }
      this.createSketch();
    }
  }

  ngOnDestroy() {
    if (this.p5) {
      this.p5.remove();
    }
  }

  private createSketch() {

    console.log();

    const sketch = (p: any) => {
      p.setup = () => {
        let canvas: any;
        if (this.container) {
           canvas = p.createCanvas( this.container?.nativeElement?.offsetWidth, this.container?.nativeElement?.offsetHeight);
        }
        
        canvas.parent('sketch-container');
        p.frameRate(60);
      };
      
      p.draw = () => {
        p.colorMode(p.RGB, 255, 255, 255, 1);

        if (this.liveExtraction) {
          // FlowRate Circle
          let flowRateX = (100 * this.liveExtraction.flowRate) / 2 * Math.random()
          let flowRateY = (200 * this.liveExtraction.flowRate) / 2 * Math.random()
          let flowRateSize = (100 * this.liveExtraction.flowRate) * Math.random()

          p.circle(flowRateX * Math.random() * 10, flowRateY * Math.random() * 10, flowRateSize * Math.random())

          // Pressure Circle
          let pressureX = (10 * this.liveExtraction.pressure) / 2 * Math.random()
          let pressureY = (20 * this.liveExtraction.pressure) / 2 * Math.random()
          let pressureSize = (10 * this.liveExtraction.pressure) * Math.random()

          p.circle(pressureX * Math.random() * 10, pressureY * Math.random() * 10, pressureSize)

          // Yield Circle
          let yieldX = (10 * this.liveExtraction.currentYield) / 2 * Math.random()
          let yieldY = (20 * this.liveExtraction.currentYield) / 2 * Math.random()
          let yieldSize = (10 * this.liveExtraction.currentYield) * Math.random()

          p.circle(yieldX * Math.random() * 10, yieldY * Math.random() * 10, yieldSize)
        }

        if (!this.animate) {
          p.noLoop();
        }
      };
    };

    this.p5 = new p5(sketch);
  }
}