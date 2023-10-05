const btn = document.querySelector('.button__submit')
const inputDay = document.querySelector('#day')
const inputMonth = document.querySelector('#month')
const inputYear = document.querySelector('#year')
const yearSpan = document.querySelector('.section__number--years')
const monthSpan = document.querySelector('.section__number--months')
const daySpan = document.querySelector('.section__number--days')
const allInputs = document.querySelectorAll('.input__box')
const firstError = allInputs[0].children[2]

const showError = (input, msg) => {
	const inputBox = input.parentElement
	const errorMsg = inputBox.querySelector('.input__error')

	if (msg === 'Must be a valid date') {
		allInputs.forEach(input => {
			input.classList.add('active')
			firstError.textContent = msg
		})
	} else {
		inputBox.classList.add('active')
		errorMsg.textContent = msg
	}
}

const clearError = input => {
	const inputBox = input.parentElement
	const errorMsg = inputBox.querySelector('.input__error')

	inputBox.classList.remove('active')
	errorMsg.textContent = ''
}

const checkForm = input => {
	input.forEach(el => {
		if (el.value === '') {
			showError(el)
		} else {
			clearError(el)
		}
	})
}

const checkLength = (input, min) => {
	let msg = ''
	if (input.id === 'day') {
		msg = 'Must be a valid day'
	} else if (input.id === 'month') {
		msg = 'Must be a valid month'
	} else {
		msg = 'Must be at least 4 characters'
	}

	if (input.value.length === min && firstError.textContent !== 'Must be a valid date') {
		clearError(input)
	} else {
		if (input.value.length < min && input.value.length > 0) {
			showError(input, msg)
		} else if (input.value === '') {
			showError(input, `This field is required`)
		}
	}
}

const checkDay = input => {
	checkLength(input, 2)
	checkMonth(input, 31)

	const daysThirtyOne = ['01', '03', '05', '07', '08', '10', '12']
	const daysThirty = ['04', '06', '09', '11']
	const date = new Date(inputYear.value, 1, input.value).getMonth()

	if (daysThirtyOne.includes(inputMonth.value) && input.value > 31) {
		showError(input, `Must be a valid day`)
		console.log(new Date(inputYear.value, inputMonth.value, inputDay.value))
	} else if (daysThirty.includes(inputMonth.value) && input.value == 31) {
		showError(inputDay, `Must be a valid date`)
	} else if (inputMonth.value === '02' && date !== 1 && input.value <= 31) {
		showError(inputDay, `Must be a valid date`)
	}
}

const checkMonth = (input, num) => {
	checkLength(input, 2)

	if (input.value > num || input.value == '00') {
		showError(input, `Must be a valid ${input.id}`)
	}
}

const checkYear = (input, min) => {
	checkLength(input, 4)

	if (parseInt(input.value) > min) {
		showError(input, 'Must be in the past')
	} else if (inputYear.value.startsWith(0)) {
		showError(input, 'Must be a valid year')
	}
}

const calculateTime = numberOfDays => {
	const years = Math.floor(numberOfDays / 365.25)
	const months = Math.floor((numberOfDays % 365.25) / 30)
	const days = Math.floor((numberOfDays % 365.25) % 30)

	yearSpan.textContent = years
	monthSpan.textContent = months
	daySpan.textContent = days
}

const submitCalculation = () => {
	const today = new Date()
	const monthOPickedDate = parseInt(inputMonth.value) - 1
	const pickedDate = new Date(parseInt(inputYear.value), monthOPickedDate, parseInt(inputDay.value))
	const result = today - pickedDate
	const daysBetweenDates = Math.floor(result / 1000 / 60 / 60 / 24)

	calculateTime(daysBetweenDates)
}

const checkErrors = () => {
	let errorCount = 0

	allInputs.forEach(input => {
		if (input.classList.contains('active')) {
			errorCount++
		}
	})
	if (errorCount === 0) {
		submitCalculation()
	} else {
		yearSpan.textContent = '--'
		monthSpan.textContent = '--'
		daySpan.textContent = '--'
	}
}

function onlyNumbers() {
	this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1')
}

;[inputDay, inputMonth, inputYear].forEach(input => {
	input.addEventListener('input', onlyNumbers)
})

btn.addEventListener('click', e => {
	e.preventDefault()
	checkForm([inputDay, inputMonth, inputYear])
	checkDay(inputDay)
	checkMonth(inputMonth, 12)
	checkYear(inputYear, new Date().getFullYear())
	checkErrors()
})
