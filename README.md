# Project 2 Milestone 1 

App that implements chat functionality with database persistance and a simple chat bot function. This App has a Star Trek theme so follow the instructions bellow to see how it is done.

## 0. Clone this repo
```$ git clone https://github.com/NJIT-CS490/project2-m1-jbk26```

## 1. Upgrade Node version to 7

```$ nvm install 7```

## 2. Install initial `npm` and `flask`:
a) npm install
b) pip install flask-socketio
c) pip install eventlet
d) npm install -g webpack
e) npm install --save-dev webpack
f) npm install socket.io-client --save

If you see any error messages, make sure you use sudo pip or sudo npm. If it says "pip cannot be found", run which pip and use sudo [path to pip from which pip] install

## 3. Install parts for PostgreSQL:
a) Update yum: sudo yum update, and enter yes to all prompts
b) Upgrade pip: sudo /usr/local/bin/pip install --upgrade pip
c) Get psycopg2: sudo /usr/local/bin/pip install psycopg2-binary
d) Get SQLAlchemy: sudo /usr/local/bin/pip install Flask-SQLAlchemy==2.1
e) Install PostGreSQL: sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs
    Enter yes to all prompts.
f) Initialize PSQL database: sudo service postgresql initdb
g) Start PSQL: sudo service postgresql start
h) Make a new superuser: sudo -u postgres createuser --superuser $USER
      ⚠️ ⚠️ ⚠️ If you get an error saying "could not change directory", that's okay! It worked! ⚠️ ⚠️ ⚠️
i) Make a new database: sudo -u postgres createdb $USER
    ⚠️ ⚠️ ⚠️ If you get an error saying "could not change directory", that's okay! It worked! ⚠️ ⚠️ ⚠️
      Make sure your user shows up:
          1a) psql
          1b) \du look for ec2-user as a user
          1c) \l look for ec2-user as a database
      Make a new user:
          2a) psql (if you already quit out of psql)
          2b) I recommend 4-5 characters - it doesn't have to be very secure. Remember this password!
              create user [some_username_here] superuser password '[some_unique_new_password_here]';
          2c) \q to quit out of sql
 j) Make a new file called sql.env and add SQL_USER= and SQL_PASSWORD= in it. Fill in those values with the values you put in i) 2b)
 
 ## 4. SQLAlchemy config:
a) Open the file in vim: sudo vim /var/lib/pgsql9/data/pg_hba.conf If that doesn't work: sudo vim $(psql -c "show hba_file;" | grep pg_hba.conf)
b) Replace all values of ident with md5 in Vim: :%s/ident/md5/g
c) After changing those lines, run sudo service postgresql restart
      Ensure that sql.env has the username/password of the superuser you created!
d) Run your code!
    a) npm run watch. If prompted to install webpack-cli, type "yes"
    b) In a new terminal, python app.py
    c) Preview Running Application (might have to clear your cache by doing a hard refresh)
## 5. Miscellenous installations:
a) If after running npm run watch  there are errors with not recognizing a dependency npm install that dependency.

## 6. Heroku Deployment:






## 5 Problems and Solutions in this Project:

1) One major problem I encountered was a git hub related issue, 
