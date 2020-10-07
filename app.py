import os
import flask
import flask_socketio

app = flask.Flask(__name__)
socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

@app.route('/')
def hello():
    return flask.render_template('index.html')

@socketio.on('connect')
def on_connect():
    print('Someone connected!')
    socketio.emit('connected', {
        'test': 'Connected'
    })

@socketio.on('disconnect')
def on_disconnect():
    print ('Someone disconnected!')

@socketio.on('newlogin')
def on_newlogin(data):
    print("Got an event for new user", data['uname'])
    uname = data['uname']
    password = data['password']
    socketio.emit('new user', {
        'user': uname
    })
    
@socketio.on('newmessage')
def on_newmessage(data):
    print("Got new message")
    message=data['txt']
    answer = ''
    if(message[0:2] == '!!'): 
        print("Got here to bot")
        answer = botmessage(message)
        #print(answer)
    socketio.emit('newresponse', {
        'answer':answer
    })
    
def botmessage(message):
    answer = ''
    if(message.replace(" ","") == "!!about"):
        answer = "Live long and prosper this is Spock_bot \nI am a Vulcan stuck in this mediocre machine \nI might as well be useful type '!!help' to see what I can do"
        return answer
    if(message.replace(" ","") == "!!help"):
        answer = "Type !!funtranslate <message> to translate to perfect Vulcan, a much more efficient language"
        return answer
    if(message == "!!funtranslate"):
        #API calls TODO
        return answer
        
if __name__ == '__main__': 
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 8080)),
        debug=True
    )
