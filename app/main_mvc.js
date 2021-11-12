class EventEmitter {
	constructor() {
		this.events = {};
		// an object of arrays containing the functions which are called when a notification signal (the object's key) is used
	}
	on(signal, listener) {
		// for adding event handler
		// if the signal is already present push a new item into it
		// if the signal is not yet present create a new array first and then push into it
		(this.events[signal] || (this.events[signal] = [])).push(listener);
		console.log('on signal:', signal)
		console.log('call: ', listener)
		return this;
	}
	emit(signal, arg) {
		// for calling the event handlers for the specified event
		//(this.events[signal] || []).slice().forEach(lsn => lsn(arg));
		(this.events[signal] || []).map(listener => listener(arg));
	}
}

class Model extends EventEmitter {

	constructor() {

		super()
		
		this.userSettings = {
			gluten: 0,
			lactose: 0,
			vegan: 0,
			fat: 0,
			glucose: 0,
			eggs: 0,
			seafood: 0,
			permanent: 0,
			diy: 0,
			laborious: 0,
			restaurant: 0,
			finishedProd: 0,
		}

		this.questions = [
			{ id: 0, key: 'fruits', text: 'Essen Sie gerne Obst?', answer: undefined, userWeight: 0, sign: undefined, 
				tags: [
					{ key: 'glucose', weightYes: 1, weightNo: 1, sign: 1, computed: 0 }, 
					{ key: 'fat', weightYes: 1, weightNo: 1, sign: 1, computed: 0 }, 
					{ key: 'vegan', weightYes: 1, weightNo: 1, sign: 1, computed: 0 },
				] 
			},
			{ id: 1, key: 'fulltime', text: 'Arbeiten Sie Vollzeit?', answer: undefined, userWeight: 0, sign: undefined,
				tags: [
					{ key: 'permanent', weightYes: 1, weightNo: 1, sign: -1, computed: 0 }, 
					{ key: 'laborious', weightYes: 1, weightNo: 1, sign: -1, computed: 0 },
				]
			},
			{ id: 2, key: 'noodles', text: 'Essen Sie gerne Nudeln?', answer: undefined, userWeight: 0, sign: undefined, 
				tags: [
					{ key: 'glucose', weightYes: 1, weightNo: 1, sign: 1, computed: 0 }, 
					{ key: 'vegan', weightYes: 1, weightNo: 1, sign: 1, computed: 0 },
				]
			},
			{ id: 3, key: 'meat', text: 'Essen Sie Fleisch?', answer: undefined, userWeight: 0, sign: undefined, 
				tags: [
					{ key: 'fat', weightYes: 1, weightNo: 1, sign: 1, computed: 0 }, 
					{ key: 'vegan', weightYes: 1, weightNo: 1, sign: -1, computed: 0 },
				]
			},
			{ id: 4, key: 'skills', text: 'Können Sie kochen?', answer: undefined, userWeight: 0, sign: undefined, 
				tags: [
					{ key: 'laborious', weightYes: 1, weightNo: 1, sign: 1, computed: 0 },
				]
			},
			{ id: 5, key: 'gluten', text: 'Haben Sie eine Unverträglichkeit / Allergie gegen Gluten?', answer: undefined, userWeight: 0, sign: -1, 
				tags: [
					{ key: 'gluten', weightYes: 99, weightNo: 1, sign: -1, computed: 0 },
				]
			},
		]

		this.diets = [
			{ key: 'weightWatchers', order: 0, tags: { gluten: 'opt', lactose: 'opt', vegan: 'opt', fat: false, glucose: 'opt', eggs: 'opt', seafood: 'opt', permanent: true, diy: 'opt', laborious: false, restaurant: true, finishedProd: false } },
			{ key: 'pineapple', order: 0, gluten: false, lactose: false, vegan: true, fat: false, glucose: true, eggs: false, seafood: false, permanent: false, diy: 'opt', laborious: false, restaurant: false, finishedProd: false },
			{ key: 'williams', order: 0, gluten: false, lactose: false, vegan: 'opt', fat: false, glucose: true, eggs: false, seafood: 'opt', permanent: true, diy: true, laborious: true, restaurant: false, finishedProd: false },
			{ key: 'edkins', order: 0, gluten: false, lactose: true, vegan: false, fat: true, glucose: false, eggs: true, seafood: true, permanent: true, diy: false, laborious: false, restaurant: true, finishedProd: false },
			{ key: 'mediterranean', order: 0, gluten: 'opt', lactose: 'opt', vegan: 'opt', fat: 'opt', glucose: 'opt', eggs: 'opt', seafood: true, permanent: true, diy: true, laborious: false, restaurant: true, finishedProd: false },
		]

		this.dietsOrder = []

	}

	updateUserSettings() {
	// V2
		// reset settings
		for (let key in this.userSettings) {
			this.userSettings[key] = 0
		}
		// retrieve settings from questions
		for (let q of this.questions) {
			for (let t of q.tags) {
				this.userSettings[t.key] += t.computed
			}
		}
		// function calls:
		this.emit('settingsUpdated', this.userSettings)
		//this.onSettingsUpdate(this.userSettings, this.dietsOrder) // update notification to controller
	}

	orderDiets() {
		for (let diet of this.diets) {
			for (let tag in diet.tags) {
				
				//console.log(`${tag}: ${diet.tags[tag]}`);
			}
		}
	}

	_createOutputString(qId) {
		
		/* let tags = this.questions[0].tags.map(item => {
			return item.key
		})

		for 
		/* for (let t of this.questions[qId].tags) {
			tagsStr += `${t.key} `
		}
		let outputString = `${tags.toString()}: ${this.questions[qId].userWeight * this.questions[qId].sign}`
		//console.log('outputString: ', outputString)
		return outputString */
	}

	updateSign(qId, inputValue) {
		let answer
		if (inputValue === "no") answer = false
		if (inputValue === "yes") answer = true
		this.questions[qId].answer = answer
		//console.log(`answer set to: ${this.questions[qId].answer}`)
		this.updateQuestion(qId)
	}

	updateWeight(qId, selectValue) {
		this.questions[qId].userWeight = selectValue
		this.updateQuestion(qId)
	}

	updateQuestion(qId) {
		
		for (let t of this.questions[qId].tags) {
			if (this.questions[qId].answer === true) {
				t.computed = t.sign * (t.weightYes + this.questions[qId].userWeight)
			}
			if (this.questions[qId].answer === false) {
				t.computed =  -1 * (t.sign * (t.weightNo + this.questions[qId].userWeight))
			}
			//console.log(`${t.key} set to: ${t.computed}`)
		}
		this.updateUserSettings()
		this.emit('questionUpdated', qId, this.questions[qId])
		//this.onQuestionUpdate(qId, this.questions[qId])
	}

	/* bindOnSettingsUpdate(callback) {
		// makes the app.controller.onSettingsUpdate method available here
		this.onSettingsUpdate = callback
	} */

	/* bindOnQuestionUpdate(callback) {
		// makes the app.controller.onSettingsUpdate method available here
		this.onQuestionUpdate = callback
	} */
}

class View extends EventEmitter {

	inputElements = []
	selectElements = []
	outputElements = []
	summaryElement;

	constructor(model) {
		super()
		this._model = model
		this.app = document.getElementById('root')
		model.on('questionUpdated', (qId) => this.updateQuestionOutput(qId))
		model.on('settingsUpdated', (userSettings) => this.updateSummaryView(userSettings))
		
	}

	/* CREATE ELEMENTS */

	createQElements(questions) {

		let qSection = document.createElement('section')
		qSection.setAttribute('id', 'question-section')
		this.app.append(qSection)

		for (let q of questions) {
			q.key, q.text

			// --- fieldset
			let qField = document.createElement('fieldset')
			qField.setAttribute('id', q.key)
			qField.classList.add('question')
			qSection.append(qField)

			// --- legend
			let qLegend = document.createElement('legend')
			qLegend.textContent = q.text;
			qField.append(qLegend)

			// --- wrapper div yes
			let qDivYes = document.createElement('div')
			qField.append(qDivYes);

			// --- label yes
			let qLabelYes = document.createElement('label')
			qLabelYes.setAttribute('for', `${q.key}-yes`)
			qLabelYes.textContent = "Ja"
			qDivYes.append(qLabelYes)

			// --- input yes
			let inputYesEl = document.createElement('input')
			inputYesEl.setAttribute('type', 'radio')
			inputYesEl.setAttribute('name', `${q.key}`)	// needed for radio button grouping
			inputYesEl.setAttribute('id', `${q.key}-yes`)
			inputYesEl.setAttribute('value', 'yes')
			inputYesEl.dataset.qId = q.id
			qDivYes.append(inputYesEl)
			this.inputElements.push(inputYesEl)

			// --- wrapper div no
			let qDivNo = document.createElement('div')
			qField.append(qDivNo)

			// --- label no
			let qLabelNo = document.createElement('label')
			qLabelNo.setAttribute('for', `${q.key}-no`)
			qLabelNo.textContent = "Nein"
			qDivNo.append(qLabelNo);

			// --- input no
			let inputNoEl = document.createElement('input')
			inputNoEl.setAttribute('type', 'radio')
			inputNoEl.setAttribute('name', `${q.key}`)
			inputNoEl.setAttribute('value', 'no')
			inputNoEl.setAttribute('id', `${q.key}-no`)
			inputNoEl.dataset.qId = q.id
			this.inputElements.push(inputNoEl)
			qDivNo.append(inputNoEl)

			// --- wrapper weight
			let wDiv = document.createElement('div')
			qField.append(wDiv)

			// --- label weight
			let wLabel = document.createElement('label')
			wLabel.setAttribute('for', `${q.key}-sel`)
			wLabel.textContent = "Gewichtung"
			wDiv.append(wLabel)

			// --- select weight
			let selectEl = document.createElement('select')
			selectEl.setAttribute('id', `${q.key}-sel`)
			selectEl.dataset.qId = q.id
			this.selectElements.push(selectEl)
			wDiv.append(selectEl)

			// schwach = 1
			let optMinusOne = document.createElement('option')
			optMinusOne.setAttribute('value', "-1")
			optMinusOne.textContent = "schwach"
			selectEl.append(optMinusOne)

			// normal = 2
			let optZero = document.createElement('option')
			optZero.setAttribute('selected', true)
			optZero.setAttribute('value', "0")
			optZero.textContent = "normal"
			selectEl.append(optZero)

			// stark = 3
			let optPlusOne = document.createElement('option')
			optPlusOne.setAttribute('value', "1")
			optPlusOne.textContent = "stark"
			selectEl.append(optPlusOne)

			// output
			let outputEl = document.createElement('div')
			outputEl.dataset.qId = q.id
			outputEl.classList.add('output')
			this.outputElements.push(outputEl)
			qSection.append(outputEl)
		}

		// summary element
		this.summaryElement = this.createElement('table', 'summary')
		this.summaryElement.setAttribute('hidden', true)
		this.app.append(this.summaryElement)

	}

	/* UPDATE VIEW */

	updateSummaryView(userSettings) {
		this.removeAllChildren(this.summaryElement)
		this.summaryElement.removeAttribute('hidden')

		for (let key in userSettings) {
			let sumItemKey = this.createElement('th', 'summary-key')
			let sumItemValue = this.createElement('td', 'summary-value')
			let tr = this.createElement('tr')
			sumItemKey.textContent = `${key}: `
			sumItemValue.textContent = userSettings[key]
			//sumItemKey.textContent = `${key}: ${userSettings[key]}`
			//sumItemValue.textContent = `${key}: ${userSettings[key]}`
			this.summaryElement.append(tr, sumItemKey, sumItemValue)
		}
	}
	
	updateQuestionOutput(qId, question) {
		// get the correct output element:
		let outEl = this.outputElements.find(item => item.dataset.qId === qId.toString())
		this.removeAllChildren(outEl)

		for (let t of this._model.questions[qId].tags) {
			//let tagValue = (question.answer === true) ? t.weightYes : -t.weightNo
			
			let outItem = this.createElement('span', 'output-item')
			outItem.textContent = `${t.key}: ${t.computed}`
			outEl.append(outItem)
		}
	}

	updateDietList(diets) {
		// code
	}
	/* BIND HANDLERS */

	bindInputYesNo(handler) {
		for (let el of this.inputElements) {
			el.addEventListener('click', evt => {
				let qId = parseInt(evt.target.dataset.qId)
				let inputValue = evt.target.value
				handler(qId, inputValue)
			})
		}
	}

	bindSelectWeight(handler) {
		for (let el of this.selectElements) {
			el.addEventListener('change', evt => {
				let qId = parseInt(evt.target.dataset.qId)
				let selectValue = parseInt(evt.target.value)
				handler(qId, selectValue)
			})
		}
	}

	/* HELPER METHODS */

	removeAllChildren(el) {
		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}
	}
	
	// Create an element with an optional CSS class
	createElement(tag, className) {
		const element = document.createElement(tag)
		if (className) element.classList.add(className)

		return element
	}

	// Retrieve an element from the DOM
	getElement(selector) {
		const element = document.querySelector(selector)

		return element
	}
	
// end of class View
}

class Controller extends EventEmitter {
	constructor(model, view) {
		super()
		this.model = model
		this.view = view

		this.view.createQElements(this.model.questions) // Create question elements based on model

		//this.view.bindClick(this.handleInputYesNo)
		this.view.bindInputYesNo(this.handleInputYesNo)
		this.view.bindSelectWeight(this.handleSelectWeight)
		//this.model.bindOnSettingsUpdate(this.onSettingsUpdate) // makes onSettingsUpdate available in the model
		//this.model.bindOnQuestionUpdate(this.onQuestionUpdate)
	}

	handleInputYesNo = (qId, inputValue) => {
		// Using arrow functions here allows us to call them from the view using the this context of the controller. 
		// If we did not use arrow functions, we would have to manually bind them
		this.model.updateSign(qId, inputValue)
	}

	handleSelectWeight = (qId, selectValue) => {
		this.model.updateWeight(qId, selectValue)
	}


	/* onSettingsUpdate = (userSettings, dietList) => {
		this.view.updateSummaryView(userSettings)
		this.view.updateDietList(dietList)
	}

	onQuestionUpdate = (qId, question) => {
		this.view.updateQuestionOutput(qId, question)
	} */
}

const model = new Model()
const view = new View(model)
const controller = new Controller(model, view)