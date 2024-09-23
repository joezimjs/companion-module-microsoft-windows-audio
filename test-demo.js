const { listDevices, setVolume, mute, unmute, setAsDefault } = require('./lib/main.js')

async function main() {
	const devices = await listDevices()
	console.log('DEVICES')
	console.log(JSON.stringify(devices, null, '  '))

	const otherDevice = devices.find((d) => !d.isDefaultForMultimedia && d.type === 'input')

	console.log('Multi-media Default Device:', otherDevice)

	if (otherDevice) {
		await setAsDefault(otherDevice, 'all')
		console.log(`Def`, otherDevice)
	} else {
		console.log('No default multimedia output found')
	}
}

function sleep(time) {
	return new Promise((res) => {
		setTimeout(res, time)
	})
}

main()
