document.addEventListener('DOMContentLoaded', function() {
	const successAlert = sessionStorage.getItem('successAlert');

	if (successAlert) {
		iziToast['success']({
			title: 'Éxito',
			message: successAlert,
			position: 'topRight',
			timeout: 5000,
			theme: 'success',
		});

		sessionStorage.removeItem('successAlert');
	}
});