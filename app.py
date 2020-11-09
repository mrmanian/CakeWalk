from os.path import join, dirname
import os
from dotenv import load_dotenv
import flask
import flask_socketio
import flask_sqlalchemy


app = flask.Flask(__name__)

dotenv_path = join(dirname(__file__), "sql.env")
load_dotenv(dotenv_path)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

database_uri = os.environ["DATABASE_URL"]
app.config["SQLALCHEMY_DATABASE_URI"] = database_uri

db = flask_sqlalchemy.SQLAlchemy(app)
db.init_app(app)
db.app = app
db.create_all()
db.session.commit()

CONNECTED = 0

import models

# Emit's list of users from users table
def emit_user_list():
    all_users = [
        (db_messages.username, db_messages.profile_img)
        for db_messages in db.session.query(models.users).all()
    ]
    socketio.emit("get_user_list", {"user_list": all_users})

# Emits list of     
def emit_task_list(user_gc):
    user_projs = [
        (db_projs.proj_name, db_projs.proj_id)
        for db_projs in db.session.query(models.Projects).filter(models.Projects.group_code == user_gc)
    ]
    
    user_tasks = [
        (db_tasks.title, db_tasks.proj_id)
        for db_tasks in db.session.query(models.Tasks).filter(models.Tasks.proj_id in user_projs[i] for i in range(len(user_projs)))
    ]
    
    socketio.emit('task list', {
        'projects': user_projs,
        'tasks': user_tasks
    })


@app.route("/")
def index():
    return flask.render_template("index.html")


@socketio.on("connect")
def on_connect():
    global CONNECTED
    print("Someone connected!")
    print("CONNECTED NUMBER: " + str(CONNECTED))
    return CONNECTED


@socketio.on("disconnect")
def on_disconnect():
    global CONNECTED
    CONNECTED -= 1
    print("Someone disconnected!")
    socketio.emit("disconnected", {"num": CONNECTED})


# Adds user data to user table on login
@socketio.on("newlogin")
def on_newlogin(data):
    print("Got an event for new user", data["uname"])
    login_status = True
    uname = data["uname"]
    email = data["email"]
    img = data["imageurl"]
    gc = ""
    db.session.add(models.users(uname, email, img, gc))
    db.session.commit()
    socketio.emit('login_status', {
        'loginStatus': login_status
    })
    emit_task_list(gc)


# Gets information from create project page
@socketio.on("create project")
def on_create_project(data):
    project_name = data["projectName"]
    project_description = data["projectDescription"]
    group_code = data["groupCode"]
    print(project_name)
    print(project_description)
    print(group_code)


if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )
