from os.path import join, dirname
from dotenv import load_dotenv
import os
import flask
import flask_socketio
import flask_sqlalchemy
import requests
import models
from random import randint 

app = flask.Flask(__name__)

dotenv_path = join(dirname(__file__), 'sql.env')
load_dotenv(dotenv_path)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")




database_uri = os.environ['DATABASE_URL'] 
app.config['SQLALCHEMY_DATABASE_URI'] = database_uri

db = flask_sqlalchemy.SQLAlchemy(app)
db.init_app(app)
db.app = app

connected = 0

    
#Emit's list of users from users table    
def emit_user_list():
    all_users = [ \
        (db_messages.username, db_messages.profile_img) for db_messages in \
        db.session.query(models.users).all()]
    socketio.emit('get_user_list', {
        'user_list': all_users
    })
    
@app.route('/')
def hello():
    return flask.render_template('index.html')

@socketio.on('connect')
def on_connect():
    global connected
    print('Someone connected!')
    print("CONNECTED NUMBER:" + str(connected))
    socketio.emit('connected', {
        'test': connected
    })
    

@socketio.on('disconnect')
def on_disconnect():
    global connected
    connected -= 1
    print ('Someone disconnected!')
    socketio.emit('disconnected', {'num': connected})

#Adds user data to user table on login
@socketio.on('newlogin')
def on_newlogin(data):
    print("Got an event for new user", data['uname'])
    uname = data['uname']
    email = data['email']
    img = data['imageurl']
    gc = ''
    db.session.add(models.users(uname, email, img, gc));
    db.session.commit();
    
    

        
if __name__ == '__main__': 
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 8080)),
        debug=True
    )
