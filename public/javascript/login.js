async function loginFormHandler(event) {
   event.preventDefault();

   const email = document.querySelector('#email-login').value.trim();
   const password = document.querySelector('#password-login').value.trim();

   if (email && password) {
      // POST request (more secure than GET) to /api/users/login tio send login credentials
      const response = await fetch('/api/users/login', {
         method: 'post',
         body: JSON.stringify({
            email,
            password,
         }),
         headers: {
            'Content-Type': 'application/json',
         },
      });
      
      if (response.ok) {
         // document.location.replace('/dashboard');
         document.location.replace('/');
      } else {
         alert(response.statusText);
      }
   }
}


async function signupFormHandler(event) {
   event.preventDefault();

   const username = document.querySelector('#username-signup').value.trim();
   const email = document.querySelector('#email-signup').value.trim();
   const password = document.querySelector('#password-signup').value.trim();
   
   if (username && email && password) {
      // POST request to /api/users to CREATE AN USER
      const response = await fetch('/api/users', {
         method: 'post',
         body: JSON.stringify({
            username,
            email,
            password,
         }),
         headers: {
            'Content-Type': 'application/json',
         },
      });
      // check the response status code
      if (response.ok) {
         console.log(`Success! You can log-in now`);
         // document.location.replace('/dashboard/');
      } else {
         alert(response.statusText);
      }
   }
}

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
