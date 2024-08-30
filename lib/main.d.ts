export interface AudioDevice {
	/**
	 * The ID of the device, used for subsequent calls that control the device
	 */
	id: string
	/**
	 * The name of the i/o
	 */
	name: string
	/**
	 * The name of the i/o device
	 */
	deviceName: string
	/**
	 * Whether this device is the default for multimedia
	 */
	isDefaultForMultimedia: boolean
	/**
	 * Whether this device is the default for communications
	 */
	isDefaultForCommunications: boolean
	/**
	 * Whether this device is muted
	 */
	isMuted: boolean
	/**
	 * The current volume of the device, in the range [0, 100]
	 */
	volume: number
}
/**
 * Get a list of currently active (connected and non-disabled) audio outputs on the system.
 */
export declare function listOutputs(): Promise<AudioDevice[]>
/**
 * Get a list of currently active (connected and non-disabled) audio inputs on the system.
 */
export async function listInputs(): Promise<AudioDevice[]>
/**
 * Set the volume of the given device.
 *
 * @param device The device or id of the device
 * @param volume The volume to set, in the range [0, 100]
 * @throws       Throws when device id or volume is invalid
 */
export declare function setVolume(device: AudioDevice | string, volume: number): Promise<void>
/**
 * Mute the given device.
 *
 * @param device The device or id of the device
 * @throws       Throws when device id is invalid
 */
export declare function mute(device: AudioDevice | string): Promise<void>
/**
 * Unmute the given device.
 *
 * @param device The device or id of the device
 * @throws       Throws when device id is invalid
 */
export declare function unmute(device: AudioDevice | string): Promise<void>
/**
 * Set the give device as the default device of the given type.
 *
 * @param device The device or id of the device
 * @param type   The type of default to set: 'multimedia', 'commcommunications', or 'all'
 * @throws       Throws when device id or default type is invalid
 */
export declare function setAsDefault(
	device: AudioDevice | string,
	type?: 'all' | 'multimedia' | 'communications',
): Promise<void>
