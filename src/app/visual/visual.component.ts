import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import * as p5 from 'p5';
import { EspressoResults } from '../brew_profile';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualComponent implements OnDestroy, OnChanges {
  @Input() liveExtraction: EspressoResults; // Input data from EspressoComponent
  @Input() run: boolean = false;
  @Input() goalYield: number;
  @Input() animate: boolean;
  @Input() container: any;

  i: number = 0;

  private p5: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['run'] && changes['run'].currentValue == true) {
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

    const sketch = (p: any) => {

      p.setup = () => {
        let canvas: any;
        if (this.container) {
          canvas = p.createCanvas(this.container?.nativeElement?.offsetWidth, this.container?.nativeElement?.offsetHeight, p.WEBGL);
          p.angleMode(p.DEGREES)
        }

        canvas.parent('sketch-container');
        p.pixelDensity(30);
      };

      p.draw = () => {
        if (this.liveExtraction) {
          // Basic Line Animation
          // let flowRateParam = (10 * this.liveExtraction.flowRate) * Math.random();
          let flowRateParam = (20 * this.liveExtraction.flowRate);
          //let pressureParam = (10 * this.liveExtraction.pressure) * Math.random();
          let pressureParam = (10 * this.liveExtraction.pressure) / 2;
          // let yieldParam = (10 * this.liveExtraction.currentYield) * Math.random();
          let yieldParam = this.liveExtraction.currentYield;

          p.rotateX(60)
          p.noFill()

          p.background(0)
          p.stroke(255);

          // Yield Shape
          for (var i = 0; i < yieldParam; i++) {
            p.stroke(132, 71, 255)
            p.strokeWeight(1.2)
            p.noFill()

            p.beginShape()

            for (var j = 0; j < 360; j += 10) {
              var rad = i * 8;
              var x = rad * p.cos(j)
              var y = rad * p.sin(j)
              var z = p.sin(p.frameCount * 2 + i * 5) * yieldParam;

              p.rotateX(i * 0.01);
              p.rotateZ(i * 0.01);
              p.rotateY(i * 0.01);

              p.vertex(x, y, z)
            }

            p.endShape(p.CLOSE)
          }

          // Flow Rate Shape
          for (var i = 0; i < flowRateParam; i++) {
            p.stroke(this.randomizeColorValue(200, 5), this.randomizeColorValue(120, 5), this.randomizeColorValue(80, 1))
            p.noFill()
            p.strokeWeight(1.2)

            p.beginShape()

            for (var j = 0; j < 360; j += 230) {
              var rad = i * 8;
              var x = rad * p.cos(j)
              var y = rad * p.sin(j)
              var z = p.sin(p.frameCount * 2 + i * 5) * flowRateParam;

              p.vertex(x, y, z)
            }

            p.endShape(p.CLOSE)
          }

          // Pressure Shape
          for (var i = 0; i < pressureParam; i++) {
            p.stroke(this.randomizeColorValue(204, 10), this.randomizeColorValue(255, 5), this.randomizeColorValue(0, 1))
            p.noFill()
            p.strokeWeight(1.2)

            p.beginShape()

            for (var j = 0; j < 360; j += pressureParam) {
              var rad = i * 8;
              var x = rad * p.cos(j)
              var y = rad * p.sin(j)
              var z = p.sin(p.frameCount * 2 + i * 5) * pressureParam;

              p.vertex(x, y, z)
            }

            p.endShape(p.CLOSE)
          }
        }

        if (!this.animate) {
          p.noLoop();
        }
      };
    };

    this.p5 = new p5(sketch);
  }

  randomizeColorValue(value: number, maxRandValue: number): number {
    // var rand = Math.random() * (maxRandValue - 0.1) + 0.1;
    return value;
  }

}



/*

      // Basic Circle Animation

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

      */