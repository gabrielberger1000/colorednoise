# YouTube upload kit

Render each video with `scripts/render-video.js` (see the header of that file
for options), then upload with the title, description and tags below. Use the
matching `video/<slug>-thumbnail.png` as the custom thumbnail.

Rendering takes roughly 2 minutes per hour of audio on an Apple Silicon Mac.
An 8-hour video is about 450 MB.

```bash
node scripts/render-video.js --preset "Deep Brown" --hours 8 --title "Brown Noise"
node scripts/render-video.js --preset "Standard Pink" --hours 8 --title "Pink Noise"
node scripts/render-video.js --preset "Pure White" --hours 8 --title "White Noise"
node scripts/render-video.js --preset "Heavy Rain" --hours 8 --title "Rain Sounds"
node scripts/render-video.js --preset "Box Fan" --hours 8 --title "Box Fan"
node scripts/render-video.js --preset "Deep Sleep" --hours 10 --title "Brown Noise for Sleep"
```

## Shared description footer

Paste this at the end of every description:

```
Generated with Colored Noise, a free noise generator that runs in your browser:
https://colorednoise.app

No ads, no signup, no tracking. The sound is synthesized in real time, so it
never loops or repeats. Includes 71 presets, a sleep timer with fade-out, and
the option to install it as an app that works offline.

This video: https://colorednoise.app/presets/<slug>
Learn about noise colors: https://colorednoise.app/white-vs-pink-vs-brown-noise

Source code (MIT): https://github.com/gabrielberger1000/colorednoise
```

## Videos

### 1. Brown Noise (Deep Brown, 8 hours)

Title: Brown Noise 8 Hours | Deep, Smooth, No Ads, No Loop | For Sleep, Focus, ADHD

Description:
```
Eight hours of pure brown noise. Deep, low, and steady, like a distant
waterfall or a plane at cruising altitude. Nothing else added: no music, no
voices, no ads in the middle.

Brown noise drops about 6 dB per octave, so almost all of its energy is in the
low frequencies. Many people find it the most comfortable noise color for
long listening, and it is widely used for sleep, studying, and masking
traffic or a snoring partner. Some adults with ADHD report it helps them
focus; the research is limited, so treat it as something to try rather than a
treatment.

Keep the volume low enough that you could still hold a conversation over it.

Prefer it without YouTube? The same sound, with a sleep timer and offline
support, is free at https://colorednoise.app/brown-noise
```

Tags: brown noise, brown noise 8 hours, brown noise for sleep, brown noise adhd, brown noise for studying, deep brown noise, brown noise no ads, sleep sounds, focus sounds, noise generator, colorednoise

### 2. Pink Noise (Standard Pink, 8 hours)

Title: Pink Noise 8 Hours | Smooth Rain-Like Sound for Sleep and Study | No Ads

Description:
```
Eight hours of pink noise. Softer than white noise, with a natural, rain-like
balance: equal energy in every octave, which is close to how hearing works.

Pink noise is the most studied noise color for sleep, and it is a common
choice for people who find white noise too sharp and brown noise too dull.
It also masks speech well, which makes it a good background for open offices
and studying.

No music, no ads, no loop point. The sound is synthesized continuously rather
than played from a recording.

The same sound with a sleep timer and offline support is free at
https://colorednoise.app/pink-noise
```

Tags: pink noise, pink noise 8 hours, pink noise for sleep, pink noise for studying, pink noise sleep, pink noise no ads, sleep sounds, study sounds, noise generator, colorednoise

### 3. White Noise (Pure White, 8 hours)

Title: White Noise 8 Hours | Pure, Steady Static for Sleep, Babies, Focus | No Ads

Description:
```
Eight hours of pure white noise. Equal energy at every frequency: the classic
steady hiss of a fan, an untuned radio, or air conditioning.

White noise is the strongest sound masker of the noise colors, which is why it
is used for sleep, for settling babies, for tinnitus relief, and for blocking
out conversations while working. If it sounds too bright to you, try pink or
brown noise instead; links are in the description.

No music, no ads, no loop point. The sound is synthesized continuously rather
than played from a recording.

The same sound with a sleep timer and offline support is free at
https://colorednoise.app/white-noise
```

Tags: white noise, white noise 8 hours, white noise for sleep, white noise for babies, white noise for studying, white noise no ads, sleep sounds, tinnitus masking, noise generator, colorednoise

### 4. Rain Sounds (Heavy Rain, 8 hours)

Title: Heavy Rain Sound 8 Hours | Steady Rainfall for Sleep and Focus | No Thunder, No Ads

Description:
```
Eight hours of steady heavy rain with no thunder, no music, and no ads in the
middle. Constant rainfall, the way it sounds on a roof during a long storm.

This is synthesized pink-brown noise tuned to the spectrum of rain, so it
never loops and there is no seam to wake you up.

Good for sleep, reading, and blocking out a noisy street.

The same sound with a sleep timer and offline support is free at
https://colorednoise.app/presets/heavy-rain
```

Tags: rain sounds, rain sounds for sleeping, heavy rain 8 hours, rain no thunder, rain sounds no ads, rain for studying, sleep sounds, colorednoise

### 5. Box Fan (Box Fan, 8 hours)

Title: Box Fan Sound 8 Hours | Steady Fan Noise for Sleep | No Ads, No Loop

Description:
```
Eight hours of a box fan on a steady setting. For everyone who cannot sleep
without a fan running and does not want to run one all night.

Synthesized pink-brown noise with a perceptual EQ curve that matches the warm,
slightly textured sound of a real fan. No loop point, no ads, no music.

The same sound with a sleep timer and offline support is free at
https://colorednoise.app/presets/box-fan
```

Tags: box fan sound, fan noise for sleeping, fan sound 8 hours, fan white noise, fan noise no ads, sleep sounds, colorednoise

### 6. Brown Noise for Sleep (Deep Sleep, 10 hours)

Title: Brown Noise for Sleep 10 Hours | Slow Breathing Swell, Fades In Gently | No Ads

Description:
```
Ten hours of deep brown noise with a slow, breathing rise and fall every
eight seconds. It fades in over the first thirty seconds so it never starts
abruptly, and fades out at the end.

Designed for falling asleep: deep enough to sit under everything, with just
enough movement that it does not feel like a wall of sound.

No music, no ads, no loop point.

The same preset with a sleep timer and offline support is free at
https://colorednoise.app/presets/deep-sleep
```

Tags: brown noise for sleep, brown noise 10 hours, deep sleep sounds, brown noise sleep no ads, sleep sounds, deep brown noise, colorednoise

## Upload settings

- Category: People & Blogs or Music. Music gets more discovery but some
  creators report more Content ID friction there.
- Audience: not made for kids (required so comments and end screens work).
- Add the site link as the first line of the description as well as the
  footer; only the first two lines show before "more".
- Use the generated thumbnail; text on thumbnails is what makes these
  videos clickable in a list of similar ones.
- Add English chapters only if the video has sections; these do not.
- Consider a playlist called "Noise for sleep and focus" so the videos link
  to each other.

## Things to know

- YouTube does not pay anything at this scale and that is fine; the goal is
  the link in the description.
- Long noise videos occasionally get automated Content ID claims from rights
  holders who uploaded similar noise. If that happens, dispute it: the audio
  is synthesized by your own open-source code and you can point at the
  repository and the render script.
- Most videos in this category get few views for months, then accumulate
  slowly through search and "up next". Upload once, leave them alone, and
  check back in a quarter.
