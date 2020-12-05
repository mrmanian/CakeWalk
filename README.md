# [CakeWalk](https://taskmanager490.herokuapp.com/)
This web app is a project management dashboard that allows team members to assign work to others with set deadlines and the ability to check off completed tasks.

## Table of Contents 

1. [Installation](#installation)
2. [Contributions](#contributions)
3. [Pending Work](#pending-work)
4. [Linting Errors](#linting-errors)
5. [Final Remarks](#final-remarks)

## Installation
Prerequisites: 

* Windows, MacOS, or Linux machine.
* [Git Bash](https://git-scm.com/downloads) installed in order to run Git commands.
* [Python](https://www.python.org/downloads/) installed in your system/virtual environment.

#### **Install basic packages**

To run this app, you first need to clone my repo to your local machine and then cd into it by typing the following commands on your terminal.

        git clone https://github.com/NJIT-CS490/project-taskmanager-sprint2.git
        cd project3-taskmanager

Now let us install the packages required to run the app! First step is to upgrade node to version 10, yum to the latest version, and pip to the latest version. Enter yes to any and all prompt, if given.

        nvm install 10
        sudo yum update
        sudo /usr/local/bin/pip install --upgrade pip

Next, lets setup SocketIO and React by installing the following packages. 

        npm install
        pip install flask-socketio
        pip install eventlet
        npm install -g webpack
        npm install --save-dev webpack
        npm install socket.io-client --save

Let us also install packages used for linting and checking coverage

        pip install pylint --upgrade
        sudo $(which pip) install black
        pip install alchemy-mock
        pip install coverage
        npm install -g eslint
        npm init
        eslint --init

Accept the default options for eslint or configure it to your liking.

Let us also add some additional packages for more complex functionality.

        npm install --save react-social-login-buttons
        npm i react-facebook-login
        npm i react-social-login-buttons
        npm i react-bootstrap
        npm i react-sliding-pane
        
Note: if you see any error messages, make sure you use `sudo pip` or `sudo npm`. If it says 'pip cannot be found', run `which pip` and use `sudo [path to pip from which pip] install` .

#### **Setup PSQL Database**

Next, we need to setup a PSQL Database to work with Python. Run the following commands to install psycopg, sqlalchemy, and postgresql. Enter yes to any and all prompts, if given.

        sudo /usr/local/bin/pip install psycopg2-binary
        sudo /usr/local/bin/pip install Flask-SQLAlchemy==2.1
        sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-doc

Run the following commands to initialize, start up and make a new superuser/database.

        sudo service postgresql initdb
        sudo service postgresql start
        sudo -u postgres createuser --superuser $USER
        sudo -u postgres createdb $USER

If you get an error saying 'could not change directory', that's normal! It worked!

Go into psql by typing `psql` and create a new user and password by running the following. Replace the [values] in this command with your own. Make note of your credentials as we will need it in the later steps!

        create user [some_username_here] superuser password '[some_unique_new_password_here]';

Now that everything is installed and setup, create a new file called `sql.env` and type the following line inside the file while replacing [username] and [password] with the same credentials you made on the previous step. Do not include the [].

        DATABASE_URL=postgresql://[username]:[password]@localhost/postgres

Quit out of psql by running `\q` . In order to enable your db admin password to work, open the following file in vim and replace all values of `ident` with `md5`, if it isn't already changed.

        sudo vim /var/lib/pgsql9/data/pg_hba.conf
        :%s/ident/md5/g

Close out of vim and then restart psql. Ensure that `sql.env` has the correct username/password of the superuser you created!
        
        sudo service postgresql restart

We also need to change the owner of the postgres database to the username that you created. This is required for heroku deployment which will be covered in the later steps. Go into psql by typing `psql` and run the following. The username should be the same username that you have in your `sql.env` file!

        ALTER DATABASE postgres OWNER TO [your_username]
#### **Email functionality**

The email functionality of the app is made possible using SMTP SSL and Port 465.  In order for this to work in your `sql.env` file, write the following and fill in the variable with your own email password.

        EMAIL_PASSWORD=[your_email_password]

#### **Google Login functionality**

Go to https://console.developers.google.com/ and create an app, be sure to login with a gmail account.

Navigate to "Select a Project" and create a new Project.

Go to the Credentials tab and Create Credentials and select Oauth client ID.

Select web application and name the credential. Finally insert the url of where you would like the application to run(beware to use http not https, and leave no slash at the end).

Follow the following link after where you put the url and select External.

Navigate to the Oauth consent screen and add your link's TLD to the Authorized Domains.

#### **Run the app**

That is all for the initial setup! We will not have to re-run all of those commands anymore! Now, every time you want to run the application, you only have to do the following. Open up 3 terminals and run one line per terminal. Make sure you are in the root-level directory of the project.
        
        sudo service postgresql start
        npm run watch
        python app.py
        
If prompted to install webpack-cli, type 'yes'. If you are using AWS Cloud9, preview the application by clicking 'preview running application'. This should successfully render the HTML!


#### **Run the Unit Tests**

I have configured all the files into the repository already so to run the unit tests, run the following command on the root directory. Make sure you start the psql database though.

        sudo service postgresql start
        coverage run -m --source=. unittest tests/*.py && coverage html

#### **Deploy to Heroku and setup Heroku database**

Once the code successfully runs locally, now we can deploy it for the world to see! We will be using Heroku to deploy. Sign up for an account [here.](https://dashboard.heroku.com/apps) Once the sign up process is complete, we need to install Heroku on your system, so in your terminal type the following command. Note that this might take some time to fully install.

        npm install -g heroku

Next go through the following steps to prepare for Heroku deployment.

        heroku login -i
        heroku create [your_app_name]

Now to setup postgres database on Heroku. Fill in [your_username] with the username in the `sql.env` file.

        heroku addons:create heroku-postgresql:hobby-dev
        heroku pg:wait
        PGUSER=[your_username] heroku pg:push postgres DATABASE_URL

It should ask for your password after this. This password should be the same password for the username you created. (Same password that is in the `sql.env` file). Enter it and run the following commands.

        heroku pg:psql
        select * from users;
        select * from projects;
        select * from tasks;
        \q


Now we can push the code to Heroku so that it can be deployed. The following command will do precisely that.

        git push heroku main

Also, go to your heroku [dashboard](https://dashboard.heroku.com/apps) and click on your newly created app and go to settings. Under buildpacks, add 'heroku/nodejs' and 'heroku/python' if they are not there already.

If all went correctly, the website should be up and running!! In case it does not load properly, you can debug it by running the following command on your console.

        heroku logs --tail

**[Back to top](#Project-Management-Dashboard)**

## Contributions

#### Michael Manian

Added Create Project functionality to the application, which allows the user to create a project. I  parsed data from the input form and emitted to the server and then stored it in a database.  Project creators can also select which users to add to the project. The page is then reloaded back to the dashboard where the project will be visible to the creator and all participants the creator added. Coded a function which will generate a random unique group code to identify who is part of which project. I styled this page and also restyled the create task page such that when a user shrinks their screen, nothing gets cut off and everything resized proportionally. Throughout development I linted as I wrote code and helped debug a ton of issues my teammates were having. I implemented a feature where the create button is disabled until the user inputs name/description and selects a user, but ended up removing it as it caused issues elsewhere despite it working fine. I also mocked the create project, emit, on connect/disconnect, and the index render template functions. In the end I successfully pushed and deployed to Heroku.

#### Devin Romanoff

Created the Projects and Tasks tables in the database. I wrote methods to send the user, project, and task data to be displayed on the dashboard. This included querying the database based on unique identifiers to get the proper tasks and projects. This data is displayed on task and project creation as well as on login for all users involved in the project. I styled the dashboard and task display components of the UI. Throughout development I helped lint the backend python and frontend jsx files. Helped integrate project and task creation screens into the dashboard, as well as the transition to the dashboard after a user logs in. I was also the PM in week one.

#### Aarati Srikumar

Added Create Task functionality to the application, which allows the user to create a task and emit data to the server, and reload to the Dash page. I chose the style colors for the entire application, and styled this page as well. Wrote code on the server to send email to users when a task or project is created using db calls to get the username as well as python’s smtp library. Created and managed access to the email for our application, that sends emails to users when Tasks or Projects are created. Wrote code to call google calendar api but it needed our app to be verified so we did not use it. Wrote mock tests for my method and other methods, as well as checked and re-checked eslint and pylint for all files made. Tested overall coverage for our application and wrote 5 mock db methods to mock db calls which greatly increased our coverage.

#### Jacob Karpman

Added Google Oauth functionality and created methods to emit user data back to the server. In the server I created the Users Table and made methods to enter user data into Users Table on first login. I styled the Login Page and created the Google Button and Login Javascript files. I added the task_owner attribute to the Tasks table then made the methods display the task owner attribute next to each task in the Task Javascript file. I also created the method that logs the task owner into the Task table on selection of the Task. Along with creating the mock test for all of the methods which I created. Along with being a resource and helping other members when I could. I was also the PM for week 2. For Sprint 2 I created the process for setting Tasks as complete also creating the front end button and layout for task selection and completion. I created the Cancel buttons for the CreateTask and CreateProjects page that allows you to return to the Dashboard without logging the information. I also used bootstrap to style the Dashboard view with gridlines, hovering, and color. I created the Landing Page, writing the information as well as designing the landing page. I created all CakeWalk logos from scratch and implemented the spinning animation. 

**[Back to top](#Project-Management-Dashboard)**

## Pending Work
- When a user adds a project, the project changes for all users, but when a user logs back in, it is corrected. So it is correct in the database, we just have to fix the UI
- Add a cancel button to Create Task and Create Project page if user changes their mind and make every input of the form required so that we don't have null values
- Allow users to be a part of multiple projects rather than just one

**[Back to top](#Project-Management-Dashboard)**

## Linting Errors
- 'useState' is defined but never used  no-unused-vars error, which happens but the script actually does use useState so it is inaccurate
- Dependency cycle detected, which we needed for our app to refresh to a page where users can decide if they want to create another task or project
- import/prefer-default-export, which happens in Socket.jsx which was given to us from a lecture so we didn't change it

**[Back to top](#Project-Management-Dashboard)**

## Final Remarks

Please feel free to let us know if any issues arise via the issues tab on Github. If there is a big feature that would be beneficial to add, feel free to fork the repo and try to implement it or let us know so we can also attempt to add it and update the repository!

**[Back to top](#Project-Management-Dashboard)**
