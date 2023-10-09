document.addEventListener('DOMContentLoaded', function() {
	const form = document.querySelector('.generalFormHandler');
	const submitButton = form.querySelector('.send-form');
  
	submitButton.addEventListener('click', function(event) {
		event.preventDefault();
		makePostRequest(form);
	});
});

const makePostRequest = async (form) => {
	const apiUrl = form.dataset.apiUrl;
	const redirectUrl = form.dataset.redirectUrl;

	if (!apiUrl || !redirectUrl) {
		console.error('El formulario no tiene los atributos personalizados requeridos.');
		return;
	}
  
	const loader = document.getElementById('loader');
	loader.classList.remove('d-none');
	loader.classList.add('d-flex');
  
	const formData = new FormData(form);

    const requestData = {};

    formData.forEach((value, key) => {
		requestData[key] = value;
	});

    const body = JSON.stringify(requestData);
    const headers = { 'Content-Type': 'application/json' };
  
	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers,
			body
		});
			
		const data = await response.json();

		if (!response.ok) {
			errorAlert(data.message);
				
			return;
		}

		successAlert({responseMessage: data.message, redirectUrl});
	} catch (error) {
		console.log({error});
		errorAlert('There was an unexpected error. We appreciate your patience');
	} finally {
		loader.classList.remove('d-flex');
		loader.classList.add('d-none');
	}
};

const errorAlert = async (message) => {
	iziToast.error({
		title: 'Error',
		message,
		position: 'topRight',
		timeout: 7000
	});
}

const successAlert = async (data) => {
	const { responseMessage, redirectUrl } = data;

	sessionStorage.setItem('successAlert', responseMessage);

	history.pushState(null, null, redirectUrl);
	window.location.replace(redirectUrl);
}