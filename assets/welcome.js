const form = document.getElementById('welcome-form');
const statusEl = document.getElementById('form-status');

function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.style.color = isError ? '#b00020' : '';
}

function normalizeUsername(input) {
    return input.replace(/^@/, '').trim();
}

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        setStatus('Opening your welcome issue...');

        const endpoint = form.dataset.endpoint;
        const formData = new FormData(form);
        const payload = {
            github: normalizeUsername(formData.get('github') || ''),
            name: (formData.get('name') || '').trim(),
            note: (formData.get('note') || '').trim(),
            link: (formData.get('link') || '').trim(),
            company: (formData.get('company') || '').trim()
        };

        if (!payload.github || !payload.name) {
            setStatus('GitHub username and name are required.', true);
            return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(result.error || 'Request failed.');
            }

            if (result.issue_url) {
                setStatus('Issue created. Redirecting you now...');
                window.location.href = result.issue_url;
            } else {
                setStatus('Issue created. You can close this tab.');
            }
        } catch (error) {
            setStatus(error.message || 'Something went wrong.', true);
        }
    });
}
