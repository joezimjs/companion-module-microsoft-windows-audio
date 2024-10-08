const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const { listDevices } = require('./lib/main.js')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')

class ModuleInstance extends InstanceBase {
	devices = []
	deviceChoices = []
	deviceChoicesWithCurrent = []

	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.log('debug', JSON.stringify(config))
		this.updateStatus(InstanceStatus.Ok)

		await this.getAudioDeviceState()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
	}

	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 4,
				regex: Regex.PORT,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	async getAudioDeviceState() {
		this.devices = await listDevices()
		this.deviceChoices = this.devices.map((d) => ({ id: d.id, label: `${d.name} (${d.type})` }))
		this.deviceChoicesWithCurrent = [
			{ id: 'default_output', label: 'Default Output Device' },
			{ id: 'default_input', label: 'Default input Device' },
		].concat(this.deviceChoices)

		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
