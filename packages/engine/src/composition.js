/**
 * JSON composition format: validation and scheduling.
 *
 * Every function here is pure. `validateComposition` returns
 * { valid, error } rather than throwing, and `buildCompositionSchedule`
 * flattens repeat blocks into a flat list of timed events.
 *
 * Format reference: https://colorednoise.app/docs
 */

export function validateComposition(comp) {
    // Check structure
    if (!comp.voices || typeof comp.voices !== 'object') {
        return { valid: false, error: 'Missing "voices" object' };
    }
    
    const voiceNames = Object.keys(comp.voices);
    if (voiceNames.length === 0) {
        return { valid: false, error: 'No voices defined' };
    }
    
    let maxDuration = 0;
    
    // Validate each voice
    for (const name of voiceNames) {
        const events = comp.voices[name];
        if (!Array.isArray(events)) {
            return { valid: false, error: `Voice "${name}" must be an array` };
        }
        
        const result = validateEventList(events, `voice "${name}"`);
        if (!result.valid) {
            return result;
        }
        maxDuration = Math.max(maxDuration, result.duration);
    }
    
    // Validate global track if present
    if (comp.global) {
        if (!Array.isArray(comp.global)) {
            return { valid: false, error: '"global" must be an array' };
        }
        const result = validateGlobalEventList(comp.global);
        if (!result.valid) {
            return result;
        }
    }
    
    return { valid: true, voiceCount: voiceNames.length, totalDuration: maxDuration };
}

export function validateEventList(events, context, currentTime = 0) {
    let time = currentTime;
    
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        
        // Check for repeat block
        if (event.repeat !== undefined) {
            if (typeof event.repeat !== 'number' || event.repeat < 1) {
                return { valid: false, error: `${context} event ${i}: "repeat" must be a positive number` };
            }
            if (!Array.isArray(event.events)) {
                return { valid: false, error: `${context} event ${i}: repeat block must have "events" array` };
            }
            
            // Validate nested events and calculate duration
            const nestedResult = validateEventList(event.events, `${context} repeat block`, 0);
            if (!nestedResult.valid) {
                return nestedResult;
            }
            time += nestedResult.duration * event.repeat;
            continue;
        }
        
        // Check for wait
        if (event.wait !== undefined) {
            if (typeof event.wait !== 'number' || event.wait < 0) {
                return { valid: false, error: `${context} event ${i}: "wait" must be a non-negative number` };
            }
            time += event.wait;
            
            // If it's just a wait, continue
            if (Object.keys(event).length === 1) {
                continue;
            }
        }
        
        // Validate voice event
        const validation = validateVoiceEvent(event, `${context} event ${i}`);
        if (!validation.valid) {
            return validation;
        }
        
        // Calculate event duration
        const attack = event.attack || 0;
        const decay = event.decay || 0;
        const duration = event.duration || 0;
        const release = event.release || 0;
        time += attack + decay + duration + release;
    }
    
    return { valid: true, duration: time };
}

export function validateVoiceEvent(event, context) {
    // Required fields with type checks
    if (event.color === undefined) {
        return { valid: false, error: `${context}: missing "color"` };
    }
    if (typeof event.color !== 'number') {
        return { valid: false, error: `${context}: "color" must be a number, got ${typeof event.color}` };
    }
    if (event.duration === undefined) {
        return { valid: false, error: `${context}: missing "duration"` };
    }
    if (typeof event.duration !== 'number') {
        return { valid: false, error: `${context}: "duration" must be a number, got ${typeof event.duration}` };
    }

    // Range checks
    if (event.color < 0 || event.color > 4 || isNaN(event.color)) {
        return { valid: false, error: `${context}: "color" must be 0-4` };
    }
    if (event.volume !== undefined) {
        if (typeof event.volume !== 'number') {
            return { valid: false, error: `${context}: "volume" must be a number, got ${typeof event.volume}` };
        }
        if (event.volume < 0 || event.volume > 1 || isNaN(event.volume)) {
            return { valid: false, error: `${context}: "volume" must be 0-1` };
        }
    }
    if (event.pan !== undefined) {
        if (typeof event.pan !== 'number') {
            return { valid: false, error: `${context}: "pan" must be a number, got ${typeof event.pan}` };
        }
        if (event.pan < -1 || event.pan > 1 || isNaN(event.pan)) {
            return { valid: false, error: `${context}: "pan" must be -1 to 1` };
        }
    }
    if (event.sustain !== undefined) {
        if (typeof event.sustain !== 'number') {
            return { valid: false, error: `${context}: "sustain" must be a number, got ${typeof event.sustain}` };
        }
        if (event.sustain < 0 || event.sustain > 1 || isNaN(event.sustain)) {
            return { valid: false, error: `${context}: "sustain" must be 0-1` };
        }
    }
    if (event.attack !== undefined && typeof event.attack !== 'number') {
        return { valid: false, error: `${context}: "attack" must be a number, got ${typeof event.attack}` };
    }
    if (event.decay !== undefined && typeof event.decay !== 'number') {
        return { valid: false, error: `${context}: "decay" must be a number, got ${typeof event.decay}` };
    }
    if (event.release !== undefined && typeof event.release !== 'number') {
        return { valid: false, error: `${context}: "release" must be a number, got ${typeof event.release}` };
    }
    if (event.duration < 0 || isNaN(event.duration)) {
        return { valid: false, error: `${context}: "duration" must be non-negative` };
    }

    return { valid: true };
}

export function validateGlobalEventList(events) {
    for (let i = 0; i < events.length; i++) {
        const event = events[i];

        // Check for repeat block
        if (event.repeat !== undefined) {
            if (typeof event.repeat !== 'number') {
                return { valid: false, error: `global event ${i}: "repeat" must be a number` };
            }
            if (!Array.isArray(event.events)) {
                return { valid: false, error: `global event ${i}: repeat block must have "events" array` };
            }
            const nestedResult = validateGlobalEventList(event.events);
            if (!nestedResult.valid) {
                return nestedResult;
            }
            continue;
        }

        // Type and range checks
        if (event.wait !== undefined) {
            if (typeof event.wait !== 'number') {
                return { valid: false, error: `global event ${i}: "wait" must be a number` };
            }
            if (event.wait < 0 || isNaN(event.wait)) {
                return { valid: false, error: `global event ${i}: "wait" must be non-negative` };
            }
        }
        if (event.pulse !== undefined) {
            if (typeof event.pulse !== 'number') {
                return { valid: false, error: `global event ${i}: "pulse" must be a number` };
            }
            if (event.pulse < 0 || event.pulse > 4 || isNaN(event.pulse)) {
                return { valid: false, error: `global event ${i}: "pulse" must be 0-4` };
            }
        }
        if (event.panRate !== undefined) {
            if (typeof event.panRate !== 'number') {
                return { valid: false, error: `global event ${i}: "panRate" must be a number` };
            }
            if (event.panRate < 0 || event.panRate > 2 || isNaN(event.panRate)) {
                return { valid: false, error: `global event ${i}: "panRate" must be 0-2` };
            }
        }
        if (event.saturation !== undefined) {
            if (typeof event.saturation !== 'number') {
                return { valid: false, error: `global event ${i}: "saturation" must be a number` };
            }
            if (event.saturation < 0 || event.saturation > 1 || isNaN(event.saturation)) {
                return { valid: false, error: `global event ${i}: "saturation" must be 0-1` };
            }
        }
        if (event.bitDepth !== undefined) {
            if (typeof event.bitDepth !== 'number') {
                return { valid: false, error: `global event ${i}: "bitDepth" must be a number` };
            }
            if (event.bitDepth < 2 || event.bitDepth > 16 || isNaN(event.bitDepth)) {
                return { valid: false, error: `global event ${i}: "bitDepth" must be 2-16` };
            }
        }
        if (event.reverbMix !== undefined) {
            if (typeof event.reverbMix !== 'number') {
                return { valid: false, error: `global event ${i}: "reverbMix" must be a number` };
            }
            if (event.reverbMix < 0 || event.reverbMix > 1 || isNaN(event.reverbMix)) {
                return { valid: false, error: `global event ${i}: "reverbMix" must be 0-1` };
            }
        }
        if (event.grey !== undefined && typeof event.grey !== 'boolean') {
            return { valid: false, error: `global event ${i}: "grey" must be a boolean` };
        }
        if (event.pulseShape !== undefined && typeof event.pulseShape !== 'string') {
            return { valid: false, error: `global event ${i}: "pulseShape" must be a string` };
        }
        if (event.reverbSize !== undefined && typeof event.reverbSize !== 'string') {
            return { valid: false, error: `global event ${i}: "reverbSize" must be a string` };
        }
    }

    return { valid: true };
}

export function buildCompositionSchedule(comp) {
    const voiceEvents = [];
    const globalEvents = [];
    let maxDuration = 0;
    
    // Process voices
    const voiceNames = Object.keys(comp.voices);
    for (let voiceIndex = 0; voiceIndex < voiceNames.length; voiceIndex++) {
        const name = voiceNames[voiceIndex];
        const events = flattenEvents(comp.voices[name]);
        
        let time = 0;
        for (const event of events) {
            if (event.wait) {
                time += event.wait;
            }
            if (event.color !== undefined) {
                voiceEvents.push({
                    time,
                    voiceIndex,
                    voiceName: name,
                    ...event
                });
                const eventDuration = (event.attack || 0) + (event.decay || 0) + (event.duration || 0) + (event.release || 0);
                time += eventDuration;
            }
        }
        maxDuration = Math.max(maxDuration, time);
    }
    
    // Process global
    if (comp.global) {
        const events = flattenEvents(comp.global);
        let time = 0;
        for (const event of events) {
            if (event.wait) {
                time += event.wait;
            }
            // Only add if there are actual settings (not just a wait)
            const settingsKeys = Object.keys(event).filter(k => k !== 'wait');
            if (settingsKeys.length > 0) {
                globalEvents.push({ time, ...event });
            }
        }
    }
    
    return { voiceEvents, globalEvents, totalDuration: maxDuration };
}

export function flattenEvents(events, result = []) {
    for (const event of events) {
        if (event.repeat !== undefined && event.events) {
            for (let i = 0; i < event.repeat; i++) {
                flattenEvents(event.events, result);
            }
        } else {
            result.push(event);
        }
    }
    return result;
}

// Maximum voices allowed in compositions to prevent memory exhaustion
const MAX_COMPOSITION_VOICES = 32;
