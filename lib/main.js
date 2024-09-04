const path = require('node:path')
const { exec } = require('node:child_process')

/**
 * The path to the binary directory, where the executables are.
 */
const binDir = path.join(__dirname, 'bin')

/**
 * Get a list of currently active (connected and non-disabled) audio devices on the system.
 */
async function listDevices() {
	const { exitCode, stdout } = await execAsPromised(
		'svcl /stab "" | GetNir "Item ID, Name, Device Name, Direction, Default Multimedia, Muted, Volume Percent" "Type=Device && DeviceState=Active"',
		{ cwd: binDir },
	)
	const devices = []
	if (exitCode === 0 && stdout.length > 0) {
		const entries = stdout.split('\r\n')
		for (const entry of entries) {
			const [id, name, deviceName, direction, isDefaultForMultimedia, isMuted, volume] = entry.split('\t')
			devices.push({
				id: id !== null && id !== void 0 ? id : '',
				name: name !== null && name !== void 0 ? name : '',
				deviceName: deviceName !== null && deviceName !== void 0 ? deviceName : '',
				type: direction === 'Capture' ? 'input' : 'output',
				isDefaultForMultimedia: isDefaultForMultimedia === 'Capture' || isDefaultForMultimedia === 'Render',
				isMuted: isMuted === 'Yes',
				volume: Number((volume !== null && volume !== void 0 ? volume : '0').replace('%', '')),
			})
		}
	}

	devices.sort((a, b) => {
		if (a.type === 'input' && b.type === 'input') {
			return a.name.localeCompare(b.name)
		} else if (a.type === 'input') {
			return -1
		} else if (b.type === 'input') {
			return 1
		} else {
			return a.name.localeCompare(b.name)
		}
	})

	return devices
}

/**
 * Set the volume of the given device.
 *
 * @param device The device or id of the device
 * @param volume The volume to set, in the range [0, 100]
 * @throws       Throws when device id or volume is invalid
 */
async function setVolume(device, volume) {
	const id = getValidId(device)
	if (!volume || typeof volume !== 'number') {
		throw new Error('invalid volume: ' + volume)
	}
	if (volume < 0 || volume > 100) {
		throw new Error('volume must be in the range [0, 100]')
	}
	const volumeRounded = Math.round(volume * 10) / 10 // rounded to 1 decimal place
	const result = await execAsPromised(`svcl /SetVolume ${id} ${volumeRounded}`, {
		cwd: binDir,
	})

	if (result.exitCode === 0 && typeof device !== 'string') {
		device.volume = volumeRounded
	}
}

/**
 * Mute the given device.
 *
 * @param device The device or id of the device
 * @throws       Throws when device id is invalid
 */
async function mute(device) {
	const id = getValidId(device)
	const result = await execAsPromised(`SoundVolumeView /SetVolume /Mute ${id}`, {
		cwd: binDir,
	})

	if (result.exitCode === 0 && typeof device !== 'string') {
		device.isMuted = true
	}
}

/**
 * Unmute the given device.
 *
 * @param device The device or id of the device
 * @throws       Throws when device id is invalid
 */
async function unmute(device) {
	const id = getValidId(device)
	const result = await execAsPromised(`SoundVolumeView /SetVolume /Unmute ${id}`, {
		cwd: binDir,
	})

	if (result.exitCode === 0 && typeof device !== 'string') {
		device.isMuted = false
	}
}

const DefaultTypes = {
	all: 'all',
	multimedia: 1,
	communications: 2,
}

const defaultTypeKeys = Object.keys(DefaultTypes)

/**
 * Set the give device as the default device of the given type.
 *
 * @param device The device or id of the device
 * @param type   The type of default to set: 'multimedia', 'communications', or 'all'
 * @throws       Throws when device id or default type is invalid
 */
async function setAsDefault(device, type = 'multimedia') {
	const id = getValidId(device)
	if (!defaultTypeKeys.includes(type)) {
		throw new Error(`Invalid default type: ${type}. Please use one of ${defaultTypeKeys.join(', ')}`)
	}
	const result = await execAsPromised(`SoundVolumeView /SetDefault ${id} ${DefaultTypes[type]}`, {
		cwd: binDir,
	})

	if (result.exitCode === 0 && typeof device !== 'string') {
		if (type === 'all' || type === 'multimedia') {
			device.isDefaultForMultimedia = true
		}
		if (type === 'all' || type === 'communications') {
			device.isDefaultForCommunications = true
		}
	}
}

module.exports = {
	listDevices,
	setVolume,
	mute,
	unmute,
	setAsDefault,
}

/**
 * Get the id of the given device and check that it is valid
 */
function getValidId(device) {
	const id = typeof device === 'string' ? device : device.id
	if (!id || typeof id !== 'string' || id.length === 0) {
		throw new Error('invalid device id: ' + id)
	}
	return id
}

/**
 * A Promise wrapper around child process exec()
 */
function execAsPromised(command, options = {}) {
	return new Promise((resolve, reject) => {
		const child = exec(command, { cwd: !options ? undefined : options.cwd }, (err, stdout, stderr) => {
			if (err) {
				reject(err)
			}
			resolve({
				stdout: stdout.trim(),
				stderr: stderr.trim(),
				exitCode: child.exitCode,
			})
		})
		if ((!options ? undefined : options.useChildProcess) !== undefined) {
			options.useChildProcess(child)
		}
	})
}
