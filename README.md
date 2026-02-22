# Venuscontrol

This is a reimplementation of https://github.com/rweijnen/marstek-venus-monitor without the insufferable agentic LLM noise.
It still is utilizing LLMs for development, but with a human in the loop to increase sanity.

I greatly appreciate the prior work, but just being in the same room as that codebase makes me uneasy.

## What can it do?

Everything required to set a storage up for cloud-free usage with an (emulated) shelly pro 3em Smartmeter + monitoring via modbusTCP.<br/>
Cloud stuff like e.g. those dynamic grid pricing arbitrage things is out of scope.

### Additional funfact:
You don't need uni-meter or similar. All this battery wants for a Shelly pro 3EM is something that listens to the subnet broadcast address on UDP Port 1010 and replies to its inquiries.

You also don't need to actually speak the shelly protocol. At least during my testing, the FW JSON parser was not actually a JSON parser but just "find string offset, read int 2 bytes later".
Therefore, responding with this works:<br/>
`a_act_power==${l1},b_act_power==${l2},c_act_power==${l3},total_act_power==${total}`

You could also send it some prose like
```
Dearest Marstek,

I hope this UDP packet finds you well.
Today, the a_act_poweris${pA}watts.

However, the b_act_poweris${pB}watts, which is interesting.
And look at c_act_poweris${pC}watts!

In conclusion, the total_act_poweris${total}watts.

Sincerely,
The Shelly Emulator.
```

You probably shouldn't, but you could.


## What does it work with?

For now, the Venus A.

I expect that a lot of code could be reused for other Venus types, but I don't have those and I want actually test things instead of just hoping for the best.


## How can I help?

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
