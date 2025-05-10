Hi,

for setting up the frontend,
You have to git clone the repository
and create a .env file
and include the following in the .env file
REACT_APP_API_BASE_URL=yyyyyyyyyy

replace the deployed backend endpoint in the place of yyyyyyyyyy
now you can deploy it so that it would work

for setting up the backend,
You have to git clone the repository
and create a .env file
and include the following in the .env file
DB_NAME=yyyyyyyyyy
DB_USER=yyyyyyyyyy
DB_PASS=yyyyyyyyyy
DB_HOST=yyyyyyyyyy

replace the actual database values in the place of yyyyyyyyyy
now you can deploy it so that it would work

Now to use the frontend application,
first you will be directed to a register page,
you have to remember your email and password,
because once successful registration, you will be directed to login page
where you have to provide your email and password again. Once logged in
you will be taken to the dashboard.

you have to be careful while uploading xlsx or csv file.
kindly follow the instruction mentioned there before uploading to avoid error
Instructions for uploading

- Kindly follow the exact excel header as shown below
  title description effort due_date user_id
  don't capitalise and only use the above headers
- Input everything as strings including date

- Date should be in dd-mm-yyyy string format. eg: 22-08-2025 . And don't change the col type to date and let it be plain string
  as backend will take care of it

  Common error fixing
  In case you have difficulty registrating,
  make sure you close the application and open it up again and use new email.
  the email should contain @gmail.com at the end. if u still face errors of any kind try going to login page,
  and input the email and password that u have entered in the registration page.

  if u face the above message
  "Registration failed. Please try again. Also check that you're not using an already registered email.",
  kindly try going to login page and login, following the login link found in the register page, as u might have already registered.

Technologies Used
frontend:Reactjs
backend:NodeJs
Database:postgres

Deployment:
frontend:vercel
backend:render
database:render

You could access the application using the following link
https://task-management-frontend-cyan.vercel.app/

You can always contact me in case you have any difficulties or need further clarifications.
