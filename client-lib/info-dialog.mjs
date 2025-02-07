import Dialog from 'ei-dialog'

export default class InfoDialog extends Dialog {
	constructor(options) {
		super(Object.assign({}, options,
			{
				on: {
					'.btn-ok': () => {
						this.resolve()
						return true
					},
					'.mask': () => {
						this.resolve()
						return true
					},
					'.btn-cancel': () => {
						this.resolve()
						return true
					}
				}
				, buttons: [
					{
						classes: 'btn btn-primary btn-ok',
						label: 'OK'
					}
				]
			}
		))
	}

	async open() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject
		})
		super.open()

		return this.promise
	}

}