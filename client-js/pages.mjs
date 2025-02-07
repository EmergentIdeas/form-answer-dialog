import tri from 'tripartite';
import {testForm} from "../views/load-browser-views.js"
import FormAnswerDialog from "../client-lib/form-answer-dialog.mjs"
import InfoDialog from "../client-lib/info-dialog.mjs"

let formButton = document.getElementById('form-dialog-button')
if(formButton) {
	formButton.addEventListener('click', async () => {
		let dialog = new FormAnswerDialog({
			title: 'A form dialog'
			, body: testForm
			, data: {
				name: 'my name'
				, sex: 'male'
				, bio: 'He is awesome'
				, newsletter: 'on'
				, pets: 'cats'
			}
		})

		let data = await dialog.open()

		if(!data) {
			console.log('Dialog was canceled.')
		}
		else {
			console.log('The data is: \n' + JSON.stringify(data, null, '\t'))
		}
	})
}

let infoButton = document.getElementById('info-dialog-button')
if(infoButton) {
	infoButton.addEventListener('click', async () => {
		let dialog = new InfoDialog({
			title: 'We have info!'
			, body: 'This is the information.'

		})
		await dialog.open()

	})
}