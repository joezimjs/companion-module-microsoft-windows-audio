const { capitalizeFirstLetter } = require('./util')

module.exports = async function (self) {
	let definitions = []
	let values = {}

	if (Array.isArray(self.devices)) {
		self.devices.forEach((device, i) => {
			definitions.push({
				variableId: `${device.type}_${i}_id`,
				name: `${capitalizeFirstLetter(device.type)} ${i}'s Device ID`,
			})
			definitions.push({
				variableId: `${device.type}_${i}_name`,
				name: `${capitalizeFirstLetter(device.type)} ${i}'s Name`,
			})
			definitions.push({
				variableId: `${device.type}_${i}_volume`,
				name: `${capitalizeFirstLetter(device.type)} ${i}'s Volume`,
			})
			definitions.push({
				variableId: `${device.type}_${i}_isMuted`,
				name: `Whether ${capitalizeFirstLetter(device.type)} ${i} is muted`,
			})
			definitions.push({
				variableId: `${device.type}_${i}_isDefault`,
				name: `Whether ${capitalizeFirstLetter(device.type)} ${i} is default`,
			})

			Object.assign(values, {
				[`${device.type}_${i}_id`]: device.id,
				[`${device.type}_${i}_name`]: device.name,
				[`${device.type}_${i}_volume`]: device.volume,
				[`${device.type}_${i}_isMuted`]: device.isMuted,
				[`${device.type}_${i}_isDefault`]: device.isDefault,
			})
		})
	}

	self.log('debug', 'DEFINITIONS: ' + JSON.stringify(definitions))
	self.log('debug', 'VAR VALUES:' + JSON.stringify(values))

	self.setVariableDefinitions(definitions)
	self.setVariableValues(values)
}

/*
X = 1-N
output_X_id
output_X_name
output_X_volume
output_X_isMuted
output_X_isDefaultForMultimedia
output_X_isDefaultForCommunications

input_X_id
input_X_name
input_X_volume
input_X_isMuted
input_X_isDefaultForMultimedia
input_X_isDefaultForCommunications
*/
