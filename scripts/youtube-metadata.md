# YouTube upload kit

Render the videos, then work through the numbered sections in order. Output
lands in `video/`, which is gitignored: six files, 4.1 GB total.

Descriptions below are assembled ready to paste — site link on the first line,
footer slugs filled in, and each paragraph on a single line so YouTube reflows
it to the viewport instead of double-wrapping this file's hard wraps.

## Rendering

Roughly 2 minutes per hour of audio on an Apple Silicon Mac. An 8-hour video is
about 640 MB, a 10-hour one about 800 MB. See the header of
`scripts/render-video.js` for options.

```bash
node scripts/render-video.js --preset "Deep Brown" --hours 8 --title "Brown Noise"
node scripts/render-video.js --preset "Standard Pink" --hours 8 --title "Pink Noise"
node scripts/render-video.js --preset "Pure White" --hours 8 --title "White Noise"
node scripts/render-video.js --preset "Heavy Rain" --hours 8 --title "Rain Sounds"
node scripts/render-video.js --preset "Box Fan" --hours 8 --title "Box Fan"
node scripts/render-video.js --preset "Deep Sleep" --hours 10 --title "Brown Noise for Sleep"
```

Each render also writes `video/<slug>-thumbnail.png` (1280x720), which is the
custom thumbnail to upload. The text on it is what makes these clickable in a
list of near-identical videos.

## Channel art

`scripts/make-banner.js` renders the 2048x1152 channel banner from the same
palette as the title cards, keeping everything readable inside the 1235x338
area that is the only part YouTube always shows.

```bash
node scripts/make-banner.js            # video/channel-banner.png
node scripts/make-banner.js --guides   # same, with the crop boxes drawn on
```

Upload the plain render, not the `--guides` one — that exists to check
placement after editing the banner text. For the channel avatar, use the
largest square in `icons/`.

## 1. Create the channel

- [ ] At <https://www.youtube.com/channel_switcher>, click **Create a channel**.
      This makes a Brand Account: transferable, multi-manager, not welded to
      your name. An existing channel is untouched and none of its subscriptions
      or history carry over.
- [ ] Name it **Colored Noise**. Try `@colorednoise`, fall back to
      `@colorednoiseapp`. Handles can only be changed twice per 14 days.

## 2. Check verification

Uploads over 15 minutes and custom thumbnails both need **Intermediate
features**. The shortest video here is 8 hours, so nothing below works
without it.

**Studio opens on whichever channel was last active,** so it will keep showing
the old channel until you switch: avatar, top right → **Switch account** →
Colored Noise, or pick it at <https://www.youtube.com/channel_switcher>. Worth
bookmarking `studio.youtube.com/channel/<CHANNEL_ID>` for the new channel; the
ID is under Settings → Channel → Advanced settings.

- [ ] On the new channel, open **Settings → Channel → Feature eligibility**:

      | Tier | Covers | Needed here |
      | --- | --- | --- |
      | Standard features | Uploads, playlists, collaborators | yes |
      | Intermediate features | Videos over 15 minutes, custom thumbnails, live streaming | yes |
      | Advanced features | Higher daily upload counts, monetization eligibility | no |

      If Intermediate reads **Enabled**, verification is done and there is
      nothing else to do here. Advanced showing *Eligible* only means you could
      apply — ignore it. It gates external links in cards and end screens,
      which also need Partner Program membership; description links work
      without any of it.
- [ ] Only if Intermediate is not enabled: open it and click **Verify phone
      number** (<https://www.youtube.com/verify> lands in the same place). If
      the number has already been used for other channels YouTube may refuse
      it, and virtual or VoIP numbers are often rejected — any real mobile line
      you can receive one code on will do, and a landline works with the call
      option.

## 3. Brand it

- [ ] **Profile picture** — largest square in `icons/`. Minimum 98x98, under 4 MB.
- [ ] **Banner** — `video/channel-banner.png`.
- [ ] **Description** — the block below.
- [ ] **Links** — `Colored Noise` → https://colorednoise.app (set to show on the
      banner) and `Source (MIT)` → the GitHub repo. Add a contact email; a blank
      one reads as abandoned.

Channel description:

```
Long, unbroken noise for sleep, focus and masking. No ads mid-video, no music, no loop point — every track is synthesized rather than looped from a recording.

Free generator with 71 presets, a sleep timer and offline support: https://colorednoise.app
```

## 4. Upload

Run `caffeinate -d -i -m` in a terminal tab first, or the Mac sleeps
mid-upload. Upload one file at a time — the browser uploader resumes, but not
reliably enough to test on six 640 MB files at once.

Identical for all six, on the Details page:

| Field | Value |
| --- | --- |
| Audience | Not made for kids — this is content for parents, not children; "made for kids" kills comments and notifications |
| Category | People & Blogs, **not** Music, which matches far more aggressively against Content ID |
| Language | English |
| Comments | On |
| Visibility | Private or scheduled until section 5 |
| Playlist | Noise for sleep and focus (create it on the first upload) |
| Chapters | None — these videos have no sections |

- [ ] Create the playlist
- [ ] Brown Noise — `deep-brown-8h.mp4`
- [ ] Pink Noise — `standard-pink-8h.mp4`
- [ ] White Noise — `pure-white-8h.mp4`
- [ ] Rain Sounds — `heavy-rain-8h.mp4`
- [ ] Box Fan — `box-fan-8h.mp4`
- [ ] Brown Noise for Sleep — `deep-sleep-10h.mp4`

### 1. Brown Noise

Video `video/deep-brown-8h.mp4` · thumbnail `video/deep-brown-thumbnail.png` · 8 hours

Title:

```
Brown Noise 8 Hours | Deep, Smooth, No Ads, No Loop | For Sleep, Focus, ADHD
```

Description:

```
Free, ad-free version with a sleep timer: https://colorednoise.app

Eight hours of pure brown noise. Deep, low, and steady, like a distant waterfall or a plane at cruising altitude. Nothing else added: no music, no voices, no ads in the middle.

Brown noise drops about 6 dB per octave, so almost all of its energy is in the low frequencies. Many people find it the most comfortable noise color for long listening, and it is widely used for sleep, studying, and masking traffic or a snoring partner. Some adults with ADHD report it helps them focus; the research is limited, so treat it as something to try rather than a treatment.

Keep the volume low enough that you could still hold a conversation over it.

Prefer it without YouTube? The same sound, with a sleep timer and offline support, is free at https://colorednoise.app/brown-noise

Generated with Colored Noise, a free noise generator that runs in your browser: https://colorednoise.app

No ads, no signup, no tracking. The sound is synthesized in real time, so it never loops or repeats. Includes 71 presets, a sleep timer with fade-out, and the option to install it as an app that works offline.

This video: https://colorednoise.app/presets/deep-brown
Learn about noise colors: https://colorednoise.app/white-vs-pink-vs-brown-noise

Source code (MIT): https://github.com/gabrielberger1000/colorednoise
```

Tags:

```
brown noise, brown noise 8 hours, brown noise for sleep, brown noise adhd, brown noise for studying, deep brown noise, brown noise no ads, sleep sounds, focus sounds, noise generator, colorednoise
```

### 2. Pink Noise

Video `video/standard-pink-8h.mp4` · thumbnail `video/standard-pink-thumbnail.png` · 8 hours

Title:

```
Pink Noise 8 Hours | Smooth Rain-Like Sound for Sleep and Study | No Ads
```

Description:

```
Free, ad-free version with a sleep timer: https://colorednoise.app

Eight hours of pink noise. Softer than white noise, with a natural, rain-like balance: equal energy in every octave, which is close to how hearing works.

Pink noise is the most studied noise color for sleep, and it is a common choice for people who find white noise too sharp and brown noise too dull. It also masks speech well, which makes it a good background for open offices and studying.

No music, no ads, no loop point. The sound is synthesized continuously rather than played from a recording.

The same sound with a sleep timer and offline support is free at https://colorednoise.app/pink-noise

Generated with Colored Noise, a free noise generator that runs in your browser: https://colorednoise.app

No ads, no signup, no tracking. The sound is synthesized in real time, so it never loops or repeats. Includes 71 presets, a sleep timer with fade-out, and the option to install it as an app that works offline.

This video: https://colorednoise.app/presets/standard-pink
Learn about noise colors: https://colorednoise.app/white-vs-pink-vs-brown-noise

Source code (MIT): https://github.com/gabrielberger1000/colorednoise
```

Tags:

```
pink noise, pink noise 8 hours, pink noise for sleep, pink noise for studying, pink noise sleep, pink noise no ads, sleep sounds, study sounds, noise generator, colorednoise
```

### 3. White Noise

Video `video/pure-white-8h.mp4` · thumbnail `video/pure-white-thumbnail.png` · 8 hours

Title:

```
White Noise 8 Hours | Pure, Steady Static for Sleep, Babies, Focus | No Ads
```

Description:

```
Free, ad-free version with a sleep timer: https://colorednoise.app

Eight hours of pure white noise. Equal energy at every frequency: the classic steady hiss of a fan, an untuned radio, or air conditioning.

White noise is the strongest sound masker of the noise colors, which is why it is used for sleep, for settling babies, for tinnitus relief, and for blocking out conversations while working. If it sounds too bright to you, try pink or brown noise instead; links are in the description.

No music, no ads, no loop point. The sound is synthesized continuously rather than played from a recording.

The same sound with a sleep timer and offline support is free at https://colorednoise.app/white-noise

Generated with Colored Noise, a free noise generator that runs in your browser: https://colorednoise.app

No ads, no signup, no tracking. The sound is synthesized in real time, so it never loops or repeats. Includes 71 presets, a sleep timer with fade-out, and the option to install it as an app that works offline.

This video: https://colorednoise.app/presets/pure-white
Learn about noise colors: https://colorednoise.app/white-vs-pink-vs-brown-noise

Source code (MIT): https://github.com/gabrielberger1000/colorednoise
```

Tags:

```
white noise, white noise 8 hours, white noise for sleep, white noise for babies, white noise for studying, white noise no ads, sleep sounds, tinnitus masking, noise generator, colorednoise
```

### 4. Rain Sounds

Video `video/heavy-rain-8h.mp4` · thumbnail `video/heavy-rain-thumbnail.png` · 8 hours

Title:

```
Heavy Rain Sound 8 Hours | Steady Rainfall for Sleep and Focus | No Thunder, No Ads
```

Description:

```
Free, ad-free version with a sleep timer: https://colorednoise.app

Eight hours of steady heavy rain with no thunder, no music, and no ads in the middle. Constant rainfall, the way it sounds on a roof during a long storm.

This is synthesized pink-brown noise tuned to the spectrum of rain, so it never loops and there is no seam to wake you up.

Good for sleep, reading, and blocking out a noisy street.

The same sound with a sleep timer and offline support is free at https://colorednoise.app/presets/heavy-rain

Generated with Colored Noise, a free noise generator that runs in your browser: https://colorednoise.app

No ads, no signup, no tracking. The sound is synthesized in real time, so it never loops or repeats. Includes 71 presets, a sleep timer with fade-out, and the option to install it as an app that works offline.

This video: https://colorednoise.app/presets/heavy-rain
Learn about noise colors: https://colorednoise.app/white-vs-pink-vs-brown-noise

Source code (MIT): https://github.com/gabrielberger1000/colorednoise
```

Tags:

```
rain sounds, rain sounds for sleeping, heavy rain 8 hours, rain no thunder, rain sounds no ads, rain for studying, sleep sounds, colorednoise
```

### 5. Box Fan

Video `video/box-fan-8h.mp4` · thumbnail `video/box-fan-thumbnail.png` · 8 hours

Title:

```
Box Fan Sound 8 Hours | Steady Fan Noise for Sleep | No Ads, No Loop
```

Description:

```
Free, ad-free version with a sleep timer: https://colorednoise.app

Eight hours of a box fan on a steady setting. For everyone who cannot sleep without a fan running and does not want to run one all night.

Synthesized pink-brown noise with a perceptual EQ curve that matches the warm, slightly textured sound of a real fan. No loop point, no ads, no music.

The same sound with a sleep timer and offline support is free at https://colorednoise.app/presets/box-fan

Generated with Colored Noise, a free noise generator that runs in your browser: https://colorednoise.app

No ads, no signup, no tracking. The sound is synthesized in real time, so it never loops or repeats. Includes 71 presets, a sleep timer with fade-out, and the option to install it as an app that works offline.

This video: https://colorednoise.app/presets/box-fan
Learn about noise colors: https://colorednoise.app/white-vs-pink-vs-brown-noise

Source code (MIT): https://github.com/gabrielberger1000/colorednoise
```

Tags:

```
box fan sound, fan noise for sleeping, fan sound 8 hours, fan white noise, fan noise no ads, sleep sounds, colorednoise
```

### 6. Brown Noise for Sleep

Video `video/deep-sleep-10h.mp4` · thumbnail `video/deep-sleep-thumbnail.png` · 10 hours

Title:

```
Brown Noise for Sleep 10 Hours | Slow Breathing Swell, Fades In Gently | No Ads
```

Description:

```
Free, ad-free version with a sleep timer: https://colorednoise.app

Ten hours of deep brown noise with a slow, breathing rise and fall every eight seconds. It fades in over the first thirty seconds so it never starts abruptly, and fades out at the end.

Designed for falling asleep: deep enough to sit under everything, with just enough movement that it does not feel like a wall of sound.

No music, no ads, no loop point.

The same preset with a sleep timer and offline support is free at https://colorednoise.app/presets/deep-sleep

Generated with Colored Noise, a free noise generator that runs in your browser: https://colorednoise.app

No ads, no signup, no tracking. The sound is synthesized in real time, so it never loops or repeats. Includes 71 presets, a sleep timer with fade-out, and the option to install it as an app that works offline.

This video: https://colorednoise.app/presets/deep-sleep
Learn about noise colors: https://colorednoise.app/white-vs-pink-vs-brown-noise

Source code (MIT): https://github.com/gabrielberger1000/colorednoise
```

Tags:

```
brown noise for sleep, brown noise 10 hours, deep sleep sounds, brown noise sleep no ads, sleep sounds, deep brown noise, colorednoise
```

## 5. Publish and check

- [ ] **Wait for 1080p.** An 8-hour video takes hours to process and plays at
      360p until it finishes. In Studio → Content the row's badge reads `SD`
      until ready, `1080p` when done.
- [ ] **Flip everything to Public.** All six the same day is fine; nobody is
      subscribed yet, so there is no notification spam to stagger.
- [ ] **Check the Restrictions column** for Content ID claims, and dispute any
      that appear with the text below.

Dispute text:

```
This audio contains no third-party material. It is not a recording. Every sample is generated procedurally at render time by my own open-source code (MIT): https://github.com/gabrielberger1000/colorednoise — see scripts/render-video.js, which synthesizes the noise directly to the output file. The claimed match is generic broadband noise, which is not copyrightable subject matter.
```

## Adding another video later

Render it, then build the description as three parts separated by blank lines:
the lead line `Free, ad-free version with a sleep timer: https://colorednoise.app`,
the body, and the footer — copy the footer from any description above and swap
the preset slug in the `This video:` line. Keep each paragraph on one line.

## Things to know

- YouTube does not pay anything at this scale and that is fine; the goal is the
  link in the description.
- Long noise videos occasionally get automated Content ID claims from rights
  holders who uploaded similar noise. Disputing works: the audio is synthesized
  by your own open-source code and you can point at the repository and the
  render script.
- Most videos in this category get few views for months, then accumulate slowly
  through search and "up next". Upload once, leave them alone, and check back
  in a quarter.
