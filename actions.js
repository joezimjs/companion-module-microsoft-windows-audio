const { setVolume, mute, unmute, setAsDefault } = require('./lib/main')
const { getDeviceById } = require('./util')

module.exports = function (self) {
	let actions = {}

	// #region Toggle Mute
	actions['toggle_mute'] = {
		name: 'Toggle Audio Device Mute',
		description: 'Toggle whether the selected audio device is muted',
		options: [
			{
				type: 'dropdown',
				label: 'Device',
				id: 'device',
				default: self.deviceChoicesWithCurrent[0]?.id,
				choices: self.deviceChoicesWithCurrent,
			},
		],
		callback: async (action, context) => {
			if (action.options.device) {
				const device = getDeviceById(action.options.device, self.devices)
				// const device = self.devices.find((d) => d.id === action.options.device)
				if (device && device.id) {
					self.log('info', `Toggling mute for device ${device.name}. Is Muted: ${device.isMuted}.`)
					if (device.isMuted) {
						await unmute(device)
					} else {
						await mute(device)
					}
				} else {
					self.log('error', `Could not find device with id ${action.options.device}`)
				}
			}
		},
	}
	// #endregion

	// #region Mute
	actions['mute'] = {
		name: 'Mute an Audio Device',
		description: 'Mute an audio device.',
		options: [
			{
				type: 'dropdown',
				label: 'Device',
				id: 'device',
				default: self.deviceChoicesWithCurrent[0]?.id,
				choices: self.deviceChoicesWithCurrent,
			},
		],
		callback: async (action, context) => {
			if (action.options.device) {
				const device = getDeviceById(action.options.device, self.devices)

				if (device && device.id) {
					self.log('info', `Muting device ${device.name}.`)
					await mute(device)
				} else {
					self.log('error', `Could not find device with id ${action.options.device}`)
				}
			}
		},
	}
	// #endregion

	// #region Unmute
	actions['unmute'] = {
		name: 'Unmute an Audio Device',
		description: 'Unmute an audio device.',
		options: [
			{
				type: 'dropdown',
				label: 'Device',
				id: 'device',
				default: self.deviceChoicesWithCurrent[0]?.id,
				choices: self.deviceChoicesWithCurrent,
			},
		],
		callback: async (action, context) => {
			if (action.options.device) {
				const device = getDeviceById(action.options.device, self.devices)
				if (device && device.id) {
					self.log('info', `Muting device ${device.name}.`)
					await unmute(device)
				} else {
					self.log('error', `Could not find device with id ${action.options.device}`)
				}
			}
		},
	}
	// #endregion

	// #region Adjust Volume
	actions['adjust_volume'] = {
		name: 'Adjust Device Volume (Percentage)',
		description: 'Adjusts the volume of a source based on a percentage of the volume slider',
		options: [
			{
				type: 'dropdown',
				label: 'Device',
				id: 'device',
				default: self.deviceChoicesWithCurrent[0]?.id,
				choices: self.deviceChoicesWithCurrent,
			},
			{
				type: 'number',
				label: 'Percent Adjustment',
				id: 'percent',
				default: 0,
				min: -100,
				max: 100,
				range: true,
			},
		],

		callback: async (action) => {
			if (action.options.device && action.options.percent) {
				const device = getDeviceById(action.options.device, self.devices)
				if (device && device.id) {
					self.log('info', `Adjusting volume for device ${device.name}. Current volume: ${device.volume}.`)

					const currentVolume = device.volume ?? 50
					const newVolume = Math.min(Math.max(currentVolume + action.options.percent, 0), 100)
					await setVolume(device, newVolume)
				} else {
					self.log('error', `Could not find device with id ${action.options.device}`)
				}
			}
		},
	}
	// #endregion

	// #region Set Volume
	actions['set_volume'] = {
		name: 'Set Device Volume (Percentage)',
		description: 'Sets the volume of a source based on a percentage of the volume slider',
		options: [
			{
				type: 'dropdown',
				label: 'Device',
				id: 'device',
				default: self.deviceChoicesWithCurrent[0]?.id,
				choices: self.deviceChoicesWithCurrent,
			},
			{
				type: 'number',
				label: 'Volume Level',
				id: 'level',
				default: 0,
				min: 0,
				max: 100,
				range: true,
			},
		],

		callback: async (action) => {
			if (action.options.device && action.options.level) {
				const device = getDeviceById(action.options.device, self.devices)
				if (device && device.id) {
					self.log('info', `Setting volume for device ${device.name}.`)
					const newVolume = Math.min(Math.max(action.options.level, 0), 100)
					await setVolume(device, newVolume)
				} else {
					self.log('error', `Could not find device with id ${action.options.device}`)
				}
			}
		},
	}
	// #endregion

	// #region Set Default Device
	actions['set_default'] = {
		name: 'Set Default Device',
		description: 'Sets a device as the default/active device.',
		options: [
			{
				type: 'dropdown',
				label: 'Device',
				id: 'device',
				default: self.devices[0]?.id,
				choices: self.deviceChoices,
			},
		],

		callback: async (action) => {
			if (action.options.device) {
				const device = getDeviceById(action.options.device, self.devices)
				self.log('info', `Setting device ${device.name} as default.`)
				if (device && device.id) {
					self.log('info', `Setting device ${device.name} as default.`)
					await setAsDefault(device, 'all')
				} else {
					self.log('error', `Could not find device with id ${action.options.device}`)
				}
			}
		},
	}
	// #endregion

	self.setActionDefinitions(actions)
}

// TODO:
// Allow entering expression/variable name instead of device id dropdown
