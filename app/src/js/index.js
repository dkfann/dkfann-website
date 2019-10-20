import p5 from 'p5/lib/p5.min';
import simplexNoise from 'simplex-noise';


document.addEventListener('DOMContentLoaded', () => {
    let dragging = false;
    let minFrequency = 0.25;
    let maxFrequency = 4;
    let minAmplitude = 0.05;
    let maxAmplitude = 0.1;

    let amplitude;
    let frequency;

    const simplex = new simplexNoise();


    let lerpAmount = 0.01;
    let opacity = 75;
    let baseRGBValue = 55;

    let sketch = (sk) => {
        let hoverColor = sk.color(255, 196, 0, opacity);
        let startColor = sk.windowWidth > 780 ? sk.color(baseRGBValue, baseRGBValue, baseRGBValue, opacity) : hoverColor;
        let endColor = sk.windowWidth > 780 ? sk.color(baseRGBValue, baseRGBValue, baseRGBValue, opacity) : hoverColor;

        sk.setup = () => {
            const cnv = sk.createCanvas(sk.windowWidth, sk.windowHeight);
            cnv.parent('main');

            sk.mouseX = sk.width / 2;
            sk.mouseY = sk.height / 2;
        }

        sk.windowResized = () => {
            sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
        }

        sk.draw = () => {
            sk.background('rgb(27,27,27)');

            const frequency = sk.lerp(minFrequency, maxFrequency, (sk.width - sk.mouseX) / sk.width);
            const amplitude = sk.lerp(minAmplitude, maxAmplitude, (sk.height - sk.mouseY) / sk.height);

            const dim = Math.min(sk.width, sk.height);

            sk.noFill();
            //sk.stroke(lineColor);
            sk.stroke(sk.lerpColor(startColor, endColor, lerpAmount));
            if (lerpAmount < 1) {
                lerpAmount += 0.05;
            }

            sk.strokeWeight(dim * 0.0035);

            const time = sk.millis() / 1000;
            const rows = 10;

            for (let y = 0; y < rows; y++) {
                const v = rows <= 1 ? 0.5 : y / (rows - 1);
                const py = v * sk.height;

                drawNoiseLine({
                    v,
                    start: [0, py],
                    end: [sk.width, py],
                    amplitude: amplitude * sk.height,
                    frequency,
                    time: time * 0.25,
                    steps: 150,
                });
            }
        }

        function drawNoiseLine({
            v,
            start,
            end,
            steps = 10,
            frequency = 1,
            time = 0,
            amplitude = 1,
        }) {
            const [ xStart, yStart ] = start;
            const [ xEnd, yEnd ] = end;

            sk.beginShape();
            for (let i = 0; i < steps; i++) {
                const t = steps <= 1 ? 0.5 : i / (steps - 1);

                const x = sk.lerp(xStart, xEnd, t);

                let y = sk.lerp(yStart, yEnd, t);

                y += (simplex.noise3D(t * frequency + time, v * frequency, time)) * amplitude;

                sk.vertex(x, y);
            }

            sk.endShape();
        }

        const codenames = document.getElementById('codenames');
        const kemet = document.getElementById('kemet');
        const webpack = document.getElementById('webpack');
        const connectK = document.getElementById('connect-k');
        const rfid = document.getElementById('rfid');

        const projects = [
            codenames,
            kemet,
            webpack,
            connectK,
            rfid,
        ];

        projects.forEach(project => {
            project.addEventListener('mouseover', () => {
                lerpAmount = 0;
                endColor = hoverColor;
            });
            
            project.addEventListener('mouseleave', () => {
                lerpAmount = 0.5;
                startColor = hoverColor;
                endColor = sk.color(baseRGBValue, baseRGBValue, baseRGBValue, opacity);

                setTimeout(() => {
                    startColor = sk.color(baseRGBValue, baseRGBValue, baseRGBValue, opacity);
                }, 700);
            });
        });
    }

    const p5Instance = new p5(sketch);
})

