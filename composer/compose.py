"""
Colored Noise Composition Helper

A Python module for programmatically creating compositions for colorednoise.app

Usage:
    from compose import *
    
    # Define reusable phrases
    bass_swell = phrase(color=4, attack=2, duration=3, release=2)
    
    # Build composition
    comp = composition(
        voices={
            "bass": [bass_swell, wait(2), bass_swell]
        }
    )
    
    # Export to JSON
    save(comp, "my_composition.json")
"""

import json
from typing import Any

# === VOICE EVENTS ===

def phrase(
    color: float,
    duration: float,
    volume: float = 0.8,
    pan: float = 0,
    attack: float = 0.5,
    decay: float = 0,
    sustain: float = 1,
    release: float = 0.5,
    wait: float = None
) -> dict:
    """
    Create a voice event (a single sound).
    
    Args:
        color: Noise color (0=violet, 1=blue, 2=white, 3=pink, 4=brown)
        duration: How long to sustain (seconds)
        volume: Loudness (0-1)
        pan: Stereo position (-1=left, 0=center, 1=right)
        attack: Fade in time (seconds)
        decay: Time to fall to sustain level (seconds)
        sustain: Level to hold at after decay (0-1)
        release: Fade out time (seconds)
        wait: Silence before this event (seconds)
    
    Returns:
        Event dictionary
    """
    event = {
        "color": color,
        "duration": duration,
        "volume": volume,
        "pan": pan,
        "attack": attack,
        "decay": decay,
        "sustain": sustain,
        "release": release
    }
    if wait is not None:
        event["wait"] = wait
    return event


def wait(seconds: float) -> dict:
    """Create a pause/silence."""
    return {"wait": seconds}


def repeat(n: int, *events) -> dict:
    """
    Repeat a sequence of events n times.
    
    Args:
        n: Number of repetitions
        *events: Events to repeat (can be phrases, waits, or nested repeats)
    
    Returns:
        Repeat block dictionary
    """
    return {
        "repeat": n,
        "events": list(events)
    }


# === GLOBAL EVENTS ===

def global_settings(
    wait: float = None,
    grey: bool = None,
    pulse: float = None,
    pulse_shape: str = None,
    texture: int = None,
    pan_rate: float = None,
    pan_depth: float = None,
    color2: float = None,
    color_blend: float = None,
    saturation: float = None,
    saturation_mode: str = None,
    bit_depth: int = None,
    sample_rate_reduction: int = None,
    reverb_mix: float = None,
    reverb_size: str = None
) -> dict:
    """
    Create a global settings change event.
    
    Only include parameters you want to change; others remain unchanged.
    
    Args:
        wait: Delay before applying these settings (seconds)
        grey: Enable grey noise EQ
        pulse: Pulse/LFO speed (0-4 Hz, 0=off)
        pulse_shape: "sine", "triangle", or "square"
        texture: 0=Gaussian, 1=Uniform
        pan_rate: Stereo LFO rate (0-2 Hz)
        pan_depth: Stereo LFO depth (0-1)
        color2: Second color for blending (0-4)
        color_blend: Blend amount (0-1)
        saturation: Distortion amount (0-1)
        saturation_mode: "soft", "hard", or "warm"
        bit_depth: Bit crushing (2-16)
        sample_rate_reduction: Downsampling (1-32)
        reverb_mix: Reverb amount (0-1)
        reverb_size: "small", "medium", or "large"
    
    Returns:
        Global event dictionary
    """
    event = {}
    
    if wait is not None:
        event["wait"] = wait
    if grey is not None:
        event["grey"] = grey
    if pulse is not None:
        event["pulse"] = pulse
    if pulse_shape is not None:
        event["pulseShape"] = pulse_shape
    if texture is not None:
        event["texture"] = texture
    if pan_rate is not None:
        event["panRate"] = pan_rate
    if pan_depth is not None:
        event["panDepth"] = pan_depth
    if color2 is not None:
        event["color2"] = color2
    if color_blend is not None:
        event["colorBlend"] = color_blend
    if saturation is not None:
        event["saturation"] = saturation
    if saturation_mode is not None:
        event["saturationMode"] = saturation_mode
    if bit_depth is not None:
        event["bitDepth"] = bit_depth
    if sample_rate_reduction is not None:
        event["sampleRateReduction"] = sample_rate_reduction
    if reverb_mix is not None:
        event["reverbMix"] = reverb_mix
    if reverb_size is not None:
        event["reverbSize"] = reverb_size
    
    return event


# === COMPOSITION ===

def composition(voices: dict, global_events: list = None) -> dict:
    """
    Create a complete composition.
    
    Args:
        voices: Dictionary mapping voice names to event lists
        global_events: Optional list of global setting changes
    
    Returns:
        Complete composition dictionary
    """
    result = {"voices": voices}
    if global_events:
        result["global"] = global_events
    return result


# === UTILITIES ===

def seq(*events) -> list:
    """Convenience function to create a sequence (just returns a list)."""
    return list(events)


def merge(*sequences) -> list:
    """Merge multiple sequences into one."""
    result = []
    for s in sequences:
        if isinstance(s, list):
            result.extend(s)
        else:
            result.append(s)
    return result


def transpose_color(event: dict, amount: float) -> dict:
    """
    Create a copy of an event with shifted color.
    
    Args:
        event: Original event
        amount: How much to shift color (can be negative)
    
    Returns:
        New event with adjusted color (clamped to 0-4)
    """
    new_event = event.copy()
    if "color" in new_event:
        new_event["color"] = max(0, min(4, new_event["color"] + amount))
    return new_event


def scale_time(event: dict, factor: float) -> dict:
    """
    Create a copy of an event with scaled timing.
    
    Args:
        event: Original event
        factor: Multiplier for all time values
    
    Returns:
        New event with scaled times
    """
    new_event = event.copy()
    time_keys = ["attack", "decay", "duration", "release", "wait"]
    for key in time_keys:
        if key in new_event:
            new_event[key] = new_event[key] * factor
    return new_event


def with_pan(event: dict, pan: float) -> dict:
    """Create a copy of an event with different pan."""
    new_event = event.copy()
    new_event["pan"] = pan
    return new_event


def with_volume(event: dict, volume: float) -> dict:
    """Create a copy of an event with different volume."""
    new_event = event.copy()
    new_event["volume"] = volume
    return new_event


# === I/O ===

def save(comp: dict, filename: str, indent: int = 2):
    """Save composition to a JSON file."""
    with open(filename, "w") as f:
        json.dump(comp, f, indent=indent)
    print(f"Saved to {filename}")


def to_json(comp: dict, indent: int = 2) -> str:
    """Convert composition to JSON string."""
    return json.dumps(comp, indent=indent)


def load(filename: str) -> dict:
    """Load composition from a JSON file."""
    with open(filename, "r") as f:
        return json.load(f)


# === PRESET PHRASES ===
# Some ready-to-use building blocks

class presets:
    """Collection of preset phrases."""
    
    # Swells
    pink_swell = phrase(color=3, attack=3, duration=2, release=3)
    brown_swell = phrase(color=4, attack=4, duration=3, release=4)
    white_swell = phrase(color=2, attack=2, duration=1, release=2)
    
    # Short hits
    pink_blip = phrase(color=3, attack=0.05, duration=0.1, release=0.2)
    brown_thud = phrase(color=4, attack=0.02, duration=0.2, release=0.3)
    white_click = phrase(color=2, attack=0.01, duration=0.05, release=0.1)
    
    # Drones
    pink_drone = phrase(color=3, attack=5, duration=30, release=5)
    brown_drone = phrase(color=4, attack=5, duration=30, release=5)
    
    # Breaths
    breath_in = phrase(color=3, attack=2, duration=0.5, decay=0.5, sustain=0.7, release=0)
    breath_out = phrase(color=3.5, attack=0, duration=0.5, decay=0.5, sustain=0.5, release=2)


# === COLOR CONSTANTS ===

VIOLET = 0
BLUE = 1
WHITE = 2
PINK = 3
BROWN = 4
