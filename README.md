# Project Management Dashboard
A project management dashboard that allows team members to assign work with deadlines and check off completed items.

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

        git clone https://github.com/NJIT-CS490/project3-taskmanager.git
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

* TODO

#### Devin Romanoff

* TODO

#### Aarati Srikumar

* TODO

#### Jacob Karpman

* TODO

**[Back to top](#Project-Management-Dashboard)**

## Pending Work

* TODO

**[Back to top](#Project-Management-Dashboard)**

## Linting Errors

* TODO

**[Back to top](#Project-Management-Dashboard)**

## Final Remarks

Please feel free to let us know if any issues arise via the issues tab on Github. If there is a big feature that would be beneficial to add, feel free to fork the repo and try to implement it or let us know so we can also attempt to add it and update the repository!

**[Back to top](#Project-Management-Dashboard)**
