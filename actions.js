module.exports = function (self) {
	self.setActionDefinitions({
		sample_action: {
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
		},
	})
}

/*
ACTIONS:
Raise Volume
Lower Volume
Mute
Unmute
Set Volume
Set Default Device (Multimedia or Communications or both)
*/
