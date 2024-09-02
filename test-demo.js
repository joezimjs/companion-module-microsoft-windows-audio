const { listDevices, setVolume, mute, unmute, setAsDefault } = require('./lib/main.js')

async function main() {
	const devices = await listDevices()
	console.log('DEVICES')
	console.log(JSON.stringify(devices, null, '  '))

	const multimediaDefault = devices.find((d) => d.isDefaultForMultimedia && d.type === 'output')

	console.log('Multi-media Default Device:', multimediaDefault)

	if (multimediaDefault) {
		const previousVolume = multimediaDefault.volume
		await setVolume(multimediaDefault, 20)
		console.log('Volume set to 20:', multimediaDefault)
		await sleep(1000)
		await setVolume(multimediaDefault, previousVolume)
		console.log(`Volume set to previous volume (${previousVolume}):`, multimediaDefault)
		await sleep(1000)
		await mute(multimediaDefault)
		console.log(`Mute`, multimediaDefault)
		await sleep(1000)
		await unmute(multimediaDefault)
		console.log(`Unmute`, multimediaDefault)
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
