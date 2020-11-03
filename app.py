from os.path import join, dirname
from dotenv import load_dotenv
import os
import flask
import flask_socketio
import requests
from random import randint 

app = flask.Flask(__name__)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")



connected = 0

    
    
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

@socketio.on('newlogin')
def on_newlogin(data):
    print("Got an event for new user", data['uname'])
    uname = data['uname']
    email = data['email']
    img = data['imageurl']
    
    

        
if __name__ == '__main__': 
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 8080)),
        debug=True
    )
