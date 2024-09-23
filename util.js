module.exports.capitalizeFirstLetter = function (string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports.getDeviceById = function (id, devices) {
	let device
	if (id === 'default_output') {
		device = devices.find((d) => d.type === 'output' && d.isDefaultForMultimedia)
	} else if (id === 'default_input') {
		device = devices.find((d) => d.type === 'input' && d.isDefaultForMultimedia)
	} else {
		device = devices.find((d) => d.id === id)
	}

	return device
}
