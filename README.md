# Venuscontrol

This is a reimplementation of https://github.com/rweijnen/marstek-venus-monitor without the insufferable agentic LLM noise.
It still is utilizing LLMs for development, but with a human in the loop to increase sanity.

I greatly appreciate the prior work, but just being in the same room as that codebase makes me uneasy.


### How can I help?

If you're asking this, you can't. Sorry.

Over the last (soon to be a full) decade, I've done so much hand-holding to get people up to speed, I think I did way more than my fair share for "the community".
Now, someone else can take over that task, thank you.

<br/>

That said, if you know what you're doing (e.g. fellow IoT Hacker, work experience with BLE) there is something:
**OTA Updates**

The battery can update its submodules via BLE, which is great, but also very scary.
In that other linked project, an LLM apparently looked into the process, but "an LLM looked into" is an oxymoron.

So, if you're a real human with real experience, that would be a more or less final piece to look into to fully uncloud these storages.

Firmware images can be found there: https://github.com/rweijnen/marstek-firmware-archive but that's also fully vibecoded, so that could definitely be redone as well.
That repo is seeded using this repo: https://github.com/rweijnen/marstek-fw-checker but that's also fully vibecoded, so that could definitely be redone as well.

But TL;DR: Blobs are available. Now we just need to figure out how to safely push them to the Battery.
