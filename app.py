from os.path import join, dirname
from dotenv import load_dotenv
import os
import flask
import flask_sqlalchemy
import flask_socketio
import models 
import requests
from rfc3987 import parse
from random import randint 

app = flask.Flask(__name__)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

dotenv_path = join(dirname(__file__), 'sql.env')
load_dotenv(dotenv_path)



database_uri = os.environ['DATABASE_URL'] 


app.config['SQLALCHEMY_DATABASE_URI'] = database_uri

db = flask_sqlalchemy.SQLAlchemy(app)
db.init_app(app)
db.app = app


channel = 'newmessagetolist'

db.create_all()
db.session.commit()


connected = 0

def emit_message_list(channel):
    all_messages = [ \
        (db_messages.message, db_messages.username, db_messages.imageurl, db_messages.urltype) for db_messages in \
        db.session.query(models.Chatlog).all()]
    #print(all_messages)
    socketio.emit(channel, {
        'mlist': all_messages
    })
    
    
@app.route('/')
def hello():
    emit_message_list(channel)
    return flask.render_template('index.html')

@socketio.on('connect')
def on_connect():
    global connected
    print('Someone connected!')
    connected+=1
    print("CONNECTED NUMBER:" + str(connected))
    socketio.emit('connected', {
        'test': connected
    })
    emit_message_list(channel)

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
    img = data['imageurl']
    socketio.emit('new user', {
        'user': uname, 'imageurl' : img
    })
    emit_message_list(channel)
    
@socketio.on('newmessage')
def on_newmessage(data):
    print("Got new message")
    message=data['text']
    username = data['username']
    imgurl = data['imageurl']
    print(username)
    answer = message
    typ = urlcheck(message)
    if(message[0:2] == '!!'): 
        print("Got here to bot")
        answer = botmessage(message)
        username = "Spock_bot"
        #print(answer)
    db.session.add(models.Chatlog(username, answer, imgurl, typ));
    db.session.commit();
    emit_message_list(channel)

def urlcheck(message):
    try:
        d = parse(message,rule='URI')
        path = d['path']
        if(path.endswith('.jpg') or path.endswith('.png') or path.endswith('.gif')):
            typ = 'i'
        else:
            typ = 'u'
    except:
        typ = ''
    print(typ)
    return typ

    
def botmessage(message):
    answer = ''
    if(message == "!!about"):
        answer = "Live long and prosper this is Spock_bot \nI am a Vulcan stuck in this mediocre machine \nI might as well be useful type '!!help' to see what I can do"
        return answer
    elif(message == "!!help"):
        answer = "Type !!funtranslate <message> to translate to perfect Vulcan, a much more efficient language.\n!!about is to learn about me.\n !!performance is an honest review of you as a user \n !!history is for a fascinating fact about a random earth year"
        return answer
    elif(message.split()[0] == "!!funtranslate"):
        words = message[15:]
        link = f"https://api.funtranslations.com/translate/vulcan.json?text={words}"
        vulcan_json = requests.get(link)
        vulcan = vulcan_json.json()
        translate = vulcan['contents']['translated']
        answer = translate
        return answer
    elif(message == "!!performace"):
        choices = ["Unacceptable", "Ordinary", "Disappointing", "Phenomenal", "Pathetic", "Adequate", "Mediocre"]
        choice_num = randint(0,6)
        answer = choices[choice_num]
        return answer
    elif(message == "!!history"):
        link = "http://numbersapi.com/random/year?json"
        get_ans = requests.get(link)
        total = get_ans.json()
        fact = total["text"]
        answer = fact
        return answer
    else:
        answer = "This is nonsense please do not waste my time"
        return answer
        
if __name__ == '__main__': 
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 8080)),
        debug=True
    )
