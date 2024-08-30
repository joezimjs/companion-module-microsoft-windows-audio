module.exports = async function (self) {
	self.setVariableDefinitions([
		{ variableId: 'variable1', name: 'My first variable' },
		{ variableId: 'variable2', name: 'My second variable' },
		{ variableId: 'variable3', name: 'Another variable' },
	])
}

/*
X = 1-N
outputX_id
outputX_name
outputX_volume
outputX_isMuted
outputX_isDefaultForMultimedia
outputX_isDefaultForCommunications

inputX_id
inputX_name
inputX_volume
inputX_isMuted
inputX_isDefaultForMultimedia
inputX_isDefaultForCommunications
*/
