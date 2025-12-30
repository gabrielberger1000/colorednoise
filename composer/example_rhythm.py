"""
Example: Rhythmic Machine

A polyrhythmic pattern using short percussive sounds.
"""

from compose import *

# Define rhythmic elements
kick = phrase(color=BROWN, attack=0.01, duration=0.1, release=0.2, volume=0.8, pan=0)
snare = phrase(color=WHITE, attack=0.01, duration=0.05, release=0.15, volume=0.6, pan=0.3)
hat = phrase(color=BLUE, attack=0.005, duration=0.02, release=0.08, volume=0.4, pan=-0.3)

# Gaps between hits
short_gap = wait(0.25)
long_gap = wait(0.5)

# Build patterns
kick_pattern = [kick, long_gap, kick, short_gap, kick, long_gap]  # 4 beats
snare_pattern = [wait(0.5), snare, long_gap, snare, short_gap]     # Offset snare
hat_pattern = [hat, short_gap]                                      # Constant 16ths

comp = composition(
    voices={
        "kick": [repeat(8, *kick_pattern)],
        "snare": [repeat(8, *snare_pattern)],
        "hats": [repeat(32, *hat_pattern)]
    },
    global_events=[
        global_settings(bit_depth=12, sample_rate_reduction=2)
    ]
)

save(comp, "example_rhythm.json")
print(to_json(comp))
