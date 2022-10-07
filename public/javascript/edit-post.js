async function editFormHandler(event) {
    event.preventDefault();
    const post_id = window.location.toString().split('/')[ //gets url split at the /
        window.location.toString().split('/').length -1
    ].split('?')[0];
    title = document.querySelector('input[name="post-title"]').value;

    const response = await fetch(`/api/posts/${post_id}`,{
        method: 'PUT',
        body: JSON.stringify({
            title
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    }
    else
    {
        alert(response.statusText);
    }
}
document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);