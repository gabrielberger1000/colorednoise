/**
 * NoiseProcessor - AudioWorklet for generating colored noise
 * 
 * Generates white, pink, brown, blue, and violet noise using various
 * filtering techniques applied to a base random signal.
 * 
 * Supports blending two colors together for richer textures.
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
        
        // Sample rate reduction state - per channel
        this.sampleHoldCounter = [0, 0];
        this.sampleHoldValue = [0, 0];
    }
    
    static get parameterDescriptors() {
        return [
            { name: 'color', defaultValue: 3, minValue: 0, maxValue: 4 },
            { name: 'color2', defaultValue: 3, minValue: 0, maxValue: 4 },
            { name: 'colorBlend', defaultValue: 0, minValue: 0, maxValue: 1 },
            { name: 'texture', defaultValue: 0, minValue: 0, maxValue: 1 },
            { name: 'bitDepth', defaultValue: 16, minValue: 2, maxValue: 16 },
            { name: 'sampleRateReduction', defaultValue: 1, minValue: 1, maxValue: 32 }
        ];
    }
    
    // Helper to get noise value for a given alpha
    getNoiseForAlpha(alpha, white, violet, blue, pink, brown) {
        if (alpha <= 1) {
            return (1 - alpha) * violet + alpha * blue;
        } else if (alpha <= 2) {
            const t = alpha - 1;
            return (1 - t) * blue + t * white;
        } else if (alpha <= 3) {
            const t = alpha - 2;
            return (1 - t) * white + t * pink;
        } else {
            const t = alpha - 3;
            return (1 - t) * pink + t * brown;
        }
    }
    
    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const colorParam = parameters['color'];
        const color2Param = parameters['color2'];
        const blendParam = parameters['colorBlend'];
        const texParam = parameters['texture'];
        const bitDepthParam = parameters['bitDepth'];
        const srrParam = parameters['sampleRateReduction'];
        
        for (let ch = 0; ch < output.length; ch++) {
            const outData = output[ch];
            const isColorConst = colorParam.length === 1;
            const isColor2Const = color2Param.length === 1;
            const isBlendConst = blendParam.length === 1;
            const isTexConst = texParam.length === 1;
            const isBitConst = bitDepthParam.length === 1;
            const isSrrConst = srrParam.length === 1;
            
            for (let i = 0; i < outData.length; i++) {
                const alpha = isColorConst ? colorParam[0] : colorParam[i];
                const alpha2 = isColor2Const ? color2Param[0] : color2Param[i];
                const blend = isBlendConst ? blendParam[0] : blendParam[i];
                const texture = isTexConst ? texParam[0] : texParam[i];
                const bitDepth = isBitConst ? bitDepthParam[0] : bitDepthParam[i];
                const srr = isSrrConst ? srrParam[0] : srrParam[i];
                
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
                const violet = (white - this.lastWhite[ch]) * 0.5;
                this.lastWhite[ch] = white;
                
                // === BLUE NOISE (+3dB/octave) ===
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
                let brown = (this.brownState[ch] + (0.02 * white)) / 1.02;
                this.brownState[ch] = brown;
                brown = Math.max(-1, Math.min(1, brown * 3.5));
                
                // Get noise for both colors
                const noise1 = this.getNoiseForAlpha(alpha, white, violet, blue, pink, brown);
                const noise2 = this.getNoiseForAlpha(alpha2, white, violet, blue, pink, brown);
                
                // Blend the two colors
                let sample = (1 - blend) * noise1 + blend * noise2;
                
                // === BITCRUSHING ===
                // Bit depth reduction (quantize to fewer bits)
                if (bitDepth < 16) {
                    const steps = Math.pow(2, bitDepth - 1);
                    sample = Math.round(sample * steps) / steps;
                }
                
                // Sample rate reduction (sample & hold)
                if (srr > 1) {
                    this.sampleHoldCounter[ch]++;
                    if (this.sampleHoldCounter[ch] >= srr) {
                        this.sampleHoldCounter[ch] = 0;
                        this.sampleHoldValue[ch] = sample;
                    }
                    sample = this.sampleHoldValue[ch];
                }
                
                outData[i] = sample;
            }
        }
        return true;
    }
}

registerProcessor('noise-processor', NoiseProcessor);
