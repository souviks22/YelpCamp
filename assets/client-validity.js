const forms = document.querySelectorAll('form.to-validate');
Array.from(forms)
    .forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        })
    })
