/**
 * Hand-written editorial content for each built-in preset.
 * Used by scripts/generate-preset-pages.js. Keys must match preset.name exactly.
 */
export const presetContent = {
    // === SLEEP ===
    "Deep Sleep": {
        tagline: "Almost pure brown noise that swells and settles once every eight seconds",
        about: [
            "Deep Sleep sounds like a large fan running behind a closed door, or a highway heard from a bedroom half a mile away. There is almost no treble in it at all, just a broad low roar that rises and falls so slowly you tend to stop noticing the movement after a minute or two.",
            "The color sits at 3.95 on the scale, one small step short of full brown, so the top end is rolled off at roughly 6 dB per octave. A sine-shaped pulse at 0.12 Hz lifts and lowers the volume once every eight seconds or so, and the whole thing fades in over 30 seconds so nothing startles you as you settle.",
            "Most people leave this running all night, either through a speaker or a single earbud. Compared with <a href='/presets/heavy-blanket'>Heavy Blanket</a>, which is flat and unmodulated, Deep Sleep has a gentle breathing motion. <a href='/presets/womb-sound'>Womb Sound</a> adds grey equalization and pulses more slowly, every twelve and a half seconds."
        ],
        bestFor: ["Masking a snoring partner", "Light sleepers in noisy flats", "All-night playback", "Daytime naps"],
        tip: "If the eight-second swell is too noticeable, lower the pulse rate to 0.05 Hz for a twenty-second cycle that fades into the background."
    },
    "Womb Sound": {
        tagline: "Full brown noise with grey EQ and a slow twelve-second heartbeat-like swell",
        about: [
            "Think of the muffled world you hear with your head underwater in a warm bath: no detail, just a soft, enveloping pressure that rises and fades. Womb Sound is thicker and rounder than most of the other sleep presets, with a fullness in the low mids that makes small rooms feel padded.",
            "This one uses the full brown setting of 4, then applies grey noise equalization so the low end does not overwhelm and the little remaining treble is audible. A sine pulse at 0.08 Hz produces one slow swell every twelve and a half seconds, and a 20-second fade-in eases the sound up from silence.",
            "Parents often reach for this preset for infants and toddlers, and adults use it when they want the most cushioned sound available. It is close to <a href='/presets/deep-sleep'>Deep Sleep</a> but heavier and slower, and next to <a href='/presets/heavy-blanket'>Heavy Blanket</a> it adds the rhythmic swell that Heavy Blanket deliberately leaves out."
        ],
        bestFor: ["Newborn and toddler naps", "Nursery background sound", "Winding down after screens", "Anxious or restless nights"],
        tip: "Enable the sleep timer for 45 minutes if you only need help falling asleep rather than sound all night."
    },
    "Lucid Dream": {
        tagline: "Steady brown-leaning noise at 3.8 with no pulse and a 25-second fade",
        about: [
            "Lucid Dream sounds like steady rain on a slate roof heard through a thick wall, a constant low hush with just enough upper texture to keep it from being a pure rumble. Nothing moves in it; there is no swell, no cycle, no change from one minute to the next.",
            "Its color value of 3.8 puts it most of the way toward brown, with a touch more upper-mid presence than presets at 3.9 or above. The pulse is switched off entirely and grey EQ is left off too, so the natural tilt of the noise is untouched. A 25-second fade-in brings it up gently.",
            "People who find any kind of rhythm distracting tend to choose this over the pulsing sleep presets. It is brighter than <a href='/presets/heavy-blanket'>Heavy Blanket</a>, which is full brown with grey EQ, and darker than <a href='/presets/delta-waves'>Delta Waves</a>, which sits at 3.6 and has noticeably more hiss. It is a good first pick if you are unsure whether you want a pulse at all."
        ],
        bestFor: ["Sleepers who dislike pulsing", "Hotel rooms with thin walls", "Lying awake at 3 am", "Shift-work daytime sleep"],
        tip: "Layer this with a second color of 3 at a low blend if the sound feels too dark on small speakers."
    },
    "Night Cocoon": {
        tagline: "Grey-equalized brown noise at 3.9 with a barely-there twenty-second swell",
        about: [
            "Night Cocoon is like lying in a tent while a slow wind pushes against the canvas: a deep, soft roar that leans in and eases off so gradually that you only notice the change if you listen for it. The grey equalization gives it a rounder, more even feel than the raw brown presets.",
            "Its color value is 3.9, and grey EQ is enabled so the bass does not dominate at volume. A triangle-shaped pulse at 0.05 Hz makes one linear ramp up and down every 20 seconds, which reads as a slow tide rather than a beat. The fade-in is a full 30 seconds.",
            "This is a favourite for people who like a hint of motion but found <a href='/presets/deep-sleep'>Deep Sleep</a> too obviously rhythmic. <a href='/presets/midnight-hum'>Midnight Hum</a> is a close cousin at 3.85 with a slightly faster sixteen-second cycle, while <a href='/presets/slow-descent'>Slow Descent</a> stretches the cycle out further to 25 seconds. Try all three at the same volume to hear how much the cycle length changes the feel."
        ],
        bestFor: ["Bedrooms facing a busy street", "Camping with a phone speaker", "Meditation before sleep", "Partners with different bedtimes"],
        tip: "Switch the pulse shape from triangle to sine if you want the swell to feel softer at the turnaround points."
    },
    "Drift Away": {
        tagline: "Brown-pink blend at 3.7 that rises and falls once every ten seconds",
        about: [
            "Drift Away has a little more air in it than the darker sleep presets, something like a distant surf line heard from a beach house with the windows shut. The ten-second swell is slow enough to feel like breathing but quick enough that you can still sense the rhythm if you want to follow it.",
            "The color sits at 3.7, about seventy percent of the way from pink to brown, so there is a soft upper-mid hush over the low rumble. A sine pulse at 0.1 Hz produces one complete rise and fall every 10 seconds. Grey EQ is off and the fade-in is 20 seconds.",
            "It suits people who find full brown noise too heavy but still want a bedtime sound with some movement. Compared with <a href='/presets/deep-sleep'>Deep Sleep</a> it is brighter and cycles slightly slower; compared with <a href='/presets/delta-waves'>Delta Waves</a>, which is static at 3.6, it adds the swell while staying only a touch darker."
        ],
        bestFor: ["Slow breathing exercises in bed", "Sleepers who find brown too dull", "Reading before lights out", "Winding down after travel"],
        tip: "Try matching your breath to the swell: inhale as it rises over five seconds and exhale as it falls."
    },
    "Heavy Blanket": {
        tagline: "Full brown noise with grey EQ, no pulse, and a quick fifteen-second fade-in",
        about: [
            "This is the sound of a jet engine idling three gates away, or a big idling truck heard through a closed window. It is dense, constant and low, with no swell or motion of any kind. Heavy Blanket is the simplest of the sleep presets and for many people the most effective.",
            "The color is set to the full brown value of 4, which rolls off at roughly 6 dB per octave and leaves very little above a few hundred hertz. Grey EQ is enabled to keep the low end from turning into mud on headphones. The pulse is off, and the fade-in is a relatively brisk 15 seconds.",
            "If you want to fall asleep fast and simply need a wall of low sound, this is usually the first pick. <a href='/presets/deep-brown'>Deep Brown</a> in the ambient category is the same color without grey EQ, and <a href='/presets/lucid-dream'>Lucid Dream</a> is the closest sleep sibling, sitting at 3.8 without equalization."
        ],
        bestFor: ["Blocking traffic and sirens", "Deep sleepers who wake early", "Sharing a wall with neighbours", "Recovery sleep after long shifts"],
        tip: "If it sounds boomy on a small speaker, nudge the color slider down to 3.7 or turn grey EQ off and compare."
    },
    "Midnight Hum": {
        tagline: "Grey-equalized noise at 3.85 with a slow swell every seventeen seconds",
        about: [
            "Midnight Hum sounds like the low drone of a ship or an old building at night: a steady, warm rumble with a subtle tide in it. The grey EQ evens out the spectrum so the sound feels centred rather than sitting entirely in the bass, which many people describe as more comfortable over long hours.",
            "The color is 3.85, close to brown with a trace of pink texture on top, and grey equalization is switched on. A sine pulse at 0.06 Hz rises and falls once roughly every 16 or 17 seconds, slow enough that the motion registers as atmosphere rather than a beat. The fade-in is 20 seconds.",
            "It is a good middle ground for people who tried <a href='/presets/night-cocoon'>Night Cocoon</a> and wanted something a fraction brighter and a little quicker in its cycle. Against <a href='/presets/womb-sound'>Womb Sound</a>, which is full brown pulsing every twelve seconds, Midnight Hum is lighter and drifts more slowly. It also works well at very low volume on a bedside speaker."
        ],
        bestFor: ["Overnight in shared dorms", "Falling back asleep after waking", "Low-volume bedside speakers", "Late-night reading"],
        tip: "Add a small amount of medium reverb, around 20 percent, to give the hum a sense of being in a larger space."
    },
    "Delta Waves": {
        tagline: "Static noise at 3.6 between pink and brown, no modulation, 30-second fade",
        about: [
            "Delta Waves is the brightest of the sleep presets, comparable to steady rain on a car roof rather than distant thunder. There is a clear soft hiss over the rumble, so it masks higher-pitched sounds like voices and clinking dishes better than the darker options do.",
            "Its color value of 3.6 places it just past the midpoint between pink and brown. The pulse is off, so the level is completely steady, and grey EQ is off too. A 30-second fade-in gives the sound time to arrive without any sense of it switching on.",
            "This is a popular choice for people who fall asleep well to pink noise but want something a shade warmer for the night. <a href='/presets/lucid-dream'>Lucid Dream</a> is the darker unmodulated sibling at 3.8, and <a href='/presets/drift-away'>Drift Away</a> is the nearest pulsing option, at 3.7 with a ten-second swell."
        ],
        bestFor: ["Masking voices through walls", "Sleepers who prefer pink noise", "Apartments near restaurants", "First-time noise users"],
        tip: "If the hiss feels too present after an hour, slide the color up to 3.8 and see whether you miss the treble."
    },
    "Slow Descent": {
        tagline: "Noise at 3.75 that takes 45 seconds to arrive and swells every 25 seconds",
        about: [
            "Slow Descent is designed around patience. It sounds like a distant weir or a far-off wind that leans in and backs off so slowly you will lose track of where it is in the cycle. The overall tone is warm and slightly textured, a step brighter than pure brown.",
            "The color is 3.75, and a triangle-shaped pulse at 0.04 Hz makes one straight ramp up and one down every 25 seconds. The fade-in is 45 seconds, the longest of any built-in preset, so the first swell does not even reach full volume until you are well into settling down. Grey EQ is off.",
            "It tends to be picked by people who put the sound on while they are still reading or stretching, rather than at the moment they close their eyes. <a href='/presets/night-cocoon'>Night Cocoon</a> has a similar triangle swell on a 20-second cycle with grey EQ, and <a href='/presets/deep-sleep'>Deep Sleep</a> is darker and cycles three times as fast."
        ],
        bestFor: ["A long wind-down routine", "Slow stretching before bed", "Falling asleep with a book", "Guided relaxation recordings"],
        tip: "Pair it with the sleep timer set to 60 minutes and let the long fade-out mirror the long fade-in."
    },

    // === FOCUS ===
    "Focus Zone": {
        tagline: "Grey-equalized pink-brown noise at 3.5, steady, with a three-second fade",
        about: [
            "Focus Zone is a balanced, even hush a lot like the ventilation in a quiet library: present enough to cover conversation two desks over, but with no harsh top end that would tire you out. Grey EQ makes it feel evenly loud from bass to treble rather than weighted to either end.",
            "The color sits at exactly 3.5, halfway between pink and brown, and grey equalization is enabled. There is no pulse and no envelope; the level is constant once the three-second fade-in completes. It is deliberately plain so it can run for hours without drawing attention to itself.",
            "This is the default for many people starting a work block. <a href='/presets/deep-work'>Deep Work</a> is nearly identical but sits a touch brighter at 3.4, and <a href='/presets/theta-meditation'>Theta Meditation</a> uses the same color and EQ with a ten-second fade for a gentler start. If you find yourself adjusting it, the color slider is the first thing to move."
        ],
        bestFor: ["Open-plan office masking", "Writing and editing", "Long spreadsheet sessions", "Working from a cafe"],
        tip: "Turn on the stereo auto-pan at a very slow rate, around 0.05 Hz, if a fixed centre image starts to feel flat."
    },
    "Study Hall": {
        tagline: "Bright blue-leaning noise at 1.2 that cuts through chatter and keyboard clatter",
        about: [
            "Study Hall sounds like air escaping a slightly open valve, or the hiss of an old cassette deck between tracks: light, airy and crisp, with almost no low end. It is unusually bright for a focus preset and is meant to sit over the top of speech rather than under it.",
            "The color is 1.2, just past blue toward white, which tilts the spectrum upward at roughly 3 dB per octave. Grey EQ is off, so the brightness is not tamed, and the fade-in is a quick two seconds. There is no pulse; the sound is continuous.",
            "It appeals to people whose main distraction is voices or typing, since higher-pitched masking covers those sounds more efficiently at lower volume. <a href='/presets/beta-boost'>Beta Boost</a> is the nearest sibling, warmer at 2.5, and <a href='/presets/concentration'>Concentration</a> goes further toward pink at 2.8 with grey EQ and uniform texture."
        ],
        bestFor: ["Busy shared study rooms", "Masking nearby conversations", "Mechanical keyboard neighbours", "Exam revision sprints"],
        tip: "Keep the volume low; blue-leaning noise masks speech at a lower level than brown, and pushing it loud will fatigue your ears."
    },
    "Alpha Waves": {
        tagline: "Unprocessed pink noise at exactly 3 with a five-second fade and no effects",
        about: [
            "Alpha Waves is textbook pink noise, the sound most people picture when they think of rain on a roof or a waterfall heard from a footpath. Every octave carries the same energy, so it feels natural and balanced without leaning either bright or boomy. There is no motion or texture layered on top, so what you hear is the color itself.",
            "The color is set to exactly 3, pink, with a spectral slope of -3 dB per octave. Grey EQ is off, the pulse is off and the distribution is Gaussian, so this is as plain as pink noise gets. The five-second fade-in is slightly longer than the other focus presets to make the start less abrupt.",
            "It is a good reference point when you are trying to work out which color you prefer. <a href='/presets/flow-state'>Flow State</a> is the same idea at 3.2, a little warmer, and <a href='/presets/standard-pink'>Standard Pink</a> in the ambient category is the same color with a one-second fade. See <a href='/physics'>the physics page</a> for why pink sounds so even."
        ],
        bestFor: ["General desk work", "Comparing noise colors", "Light reading and note-taking", "Background for muted video calls"],
        tip: "Enable grey EQ and listen for the difference; many people prefer one or the other quite strongly after a minute."
    },
    "Deep Work": {
        tagline: "Grey-equalized noise at 3.4, slightly brighter than Focus Zone, steady level",
        about: [
            "Deep Work sounds like a heavy rain shower heard through double glazing, evenly spread across the spectrum thanks to the grey equalization. It is a hair lighter than Focus Zone, with a touch more upper texture, and that small difference is what makes some people prefer one over the other for hours-long sessions.",
            "The color is 3.4, forty percent of the way from pink toward brown, with grey EQ on. The pulse is off and there is no envelope loop, so once the three-second fade completes the level is fixed. Gaussian distribution keeps the texture smooth, and nothing else is applied, so the small color difference from Focus Zone is the whole story.",
            "People tend to settle on Deep Work when they want slightly more presence than <a href='/presets/focus-zone'>Focus Zone</a> without stepping all the way to the brighter <a href='/presets/concentration'>Concentration</a>. If you find yourself turning Focus Zone up to cover voices, try this at the same volume first. Both keep the same grey EQ, so the change is purely in the color slider."
        ],
        bestFor: ["Programming and debugging", "Two-hour focus blocks", "Masking HVAC and printers", "Afternoon energy dips"],
        tip: "Set the sleep timer to 50 minutes and use its fade-out as your cue to take a break."
    },
    "Concentration": {
        tagline: "Grey-equalized noise at 2.8 with uniform distribution for a grittier texture",
        about: [
            "Concentration has a slightly rough, sandy quality, like rain hitting gravel rather than grass. It sits close to white with the harshness taken out by grey EQ, and the uniform random distribution gives it a faintly grainy texture that some people find more engaging than the smoother presets.",
            "The color is 2.8, just below pink, and grey equalization is on so the treble does not bite. The distribution is set to uniform rather than Gaussian, which changes the fine-grained character of the noise without altering its overall color. The fade-in is two seconds and there is no pulse.",
            "This preset suits people who find pink too soft and white too sharp. <a href='/presets/beta-boost'>Beta Boost</a> is brighter at 2.5 without EQ or texture, and <a href='/presets/deep-work'>Deep Work</a> is warmer at 3.4 with the same grey EQ but a smooth Gaussian texture. It also works as a daytime alternative to Coffee Shop when you want the grain without the busyness."
        ],
        bestFor: ["Detail-heavy proofreading", "Data entry and admin", "Noisy coworking spaces", "Staying alert late afternoon"],
        tip: "Flip the distribution back to Gaussian and compare; the difference is subtle but noticeable over a long session."
    },
    "Beta Boost": {
        tagline: "Midpoint between white and pink at 2.5, no EQ, one-second fade, fairly bright",
        about: [
            "Beta Boost is the brightest of the pink-leaning focus presets, a sound somewhere between a television tuned to static and heavy rain. It has plenty of high-frequency energy and a firm, alert quality that some people find keeps them sharper than the warmer options. On small speakers it can read as a little thin, but on headphones it is crisp and clear.",
            "The color is 2.5, exactly halfway between white and pink, and no grey EQ is applied, so the top end is left as it is. The pulse is off, the distribution is Gaussian and the fade-in is a single second, so it arrives almost immediately when you press play.",
            "It is a common pick for short bursts of high-intensity work rather than all-day listening. <a href='/presets/study-hall'>Study Hall</a> is brighter still at 1.2, and <a href='/presets/concentration'>Concentration</a> is a touch warmer at 2.8 with grey EQ softening the treble. If you start with Beta Boost and find it tiring, moving to Concentration is the usual next step, and from there to Deep Work."
        ],
        bestFor: ["Morning start-up routines", "Timed sprint work", "Overcoming afternoon drowsiness", "Masking high-pitched appliance whine"],
        tip: "If it feels harsh after twenty minutes, enable grey EQ rather than lowering the volume; you keep the masking without the edge."
    },
    "Flow State": {
        tagline: "Warm pink noise at 3.2 with a five-second fade, no EQ, no modulation",
        about: [
            "Flow State is just a little warmer than plain pink noise, like rain that has settled into a steady, unhurried rhythm. It is soft enough to disappear into the background but has enough upper texture that it never feels muffled or heavy over a long session.",
            "The color is 3.2, a fifth of the way from pink toward brown. Grey EQ is off so the natural spectral slope of the noise is preserved, and there is no pulse. The five-second fade-in is on the gentler side for the focus category. The result is a very simple, honest sound with nothing layered on top.",
            "It is a natural next step for people who like <a href='/presets/alpha-waves'>Alpha Waves</a> but want the treble tucked in slightly. <a href='/presets/focus-zone'>Focus Zone</a> is warmer still and adds grey EQ, which some find flatter and some find more even; it is worth trying both back to back."
        ],
        bestFor: ["Creative writing sessions", "Sketching and design work", "Reading dense material", "Working in a quiet home"],
        tip: "Add a second color of 4 at a blend of 0.3 to add a bed of low rumble underneath without losing the pink character."
    },
    "Theta Meditation": {
        tagline: "Grey-equalized noise at 3.5 with a slow ten-second fade for seated practice",
        about: [
            "Theta Meditation sounds like being inside a still, empty hall with the air handling running: a soft, even wash without any obvious rhythm or edge. The grey EQ gives it a centred, neutral quality, and the slow fade means it never breaks the silence abruptly.",
            "Its color is 3.5, halfway between pink and brown, and grey equalization is on. The pulse is off and there is no envelope loop. The one deliberate difference from its siblings is the ten-second fade-in, which is about three times longer than the other focus presets.",
            "It is used for sitting meditation, breathing practice and yoga more than for desk work, though the underlying sound is the same as <a href='/presets/focus-zone'>Focus Zone</a>. If you want motion in the sound, <a href='/presets/breath-work'>Breath Work</a> in the experimental category adds a six-second breathing envelope. Many people set it up once and simply leave it as their default for any seated practice."
        ],
        bestFor: ["Seated meditation", "Body scan practice", "Slow yoga sequences", "Quiet journaling"],
        tip: "Set the sleep timer to the length of your sit so the sound fades out on its own as a gentle bell."
    },

    // === NATURE ===
    "Ocean Waves": {
        tagline: "Pink-leaning noise shaped into a ten-second wave cycle with a faster shimmer",
        about: [
            "Ocean Waves is the sound of surf on a shingle beach: a rush that builds, holds for a moment, then draws back into a long fade before the next wave arrives. A faster ripple sits on top of the main cycle, which gives the impression of smaller waves breaking within larger ones.",
            "The color is 3.2, a little warmer than pink. An envelope loop rises over 3 seconds, drops slightly to a 70 percent sustain, holds for 3 seconds and releases over 4, so each wave lasts about ten and a half seconds. On top of that a sine pulse at 0.18 Hz adds a lighter swell every five or six seconds.",
            "It is the most-used nature preset for both sleep and relaxation. <a href='/presets/waves-loop'>Waves Loop</a> in the textured category uses the same envelope at a darker 3.8 without the extra pulse, and <a href='/presets/seaside-cave'>Seaside Cave</a> is a slower, boomier twelve-second version with grey EQ. If you fall asleep to it, the wave count is roughly six per minute."
        ],
        bestFor: ["Sleeping with a beach feel", "Stress relief after work", "Background for massage", "Kids who like the seaside"],
        tip: "Lengthen the release to 6 seconds for lazier waves, or shorten the attack to 1.5 for a crashing shore break."
    },
    "Heavy Rain": {
        tagline: "Steady pink-warm noise at 3.3 with no modulation, a downpour with no let-up",
        about: [
            "Heavy Rain is a constant downpour on a roof, the kind that goes on for hours without a pause. There is no swell or rhythm in it, just a dense, evenly textured hush with enough treble to suggest individual drops and enough body to feel like a real storm.",
            "The color is 3.3, slightly warmer than pink, and the pulse is off. Grey EQ is off too, so the natural -3 dB per octave slope with a touch of extra low end is what you hear. The fade-in is three seconds and the sound then holds indefinitely.",
            "People pick this when they want a nature sound that does not draw attention with movement. <a href='/presets/rain-on-tent'>Rain on Tent</a> is the nearest sibling, warmer at 3.4 and shaped into gusts with a uniform texture, while <a href='/presets/waterfall'>Waterfall</a> is brighter and grittier at 2.8. Many people find it the easiest nature preset to leave on for a whole night."
        ],
        bestFor: ["Sleeping through the night", "Masking traffic and neighbours", "Studying in a rainy-day mood", "Long reading sessions"],
        tip: "Layer a second color of 4 at a blend of 0.2 to add distant low rumble under the rain."
    },
    "Distant Thunder": {
        tagline: "Full brown noise that rolls in fast and fades over five seconds, every nine seconds",
        about: [
            "Distant Thunder is a slow series of far-off rumbles: each one arrives quickly, tails away over several seconds, and is followed by a quiet stretch before the next. It sounds like a storm on the horizon rather than overhead, all low end and no crack.",
            "The color is full brown at 4 with grey EQ on to keep the bass from swamping everything. The envelope loop attacks in just 0.2 seconds, decays over 2 seconds to a low 30 percent sustain, holds for 2 seconds and releases over 5, giving a cycle of about nine seconds. A triangle pulse at 0.08 Hz adds a slower undertow.",
            "It is popular with people who like storm sounds but want them soft enough to sleep through. <a href='/presets/seaside-cave'>Seaside Cave</a> is a smoother, grey-equalized sibling at 3.8, and <a href='/presets/slow-swell'>Slow Swell</a> in the textured category is the same brown color with a much gentler 21-second cycle. Of the three, this is the only one with a sharp attack."
        ],
        bestFor: ["Storm lovers at bedtime", "Masking low traffic rumble", "Atmosphere for reading fiction", "Winding down after evening exercise"],
        tip: "Raise the sustain to 0.6 for a storm that feels closer, or push the release to 8 seconds for longer rolling tails."
    },
    "Waterfall": {
        tagline: "Bright, gritty noise at 2.8 with uniform texture, like standing beside a cascade",
        about: [
            "Waterfall is the roar you hear standing on a footbridge beside a cascade: brighter and more textured than rain, with a sandy, spraying quality in the high frequencies. It is the most energetic of the nature presets and masks a wide range of sounds. Stand by it long enough and voices, keyboards and traffic all disappear into the spray.",
            "The color is 2.8, just on the white side of pink, so there is plenty of treble energy. The distribution is uniform rather than Gaussian, which adds a fine grain to the texture that reads as spray. Grey EQ and pulse are both off, and the fade-in is three seconds.",
            "It suits people who find rain presets too soft, and those who need a nature sound that covers voices. <a href='/presets/heavy-rain'>Heavy Rain</a> is warmer and smoother at 3.3, and <a href='/presets/mountain-wind'>Mountain Wind</a> goes even brighter at 1.8 but with gusting rather than a constant roar. Try it during the day rather than at night; it is a lot of sound to sleep through."
        ],
        bestFor: ["Masking loud conversations", "Daytime focus with a nature feel", "Kitchen or workshop background", "Covering upstairs footsteps"],
        tip: "Enable grey EQ to soften the spray if the top end feels sharp on earbuds."
    },
    "Windy Day": {
        tagline: "Pink noise shaped into nine-second gusts with a quicker three-second flutter",
        about: [
            "Windy Day sounds like a steady breeze pushing through trees and around the corners of a house, with gusts that build, hold and subside, and a faster flutter inside each one. It has more motion than most nature presets and feels like being outdoors rather than sheltered.",
            "The color is 3.1, just warmer than pink. An envelope loop rises over 2 seconds, settles to a 60 percent sustain, holds for 4 seconds and releases over 3, giving a cycle of about nine and a half seconds. A triangle pulse at 0.35 Hz adds a flutter roughly every three seconds on top.",
            "It is chosen by people who want a lively sound for daytime rather than sleep. <a href='/presets/mountain-wind'>Mountain Wind</a> is much brighter at 1.8 with shorter, sharper gusts, and <a href='/presets/night-forest'>Night Forest</a> is the darker, slower sibling at 3.65 with a fourteen-second sway and no envelope. Of the three, Windy Day has the most obvious sense of weather changing."
        ],
        bestFor: ["Daydreaming by a window", "Nature ambience while working", "Background for outdoor scenes", "A cooling feel on hot nights"],
        tip: "Drop the pulse to 0.15 Hz for slower, lazier flutter inside each gust, or raise the sustain to 0.8 for steadier wind."
    },
    "Mountain Wind": {
        tagline: "Bright blue-white noise at 1.8 with sharp seven-second gusts and a two-second flicker",
        about: [
            "Mountain Wind is a thin, high, whistling wind across an exposed ridge, all treble and very little body. Gusts arrive quickly, hold for a few seconds and fall away, with a fast flicker running through them that suggests wind catching on rock and grass. It is a cold, exposed sound rather than a cosy one, and it is meant to be.",
            "The color is 1.8, between blue and white, so the spectrum tilts firmly upward. The envelope attacks in 1.5 seconds, decays briefly to 70 percent, holds for 3 seconds and releases over 2, a cycle of just under seven seconds. A triangle pulse at 0.5 Hz adds a flicker every two seconds.",
            "It is a niche pick, used for immersive atmosphere or as a bright masking sound rather than for sleep. <a href='/presets/windy-day'>Windy Day</a> is the warmer, slower sibling at 3.1, and <a href='/presets/jet-stream'>Jet Stream</a> in the mechanical category is even brighter at 0.8 but steady rather than gusting."
        ],
        bestFor: ["Masking high-pitched noise", "Alpine or winter atmosphere", "Sound design sketches", "Short alertness breaks"],
        tip: "Slide the color to 2.5 and enable grey EQ for a warmer wind that keeps the gusting but loses the whistle."
    },
    "Rain on Tent": {
        tagline: "Warm pink noise at 3.4 with uniform grain, shaped into nine-second showers",
        about: [
            "Rain on Tent is a shower drumming on canvas a few feet above your head: close, textured and cosy, with the intensity easing and picking up as the rain shifts. The uniform distribution gives the drops a slightly pattering quality that plain rain presets lack.",
            "The color is 3.4, warmer than plain pink. The envelope rises over 2 seconds, settles to a high 80 percent sustain, holds for 5 seconds and releases over 2, so each shower lasts about nine and a half seconds. A sine pulse at 0.15 Hz adds a softer swell every six or seven seconds, and the distribution is uniform.",
            "It is a favourite for sleep among people who want rain with a little life in it. <a href='/presets/heavy-rain'>Heavy Rain</a> is the steady, unshaped version at 3.3, and <a href='/presets/night-forest'>Night Forest</a> is darker and slower if you would rather have a still night than a wet one."
        ],
        bestFor: ["Camping nostalgia at bedtime", "Sleeping in a warm room", "Cosy weekend afternoons", "Masking upstairs neighbours"],
        tip: "Set the release to 4 seconds and the sustain to 0.6 for showers that die away more noticeably between bursts."
    },
    "Night Forest": {
        tagline: "Dark noise at 3.65 with a slow fourteen-second sway and an eight-second fade",
        about: [
            "Night Forest is a still, dark wood after sundown: a low breath of air moving through the canopy, slowly leaning one way and then the other. There is no rain and no gusting, just a deep, soft hush with a gentle sway that you feel more than hear.",
            "The color is 3.65, well toward brown. A triangle pulse at 0.07 Hz sways the level up and down once every fourteen seconds or so, and there is no envelope loop, so it simply fades in over 8 seconds and then holds with that slow motion. Grey EQ is off.",
            "It sits between the nature and sleep categories in practice and is often used for both. <a href='/presets/windy-day'>Windy Day</a> is the daytime sibling, brighter and gusting, and <a href='/presets/slow-descent'>Slow Descent</a> in the sleep category is a close cousin at 3.75 with an even slower 25-second sway. It is also a good pick for anyone who found the wave presets too watery."
        ],
        bestFor: ["Sleeping with an open-window feel", "Late-night writing", "Calming a restless mind", "Background for stargazing"],
        tip: "Add large reverb at around 30 percent to open the space up and make the forest feel bigger."
    },
    "Seaside Cave": {
        tagline: "Grey-equalized noise at 3.8 in a twelve-second surge with an eight-second undertow",
        about: [
            "Seaside Cave is the sound of water surging into a rocky hollow and draining out again: a low, hollow boom that builds, drops away and lingers before the next surge. It is darker and slower than Ocean Waves, more like being inside the cliff than on the beach.",
            "The color is 3.8 with grey EQ enabled to keep the low end from smearing. The envelope rises over 3 seconds, decays over 1 second to a 50 percent sustain, holds for 4 and releases over 4, so each surge takes about twelve seconds. A sine pulse at 0.12 Hz layers a swell every eight seconds underneath.",
            "It is chosen by people who like wave sounds but want them deeper and less busy for sleep. <a href='/presets/ocean-waves'>Ocean Waves</a> is the brighter, quicker sibling at 3.2, and <a href='/presets/cave-ambience'>Cave Ambience</a> in the textured category adds comb and resonant filtering for a more literal cave echo."
        ],
        bestFor: ["Deep sleep with wave motion", "Masking a rumbling boiler", "Long baths", "Immersive reading"],
        tip: "Shorten the duration to 2 seconds and the release to 3 for a choppier sea with surges that come every eight seconds."
    },

    // === AMBIENT ===
    "Pure White": {
        tagline: "Flat white noise at exactly 2, Gaussian, no EQ, one-second fade, the reference sound",
        about: [
            "Pure White is the classic hiss of an untuned analogue television or a radio between stations: equal energy at every frequency, which the ear hears as bright and slightly sharp because there are so many more audible frequencies in the upper octaves than the lower ones.",
            "The color is set to exactly 2, white, with a flat power spectrum. The distribution is Gaussian, grey EQ is off, the pulse is off, and the fade-in is one second. There is no processing of any kind, which makes it the baseline against which every other preset can be compared.",
            "It is used mostly by people who already know they like white noise, and by anyone testing headphones or a room. <a href='/presets/grey-noise'>Grey Noise</a> is the same color with perceptual EQ applied, and <a href='/presets/standard-pink'>Standard Pink</a> is the warmer -3 dB per octave version. The <a href='/physics'>physics page</a> explains the maths."
        ],
        bestFor: ["Testing speakers and headphones", "Classic white-noise sleepers", "Masking a wide range of sounds", "Comparing noise colors"],
        tip: "If it feels harsh, try Grey Noise first before reaching for pink; the EQ alone fixes it for many people."
    },
    "Standard Pink": {
        tagline: "Plain pink noise at 3, equal energy per octave, one-second fade, nothing added",
        about: [
            "Standard Pink is the balanced middle ground of the noise family, close to the sound of steady rain or a large waterfall at a distance. Because it carries equal energy in every octave rather than every hertz, it matches how we hear and feels neither bright nor boomy.",
            "The color is exactly 3, pink, with a spectral slope of -3 dB per octave. Grey EQ, pulse and effects are all off, the distribution is Gaussian, and the fade-in is one second. Like Pure White, it is deliberately unadorned so it can serve as a reference.",
            "It is the sensible default for someone who has never used a noise generator before. <a href='/presets/alpha-waves'>Alpha Waves</a> in the focus category is identical apart from a longer five-second fade, and <a href='/presets/soft-air'>Soft Air</a> is a warmer neighbour at 3.4. If you are unsure where to begin, start here and move the color slider a little each way until it feels right."
        ],
        bestFor: ["First-time noise users", "All-purpose background sound", "Mixing and mastering reference", "Calming a busy room"],
        tip: "Nudge the color slider up toward 3.5 if you want the same character with less treble for evening use."
    },
    "Deep Brown": {
        tagline: "Full brown noise at 4 with no EQ, no pulse, and a two-second fade, pure rumble",
        about: [
            "Deep Brown is the sound of a waterfall heard from inside a cave, or a very large aircraft taxiing far away: almost entirely low end, with a soft, rolling rumble and hardly any hiss. It is the darkest single-color preset and the closest to a physical, felt sound.",
            "The color is set to the full brown value of 4, which rolls off at roughly 6 dB per octave and is generated as a random walk, each sample being the last plus a small random step. Grey EQ is off, so the natural bass weight is left intact. There is no pulse and the fade-in is two seconds.",
            "It is popular for sleep, for masking low-frequency noise and for people who find any hiss uncomfortable. <a href='/presets/heavy-blanket'>Heavy Blanket</a> is the same color with grey EQ and a longer fade, and <a href='/presets/soft-air'>Soft Air</a> is the next step brighter at 3.4. It also serves as the bottom layer in Layered Depths, which blends a blue hiss over the top."
        ],
        bestFor: ["Masking low traffic rumble", "Listeners sensitive to hiss", "Studio subwoofer checks", "Deep relaxation"],
        tip: "On laptop speakers this can nearly vanish; enable grey EQ or lower the color to 3.7 so there is something left to hear."
    },
    "Blue Sky": {
        tagline: "Pure blue noise at 1, rising 3 dB per octave, light and airy with no low end",
        about: [
            "Blue Sky is a thin, bright hiss like air escaping from a tyre valve or a steam radiator at a distance. It has almost no bass at all, and the energy climbs steadily into the treble, which makes it feel light and open but also quite forward on headphones.",
            "The color is exactly 1, blue, with a spectral slope of +3 dB per octave, the mirror image of pink. Grey EQ is off, the pulse is off and the fade-in is one second. It is generated as the derivative of pink noise, which is why it sounds like pink turned inside out.",
            "It is used for masking high-pitched sounds, for dithering experiments and by people who simply prefer a lighter texture. <a href='/presets/violet-haze'>Violet Haze</a> is the even brighter sibling at 0.2, and <a href='/presets/tinnitus-mask'>Tinnitus Mask</a> is a softened version at 1.5 with grey EQ. Most listeners find it more comfortable in short sessions than as an all-day background sound."
        ],
        bestFor: ["Masking tinnitus-range whine", "Covering high-pitched electronics", "Audio dithering tests", "A lighter alternative to white"],
        tip: "Keep the volume modest; blue noise is bright enough that it can fatigue your ears sooner than pink or brown."
    },
    "Violet Haze": {
        tagline: "Near-pure violet noise at 0.2, rising 6 dB per octave, very bright and glassy",
        about: [
            "Violet Haze is the brightest sound in the collection, like the sizzle of a hot pan or a very high, glassy hiss with nothing underneath it. It has practically no mid or low content, and most of what you hear sits in the top two octaves of your hearing.",
            "The color is 0.2, almost pure violet, with a spectral slope close to +6 dB per octave. It is the derivative of white noise, the inverse of brown, and it is left completely unprocessed: no grey EQ, no pulse, Gaussian distribution and a two-second fade-in.",
            "Few people use this for hours, but it is useful for masking very high-pitched tones and for exploring the extremes of the color scale. <a href='/presets/blue-sky'>Blue Sky</a> is a step warmer at 1, and <a href='/presets/asmr-static'>ASMR Static</a> in the experimental category tames a similar 0.3 with grey EQ and uniform texture."
        ],
        bestFor: ["Masking high-frequency ringing", "Exploring the color extremes", "Sound design ingredients", "Short bursts of alertness"],
        tip: "Enable grey EQ and slide the color to 0.5 for a version that keeps the sparkle without the sting."
    },
    "Grey Noise": {
        tagline: "White noise with perceptual equalization so every frequency sounds equally loud",
        about: [
            "Grey Noise is white noise adjusted to the ear rather than to the meter. Where Pure White sounds bright because we hear the upper octaves more readily, Grey Noise compensates with an inverse equal-loudness curve, so the result feels spread evenly from a soft bass floor up to a smooth, unexaggerated top.",
            "The color is 2, white, with grey equalization switched on. The EQ boosts the low and very high frequencies where hearing is less sensitive and eases back the mids where it is most sensitive. The pulse is off, the distribution is Gaussian and the fade-in is one second.",
            "Many people who tried white noise and found it harsh end up here. <a href='/presets/pure-white'>Pure White</a> is the untreated version for direct comparison, and <a href='/presets/concentration'>Concentration</a> in the focus category applies the same EQ to a slightly warmer 2.8 with uniform texture. See <a href='/physics'>the physics page</a> for the equal-loudness idea."
        ],
        bestFor: ["Long white-noise sessions", "Fuller sound on small speakers", "Even masking across pitches", "Listeners bothered by hiss"],
        tip: "Pair grey EQ with a color of 2.5 if you want a touch of warmth while keeping the balanced feel."
    },
    "Soft Air": {
        tagline: "Gentle warm noise at 3.4 with no EQ or modulation, like air through a vent",
        about: [
            "Soft Air is the sound of a heating vent in a quiet room, or a fan on its lowest setting across the hall. It is warmer than pink but far from brown, with a smooth, unobtrusive hush that fills a space without ever calling attention to itself.",
            "The color is 3.4, and everything else is left plain: no grey EQ, no pulse, Gaussian distribution and a two-second fade-in. That makes it a good gauge of what the color slider alone does between pink at 3 and brown at 4, with nothing else changing.",
            "It is a general-purpose choice for people who want a comfortable background at any time of day. <a href='/presets/standard-pink'>Standard Pink</a> is the slightly brighter reference at 3, and <a href='/presets/deep-brown'>Deep Brown</a> is the full-bass extreme at 4. <a href='/presets/box-fan'>Box Fan</a> is a similar color with grey EQ and grainier texture."
        ],
        bestFor: ["All-day home office background", "Light sleepers who dislike rumble", "Living room ambience", "Covering fridge and fan noise"],
        tip: "Add stereo auto-pan at 0.03 Hz with low depth for a subtle sense of air moving around the room."
    },
    "Coffee Shop": {
        tagline: "Grainy noise at 2.6 with uniform distribution, a stand-in for cafe bustle",
        about: [
            "Coffee Shop is a busy, slightly rough hush somewhere between a crowded room and a rainy street: not actual voices, but a texture with the same lively density. The uniform distribution adds a grain that reads as the clatter and murmur of a full cafe heard from a corner table.",
            "The color is 2.6, just warmer than white, and the distribution is set to uniform, which gives the noise a busier, more granular character than the smooth Gaussian presets. Grey EQ is off, there is no pulse, and the fade-in is two seconds before the sound settles at a fixed level.",
            "It appeals to people who work best with a sense of activity around them but find real cafe recordings distracting. <a href='/presets/concentration'>Concentration</a> is the closest focus-category sibling at 2.8 with grey EQ, and <a href='/presets/waterfall'>Waterfall</a> is the same grainy idea at a brighter 2.8 without EQ. It is also a decent bridge for people moving from music to noise while working."
        ],
        bestFor: ["Working from home alone", "Writers who miss cafe energy", "Masking silence in a quiet office", "Casual reading and browsing"],
        tip: "Add medium reverb at around 25 percent to push the sound back and make the room feel larger."
    },
    "Tinnitus Mask": {
        tagline: "Grey-equalized blue-white noise at 1.5 with uniform texture, aimed at the high range",
        about: [
            "Tinnitus Mask is a smooth, bright hush with a light grain, a little like a well-tuned fan or air moving through a fine mesh. The grey EQ keeps it from being shrill, and the brightness places most of its energy in the upper range, where many people report their ringing sits.",
            "The color is 1.5, halfway between blue and white, with grey equalization on to flatten the perceived loudness across pitches and uniform distribution for a fine, even grain. There is no pulse. The fade-in is five seconds so the sound arrives gently rather than snapping on.",
            "Many people use masking sounds at low volume alongside tinnitus, and commonly find a sound near the pitch of their ringing works better than a low rumble. This is not medical advice; consult an audiologist for treatment. <a href='/presets/blue-sky'>Blue Sky</a> is brighter without EQ, and <a href='/presets/grey-noise'>Grey Noise</a> is warmer at 2."
        ],
        bestFor: ["Low-volume ringing masking", "Quiet rooms at night", "Reading in silence", "Settling into sleep"],
        tip: "Set the volume just below the level of your ringing rather than above it, and adjust the color slider until the two blend."
    },

    // === MECHANICAL ===
    "Airplane Cabin": {
        tagline: "Grey-equalized noise at 3.5, steady, the cruise-altitude hum of a widebody cabin",
        about: [
            "Airplane Cabin is the steady roar of a jet at cruising altitude heard from a window seat: broad, even, and thick enough to swallow the conversation two rows back. It has a fullness in the low mids and a soft hiss on top that together feel very much like pressurized air moving through ducts.",
            "The color is 3.5, midway between pink and brown, and grey equalization is on to give it that even, enveloping balance. The pulse is off, so the level never changes, and the fade-in is three seconds. It is a simple recipe that happens to land very close to the real thing.",
            "It is a favourite for people who sleep well on planes and want to recreate that feeling at home. <a href='/presets/box-fan'>Box Fan</a> is brighter at 3.3 with a grainier texture, and <a href='/presets/jet-stream'>Jet Stream</a> is the outside-the-aircraft version, far brighter at 0.8. It also works well as an all-day office sound, since the balance is easy on the ears for long stretches."
        ],
        bestFor: ["Sleeping like you do on flights", "Long-haul jet lag recovery", "Masking office chatter", "Napping in the afternoon"],
        tip: "Add a second color of 4 at a blend of 0.3 to deepen the engine rumble for a seat nearer the wing."
    },
    "Box Fan": {
        tagline: "Grey-equalized noise at 3.3 with uniform grain, a fan on high in the next room",
        about: [
            "Box Fan is exactly what it says: the rush of a cheap box fan on its highest setting, with a fine mechanical grain from the blades and the grille. It sits a little brighter than Airplane Cabin and has more texture, which makes it feel closer and more physical.",
            "The color is 3.3, on the warm side of pink, with grey EQ enabled and the distribution set to uniform for that slight blade-chop grain. There is no pulse, and the fade-in is a single second, so it comes on almost as quickly as flicking a real fan switch.",
            "This is the most common sleep sound in the world for a reason, and many people use this preset to replace an actual fan in winter. <a href='/presets/airplane-cabin'>Airplane Cabin</a> is the smoother, slightly warmer sibling, and <a href='/presets/cpu-fan'>CPU Fan</a> is a much brighter, whinier small fan at 1.3."
        ],
        bestFor: ["Replacing a real fan in winter", "Dorm room sleep", "Masking a partner's phone", "Familiar comfort for kids"],
        tip: "Set the color to 3.6 and switch the distribution to Gaussian for a bigger, softer fan a few metres further away."
    },
    "Space Station": {
        tagline: "Grey-equalized noise at 3.9 with a 25-second swell, life support in the next module",
        about: [
            "Space Station is the constant hum of machinery keeping a sealed environment alive: deep, even, and slowly breathing as pumps and fans cycle somewhere out of sight. It is darker than Airplane Cabin and its slow swell gives it a sense of vast, patient systems running around you.",
            "The color is 3.9, nearly brown, with grey EQ on to keep the bass from turning to mud. A sine pulse at 0.04 Hz raises and lowers the level once every 25 seconds, slow enough to feel like the ventilation cycling rather than a rhythm. The fade-in is five seconds.",
            "It is picked for sleep and for people who like a science-fiction feel to their background sound. <a href='/presets/submarine'>Submarine</a> is a close cousin with an envelope loop instead of a pulse, and <a href='/presets/spaceship-hull'>Spaceship Hull</a> in the textured category adds comb and resonant filters for a metallic ring."
        ],
        bestFor: ["Sleeping in a sci-fi mood", "Late-night coding", "Masking a humming fridge", "Reading space fiction"],
        tip: "Enable large reverb at around 30 percent to make the station feel bigger and more distant."
    },
    "Server Room": {
        tagline: "Grey-equalized blue-white noise at 1.6, the steady whine of racks of small fans",
        about: [
            "Server Room is the sound of a data centre corridor: a bright, unrelenting whine from hundreds of small high-speed fans, softened only slightly by the room. There is little bass in it, and what body it has comes from the grey EQ pulling up the low end.",
            "The color is 1.6, between blue and white, with grey equalization switched on so the brightness is balanced rather than piercing. There is no pulse, the distribution is Gaussian and the fade-in is two seconds. It holds perfectly steady once running, with no envelope or effects.",
            "It suits people who work in or near technical spaces and find that sound oddly calming, and those who need a bright mask for high-pitched distractions. <a href='/presets/cpu-fan'>CPU Fan</a> is a grainier single-fan version at 1.3, and <a href='/presets/tinnitus-mask'>Tinnitus Mask</a> in the ambient category is nearly the same color at 1.5 with uniform texture."
        ],
        bestFor: ["Sysadmins who miss the hum", "Masking high-pitched appliance noise", "Bright focus sound", "Late-night ops work"],
        tip: "Lower the color to 2.2 if the whine is too sharp; you keep the fan character with more body underneath."
    },
    "Diesel Engine": {
        tagline: "Full brown noise chopped into a 1.4-second throb, like a big engine idling nearby",
        about: [
            "Diesel Engine is the heavy, chugging idle of a lorry or a fishing boat, felt as much as heard. The throb is quick enough to read as a motor turning over, and the brown color keeps it entirely in the low end with no hiss, so it sits like a vibration in the room.",
            "The color is full brown at 4. A very short envelope loop attacks in 0.1 seconds, decays over 0.2 to an 80 percent sustain, holds for 0.8 seconds and releases in 0.3, for a cycle of 1.4 seconds. A triangle pulse at 1.4 Hz is locked to the same rate, sharpening the chug. Grey EQ is off.",
            "This is a niche pick for people who sleep well on boats or in trucks, and for sound design. <a href='/presets/furnace'>Furnace</a> is a slower, roaring relative at 3.7, and <a href='/presets/electric-hum'>Electric Hum</a> is the brighter, faster buzz of mains electricity at 3.2. Use it at low volume if you want the vibration without the noise dominating the room."
        ],
        bestFor: ["Sleeping on boats and trucks", "Engine-room sound design", "Masking a neighbour's bass", "Infants who like car rides"],
        tip: "Lower the pulse to 0.9 Hz and lengthen the duration to 1.2 seconds for a slower, older engine."
    },
    "CPU Fan": {
        tagline: "Grey-equalized blue noise at 1.3 with uniform grain, a small fan spinning fast",
        about: [
            "CPU Fan is the thin, fast whir of a small computer fan running at full speed, sitting a foot away on the desk. It is bright and slightly gritty, with almost no low end, and the uniform distribution adds a fine blade-chop grain that makes it feel like a real small motor.",
            "The color is 1.3, close to blue, with grey EQ on so the treble stays tolerable and a little bass appears underneath. The distribution is uniform for grain, there is no pulse, and the fade-in is one second, so it spins up almost instantly when you press play.",
            "It is chosen by people who are used to working next to a laptop and find silence odd without it. <a href='/presets/server-room'>Server Room</a> is the same idea multiplied into a whole rack at 1.6 with smoother Gaussian texture, and <a href='/presets/box-fan'>Box Fan</a> is the large, warm domestic fan at 3.3."
        ],
        bestFor: ["Quiet rooms that feel too quiet", "Masking laptop coil whine", "Light desk work", "Replacing a noisy old PC"],
        tip: "Slide the color to 2 for a larger, slower case fan while keeping the uniform grain."
    },
    "Furnace": {
        tagline: "Warm brown-leaning roar at 3.7 in seven-second cycles with a fast 0.7 Hz flicker",
        about: [
            "Furnace is the roar of a gas burner or a basement boiler kicking on, holding for a few seconds and easing off, with a fast flicker inside the flame. It is warm and enveloping, and the flicker gives it a restless, physical quality that steady presets do not have.",
            "The color is 3.7, well toward brown. The envelope rises over 1 second, decays to 70 percent, holds for 4 seconds and releases over 2, a cycle of about seven and a half seconds. A triangle pulse at 0.7 Hz flickers the level roughly every 1.4 seconds on top. Grey EQ is off.",
            "It suits people who like the feel of a heating system cycling on a cold night. <a href='/presets/diesel-engine'>Diesel Engine</a> is the faster, darker mechanical throb at 4, and <a href='/presets/distant-thunder'>Distant Thunder</a> in the nature category is a similar slow-cycle brown sound with a much softer attack. It is a daytime and evening sound more than an overnight one."
        ],
        bestFor: ["Cold-weather cosiness", "Basement or workshop atmosphere", "Masking a noisy radiator", "Winter reading nooks"],
        tip: "Set the pulse to 0 to remove the flicker if you want the burner roar without the restlessness."
    },
    "Submarine": {
        tagline: "Grey-equalized near-brown noise in eleven-second surges with a seventeen-second undertow",
        about: [
            "Submarine is the deep, pressurized hum of a hull at depth: a very low, slow rumble that swells, holds and eases with the ballast and propulsion systems somewhere aft. There is almost nothing above the low mids, and the grey EQ keeps the bass full without letting it smear.",
            "The color is 3.95 with grey EQ on. The envelope loop rises over 2 seconds, decays over 1 to a 60 percent sustain, holds for 5 seconds and releases over 3, for an eleven-second cycle. Beneath that a sine pulse at 0.06 Hz adds a slower undertow every sixteen or seventeen seconds.",
            "It is a sleep favourite for people who want the darkest sound available with some motion in it. <a href='/presets/space-station'>Space Station</a> is the same color range with a single slow pulse and no envelope, and <a href='/presets/deep-sleep'>Deep Sleep</a> in the sleep category is nearly the same color with a quicker eight-second swell."
        ],
        bestFor: ["Deepest possible sleep sound", "Masking low-frequency rumble", "Submarine film atmosphere", "Anxious nights"],
        tip: "Turn the pulse off and the envelope becomes the only motion, which some people find calmer over a full night."
    },
    "Electric Hum": {
        tagline: "Pink-warm noise at 3.2 gated by a square pulse every two seconds, a mains buzz",
        about: [
            "Electric Hum is the buzz of a transformer or a fluorescent light ballast: a hard-edged on-off pulse over a warm noise bed that reads as electrical rather than mechanical. The square shape gives it sharp corners, and the rapid envelope turns it into a buzz rather than a swell.",
            "The color is 3.2, slightly warmer than pink. The envelope loop is extremely short, attacking in 0.05 seconds, holding for 0.3 at 90 percent and releasing in 0.1, so it cycles roughly twice a second. A square-shaped pulse at 0.5 Hz gates the level on and off every two seconds on top of that.",
            "It is mostly used for sound design and by people who find the buzz of old electrics oddly soothing. <a href='/presets/diesel-engine'>Diesel Engine</a> is the low, chugging equivalent, and <a href='/presets/static-tv'>Static TV</a> in the experimental category is a faster, brighter version of the same gated idea at white."
        ],
        bestFor: ["Retro electronics atmosphere", "Sound design for film", "Masking an actual light buzz", "Studio experimentation"],
        tip: "Change the pulse shape to sine and the buzz softens into a gentle two-second wobble."
    },
    "Jet Stream": {
        tagline: "Grey-equalized near-violet noise at 0.8, a jet passing high overhead",
        about: [
            "Jet Stream is the tearing hiss of an aircraft heard from the ground, or the outside of the fuselage rather than the cabin: very bright, thin and continuous. The grey EQ lends it enough body that it does not feel like pure treble, but it remains one of the brightest presets available.",
            "The color is 0.8, between violet and blue, so the spectrum climbs steeply into the high frequencies. Grey equalization is on, which lifts the bass and eases the mids to make it more tolerable. There is no pulse, the distribution is Gaussian and the fade-in is three seconds.",
            "It is picked for masking very high-pitched sounds and for people who like a bright, open hiss for daytime alertness. <a href='/presets/airplane-cabin'>Airplane Cabin</a> is the inside-the-plane version at 3.5, and <a href='/presets/mountain-wind'>Mountain Wind</a> in the nature category is a gusting sibling at 1.8. Most people use it in short sessions rather than for hours at a time."
        ],
        bestFor: ["Masking high-pitched whine", "Bright daytime background", "Airport atmosphere", "Ear-training comparisons"],
        tip: "Blend a second color of 3.5 at 0.4 to put the cabin back around the engine hiss."
    },

    // === EXPERIMENTAL ===
    "Static TV": {
        tagline: "White noise with uniform grain, hard-gated nearly three times a second",
        about: [
            "Static TV is the sound of an old set losing its signal and stuttering: raw white hiss chopped into fast, hard bursts. It is abrasive by design, with the uniform distribution adding a crackly grain and the square-shaped pulse switching it on and off like a faulty relay.",
            "The color is exactly 2, white, with uniform distribution. The envelope loop is tiny, attacking in 0.02 seconds, holding for 0.2 and releasing in 0.1, so it cycles almost three times a second. A square pulse at 2.5 Hz gates the level at a similar rate, so the two rhythms interfere and stutter. Grey EQ is off.",
            "This is a sound-design and novelty preset rather than a sleep aid. <a href='/presets/electric-hum'>Electric Hum</a> in the mechanical category is the slower, warmer gated cousin, and <a href='/presets/machine-rhythm'>Machine Rhythm</a> layers four independent gated voices for a more complex industrial pattern. Turn the volume down before pressing play; it arrives instantly and at full intensity, with a fade-in of only two hundredths of a second."
        ],
        bestFor: ["Retro television effects", "Glitch and industrial sound design", "Video and game audio assets", "Testing envelope settings"],
        tip: "Lengthen the duration to 1 second and the release to 0.5 and the stutter turns into a slow signal drop-out."
    },
    "Vinyl Crackle": {
        tagline: "Near-violet noise at 0.4 with uniform grain in a two-second crackle cycle",
        about: [
            "Vinyl Crackle is the surface noise of a record spinning in the run-in groove: a light, high crackle that ebbs and flows with the rotation. It is bright and thin, with the uniform distribution supplying the pops and the slow triangle pulse suggesting the platter turning.",
            "The color is 0.4, close to violet, so almost all the energy is in the top of the spectrum, and the distribution is uniform for crackle. The envelope loop rises in 0.1 seconds, decays over 0.3 to a 50 percent sustain, holds for 1 second and releases over 0.5, a cycle of about 1.9 seconds. A triangle pulse at 0.3 Hz sways the level every three seconds or so.",
            "It is layered under music or podcasts by people who like a lo-fi feel, and used alone as a very light bedtime texture. <a href='/presets/asmr-static'>ASMR Static</a> is the steady, grey-equalized version at 0.3, and <a href='/presets/lo-fi-crunch'>Lo-Fi Crunch</a> in the textured category gets its grit from bit-reduction rather than color."
        ],
        bestFor: ["Lo-fi music beds", "Podcast intros and outros", "Very light sleep texture", "Nostalgic study sessions"],
        tip: "Add warm saturation at around 0.3 to round off the top and make the crackle feel more like an old cartridge."
    },
    "Cicadas": {
        tagline: "Blue-white noise buzzing at 8 Hz through resonant peaks at 4, 5 and 6 kHz",
        about: [
            "Cicadas is a hot afternoon in a dry field: a shrill, pulsing insect chorus that seems to come from every tree at once. The resonant filters give it a whistling, tonal edge and the fast tremolo makes it shimmer, so it reads as living creatures rather than a machine.",
            "The color is 1.5, between blue and white. Three resonant bandpass filters at 4000, 5000 and 6000 Hz with a Q of 8 and a 50 percent mix ring the noise into a bright insect-like tone. A sine pulse at 8 Hz throbs the level eight times a second for the buzz. The fade-in is three seconds and there is no envelope loop.",
            "It is popular for summer atmosphere and for people who grew up with the sound. <a href='/presets/wind-chimes'>Wind Chimes</a> in the textured category uses resonant filters on a similar color but at musical pitches with a slow envelope, and <a href='/presets/mountain-wind'>Mountain Wind</a> is the same brightness without the tonal ring."
        ],
        bestFor: ["Summer evening atmosphere", "Nature scenes for film", "Masking high-pitched hums", "Nostalgic outdoor feel"],
        tip: "Lower the pulse to 5 Hz and raise the filter Q to 12 for a slower, more piercing species."
    },
    "ASMR Static": {
        tagline: "Near-violet noise at 0.3 with grey EQ and uniform grain, a soft, fine hiss",
        about: [
            "ASMR Static is a very fine, whispery hiss, like the sound between tracks on a cassette or the faint fizz of a carbonated drink held near the ear. It is bright but not sharp, because the grey EQ pulls the spectrum back into balance and the uniform grain gives it a soft, dry texture.",
            "The color is 0.3, almost violet, with grey equalization switched on to keep the treble from stinging and a little body underneath. The distribution is uniform for grain. There is no pulse and no envelope, and the five-second fade-in lets the hiss creep up rather than snap on.",
            "It is used at low volume for tingles, for masking very quiet rooms, and as a texture under recorded whispers. <a href='/presets/violet-haze'>Violet Haze</a> in the ambient category is the raw, unequalized sibling at 0.2, and <a href='/presets/vinyl-crackle'>Vinyl Crackle</a> is the same brightness shaped into a crackle rhythm."
        ],
        bestFor: ["Low-volume ASMR listening", "Bed for whispered recordings", "Very quiet rooms at night", "Light masking on headphones"],
        tip: "Enable stereo auto-pan at 0.1 Hz with moderate depth so the hiss drifts slowly from ear to ear."
    },
    "Breath Work": {
        tagline: "Pink-warm noise at 3.2 in a six-second inhale and exhale envelope with a slow swell",
        about: [
            "Breath Work rises and falls like a slow, deliberate breath: two seconds in, a short hold, and a longer release out. It sounds like someone breathing calmly through a mask, or a bellows worked patiently, and it is meant to be followed rather than ignored.",
            "The color is 3.2, just warmer than pink. The envelope loop attacks over 2 seconds to full level, holds for 1.5 seconds and releases over 2.5, giving a six-second breath cycle, ten breaths a minute. A sine pulse at 0.1 Hz adds a slower ten-second swell so no two breaths are quite the same. Grey EQ is off.",
            "It is used for paced breathing, meditation and settling before sleep. <a href='/presets/breathing'>Breathing</a> in the textured category is the same envelope at 3.5 without the extra pulse, and <a href='/presets/breathing-room'>Breathing Room</a> layers three breathing voices of different lengths with reverb. Many people use it as a five-minute reset between tasks rather than as a long background sound."
        ],
        bestFor: ["Paced breathing exercises", "Calming before a presentation", "Settling into meditation", "Guided relaxation beds"],
        tip: "Lengthen the release to 4 seconds for a slower exhale and a cycle nearer seven or eight breaths per minute."
    },
    "Machine Rhythm": {
        tagline: "Four bit-reduced gated voices at different rates interlocking into an industrial pattern",
        about: [
            "Machine Rhythm is a factory floor of small machines each running at its own pace: a stamping press on the left, a slower one on the right, a deep thump in the centre and a fast tick underneath. Because none of the cycles line up, the pattern keeps shifting without ever quite repeating.",
            "Four voices run at once: white noise on the left cycling every 0.65 seconds, a 2.5 color on the right every second, full brown in the centre every 2.2 seconds, and a quiet blue tick every 0.37 seconds. The mix is bit-reduced to 10 bits with 2x sample-rate reduction and uses uniform distribution for grit.",
            "This is a sound-design and creative preset rather than a sleep sound. <a href='/presets/static-tv'>Static TV</a> is the single-voice gated ancestor, and <a href='/presets/pulse-rhythm'>Pulse Rhythm</a> in the textured category is a single clean gated voice at 2.5 with grey EQ and no bit reduction. Because the voices live in the generator, you can mute or retune any of them while it runs."
        ],
        bestFor: ["Industrial and techno sketches", "Polyrhythm experiments", "Game and film sound assets", "Rhythmic energy while working"],
        tip: "Mute the fast blue voice and the pattern immediately feels heavier and slower without changing anything else."
    },

    // === TEXTURED ===
    "Resonant Drone": {
        tagline: "Noise at 3.5 rung through peaks at 110, 220 and 330 Hz in a nine-second swell",
        about: [
            "Resonant Drone is a low, tonal hum that swells and recedes, like a cello section holding a single note through a wall or a large engine that has settled on a pitch. The resonant filters pull a definite note out of the noise, an A two octaves below concert pitch and its first two harmonics.",
            "The color is 3.5, halfway between pink and brown. Three resonant bandpass filters at 110, 220 and 330 Hz with a high Q of 25 and a 60 percent mix ring the noise into a pitched drone. The envelope rises over 2 seconds, settles to 70 percent, holds for 4 and releases over 3, a cycle of nine and a half seconds.",
            "It is used for meditation, as a drone under improvised music, and by people who like a musical undertone to their background sound. <a href='/presets/singing-pipes'>Singing Pipes</a> is a brighter, higher-pitched relative at 180 Hz, and <a href='/presets/tibetan-bowl'>Tibetan Bowl</a> uses tighter filters and a bell-like struck envelope. The pitch is fixed, so it may clash with music in other keys."
        ],
        bestFor: ["Drone for improvisation", "Meditation on a single tone", "Cello-like ambient beds", "Masking with a musical note"],
        tip: "Change the filter frequencies to 98, 196 and 294 Hz for the same drone a whole tone lower."
    },
    "Singing Pipes": {
        tagline: "White-pink noise sung through peaks at 180, 360 and 540 Hz in a six-second cycle",
        about: [
            "Singing Pipes is the sound wind makes across the mouth of an open pipe, or old plumbing resonating when the pressure changes: a hollow, whistling tone that rises with each swell and fades between. It is brighter and higher than Resonant Drone and has more of a breathy, aerated quality.",
            "The color is 2.5, halfway between white and pink. Resonant filters at 180, 360 and 540 Hz with a Q of 30 and 50 percent mix ring the noise to a pitch near F-sharp and its harmonics. The envelope rises in 1 second, holds for 3 at 80 percent and releases over 2, a six-second cycle, while a sine pulse at 0.08 Hz adds a slower swell every twelve seconds.",
            "It appeals to people who like tonal ambience and to composers looking for an organ-like bed. <a href='/presets/resonant-drone'>Resonant Drone</a> is the lower, darker cousin at 110 Hz, and <a href='/presets/hollow-tube'>Hollow Tube</a> gets a similar pipe quality from a comb filter instead of resonant peaks. Because of the twelve-second swell, it feels alive rather than static even over long stretches."
        ],
        bestFor: ["Organ-like ambient beds", "Wind-across-pipes atmosphere", "Haunting film textures", "Tonal meditation"],
        tip: "Raise the filter Q to 45 for a purer whistle, or lower it to 15 for a breathier, less pitched sound."
    },
    "Tibetan Bowl": {
        tagline: "Noise struck into a bell tone at 256, 384 and 512 Hz, ringing out over nine seconds",
        about: [
            "Tibetan Bowl is a singing bowl struck once every nine seconds: a quick bright onset, a long shimmering decay, and a soft tail that lingers until the next strike. The very high filter Q gives it a clear ringing pitch, a C and its fifth and octave, so it sounds like metal rather than air.",
            "The color is 3.2, a little warmer than pink. Resonant filters at 256, 384 and 512 Hz with a Q of 40 and 40 percent mix produce the bell. The envelope attacks in 0.1 seconds, decays over 2 seconds to a low 30 percent sustain, holds for 3 and releases over 4, so each strike rings for about nine seconds before the next.",
            "It is used for meditation timing, yoga transitions and as a gentle wake-up tone. <a href='/presets/wind-chimes'>Wind Chimes</a> uses the same struck idea with higher, major-chord pitches and a faster cycle, and <a href='/presets/resonant-drone'>Resonant Drone</a> sustains a lower tone instead of striking it. At low volume it is unobtrusive enough to run through an entire sitting without pulling focus."
        ],
        bestFor: ["Meditation interval bell", "Yoga class transitions", "Gentle wake-up sound", "Sound-bath style ambience"],
        tip: "Extend the duration to 10 seconds and the release to 8 for a bowl struck only every twenty seconds."
    },
    "Metal Wind": {
        tagline: "White noise through a 3 ms comb filter in four-second gusts, a metallic whistle",
        about: [
            "Metal Wind is wind blowing across sheet metal or through the gaps of a corrugated shed: a hard, ringing whistle with a hollow, metallic color that plain noise never has. Gusts arrive, hold briefly and drop away, with a slower swell moving underneath them. It is deliberately unsettling, and it works best in a mix rather than on its own for hours.",
            "The color is exactly 2, white. A comb filter with a 3 millisecond delay and 75 percent feedback at a 40 percent mix adds resonant peaks spaced about 333 Hz apart, which gives the metallic ring. The envelope rises in 0.8 seconds, holds for 2 at 90 percent and releases over 1.5, a cycle of four and a half seconds, and a triangle pulse at 0.15 Hz swells every six or seven seconds.",
            "It is a sound-design and atmosphere preset more than a relaxation one. <a href='/presets/hollow-tube'>Hollow Tube</a> uses a longer 8 millisecond comb for a lower, woodier tone, and <a href='/presets/mountain-wind'>Mountain Wind</a> in the nature category is the same gusting idea without any filtering. Try it under a darker preset for a hint of metal without giving up the low end."
        ],
        bestFor: ["Abandoned-building atmosphere", "Science-fiction wind effects", "Metallic drone beds", "Horror and thriller sound design"],
        tip: "Increase the comb delay to 0.005 seconds and the ring drops to a lower, thicker pitch."
    },
    "Hollow Tube": {
        tagline: "Pink noise through an 8 ms comb filter with high feedback, air moving through a pipe",
        about: [
            "Hollow Tube is the sound of blowing gently across the end of a wide cardboard tube, or air moving through a long duct: a soft, woody, pitched breathiness with a fundamental near 125 Hz and a stack of harmonics above it. It is smoother and lower than Metal Wind.",
            "The color is exactly 3, pink. A comb filter with an 8 millisecond delay, 80 percent feedback and a 50 percent mix creates evenly spaced resonances starting at about 125 Hz, which the ear reads as a hollow pipe. The envelope rises in 0.5 seconds, holds for 2 at full level and releases over 1, a short cycle of three and a half seconds. There is no pulse.",
            "It is useful as a tonal bed for ambient music and for people who find the pipe-like character calming. <a href='/presets/metal-wind'>Metal Wind</a> is the brighter, harsher comb relative at 3 milliseconds, and <a href='/presets/singing-pipes'>Singing Pipes</a> gets a similar pipe tone from resonant bandpass filters instead. Because the cycle is short, it feels more like a steady drone than a rhythm."
        ],
        bestFor: ["Ambient music beds", "Duct and ventilation atmosphere", "Didgeridoo-like drones", "Calm tonal background"],
        tip: "Lengthen the duration to 6 seconds so the pipe sustains longer between the short fades."
    },
    "Spaceship Hull": {
        tagline: "Grey-equalized noise at 3.8 with comb and resonant filters in a thirteen-second cycle",
        about: [
            "Spaceship Hull is the interior of a large vessel under way: a deep rumble with a metallic ring in the structure, slowly breathing as the engines cycle. The comb filter gives the hull its ring, the resonant filters at 80, 160 and 240 Hz add a low tonal hum, and everything moves at a glacial pace.",
            "The color is 3.8 with grey EQ on. A comb filter with a 15 millisecond delay, 70 percent feedback and 35 percent mix supplies a ring around 67 Hz and its harmonics, and resonant filters at 80, 160 and 240 Hz with a Q of 15 and 30 percent mix add the hum. The envelope rises over 3 seconds, holds for 5 at 60 percent and releases over 4, a thirteen-second cycle, with a sine pulse at 0.03 Hz swelling every 33 seconds.",
            "It is a favourite for sleep among science-fiction fans and for anyone who likes a low tonal element. <a href='/presets/space-station'>Space Station</a> in the mechanical category is the unfiltered version, and <a href='/presets/cave-ambience'>Cave Ambience</a> uses a similar comb and resonant recipe at full brown with a longer 16-second cycle."
        ],
        bestFor: ["Sleeping aboard a starship", "Sci-fi reading and writing", "Long-haul immersion", "Masking low building hum"],
        tip: "Raise the resonant mix to 0.5 and the hum comes forward as a clearly pitched engine note."
    },
    "Wind Chimes": {
        tagline: "Blue-white noise struck into a C major chord at 523, 659 and 784 Hz every four seconds",
        about: [
            "Wind Chimes is a set of tuned chimes catching the breeze: a bright, quick strike, a shimmering decay and a quiet gap, with the wind rising and falling behind them. The three filters are tuned to C, E and G above middle C, so the chimes always ring a consonant major chord.",
            "The color is 1.5, between blue and white, for brightness. Resonant filters at 523, 659 and 784 Hz with a very high Q of 35 and a 50 percent mix produce the chord. The envelope attacks in 0.05 seconds, decays over 0.8 to a 20 percent sustain, holds for 1.5 and releases over 2, a cycle of about four seconds, and a triangle pulse at 0.2 Hz adds a five-second breeze.",
            "It is used for gentle wake-up alarms, garden atmosphere and as a light tonal texture. <a href='/presets/tibetan-bowl'>Tibetan Bowl</a> is the lower, slower struck sibling at 256 Hz, and <a href='/presets/cicadas'>Cicadas</a> in the experimental category uses resonant filters on a similar color for a buzzing insect chorus instead."
        ],
        bestFor: ["Gentle morning alarms", "Garden and patio atmosphere", "Light background for yoga", "Quiet time for kids"],
        tip: "Retune the filters to 440, 554 and 659 Hz for an A major chord a few notes lower."
    },
    "Cave Ambience": {
        tagline: "Full brown noise with grey EQ, comb and resonant filters, in a slow sixteen-second cycle",
        about: [
            "Cave Ambience is the deep, echoing hush of a large underground chamber: a low rumble with a hollow, resonant color, swelling and fading so slowly it feels like the rock itself breathing. Water drips and wind are implied by the filtering rather than spelled out.",
            "The color is full brown at 4 with grey EQ on. A comb filter with a 25 millisecond delay and 60 percent feedback adds resonances spaced about 40 Hz apart, and resonant filters at 100, 150 and 200 Hz with a Q of 12 add a low chamber tone. The envelope rises over 4 seconds, holds for 6 at 50 percent and releases over 5, a sixteen-second cycle, with a sine pulse at 0.05 Hz swelling every twenty seconds.",
            "It suits sleep, meditation and anyone who wants the darkest textured preset. <a href='/presets/seaside-cave'>Seaside Cave</a> in the nature category is the unfiltered, wetter cousin at 3.8, and <a href='/presets/spaceship-hull'>Spaceship Hull</a> is the same filter recipe tuned brighter and more metallic. Of the three it is the darkest and slowest, and the most likely to disappear into the background over a long night."
        ],
        bestFor: ["Spacious deep sleep sound", "Meditation in darkness", "Underground film atmosphere", "Masking deep rumble"],
        tip: "Add large reverb at 40 percent on top of the comb filter to make the chamber feel enormous."
    },
    "Breathing": {
        tagline: "Noise at 3.5 shaped into a six-second breath, two seconds in and two and a half out",
        about: [
            "Breathing is a steady, calm breath rendered in noise: it rises for two seconds, pauses briefly at the top, and eases out over two and a half. It sounds like a sleeper breathing slowly beside you, or a bellows worked at a resting pace, and it invites you to fall into step with it.",
            "The color is 3.5, midway between pink and brown, and there is no pulse or filtering. The envelope loop attacks over 2 seconds to full level, holds for 1.5 seconds and releases over 2.5, giving a cycle of exactly six seconds, ten breaths a minute. Grey EQ is off, so the tone is left natural.",
            "It is used for paced breathing and for settling into sleep alongside a partner who is already asleep. <a href='/presets/breath-work'>Breath Work</a> in the experimental category is the same envelope at 3.2 with an extra slow swell, and <a href='/presets/breathing-room'>Breathing Room</a> spreads three breathing voices across the stereo field."
        ],
        bestFor: ["Paced breathing at rest", "Falling asleep to a rhythm", "Grounding during panic", "Slow evening meditation"],
        tip: "Set the attack to 4 and the release to 6 for a slower five-breaths-per-minute pace often used in relaxation exercises."
    },
    "Waves Loop": {
        tagline: "Dark noise at 3.8 in a ten-second wave envelope with no extra pulse or filtering",
        about: [
            "Waves Loop is a deeper, simpler version of Ocean Waves: each wave builds over three seconds, holds, and draws back over four, with no faster ripple on top. It sounds like surf at night heard from a distance, when the individual splashes are gone and only the swell remains.",
            "The color is 3.8, well toward brown, and there is no pulse. The envelope loop rises over 3 seconds, decays over 0.5 to a 70 percent sustain, holds for 3 seconds and releases over 4, so a full wave lasts ten and a half seconds and roughly six waves pass each minute. Grey EQ is off.",
            "It is often chosen for sleep when Ocean Waves is too bright or too busy. <a href='/presets/ocean-waves'>Ocean Waves</a> in the nature category is the same envelope at 3.2 with an added 0.18 Hz shimmer, and <a href='/presets/ocean-drift'>Ocean Drift</a> runs three of these wave voices at different lengths so they never line up."
        ],
        bestFor: ["Night-time beach sleep", "Slow rocking for infants", "Masking traffic with waves", "Winding down in the dark"],
        tip: "Layer a second color of 3 at a blend of 0.3 to bring back a little foam without the shimmer."
    },
    "Pulse Rhythm": {
        tagline: "Grey-equalized white-pink noise gated in a 1.7-second cycle, a slow steady pulse",
        about: [
            "Pulse Rhythm is a soft, regular thump of noise, like a slow heartbeat or a washing machine on a gentle cycle heard from another room. Each pulse arrives quickly, drops to a quieter tail and fades, then the next one comes. It is calm rather than driving.",
            "The color is 2.5, between white and pink, with grey EQ on so the pulse feels full rather than hissy. The envelope loop attacks in 0.1 seconds, decays over 0.3 to a 50 percent sustain, holds for 0.5 and releases over 0.8, a cycle of 1.7 seconds, or about 35 pulses a minute. There is no LFO pulse.",
            "It suits people who like a rhythmic anchor without the aggression of the mechanical presets. <a href='/presets/diesel-engine'>Diesel Engine</a> is the darker, faster chug at full brown, and <a href='/presets/machine-rhythm'>Machine Rhythm</a> in the experimental category multiplies this idea into four interlocking gated voices. At low volume it can also serve as a loose timekeeper for slow breathing or walking."
        ],
        bestFor: ["Slow rhythmic grounding", "Walking meditation pace", "Rocking infants to sleep", "Metronome-like background"],
        tip: "Set the duration to 0.2 and the release to 0.4 for a cycle near one second, about the pace of a resting heartbeat."
    },
    "Slow Swell": {
        tagline: "Full brown noise rising over eight seconds and falling over six in a 21-second cycle",
        about: [
            "Slow Swell is the slowest cycle in the collection: a deep rumble that takes eight seconds to build, eases slightly, holds for five, then falls away over six before starting again. It feels like a distant tide, or a very large machine breathing once every twenty seconds.",
            "The color is full brown at 4 with no EQ, pulse or filtering. The envelope loop attacks over 8 seconds, decays over 2 seconds to a 60 percent sustain, holds for 5 and releases over 6, for a cycle of 21 seconds, just under three swells a minute. The long attack is what keeps it from ever feeling abrupt.",
            "It is used for sleep and for slow breathing practice at a very relaxed pace. <a href='/presets/distant-thunder'>Distant Thunder</a> in the nature category is the same brown color with a fast attack and a much shorter cycle, and <a href='/presets/deep-sleep'>Deep Sleep</a> gets a similar slow motion from a pulse rather than an envelope."
        ],
        bestFor: ["Very slow breathing practice", "Deep sleep with tide-like motion", "Masking rumble without hiss", "Floating in a bath"],
        tip: "Enable grey EQ if the swell disappears on small speakers; it brings the low end into hearing range."
    },
    "Drifting": {
        tagline: "Noise at 3.5 that swings slowly across the stereo field every twelve seconds",
        about: [
            "Drifting is a smooth, even hush that never sits still in the room: it wanders from the left ear toward the right and back again over about twelve seconds, like a slow current moving past. The tone itself is unremarkable on purpose; the motion is the whole point.",
            "The color is 3.5, halfway between pink and brown, with no pulse, EQ or envelope. Stereo auto-pan is enabled at 0.08 Hz, which is one full left-right-left sweep every twelve and a half seconds, with a depth of 0.7 so the sound never fully disappears from either side. The fade-in is five seconds.",
            "It is popular on headphones for sleep and for people who find a fixed centre image fatiguing. <a href='/presets/focus-zone'>Focus Zone</a> in the focus category is the same color with grey EQ and no panning, and <a href='/presets/stereo-clouds'>Stereo Clouds</a> pairs two separately panned voices with reverb for a wider, more diffuse motion."
        ],
        bestFor: ["Headphone sleep", "Reducing centre-image fatigue", "Meditation with movement", "Long listening sessions"],
        tip: "Lower the pan rate to 0.03 Hz for a very slow 33-second drift that is felt more than heard."
    },
    "Layered Depths": {
        tagline: "Full brown noise with a blue layer at 1.5 mixed in, deep rumble with a light shimmer",
        about: [
            "Layered Depths is two sounds at once: a heavy brown rumble underneath and a light blue hiss floating above it, with the midrange between them left comparatively empty. The result sounds like standing near a waterfall at the base and hearing spray high above, or a big engine with a small fan beside it.",
            "The primary color is full brown at 4, and a second color of 1.5, between blue and white, is blended in at 40 percent. Because the two colors sit at opposite ends of the spectrum, the blend produces a scooped shape that no single color setting can make. There is no pulse or EQ, and the fade-in is five seconds.",
            "It is chosen by people who want the mass of brown noise with enough treble to mask voices and keyboards. <a href='/presets/deep-brown'>Deep Brown</a> in the ambient category is the bottom layer alone, and <a href='/presets/tinnitus-mask'>Tinnitus Mask</a> is close to the top layer alone with grey EQ added."
        ],
        bestFor: ["Masking both rumble and voices", "Sleep with a hint of air", "Large-room fill sound", "Listeners who find brown muffled"],
        tip: "Lower the blend to 0.2 for a mostly-brown sound with only a whisper of the blue layer on top."
    },
    "Warm Hiss": {
        tagline: "White-pink noise at 2.5 through warm saturation, a softened tape-like hiss",
        about: [
            "Warm Hiss is the sound of an analogue tape machine or a valve amplifier idling: a bright noise floor that has been gently squashed so the edges are rounded and the tone feels thicker. It is brighter than the pink presets but far less spiky than plain white noise.",
            "The color is 2.5, halfway between white and pink. Warm-mode saturation at 0.6 compresses the peaks and adds low-order harmonics, which fattens the sound and takes the sting out of the treble. There is no pulse, EQ or envelope, and the fade-in is two seconds before it settles.",
            "It suits people who like a bright noise for focus but find white or blue tiring after an hour. <a href='/presets/beta-boost'>Beta Boost</a> in the focus category is the same color without saturation, and <a href='/presets/lo-fi-crunch'>Lo-Fi Crunch</a> takes a different route to warmth through bit reduction rather than saturation."
        ],
        bestFor: ["Tape-machine studio atmosphere", "Bright focus without fatigue", "Lo-fi music beds", "Masking on cheap earbuds"],
        tip: "Raise the saturation toward 0.9 for a thicker, more compressed hiss that sits further back in the mix."
    },
    "Lo-Fi Crunch": {
        tagline: "Pink noise crushed to 6 bits with 8x sample-rate reduction, a crunchy retro texture",
        about: [
            "Lo-Fi Crunch sounds like pink noise played back through an early video-game console or a broken sampler: gritty, aliased and crunchy, with a distinctive digital grain and a rolled-off, muffled top end from the reduced sample rate. It is more character than comfort, and it makes no attempt to hide that.",
            "The color is exactly 3, pink, with uniform distribution for extra grit. The bit depth is reduced to 6 bits, which adds quantization noise and a stepped, crunchy texture, and the sample rate is divided by 8, which introduces aliasing and cuts the highest frequencies. There is no pulse or EQ, and the fade-in is two seconds.",
            "It is used for retro game and music sound design and by people who simply like the texture. <a href='/presets/warm-hiss'>Warm Hiss</a> is the analogue-flavoured alternative using saturation, and <a href='/presets/machine-rhythm'>Machine Rhythm</a> in the experimental category applies a milder 10-bit crush to a four-voice rhythm. It sits well under chiptune or lo-fi beats where a clean noise would sound out of place."
        ],
        bestFor: ["Retro game sound design", "Lo-fi hip-hop textures", "Chiptune noise layers", "Deliberately rough ambience"],
        tip: "Raise the bit depth to 8 and the sample-rate reduction to 4 for a gentler crunch closer to a 1990s sampler."
    },
    "Cathedral Air": {
        tagline: "Grey-equalized noise at 3.5 in a large reverb at 70 percent, a vast still space",
        about: [
            "Cathedral Air is the hush of an enormous stone building: a soft, even wash that seems to come from everywhere at once, with the long tail of a big room smoothing away any detail. It feels spacious and distant rather than close and enveloping, more like weather than a machine.",
            "The color is 3.5, midway between pink and brown, with grey EQ on for balance. A large-room reverb is mixed in at 70 percent, which is high enough that the reverb tail dominates and the dry noise becomes a texture inside the space. There is no pulse or envelope, and the eight-second fade-in suits the slow character.",
            "It is chosen for meditation, sleep, and anyone who finds dry noise too close to the ear. <a href='/presets/focus-zone'>Focus Zone</a> in the focus category is exactly this sound without the reverb, and <a href='/presets/stereo-clouds'>Stereo Clouds</a> uses a similar large reverb with two panned voices for a wider, more mobile space."
        ],
        bestFor: ["Meditation in a big space", "Sleep with distance", "Ambient music beds", "Reducing headphone closeness"],
        tip: "Lower the reverb mix to 0.4 if you want the room without losing the sense of the noise itself."
    },
    "Ocean Drift": {
        tagline: "Three wave voices on 12, 17 and 8-second cycles drifting out of phase in a large reverb",
        about: [
            "Ocean Drift is a shoreline where the waves never fall into a pattern: a mid-sized wave breaking slightly to the left, a bigger, slower one to the right, and a quick, light one in the centre, all in a large space. Because the three cycles have different lengths, the sea keeps changing for many minutes before it repeats.",
            "Three voices run together. A 3.8 color voice panned left cycles every twelve and a half seconds, a full-brown voice panned right every seventeen seconds, and a 3.5 voice in the centre every eight seconds or so, each with its own attack and release. A large reverb at 30 percent blends them, and a fourth voice is present but muted.",
            "It is the preset to try when a single looping wave starts to feel mechanical. <a href='/presets/waves-loop'>Waves Loop</a> is one of these voices on its own, and <a href='/presets/ocean-waves'>Ocean Waves</a> in the nature category is brighter and uses a pulse rather than extra voices for its added motion."
        ],
        bestFor: ["Sleep without a repeating loop", "Long relaxation sessions", "Realistic beach atmosphere", "Wide stereo headphone listening"],
        tip: "Enable the muted fourth voice at a low volume and set its color to 2.5 for a hint of foam on the surface."
    },
    "Breathing Room": {
        tagline: "Three breathing voices on 6, 9 and 8-second cycles, spread across the stereo field",
        about: [
            "Breathing Room sounds like a small group breathing calmly together but not in unison: a steady breath in the centre, a slower one off to the left and a slightly lighter one to the right. The rhythms overlap and separate, and the modest reverb makes it feel like a shared, quiet room.",
            "Three voices are active. A pink voice in the centre breathes on a six-second cycle, a 3.5 voice panned half left on a nine-second cycle, and a 2.5 voice panned half right on a cycle of about eight seconds. Grey EQ is applied to the whole mix and a medium reverb sits at 20 percent. A fourth voice is present but muted.",
            "It suits group meditation, sleep, and people who found a single breathing loop too regimented. <a href='/presets/breathing'>Breathing</a> is the centre voice on its own, and <a href='/presets/breath-work'>Breath Work</a> in the experimental category is a single breath at 3.2 with an added slow swell. The stereo spread means it works best on headphones or a well-separated pair of speakers."
        ],
        bestFor: ["Group meditation background", "Falling asleep beside others", "Yoga nidra sessions", "Calming a shared space"],
        tip: "Mute the left and right voices to fall back to a single central breath, then bring them in once you have settled."
    },
    "Stereo Clouds": {
        tagline: "Two pink voices hard-panned left and right on 16 and 20-second cycles in a large reverb",
        about: [
            "Stereo Clouds is a slow weather system in headphones: one soft mass of sound swelling on the far left over sixteen seconds, another on the far right over twenty, so the balance keeps tipping gently one way and then the other. A big reverb and a very slow global pan blur the edges.",
            "Two voices are active. A pink voice panned hard left rises over 5 seconds, holds for 4 at 60 percent and releases over 6, a sixteen-second cycle. A 3.2 voice panned hard right rises over 6, holds for 5 at 50 percent and releases over 7, a cycle of about twenty seconds. A large reverb at 50 percent and a global auto-pan at 0.05 Hz with 0.3 depth tie them together.",
            "It is designed for headphones and long sessions where a static image gets tiring. <a href='/presets/drifting'>Drifting</a> is a single voice with faster, deeper panning and no reverb, and <a href='/presets/cathedral-air'>Cathedral Air</a> is a single grey-equalized voice in a similar large space without the motion. Because both voices are pink-range, the tone stays soft no matter where the balance sits."
        ],
        bestFor: ["Headphone sleep with motion", "Slow ambient listening", "Reducing static-image fatigue", "Wide-field meditation"],
        tip: "Lower the reverb mix to 0.3 to sharpen the left-right separation and make each cloud more distinct."
    }
};
