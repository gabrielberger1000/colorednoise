"""
Example: Evolving Texture

A long-form piece where the global effects change over time,
transforming the same base material.
"""

from compose import *

# Base drone - will be transformed by global effects
drone = phrase(
    color=PINK,
    attack=8,
    duration=20,
    release=8,
    volume=0.7
)

# Secondary texture
texture = phrase(
    color=BROWN,
    attack=4,
    duration=10,
    release=6,
    volume=0.5,
    pan=0.4
)

# Accent hits
accent = phrase(
    color=WHITE,
    attack=0.1,
    duration=0.3,
    release=0.5,
    volume=0.3
)

comp = composition(
    voices={
        "drone": [
            drone,
            drone,
            drone
        ],
        "texture": [
            wait(10),
            texture,
            wait(5),
            texture,
            wait(5),
            texture
        ],
        "accents": [
            wait(15),
            repeat(10,
                with_pan(accent, -0.6),
                wait(3),
                with_pan(accent, 0.6),
                wait(4)
            )
        ]
    },
    global_events=[
        # Start clean
        global_settings(
            grey=True,
            reverb_mix=0.2,
            reverb_size="medium"
        ),
        # At 20 seconds: add saturation
        global_settings(
            wait=20,
            saturation=0.3,
            saturation_mode="warm"
        ),
        # At 40 seconds: increase reverb, add bit crushing
        global_settings(
            wait=20,
            reverb_mix=0.5,
            reverb_size="large",
            bit_depth=12
        ),
        # At 60 seconds: full effects
        global_settings(
            wait=20,
            saturation=0.6,
            bit_depth=8,
            pan_rate=0.1,
            pan_depth=0.3
        ),
        # At 80 seconds: pull back
        global_settings(
            wait=20,
            saturation=0.2,
            bit_depth=16,
            reverb_mix=0.7
        )
    ]
)

save(comp, "example_evolving.json")
print(to_json(comp))
