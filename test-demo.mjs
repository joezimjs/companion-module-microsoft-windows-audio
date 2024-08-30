import { listOutputs, listInputs, setVolume, mute, setAsDefault } from './lib/main.mjs'

async function main() {
	const outputs = await listOutputs()
	console.log('OUTPUT DEVICES')
	console.log(JSON.stringify(outputs, null, '  '))
	const inputs = await listInputs()
	console.log('INPUT DEVICES')
	console.log(JSON.stringify(inputs, null, '  '))

	const multimediaDefault = outputs.find((output) => output.isDefaultForMultimedia)

	console.log('Multi-media Default Device:', multimediaDefault)

	if (multimediaDefault) {
		const previousVolume = multimediaDefault.volume
		await setVolume(multimediaDefault, 20)
		console.log('Volume set to 20:', multimediaDefault)
		await sleep(1000)
		await setVolume(multimediaDefault, previousVolume)
		console.log(`Volume set to previous volume (${previousVolume}):`, multimediaDefault)
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
