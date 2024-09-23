const { capitalizeFirstLetter } = require('./util')

module.exports = async function (self) {
	let definitions = []
	let values = {}

	if (Array.isArray(self.devices)) {
		let indexes = {
			input: 0,
			output: 0,
		}
		self.devices.forEach((device) => {
			const index = indexes[device.type]++
			definitions.push({
				variableId: `${device.type}_${index}_id`,
				name: `${capitalizeFirstLetter(device.type)} ${index}'s Device ID`,
			})
			definitions.push({
				variableId: `${device.type}_${index}_name`,
				name: `${capitalizeFirstLetter(device.type)} ${index}'s Name`,
			})
			definitions.push({
				variableId: `${device.type}_${index}_volume`,
				name: `${capitalizeFirstLetter(device.type)} ${index}'s Volume`,
			})
			definitions.push({
				variableId: `${device.type}_${index}_isMuted`,
				name: `Whether ${capitalizeFirstLetter(device.type)} ${index} is muted`,
			})
			definitions.push({
				variableId: `${device.type}_${index}_isDefault`,
				name: `Whether ${capitalizeFirstLetter(device.type)} ${index} is default`,
			})

			Object.assign(values, {
				[`${device.type}_${index}_id`]: device.id,
				[`${device.type}_${index}_name`]: device.name,
				[`${device.type}_${index}_volume`]: device.volume,
				[`${device.type}_${index}_isMuted`]: device.isMuted,
				[`${device.type}_${index}_isDefault`]: device.isDefaultForMultimedia,
			})
		})
	}

	self.log('debug', 'DEFINITIONS: ' + JSON.stringify(definitions))
	self.log('debug', 'VAR VALUES:' + JSON.stringify(values))

	self.setVariableDefinitions(definitions)
	self.setVariableValues(values)
}
