var buttonCaptureVoice = document.querySelector('#buttonCaptureVoice'),
	voice = new Voice(response),
	text = new Text()

buttonCaptureVoice.addEventListener('mousedown', () => {
	voice.listen()
	this.addEventListener('mouseup',voice.listen)
})

function response (resultText){
	console.log(resultText)
	if (resultText) {
		resultText = resultText.replace('í','i')
		if (resultText.search('si') < 0 && resultText.search('no') < 0) {
			text.toVoice('No respondiste la pregunta.')
		}else{
			if (resultText.search('si') >= 0) {
				text.toVoice('perfecto, sigue asi.')
				var xhr = new XMLHttpRequest()
				xhr.open('POST', '/api/history/add' , true)
				xhr.setRequestHeader('Content-Type', 'application/json')
				xhr.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						var data = this.responseText
					}
				}

				xhr.send(JSON.stringify(detailActivityActive))
			}else{
				text.toVoice('No olvides hacerlo.')
				confirmActivityWindow.hide()
			}
		}
	}else text.toVoice('No te entendi.')
	console.log(resultText)
}