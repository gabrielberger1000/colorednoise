"""
Example: Ocean Waves

Two voices creating an overlapping wave pattern.
"""

from compose import *

# Define the wave shape - a slow swell of brown noise
wave = phrase(
    color=BROWN,
    attack=3,
    duration=2,
    release=4,
    volume=0.7
)

# Create composition with offset timing
comp = composition(
    voices={
        "wave_left": [
            with_pan(wave, -0.5),
            repeat(5, with_pan(wave, -0.5))
        ],
        "wave_right": [
            wait(4),  # Offset from left wave
            with_pan(wave, 0.5),
            repeat(5, with_pan(wave, 0.5))
        ]
    },
    global_events=[
        global_settings(reverb_mix=0.4, reverb_size="large")
    ]
)

save(comp, "example_ocean.json")
print(to_json(comp))
