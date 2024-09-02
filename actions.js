const { mute, unmute } = require('./lib/main')

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
				if (device) {
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
				default: self.audioDeviceListDefault,
				choices: self.audioDeviceList,
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
		callback: (action) => {
			//Standard offset values (aka how the OBS code determines slider percentage)
			let LOG_RANGE_DB = 96.0
			let LOG_OFFSET_DB = 6.0
			let LOG_OFFSET_VAL = -0.77815125038364363
			let LOG_RANGE_VAL = -2.00860017176191756

			//Calculate current "percent" of volume slider in OBS
			let dB = self.sources[action.options.source].inputVolume
			let currentPercent = 0.0
			if (dB >= 0.0) {
				currentPercent = 100.0
			} else if (dB <= -96.0) {
				currentPercent = 0.0
			} else {
				currentPercent = ((-Math.log10(-dB + 6.0) - LOG_RANGE_VAL) / (LOG_OFFSET_VAL - LOG_RANGE_VAL)) * 100.0
			}

			//Calculate new "percent" of volume slider
			let percentAdjustment = Math.abs(action.options.percent)

			let newPercent
			if (action.options.percent > 0) {
				newPercent = currentPercent + percentAdjustment
			} else {
				newPercent = currentPercent - percentAdjustment
			}
			newPercent = newPercent / 100
			let newDb
			if (newPercent >= 1.0) {
				newDb = 0.0
			} else if (newPercent <= 0.0) {
				newDb = -100.0
			} else {
				newDb =
					-(LOG_RANGE_DB + LOG_OFFSET_DB) * Math.pow((LOG_RANGE_DB + LOG_OFFSET_DB) / LOG_OFFSET_DB, -newPercent) +
					LOG_OFFSET_DB
			}

			self.sendRequest('SetInputVolume', { inputName: action.options.source, inputVolumeDb: newDb })
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
