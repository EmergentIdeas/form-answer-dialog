/******/ var __webpack_modules__ = ({

/***/ "./node_modules/ei-dialog/dialog.js":
/*!******************************************!*\
  !*** ./node_modules/ei-dialog/dialog.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

let dialogStyles = __webpack_require__(/*! ./dialog-styles.txt */ "./node_modules/ei-dialog/dialog-styles.txt")
let sequence = 0

// If we're loading via a module system or packed by webpack, we may
// have a module here instead of the value. We need to check for default
// and use that if it exists.
if(typeof dialogStyles !== 'string' && dialogStyles.default) {
	dialogStyles = dialogStyles.default	
}


/**
 * A button definition.
 * @typedef {Object} Button
 * @property {string} classes Classes to add to the button
 * @property {string} label Text shown to the user
 */



/**
 * A whole page dialog. 
 * @param {object} options 
 * @param {string,function} options.body The contents of the body section. This can be a string,
 * in which case it will just be inserted into the body. It can be a function, in which case
 * it is expected to return a string (which will be inserted) or a Promise, which should resolve to
 * a string, which will be inserted. However, this function is passed the body element and dialog
 * object as arguments, so it can also modify content directory and return an empty string.
 * @param {object} options.on An object which the key is the selector and the value is a funtion
 * which is called when the object with that selector is clicked. If the function returns false the
 * dialog will not be closed. If it returns a Promise, the promise will be resolved and if the resolved
 * value is false, it will not be closed. Any other return condition will result in the dialog being
 * closed.
 * @param {Button[]} options.buttons The buttons that will show up in the footer of the dialog. If buttons are not
 * specified, "OK" and "Cancel" buttons will be added.
 * @param {string} options.title The title of the dialog
 * @param {string} options.dialogFrameClass An additional string inserted into the class attribute for
 * specific styling of specific types of dialog boxes.
 * @param {function} options.afterOpen A function which is called after open with the body element and dialog object
 * as arguments.
 */
var Dialog = function(options) {
	this.id = "dialog" + (new Date().getTime()) + (sequence++)
	Object.assign(this, options)
	if(!this.on) {
		this.on = {}
	}
	if(!this.on['.btn-cancel']) {
		this.on['.btn-cancel'] = function() {
		}
	}
	if(!this.on['.btn-close']) {
		this.on['.btn-close'] = function() {
		}
	}
	
	if(!options.buttons) {
		this.buttons = [
			{
				classes: 'btn btn-primary btn-ok',
				label: 'OK'
			},
			{
				classes: 'btn btn-cancel',
				label: 'Cancel'
			}
		]
	}
	
	this.body = options.body
}

Dialog.prototype.getBodySelector = function() {
	return '#' + this.id + ' .body'
}

Dialog.prototype.getFrameSelector = function() {
	return '#' + this.id 
}

Dialog.prototype.addStylesIfNeeded = function() {
	if(!document.querySelector('#dialog-frame-styles')) {
		document.querySelector('head').insertAdjacentHTML('beforeend', 
			'<style type="text/css" id="dialog-frame-styles">' +
			dialogStyles + 
			'</style>')
	}
}

Dialog.prototype.renderButton = function(button) {
	return `<button class="${button.classes}" type="button">${button.label}</button>`
}

Dialog.prototype.generateFrame = function() {
	let buttons = this.buttons.map(this.renderButton).join('')
	
	return `
<div class="dialog-frame ${this.dialogFrameClass || ''}" id="${this.id}" >
	<div class="mask">
	</div>
	<div class="the-dialog">
		<div class="close btn-close">&times;</div>
		<div class="head">
			${this.title}
		</div>
		<div class="body">
		</div>
		<div class="foot">
			${buttons}
		</div>
	</div>
</div>
	`
}

Dialog.prototype.open = function() {
	let self = this
	this.addStylesIfNeeded()
	document.querySelector('body').insertAdjacentHTML('beforeend', this.generateFrame())
	
	let bodySelector = this.getBodySelector()
	let frameSelector = this.getFrameSelector()
	
	let bodyContent
	let bodyElement = document.querySelector(bodySelector)
	let frameElement = document.querySelector(frameSelector)

	
	
	frameElement.addEventListener('click', function(evt) {
		for(let selector in self.on) {
			let target = frameElement.querySelector(selector)
			if(evt.target == target) {
				let result = self.on[selector]()
				if(typeof result === 'boolean') {
					if(result) {
						self.close()
					}
				}
				else if(typeof Promise === 'function' && result instanceof Promise) {
					result.then(function(result) {
						if(result !== false) {
							self.close()
						}
					})
				}
				else {
					self.close()
				}
				
				break
			}
		}
	})
	
	function afterOpenResizeSetup() {
		setTimeout(function() {
			let head = document.querySelector(frameSelector + ' .head').clientHeight 
			let foot = document.querySelector(frameSelector + ' .foot').clientHeight
			let topAndBottom = head + foot

			bodyElement.style.maxHeight = 'calc(90vh - ' + topAndBottom + 'px)'
			frameElement.classList.add('open')
			
			if(self.afterOpen) {
				self.afterOpen(bodyElement, self)
			}
		})
	}
	
	if(typeof this.body === 'function') {
		bodyContent = this.body(bodyElement, this)
	}
	else if(typeof this.body == 'string') {
		bodyContent = this.body
	}

	if(typeof bodyContent === 'string') {
		bodyElement.insertAdjacentHTML('beforeend', bodyContent)
		afterOpenResizeSetup()
	}
	else if(typeof Promise === 'function' && bodyContent instanceof Promise) {
		bodyContent.then(function(content) {
			bodyElement.insertAdjacentHTML('beforeend', content)
			afterOpenResizeSetup()
		})
	}
	

	return this
}

Dialog.prototype.close = function() {
	let frame = document.querySelector(this.getFrameSelector())
	frame.remove()
	return this
}

module.exports = Dialog



/***/ }),

/***/ "./node_modules/form-value-injector/form-value-injector.js":
/*!*****************************************************************!*\
  !*** ./node_modules/form-value-injector/form-value-injector.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const inputInjector = __webpack_require__(/*! input-value-injector */ "./node_modules/input-value-injector/input-value-injector.js")
const textareaInjector = __webpack_require__(/*! textarea-value-injector */ "./node_modules/textarea-value-injector/textarea-value-injector.js")
const selectInjector = __webpack_require__(/*! select-value-injector */ "./node_modules/select-value-injector/select-value-injector.js")

let injectValues = function(text, values) {
	
	let result = inputInjector(text, values)
	result = textareaInjector(result, values)
	result = selectInjector(result, values)
	
	
	return result
}

module.exports = injectValues

/***/ }),

/***/ "./node_modules/input-value-injector/input-value-injector.js":
/*!*******************************************************************!*\
  !*** ./node_modules/input-value-injector/input-value-injector.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
	evalFunction
	, attributeEscapes
	, fetchValue
	, isOrContains
	, escForRegex
	, escapeAttributeValue
} = __webpack_require__(/*! value-injector-common */ "./node_modules/value-injector-common/value-injector-common.js")


function makeDate(date) {
	if(date instanceof Date) {
		return date
	}
	return new Date(date)
}

function pad(value, len, pad) {
	value = '' + value
	while(value.length < len) {
		value = pad + value
	}
	return value
}

function formatDate(date) {
	date = makeDate(date)
	let year = date.getFullYear()
	let month = pad(date.getMonth() + 1, 2, '0')
	let day = pad(date.getDate(), 2, '0')

	return `${year}-${month}-${day}`
}
function formatTime(date) {
	date = makeDate(date)
	let hour = pad(date.getHours(), 2, '0')
	let minute = pad(date.getMinutes(), 2, '0')
	let sec = pad(date.getSeconds(), 2, '0')
	let milli = pad(date.getMilliseconds(), 4, '0')
	return `${hour}:${minute}`
}

function formatCombined(date) {
	return formatDate(date) + 'T' + formatTime(date)
}

let nameAttrPattern = /\sname=["'](.*?)["']/i
let valAttrPattern = /\svalue=["'](.*?)["']/i
let typeAttrPattern = /\stype=["'](.*?)["']/i
let inputPattern = /(<input.*?>)/i
let checkedAttrPattern = /\schecked(=["'](.*?)["'])?/i


let injectValues = function(text, values) {
	
	let result = ''
	
	text.split(inputPattern).forEach((item) => {
		if(item.toLowerCase().indexOf('<input') == 0) {
			let r = item.match(nameAttrPattern)
			let name = r ? r[1] : null
			
			r = item.match(typeAttrPattern)
			let type = (r ? r[1] : 'text').toLowerCase()
			
			
			if(type === 'text' || type === 'hidden' || type === 'date' || type === 'time' || type === 'datetime-local'
			|| type === 'search' || type === 'email' || type === 'number' || type === 'tel' || type === 'url' 
			|| type === 'month' || type === 'week' || type === 'color' || type === 'week'
			) {
				r = item.match(valAttrPattern)
				let value = r ? r[1] : null
				
				let newVal = fetchValue(values, name)
				if(type === 'date') {
					if(newVal) {
						let orgValue = newVal
						try {
							newVal = formatDate(newVal)
						} catch(e) {
							newVal = orgValue
						}
						if(newVal == 'Invalid date') {
							newVal = orgValue
						}
					}
				}
				else if(type === 'time') {
					if(newVal) {
						let orgValue = newVal
						try {
							newVal = formatTime(newVal)
						} catch(e) {
							newVal = orgValue
						}
						if(newVal == 'Invalid date') {
							newVal = orgValue
						}
					}
				}
				else if(type === 'datetime-local') {
					if(newVal) {
						let orgValue = newVal
						try {
							newVal = formatCombined(newValue)
						} catch(e) {}
						if(newVal == 'Invalid date') {
							newVal = orgValue
						}
					}
				}
				
				let replacementText
				if(newVal === null || newVal === undefined) {
					replacementText = ''
				}
				else {
					newVal = escapeAttributeValue(newVal)
					replacementText = ' value="' + newVal + '"'
				}


				if(value != null) {
					if(newVal != null) {
						item = item.replace(valAttrPattern, replacementText)
					}
				}
				else {
					if(item.endsWith('/>')) {
						item = item.slice(0, -2)
					}
					else {
						item = item.slice(0, -1)
					}
					item = item + replacementText + ' />'
				}
				
				result += item
			}
			else if(type === 'radio') {
				r = item.match(valAttrPattern)
				let value = r ? r[1] : null
				let newVal = fetchValue(values, name)
				
				if(!value) {
					// We don't have a specific value, so we'll say it's checked
					// if the new value is truthy.
					
					if(!newVal || newVal == 'false' || newVal == 'off') {
						item = item.replace(checkedAttrPattern, '')
					}
					else {
						// so we should have it checked
						if(!item.match(checkedAttrPattern)) {
							if(item.endsWith('/>')) {
								item = item.slice(0, -2)
							}
							else {
								item = item.slice(0, -1)
							}
							item = item + ' checked="checked" />'  
						}
						// if the above were not true, it's because it's already checked
					}
				}
				else {
					if(!newVal || newVal != value) {
						// if the new value is blank or does not equal the value in
						// in the value attribute, we'll make it unchecked
						item = item.replace(checkedAttrPattern, '')
					}
					else {
						// so we should have it checked
						if(!item.match(checkedAttrPattern)) {
							if(item.endsWith('/>')) {
								item = item.slice(0, -2)
							}
							else {
								item = item.slice(0, -1)
							}
							item = item + ' checked="checked" />'  
						}
						// if the above were not true, it's because it's already checked
					}
				}
				
				result += item
			}
			else if(type === 'checkbox') {
				r = item.match(valAttrPattern)
				let value = r ? r[1] : null
				let newVal = fetchValue(values, name)
				
				if(!value) {
					// We don't have a specific value, so we'll say it's checked
					// if the new value is truthy.
					
					if(!newVal || isOrContains('false', newVal) || isOrContains('off', newVal)) {
						item = item.replace(checkedAttrPattern, '')
					}
					else {
						// so we should have it checked
						if(!item.match(checkedAttrPattern)) {
							if(item.endsWith('/>')) {
								item = item.slice(0, -2)
							}
							else {
								item = item.slice(0, -1)
							}
							item = item + ' checked="checked" />'  
						}
						// if the above were not true, it's because it's already checked
					}
				}
				else {
					if(!newVal || !isOrContains(value, newVal)) {
						// if the new value is blank or does not equal the value in
						// in the value attribute, we'll make it unchecked
						item = item.replace(checkedAttrPattern, '')
					}
					else {
						// so we should have it checked
						if(!item.match(checkedAttrPattern)) {
							if(item.endsWith('/>')) {
								item = item.slice(0, -2)
							}
							else {
								item = item.slice(0, -1)
							}
							item = item + ' checked="checked" />'  
						}
						// if the above were not true, it's because it's already checked
					}
				}
				
				result += item
			}
			else {
				result += item
			}
			
		}
		else {
			result += item
		}
	})
	
	return result
}


module.exports = injectValues


/***/ }),

/***/ "./node_modules/ei-dialog/dialog-styles.txt":
/*!**************************************************!*\
  !*** ./node_modules/ei-dialog/dialog-styles.txt ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".dialog-frame {\n\tposition: fixed;\n\ttop: 0;\n\tbottom: 0;\n\tleft: 0;\n\tright: 0;\n\tz-index: 11000;\n\topacity: 0;\n\ttransition: opacity .3s;\n\toverflow: hidden;\n\t\n\t\n\tdisplay: grid;\n\tjustify-content: center;\n\talign-content: center;\n\tpadding: 5vh 5%;\n}\n\n.dialog-frame.open {\n\topacity: 1;\n}\n\n.dialog-frame .mask {\n\tposition: absolute;\n\tbox-sizing: border-box;\n\ttop: 0;\n\tbottom: 0;\n\tleft: 0;\n\tright: 0;\n\tbackground-color: #333333;\n\topacity: .7;\n\theight: 100%;\n\tz-index: 0;\n\t\n}\n\n\n.dialog-frame .the-dialog {\n\tposition: relative;\n\tdisplay: inline-block;\n\tz-index: 1;\n\tborder-radius: 5px;\n\tbackground-color: white;\n\toverflow: hidden;\n\ttransform: scale(.84);\n\ttransition: transform 0.262s cubic-bezier(.77,-1.72,.08,1);\n}\n\n.dialog-frame.open .the-dialog {\n\ttransform: scale(1);\n}\n\n.dialog-frame .the-dialog .close {\n\tposition: absolute;\n\ttop: 0px;\n\tright: 0px;\n\tpadding: 8px 10px 10px 10px;\n\tcursor: pointer;\n}\n\n.dialog-frame .the-dialog .head {\n\tborder-bottom: solid #aaaaaa 1px;\n\tline-height: 2em;\n\tpadding: 0 10px;\n}\n\n.dialog-frame .the-dialog .body {\n\tbox-sizing: border-box;\n\tpadding: 20px;\n\toverflow: auto;\n\tmax-height: calc(90vh - 75px);\n}\n\n.dialog-frame .the-dialog .foot {\n\tborder-top: solid #aaaaaa 1px;\n\tpadding: 10px;\n}\n\n.dialog-frame .the-dialog .foot button {\n\tmargin-right: 15px;\n}");

/***/ }),

/***/ "./node_modules/select-value-injector/select-value-injector.js":
/*!*********************************************************************!*\
  !*** ./node_modules/select-value-injector/select-value-injector.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
	evalFunction
	, attributeEscapes
	, fetchValue
	, isOrContains
	, escForRegex
	, escapeAttributeValue
} = __webpack_require__(/*! value-injector-common */ "./node_modules/value-injector-common/value-injector-common.js")



let nameAttrPattern = /\sname=["'](.*?)["']/i
let valAttrPattern = /\svalue=["'](.*?)["']/i
let typeAttrPattern = /\stype=["'](.*?)["']/i
let selectPattern = /(<select[\w\W]*?select\w*>)/im
let selectedAttrPattern = /\sselected(=["'](.*?)["'])?/i


let injectValues = function(text, values) {
	
	let result = ''
	
	text.split(selectPattern).forEach((item) => {
		if(item.toLowerCase().indexOf('<select') == 0) {
			let r = item.match(nameAttrPattern)
			let name = r ? r[1] : null
			
			let newVal = fetchValue(values, name)
			if(typeof newVal != 'undefined' && newVal !== null) {
				item = item.replace(selectedAttrPattern, '')
				let optionMatch = item.match( new RegExp('value=["\']' + escForRegex(newVal) + '["\']', 'i'))
				if(optionMatch) {
					let breakIndex = item.indexOf(optionMatch[0]) + optionMatch[0].length
					item = item.slice(0, breakIndex) + ' selected="selected" ' + item.substring(breakIndex)
				}
			}
			
			result += item
		}
		else {
			result += item
		}
	})
	
	return result
}


module.exports = injectValues


/***/ }),

/***/ "./node_modules/textarea-value-injector/textarea-value-injector.js":
/*!*************************************************************************!*\
  !*** ./node_modules/textarea-value-injector/textarea-value-injector.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
	evalFunction
	, attributeEscapes
	, fetchValue
	, isOrContains
	, escForRegex
	, escapeAttributeValue
} = __webpack_require__(/*! value-injector-common */ "./node_modules/value-injector-common/value-injector-common.js")


let nameAttrPattern = /\sname=["'](.*?)["']/i
let valAttrPattern = /\svalue=["'](.*?)["']/i
let typeAttrPattern = /\stype=["'](.*?)["']/i
let textareaPattern = /(<textarea[\w\W]*?textarea\w*>)/im
let selectedAttrPattern = /\sselected(=["'](.*?)["'])?/i


let injectValues = function(text, values) {
	
	let result = ''
	
	text.split(textareaPattern).forEach((item) => {
		if(item.toLowerCase().indexOf('<textarea') == 0) {
			let r = item.match(nameAttrPattern)
			let name = r ? r[1] : null
			
			if(name) {
				let newVal = fetchValue(values, name)
				if(typeof newVal != 'undefined' && newVal !== null) {
					let startTagEnd = item.indexOf('>')
					let endTagStart = item.lastIndexOf('<')
					item = item.substring(0, startTagEnd + 1) + newVal + item.substring(endTagStart)
				}
			}
			
			result += item
		}
		else {
			result += item
		}
	})
	
	return result
}


module.exports = injectValues

/***/ }),

/***/ "./node_modules/tripartite/active-element.js":
/*!***************************************************!*\
  !*** ./node_modules/tripartite/active-element.js ***!
  \***************************************************/
/***/ ((module) => {


const defaultTemplateName = 'defaultTemplate'

class ActiveElement {
	constructor(conditionalExpression, dataExpression, handlingExpression, tripartite) {
		this.conditionalExpression = conditionalExpression
		this.dataExpression = dataExpression
		this.handlingExpression = handlingExpression || defaultTemplateName
		this.tripartite = tripartite
	}
}

module.exports = ActiveElement

/***/ }),

/***/ "./node_modules/tripartite/calculate-relative-path.js":
/*!************************************************************!*\
  !*** ./node_modules/tripartite/calculate-relative-path.js ***!
  \************************************************************/
/***/ ((module) => {

var calculateRelativePath = function(parentPath, currentPath) {
	if(!parentPath) {
		return currentPath
	}
	if(!currentPath) {
		return currentPath
	}
	
	if(currentPath.indexOf('../') != 0 && currentPath.indexOf('./') != 0) {
		return currentPath
	}
	
	var pparts = parentPath.split('/')
	var cparts = currentPath.split('/')
	
	// trim any starting blank sections
	while(pparts.length && !pparts[0]) {
		pparts.shift()
	}
	while(cparts.length && !cparts[0]) {
		cparts.shift()
	}
	
	if(currentPath.indexOf('../') == 0 ) {
		while(cparts.length && cparts[0] == '..') {
			pparts.pop()
			cparts.shift()
		}
		pparts.pop()
		
		while(cparts.length) {
			pparts.push(cparts.shift())
		}
		return pparts.join('/')
	}
	if(currentPath.indexOf('./') == 0 ) {
		cparts.shift()
		pparts.pop()
		while(cparts.length) {
			pparts.push(cparts.shift())
		}
		return pparts.join('/')
	}
	
	return currentPath
}

module.exports = calculateRelativePath

/***/ }),

/***/ "./node_modules/tripartite/evaluate-in-context.js":
/*!********************************************************!*\
  !*** ./node_modules/tripartite/evaluate-in-context.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const resolveDataPath = __webpack_require__(/*! ./resolve-data-path */ "./node_modules/tripartite/resolve-data-path.js")
function evaluateInContext(context, expression, dataFunctions, globalData) {
	if (!expression) {
		return null
	}
	if (typeof expression === 'string') {
		expression = expression.trim()
	}

	if (expression === '$this' || expression === 'this') {
		return context
	}
	if (typeof context === 'object' && expression in context) {
		return context[expression]
	}
	if (expression === '""' || expression === "''") {
		return ''
	}
	let resolved = resolveDataPath(context, expression)
	if (resolved === null || resolved === undefined) {
		resolved = resolveDataPath({
			'$globals': globalData
		}, expression)
	}
	if (resolved === null || resolved === undefined) {
		resolved = _evaluateInContext.call(context, context, expression, dataFunctions, globalData)
	}
	return resolved
}

let evalFunction = new Function('additionalContexts',
	`with ({
		'$globals': additionalContexts.globalData
	}) {
		with (additionalContexts.dataFunctions) {
			with (additionalContexts.context) {
				try {
					return eval(additionalContexts.expression);
				} catch (e) {
					return null;
				}
			}
		}
	}`
)

function _evaluateInContext(context, expression, dataFunctions, globalData) {
	dataFunctions = dataFunctions || {}
	globalData = globalData || {}


	let result = evalFunction.call(this, {
		globalData: globalData
		, dataFunctions: dataFunctions
		, context: context
		, expression: expression
	})
	return result
}

module.exports = evaluateInContext

/***/ }),

/***/ "./node_modules/tripartite/execution-context.js":
/*!******************************************************!*\
  !*** ./node_modules/tripartite/execution-context.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


let ActiveElement = __webpack_require__(/*! ./active-element */ "./node_modules/tripartite/active-element.js")
var calculateRelativePath = __webpack_require__(/*! ./calculate-relative-path */ "./node_modules/tripartite/calculate-relative-path.js")
let evaluateInContext = __webpack_require__(/*! ./evaluate-in-context */ "./node_modules/tripartite/evaluate-in-context.js")

class ExecutionContext {
	/**
	 * 
	 * @param {Tripartite} tripartite 
	 * @param {function} template 
	 * @param {stream} [destination]
	 */
	constructor(tripartite, template, data = {}, destination = '', dataFunctions = {}) {
		this.tripartite = tripartite
		this.template = template
		this.destination = destination
		this.initialData = data
		this.currentData = []
		this.dataFunctions = dataFunctions
		this.continueOnTripartiteError = true
		
		// Sometimes large pages have so many elements that we exceed
		// the maximum call depth. This happens when we have a lot of elements all being
		// rendered by the same templates. That is, there's no async callback when a template
		// is loaded, only instant callbacks.
		// The downside to doing very frequent async calls is that it takes a lot longer to
		// to get called from a setTimeout than it does to call directly. We want ot keep
		// the time between needing to do that reasonably long. Unfortunately, there's no
		// easy/fast way to detect the call stack depth, so we rely on this proxy.
		this.callCount = 0
		this.callDepthLimit = 1000
	}

	/**
	 * 
	 * @param {function} [callback] called when done
	 * @returns Returns the string of stream as the result of the operation
	 */
	run(callback) {
		let ourCallback
		if (callback) {
			ourCallback = () => {
				callback(null, this.destination)
			}
		}

		this._run(this.template, this.initialData, ourCallback)

		return this.destination
	}

	_resolveHandlingExpression(template, handlingExpression, data) {
		if (!handlingExpression) {
			handlingExpression = defaultTemplateName
		}
		if (handlingExpression.charAt(0) == '$') {
			// Indicates the handling espression is not a literal template name but is a string which should
			// be evaluated to determine the template name
			handlingExpression = evaluateInContext(data, handlingExpression.substring(1), this.dataFunctions, this.initialData)
		}
		// resolve relative template paths
		if (handlingExpression.indexOf('./') == 0 || handlingExpression.indexOf('../') == 0) {
			handlingExpression = calculateRelativePath(template.templateMeta.name, handlingExpression)
		}

		return handlingExpression
	}

	_run(template, data, callback) {
		let parts = [...template.parts].reverse()
		const processParts = () => {
			
			// check to see how far down in the call stack we are. If too far down,
			// come back in the next tick.
			this.callCount++
			if(this.callCount++ > this.callDepthLimit) {
				setTimeout(()=> {
					this.callCount = 0
					processParts()
				})
				return
			}

			if (parts.length > 0) {
				let part = parts.pop()
				if (typeof part === 'string') {
					this.output(part)
					processParts()
				}
				else if (part instanceof ActiveElement) {
					let conditional = part.conditionalExpression || part.dataExpression
					let conditionalResult = false
					let resultData
					if (conditional == null || conditional == undefined || conditional === '') {
						// Because if they didn't specify a condition or data, they probably 
						// just want the template to be run as is
						conditionalResult = true
					}
					else {
						if(part.conditionalExpression) {
							let result = evaluateInContext(data, part.conditionalExpression, this.dataFunctions, this.initialData)
							if (result) {
								conditionalResult = true
							}
						}
						else {
							// This means we're evaluating the data expression to see if we should run the template
							resultData = evaluateInContext(data, part.dataExpression, this.dataFunctions, this.initialData)
							if(resultData === null || resultData === undefined) {
								conditionalResult = false
							}
							else if (typeof resultData === 'number') {
								// if the result is a number, any number, we want to output it
								// unless the number is from the conditional expression, in which
								// case we want to evaluate it as truthy
								conditionalResult = true
							}
							else if(Array.isArray(resultData) && resultData.length > 0) {
								conditionalResult = true
							}
							else if(resultData) {
								conditionalResult = true
							}
						}
					}


					if (conditionalResult) {
						if (part.dataExpression && resultData === undefined) {
							resultData = evaluateInContext(data, part.dataExpression, this.dataFunctions, this.initialData)
						}
						if((resultData === null || resultData === undefined) && !part.dataExpression) {
							resultData = data
						}

						let handlingExpression = this._resolveHandlingExpression(template, part.handlingExpression, data)
						let handlingTemplate
						let children = (Array.isArray(resultData) ? [...resultData] : [resultData]).reverse()
						const applyTemplate = () => {
							if (children.length > 0) {
								let child = children.pop()
								this._run(handlingTemplate, child, () => {
									applyTemplate()
								})
							}
							else {
								processParts()
							}
						}

						if(handlingExpression in this.tripartite.templates) {
							handlingTemplate = this.tripartite.getTemplate(handlingExpression)
							if (handlingTemplate) {
								applyTemplate()
							}
							else {
								// the template has been loaded before but is empty
								if (this.continueOnTripartiteError) {
									processParts()
								}
							}
							
						}
						else {
							this.tripartite.loadTemplate(handlingExpression, (template) => {
								if (!template) {
									let msg = 'Could not load template: ' + handlingExpression
									console.error(msg)
									if (this.continueOnTripartiteError) {
										processParts()
									}
									else {
										let err = new Error(msg)
										if (callback) {
											callback(err)
										}
										else {
											throw err
										}
									}
								}
								else {
									handlingTemplate = template
									applyTemplate()
								}
							})
						}
					}
					else {
						processParts()
					}
				}
				else if (typeof part === 'function') {
					if(part.write) {
						part.write(data, this.destination, () => {
							processParts()
						})

					}
					else {
						this.output(part(data))
						processParts()
					}
				}

			}
			else {
				if (callback) {
					callback()
				}
			}
		}

		processParts()
	}

	/**
	 * 
	 * @param {string} value 
	 */
	output(value) {
		if(value === null || value === undefined) {
			return
		}
		if (typeof this.destination === 'string') {
			this.destination += value
		}
		else if (this.destination.write) {
			this.destination.write(value)
		}
	}
}


module.exports = ExecutionContext

/***/ }),

/***/ "./node_modules/tripartite/resolve-data-path.js":
/*!******************************************************!*\
  !*** ./node_modules/tripartite/resolve-data-path.js ***!
  \******************************************************/
/***/ ((module) => {

/*
function resolveDataPath(data, path) {
	if(data === null || data === undefined) {
		return data
	}
	let parts
	if(typeof path === 'string') {
		parts = path.trim().split('.')
	}
	else if(Array.isArray(path)) {
		parts = path
	}
	
	let name = parts.shift()
	if(name.indexOf(' ') > -1) {
		// there's a space, which means it's really unlikely it's a property
		return null
	}
	let child
	if(name === 'this' || name === '$this') {
		child = data
	}
	else if(typeof data === 'object') {
		if(name in data) {
			child = data[name]
		}
	}
	if(parts.length > 0) {
		return resolveDataPath(child, parts)
	}
	else {
		return child
	}
} */
function resolveDataPath(data, path) {
	try {
		if (data === null || data === undefined) {
			return data
		}
		let parts
		if (typeof path === 'string') {
			parts = path.trim().split('.')
		}
		else if (Array.isArray(path)) {
			parts = path
		}

		while (parts.length > 0) {
			let name = parts.shift()
			if (name.indexOf(' ') > -1) {
				// there's a space, which means it's really unlikely it's a property
				return null
			}
			let child
			if (name === 'this' || name === '$this') {
				child = data
			}
			else if (typeof data === 'object') {
				if (name in data) {
					child = data[name]
				}
			}
			if (parts.length == 0) {
				return child
			}
			if (child === null || child === undefined) {
				return null
			}
			data = child
		}
	}
	catch (e) {
		return null
	}
}

module.exports = resolveDataPath

/***/ }),

/***/ "./node_modules/tripartite/tripartite.js":
/*!***********************************************!*\
  !*** ./node_modules/tripartite/tripartite.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {




if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	}
}


function isStream(stream) {
	return stream !== null
		&& typeof stream === 'object'
		&& typeof stream.pipe === 'function';
}


function isTemplate(obj) {
	if (!obj) {
		return false
	}
	if (typeof obj !== 'function') {
		return false
	}
	if (!obj.write) {
		return false
	}
	if (!obj.parts) {
		return false
	}
	if (!obj.templateMeta) {
		return false
	}

	return true
}

let ExecutionContext = __webpack_require__(/*! ./execution-context */ "./node_modules/tripartite/execution-context.js")
let ActiveElement = __webpack_require__(/*! ./active-element */ "./node_modules/tripartite/active-element.js")


class Tripartite {
	constructor(options = {}) {
		this.templates = {
			defaultTemplate: this._makeTemplate(function (thedata) {
				return '' + thedata;
			})
		}
		let { constants = {
			templateBoundary: '__',
			templateNameBoundary: '##'
		} } = options
		this.constants = constants

		// This object (if set) will receive the template functions parsed from a script
		// I want to be able to call my templates as global functions, so I've set it
		// to be the window object
		this.secondaryTemplateFunctionObject = options.secondaryTemplateFunctionObject

		this.loaders = options.loaders || []

		this.dataFunctions = options.dataFunction || {}
	}

	_makeTemplate(transformationFunction) {
		if (isTemplate(transformationFunction)) {
			return transformationFunction
		}
		let tri = this
		let f = function (thedata) {
			let stream = null
			let options = null
			let callback = null
			for (let i = 1; i < arguments.length; i++) {
				let arg = arguments[i]
				if (isStream(arg)) {
					stream = arg
				}
				else if(typeof arg === 'function') {
					callback = arg
				}
				else if(typeof arg === 'object') {
					options = arg
				}
			}

			return f.write(thedata, stream, callback, options)
		}
		f.write = function (thedata, stream, callback, options = {}) {
			if(transformationFunction && transformationFunction.write) {
				// if it's not a template, but has a write method, invoke the right method directly
				return transformationFunction.write.apply(transformationFunction, arguments)
			}
			else {
				let dest = stream || ''

				let context = new ExecutionContext(tri, f, thedata, dest, tri.dataFunctions)
				if (options && 'continueOnTripartiteError' in options) {
					context.continueOnTripartiteError = options.continueOnTripartiteError
				}

				return context.run(callback)
			}
		}
		f.parts = []
		if (transformationFunction && typeof transformationFunction === 'function') {
			f.parts.push(transformationFunction)
		}
		f.templateMeta = {}
		return f
	}

	addTemplate(name, template) {
		if (typeof template === 'string') {
			template = this.parseTemplate(template);
		}
		else if (typeof template === 'function') {
			template = this._makeTemplate(template)
		}

		this.templates[name] = template;
		template.templateMeta = template.templateMeta || {}
		template.templateMeta.name = name
		return template;
	}

	createBlank() {
		return new Tripartite()
	}

	getTemplate(name) {
		return this.templates[name]
	}

	loadTemplate(name, callback) {
		if (name in this.templates) {
			callback(this.templates[name])
		}
		else {
			let tri = this
			let count = this.loaders.length
			let done = false

			if (count == 0) {
				tri.templates[name] = null
				callback(tri.getTemplate(name))
			}
			else {
				this.loaders.forEach(loader => {
					if (done) {
						return
					}
					loader(name, template => {
						if (done) {
							return
						}
						count--
						if (template) {
							done = true
							tri.addTemplate(name, template)
						}
						else if (count == 0) {
							done = true
							tri.templates[name] = null
						}
						if (done) {
							callback(tri.getTemplate(name))
						}
					})
				})
			}
		}
	}
	parseTemplateScript(tx) {
		var tks = this.tokenizeTemplateScript(tx);
		/* current template name */
		var ctn = null;
		for (var i = 0; i < tks.length; i++) {
			var token = tks[i];
			if (token.active) {
				ctn = token.content;
			}
			else {
				if (ctn) {
					var template = this.addTemplate(ctn, this.stripTemplateWhitespace(token.content));
					if (this.secondaryTemplateFunctionObject) {
						this.secondaryTemplateFunctionObject[ctn] = template;
					}
					ctn = null;
				}
			}
		}
	}

	stripTemplateWhitespace(txt) {
		var i = txt.indexOf('\n');
		if (i > -1 && txt.substring(0, i).trim() == '') {
			txt = txt.substring(i + 1);
		}
		i = txt.lastIndexOf('\n');
		if (i > -1 && txt.substring(i).trim() == '') {
			txt = txt.substring(0, i);
		}
		return txt;
	}

	/* simple template */
	_createActiveElement(/* conditional expression */ cd, data, /* handling expression */ hd, tripartite, templateMeta) {
		let el = new ActiveElement(cd, data, hd, tripartite);
		el.templateMeta = templateMeta
		return el
	}
	pt(tx) {
		return this.parseTemplate(tx)
	}
	/* parse template */
	parseTemplate(tx) {
		var tks = this.tokenizeTemplate(tx);
		let t = this._makeTemplate()
		var templateMeta = t.templateMeta

		for (let tk of tks) {
			if (tk.active) {
				t.parts.push(this.tokenizeActivePart(tk.content, templateMeta));
			}
			else if (tk.content) {
				t.parts.push(tk.content);
			}
		}

		return t
	}

	tokenizeActivePart(tx, templateMeta) {
		var con = null;
		var dat = null;
		var han = null;

		/* condition index */
		var ci = tx.indexOf('??');
		if (ci > -1) {
			con = tx.substring(0, ci);
			ci += 2;
		}
		else {
			ci = 0;
		}

		/* handler index */
		var hi = tx.indexOf('::');
		if (hi > -1) {
			dat = tx.substring(ci, hi);
			han = tx.substring(hi + 2);
		}
		else {
			dat = tx.substring(ci);
		}
		return this._createActiveElement(con, dat, han, this, templateMeta);
	}

	tokenizeTemplate(tx) {
		return this.tokenizeActiveAndInactiveBlocks(tx, this.constants.templateBoundary);
	}


	/** tokenize template script */
	tokenizeTemplateScript(tx) {
		return this.tokenizeActiveAndInactiveBlocks(tx, this.constants.templateNameBoundary);
	}

	/* tokenize active and inactive blocks */
	tokenizeActiveAndInactiveBlocks(text, /*Active Region Boundary */ boundary) {
		/* whole length */
		let length = text.length

		/* current position */
		let position = 0

		/* are we in an active region */
		let act = false

		let tokens = []

		while (position < length) {
			let i = text.indexOf(boundary, position);
			if (i == -1) {
				i = length;
			}
			var tk = { active: act, content: text.substring(position, i) };
			tokens.push(tk);
			position = i + boundary.length;
			act = !act;
		}

		return tokens;
	}

}
var tripartiteInstance = new Tripartite()

if (typeof window != 'undefined') {
	tripartiteInstance.secondaryTemplateFunctionObject = window
}


if (true) {
	module.exports = tripartiteInstance
}
else {}

if (typeof __webpack_require__.g != 'undefined') {
	if (!__webpack_require__.g.Tripartite) {
		__webpack_require__.g.Tripartite = Tripartite
	}
	if (!__webpack_require__.g.tripartite) {
		__webpack_require__.g.tripartite = tripartiteInstance
	}
}



/***/ }),

/***/ "./views/test-form.tri":
/*!*****************************!*\
  !*** ./views/test-form.tri ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var tri = __webpack_require__(/*! tripartite */ "./node_modules/tripartite/tripartite.js"); var t = "<label> Name\n\t<br>\n\t<input name=\"name\" type=\"text\" \/>\n<\/label>\n<br>\n<label> Sex\n\t<br>\n\t<select name=\"sex\">\n\t\t<option value=\"\">-- please choose --<\/option>\n\t\t<option value=\"male\">male<\/option>\n\t\t<option value=\"female\">female<\/option>\n\t<\/select>\n<\/label>\n<br>\n<label> Bio\n\t<br>\n\t<textarea name=\"bio\"><\/textarea>\n<\/label>\n<br>\n<div> Newsletter\n\t<label>\n\t\t<input name=\"newsletter\" type=\"checkbox\" \/>\n\t<\/label>\n<\/div>\n<br>\n<div> Pet\n\t<br>\n\t<label>\n\t\t<input name=\"pets\" type=\"radio\" value=\"cats\" \/> Cats\n\t<\/label>\n\t<br>\n\t<label>\n\t\t<input name=\"pets\" type=\"radio\" value=\"dogs\" \/> Dogs\n\t<\/label>\n<\/div>"; 
module.exports = tri.addTemplate("test-form", t); 

/***/ }),

/***/ "./node_modules/value-injector-common/value-injector-common.js":
/*!*********************************************************************!*\
  !*** ./node_modules/value-injector-common/value-injector-common.js ***!
  \*********************************************************************/
/***/ ((module) => {


let attributeEscapes = {
	'&': '&amp;'
	, '"': '&quot;'
	, '<': '&lt;'
}

let evalFunction = new Function('data',
	`with (data.context) {
		try {
			return eval(data.expression);
		} catch (e) {
			return null;
		}
	}`
)

function fetchValue(obj, path) {
	if(typeof obj === 'null' || typeof obj === 'undefined') {
		return null
	}
	return evalFunction.call(this, {
		context: obj
		, expression: path
	})
}


function isOrContains(target, possible) {
	if(Array.isArray(possible)) {
		return possible.includes(target)
	}
	else {
		return target == possible
	}
}

function escForRegex(val) {
	if(val && val.replace) {
		return val.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
	}
	else {
		return val;
	}
}

function escapeAttributeValue(attr) {
	if(attr === null || attr === undefined) {
		attr = ''
	}
	if(typeof attr !== 'string') {
		attr = '' + attr
	}
	for(let [key, value] of Object.entries(attributeEscapes)) {
		attr = attr.split(key).join(value)
	}
	return attr
}


module.exports = {
	evalFunction
	, attributeEscapes
	, fetchValue
	, isOrContains
	, escForRegex
	, escapeAttributeValue
}


/***/ }),

/***/ "./client-lib/form-answer-dialog.mjs":
/*!*******************************************!*\
  !*** ./client-lib/form-answer-dialog.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FormAnswerDialog)
/* harmony export */ });
/* harmony import */ var ei_dialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ei-dialog */ "./node_modules/ei-dialog/dialog.js");
/* harmony import */ var form_value_injector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! form-value-injector */ "./node_modules/form-value-injector/form-value-injector.js");
/* harmony import */ var _webhandle_gather_form_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @webhandle/gather-form-data */ "./node_modules/@webhandle/gather-form-data/gather-form-data.mjs");





class FormAnswerDialog extends ei_dialog__WEBPACK_IMPORTED_MODULE_0__ {
	/**
	 * 
	 * @param {Object} options Properties to create the dialog box. In addition to the properties from Dialog
	 * there those below.
	 * @param {Object} options.data The data which will be used to populate the controls in the dialog
	 */
	constructor(options) {
		super(Object.assign({}, options,
			{
				on: {
					'.btn-ok': () => {
						this.resolve(this.gatherData())
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

			}
		))
		if (this.afterOpen) {
			this.afterOpenOriginal = this.afterOpen
		}
		this.afterOpen = function (bodyElement, self) {
			if (this.data) {
				bodyElement.innerHTML = form_value_injector__WEBPACK_IMPORTED_MODULE_1__(bodyElement.innerHTML, this.data)
			}
			let firstInput = bodyElement.querySelector('input, textarea')
			if (firstInput) {
				firstInput.focus()
			}

			if (this.afterOpenOriginal) {
				this.afterOpenOriginal(bodyElement, self)
			}
		}
	}
	gatherData() {
		let dialogBody = document.querySelector(this.getBodySelector())
		return (0,_webhandle_gather_form_data__WEBPACK_IMPORTED_MODULE_2__["default"])(dialogBody)
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

/***/ }),

/***/ "./client-lib/info-dialog.mjs":
/*!************************************!*\
  !*** ./client-lib/info-dialog.mjs ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InfoDialog)
/* harmony export */ });
/* harmony import */ var ei_dialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ei-dialog */ "./node_modules/ei-dialog/dialog.js");


class InfoDialog extends ei_dialog__WEBPACK_IMPORTED_MODULE_0__ {
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

/***/ }),

/***/ "./node_modules/@webhandle/gather-form-data/gather-form-data.mjs":
/*!***********************************************************************!*\
  !*** ./node_modules/@webhandle/gather-form-data/gather-form-data.mjs ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ gatherFormData)
/* harmony export */ });
/**
 * Gathers the data from the form controls.
 * @param {HTMLElement} formBody The html element containing the controls. Probably
 * a form tag element, but it really doesn't matter.
 */
function gatherFormData(formBody) {
	let result = {}
	let controls = formBody.querySelectorAll('input, textarea, select')
	for (let control of controls) {
		if (control.type === 'checkbox') {
			if (!control.checked) {
				continue
			}
		}
		else if (control.type === 'radio') {
			if (!control.checked) {
				continue
			}
		}
		result[control.getAttribute('name')] = control.value
	}
	return result
}



/***/ }),

/***/ "./views/load-browser-views.js":
/*!*************************************!*\
  !*** ./views/load-browser-views.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   testForm: () => (/* binding */ testForm)
/* harmony export */ });
/* harmony import */ var _test_form_tri__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./test-form.tri */ "./views/test-form.tri");


let testForm = _test_form_tri__WEBPACK_IMPORTED_MODULE_0__

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/global */
/******/ (() => {
/******/ 	__webpack_require__.g = (function() {
/******/ 		if (typeof globalThis === 'object') return globalThis;
/******/ 		try {
/******/ 			return this || new Function('return this')();
/******/ 		} catch (e) {
/******/ 			if (typeof window === 'object') return window;
/******/ 		}
/******/ 	})();
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./client-js/pages.mjs ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tripartite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tripartite */ "./node_modules/tripartite/tripartite.js");
/* harmony import */ var _views_load_browser_views_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/load-browser-views.js */ "./views/load-browser-views.js");
/* harmony import */ var _client_lib_form_answer_dialog_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../client-lib/form-answer-dialog.mjs */ "./client-lib/form-answer-dialog.mjs");
/* harmony import */ var _client_lib_info_dialog_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../client-lib/info-dialog.mjs */ "./client-lib/info-dialog.mjs");





let formButton = document.getElementById('form-dialog-button')
if(formButton) {
	formButton.addEventListener('click', async () => {
		let dialog = new _client_lib_form_answer_dialog_mjs__WEBPACK_IMPORTED_MODULE_2__["default"]({
			title: 'A form dialog'
			, body: _views_load_browser_views_js__WEBPACK_IMPORTED_MODULE_1__.testForm
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
		let dialog = new _client_lib_info_dialog_mjs__WEBPACK_IMPORTED_MODULE_3__["default"]({
			title: 'We have info!'
			, body: 'This is the information.'

		})
		await dialog.open()

	})
}
})();


//# sourceMappingURL=pages.js.map