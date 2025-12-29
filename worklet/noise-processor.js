/**
 * NoiseProcessor - AudioWorklet for generating colored noise
 * 
 * Generates white, pink, brown, blue, and violet noise using various
 * filtering techniques applied to a base random signal.
 */
class NoiseProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        // Pink noise state (Paul Kellett algorithm) - per channel
        this.b0 = [0, 0];
        this.b1 = [0, 0];
        this.b2 = [0, 0];
        this.b3 = [0, 0];
        this.b4 = [0, 0];
        this.b5 = [0, 0];
        this.b6 = [0, 0];
        
        // Brown noise state - per channel
        this.brownState = [0, 0];
        
        // Blue/Violet state (high-pass filtering) - per channel
        this.lastWhite = [0, 0];
        this.lastBlue = [0, 0];
    }
    
    static get parameterDescriptors() {
        return [
            { name: 'color', defaultValue: 3, minValue: 0, maxValue: 4 },
            { name: 'texture', defaultValue: 0, minValue: 0, maxValue: 1 }
        ];
    }
    
    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const colorParam = parameters['color'];
        const texParam = parameters['texture'];
        
        for (let ch = 0; ch < output.length; ch++) {
            const outData = output[ch];
            const isColorConst = colorParam.length === 1;
            const isTexConst = texParam.length === 1;
            
            for (let i = 0; i < outData.length; i++) {
                const alpha = isColorConst ? colorParam[0] : colorParam[i];
                const texture = isTexConst ? texParam[0] : texParam[i];
                
                // Generate white noise base
                let white = 0;
                if (texture < 0.5) {
                    // Gaussian approximation via Central Limit Theorem
                    const u = Math.random() + Math.random() + Math.random() + Math.random();
                    white = (u - 2.0) * 0.75;
                } else {
                    // Uniform distribution
                    white = Math.random() * 2 - 1;
                }
                
                // === VIOLET NOISE (+6dB/octave) ===
                // Differentiate white noise
                const violet = (white - this.lastWhite[ch]) * 0.5;
                this.lastWhite[ch] = white;
                
                // === BLUE NOISE (+3dB/octave) ===
                // Gentle high-pass
                const blue = (violet + this.lastBlue[ch]) * 0.5;
                this.lastBlue[ch] = blue;
                
                // === PINK NOISE (-3dB/octave, Paul Kellett algorithm) ===
                this.b0[ch] = 0.99886 * this.b0[ch] + white * 0.0555179;
                this.b1[ch] = 0.99332 * this.b1[ch] + white * 0.0750759;
                this.b2[ch] = 0.96900 * this.b2[ch] + white * 0.1538520;
                this.b3[ch] = 0.86650 * this.b3[ch] + white * 0.3104856;
                this.b4[ch] = 0.55000 * this.b4[ch] + white * 0.5329522;
                this.b5[ch] = -0.7616 * this.b5[ch] - white * 0.0168981;
                const pink = (this.b0[ch] + this.b1[ch] + this.b2[ch] + this.b3[ch] + 
                             this.b4[ch] + this.b5[ch] + this.b6[ch] + white * 0.5362) * 0.11;
                this.b6[ch] = white * 0.115926;
                
                // === BROWN NOISE (-6dB/octave) ===
                // Integrated white noise with clamping
                let brown = (this.brownState[ch] + (0.02 * white)) / 1.02;
                this.brownState[ch] = brown;
                brown = Math.max(-1, Math.min(1, brown * 3.5));
                
                // === MIX based on alpha (0-4 scale) ===
                // 0=Violet, 1=Blue, 2=White, 3=Pink, 4=Brown
                let s = 0;
                if (alpha <= 1) {
                    // Violet to Blue
                    s = (1 - alpha) * violet + alpha * blue;
                } else if (alpha <= 2) {
                    // Blue to White
                    const t = alpha - 1;
                    s = (1 - t) * blue + t * white;
                } else if (alpha <= 3) {
                    // White to Pink
                    const t = alpha - 2;
                    s = (1 - t) * white + t * pink;
                } else {
                    // Pink to Brown
                    const t = alpha - 3;
                    s = (1 - t) * pink + t * brown;
                }
                
                outData[i] = s;
            }
        }
        return true;
    }
}

registerProcessor('noise-processor', NoiseProcessor);
