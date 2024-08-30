# win-audio-outputs

> List and system control audio outputs from Node.js on Windows

Wraps the excellent [SoundVolumeView](https://www.nirsoft.net/utils/sound_volume_view.html) for use in Node.js.

This project is part of [#CreateWeekly](https://twitter.com/JosephusPaye/status/1214853295023411200), my attempt to create something new publicly every week in 2020.

## Installation

```sh
npm install -g @josephuspaye/win-audio-outputs
```

## Examples

### List audio outputs

The following program prints a list of currently active audio outputs in JSON format:

```js
import { listOutputs } from '@josephuspaye/win-audio-outputs';

async function main() {
  const outputs = await listOutputs();
  console.log(JSON.stringify(outputs, null, '  '));
}

main();
```

<details>
<summary>View sample output</summary>

```json
[
  {
    "id": "{0.0.0.00000000}.{456f665c-5c37-4a04-b894-9ea4a1717f76}",
    "name": "LG Ultra HD",
    "deviceName": "NVIDIA High Definition Audio",
    "isDefaultForMultimedia": false,
    "isDefaultForCommunications": false,
    "isMuted": false,
    "volume": 60
  },
  {
    "id": "{0.0.0.00000000}.{938a0889-557f-4ba3-ae3e-2d6837decbe4}",
    "name": "Realtek HD Audio 2nd output",
    "deviceName": "Realtek(R) Audio",
    "isDefaultForMultimedia": true,
    "isDefaultForCommunications": true,
    "isMuted": false,
    "volume": 20.5
  }
]
```

</details>

### Set the volume of an output

The following program sets the volume of the default multimedia output to 50%:

```js
import { listOutputs, setVolume } from '@josephuspaye/win-audio-outputs';

async function main() {
  const outputs = await listOutputs();
  const multimediaDefault = outputs.find(
    (output) => output.isDefaultForMultimedia
  );

  if (multimediaDefault) {
    await setVolume(multimediaDefault, 50);
  } else {
    console.log('No default multimedia output found');
  }
}

main();
```

### Mute or unmute an output

The following program mutes or unmutes the default communications output:

```js
import { listOutputs, mute, unmute } from '@josephuspaye/win-audio-outputs';

async function main() {
  const outputs = await listOutputs();
  const multimediaDefault = outputs.find(
    (output) => output.isDefaultForCommunications
  );

  if (multimediaDefault) {
    if (multimediaDefault.isMuted) {
      await unmute(multimediaDefault);
    } else {
      await mute(multimediaDefault);
    }
  } else {
    console.log('No default communications output found');
  }
}

main();
```

### Change default output

The following program changes the default multimedia output to the first non-default one:

```js
import { listOutputs, setAsDefault } from '@josephuspaye/win-audio-outputs';

async function main() {
  const outputs = await listOutputs();
  const firstNonDefault = outputs.find(
    (output) => output.isDefaultForMultimedia === false
  );

  if (firstNonDefault) {
    await setAsDefault(firstNonDefault);
  } else {
    console.log('No non-default multimedia output found');
  }
}

main();
```

## API

```ts
interface AudioOutput {
  /**
   * The ID of the output, used for subsequent calls that control the output
   */
  id: string;

  /**
   * The name of the output
   */
  name: string;

  /**
   * The name of the output device
   */
  deviceName: string;

  /**
   * Whether this output is the default for multimedia
   */
  isDefaultForMultimedia: boolean;

  /**
   * Whether this output is the default for communications
   */
  isDefaultForCommunications: boolean;

  /**
   * Whether this output is muted
   */
  isMuted: boolean;

  /**
   * The current volume of the output, in the range [0, 100]
   */
  volume: number;
}

/**
 * Get a list of currently active (connected and non-disabled) audio outputs on the system.
 */
function getOutputs(): Promise<AudioOutput[]>;

/**
 * Set the volume of the given output.
 *
 * @param output The output or id of the output
 * @param volume The volume to set, in the range [0, 100]
 * @throws       Throws when output id or volume is invalid
 */
function setVolume(output: AudioOutput | string, volume: number): Promise<void>;

/**
 * Mute the given output.
 *
 * @param output The output or id of the output
 * @throws       Throws when output id is invalid
 */
function mute(output: AudioOutput | string): Promise<void>;

/**
 * Unmute the given output.
 *
 * @param output The output or id of the output
 * @throws       Throws when output id is invalid
 */
function unmute(output: AudioOutput | string): Promise<void>;

/**
 * Set the give output as the default output of the given type.
 *
 * @param output The output or id of the output
 * @param type   The type of default to set: 'multimedia', 'commcommunications', or 'all'
 * @throws       Throws when output id or default type is invalid
 */
function setAsDefault(
  output: AudioOutput | string,
  type?: 'all' | 'multimedia' | 'communications'
): Promise<void>;
```

## Licence

[MIT](LICENCE)
