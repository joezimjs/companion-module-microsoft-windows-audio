const { setVolume, mute, unmute } = require('./lib/main')

module.exports = function (self) {
	let actions = {}

	actions['sample_action'] = {
		name: 'My First Action',
		options: [
			{
				id: 'num',
				type: 'number',
				label: 'Test',
				default: 5,
				min: 0,
				max: 100,
			},
		],
		callback: async (event) => {
			console.log('Hello world!', event.options.num)
		},
	}

	actions['toggle_mute'] = {
		name: 'Toggle Audio Device Mute',
		description: 'Toggle whether the selected audio device is muted',
		options: [
			{
				type: 'dropdown',
				label: 'Device',
				id: 'device',
				default: self.devices[0]?.id,
				choices: self.deviceChoices,
			},
		],
		callback: async (action, context) => {
			if (action.options.device) {
				const device = self.devices.find((d) => d.id === action.options.device)
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

	actions['adjust_volume'] = {
		name: 'Adjust Device Volume (Percentage)',
		description: 'Adjusts the volume of a source based on a percentage of the OBS volume slider',
		options: [
			{
				type: 'dropdown',
				label: 'Device',
				id: 'device',
				default: self.devices[0]?.id,
				choices: self.deviceChoices,
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
				const device = self.devices.find((d) => d.id === action.options.device)
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

	self.setActionDefinitions(actions)
}

/*
ACTIONS:
Raise Volume
Lower Volume
Set Volume
Mute
Unmute
Toggle Mute
Set Default Device (Multimedia or Communications or both)
*/
