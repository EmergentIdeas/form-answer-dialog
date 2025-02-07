# Form Answer Dialog

Presents a dialog (normally with a form) and resolves with the form information.

## Install

```bash
npm install @webhandle/form-answer-dailog
```

## Usage

```js
import FormAnswerDialog from '@webhandle/form-answer-dialog'

let dialog = new FormAnswerDialog({
	title: 'A form dialog'
	, body: stringLiteralOrFunctionToGenerateBody
	, data: {
		name: 'my name'
		, address: '123 Main St.'
	}
})

let userData = await dialog.open()

```

The code above opens a new dialog with two buttons on the bottom (OK and Cancel). If the
user cancels the dialog, `userData` will be null. If they click 'OK' then it will be an
object with the form data.

The `body` can be any string which should be used for the dialog's content or any function
which when called will produce the dialog's content. `FormAnswerDialog` will attempt to set
the values of the form elements according to `data`.


### Additional Usage

If you only want to show information, the code below will open a dialog with just an
'OK' button.


```js
import InfoDialog from '@webhandle/form-answer-dialog/client-lib/info-dialog.mjs'

let dialog = new InfoDialog({
	title: 'We have info!'
	, body: 'This is the information.'

})
await dialog.open()
```
