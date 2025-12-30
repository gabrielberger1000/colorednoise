"""
Example: Theme and Variations

Demonstrates using transformation functions to create variations
from a single base phrase.
"""

from compose import *

# Define a base motif
motif = phrase(
    color=PINK,
    attack=0.5,
    duration=1,
    release=0.5,
    volume=0.7,
    pan=0
)

# Create variations
motif_bright = transpose_color(motif, -1)      # Shift toward white
motif_dark = transpose_color(motif, 1)         # Shift toward brown
motif_slow = scale_time(motif, 2)              # Double all times
motif_fast = scale_time(motif, 0.5)            # Half all times
motif_left = with_pan(motif, -0.7)
motif_right = with_pan(motif, 0.7)
motif_quiet = with_volume(motif, 0.3)

# A more complex variation combining transforms
motif_dark_slow_left = with_pan(scale_time(transpose_color(motif, 1), 1.5), -0.5)

# Build a piece using the variations
comp = composition(
    voices={
        "theme": [
            # State the theme
            motif,
            motif,
            wait(1),
            
            # Variation 1: color changes
            motif_bright,
            motif,
            motif_dark,
            wait(1),
            
            # Variation 2: time changes
            motif_slow,
            repeat(4, motif_fast),
            wait(1),
            
            # Variation 3: stereo
            motif_left,
            motif_right,
            motif_left,
            motif_right
        ],
        
        "counterpoint": [
            wait(4),  # Enter after theme is established
            repeat(6, 
                motif_dark_slow_left,
                wait(0.5)
            )
        ],
        
        "pedal": [
            # A quiet sustained note underneath
            phrase(color=BROWN, attack=2, duration=30, release=4, volume=0.25)
        ]
    },
    global_events=[
        global_settings(reverb_mix=0.3, reverb_size="medium")
    ]
)

save(comp, "example_variations.json")
print(to_json(comp))
