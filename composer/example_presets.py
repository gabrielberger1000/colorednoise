"""
Example: Using Preset Phrases

Demonstrates using the built-in preset phrases to quickly
build a composition.
"""

from compose import *

# Use the preset phrases directly
comp = composition(
    voices={
        "bass": [
            presets.brown_swell,
            wait(2),
            repeat(3, presets.brown_swell, wait(1))
        ],
        
        "mid": [
            wait(3),
            presets.pink_swell,
            repeat(3, presets.pink_swell, wait(2))
        ],
        
        "high": [
            wait(6),
            repeat(8,
                presets.white_click,
                wait(0.5),
                presets.pink_blip,
                wait(1)
            )
        ],
        
        "drone": [
            presets.pink_drone
        ]
    },
    global_events=[
        global_settings(grey=True, reverb_mix=0.4, reverb_size="large")
    ]
)

save(comp, "example_presets.json")
print(to_json(comp))
