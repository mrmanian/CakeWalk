from os.path import join, dirname
import os
import smtplib
import ssl
from dotenv import load_dotenv
import flask
import flask_socketio
import flask_sqlalchemy
from flask import request

app = flask.Flask(__name__)

dotenv_path = join(dirname(__file__), "sql.env")
load_dotenv(dotenv_path)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

database_uri = os.environ["DATABASE_URL"]
email_password = os.environ["EMAIL_PASSWORD"]
app.config["SQLALCHEMY_DATABASE_URI"] = database_uri

db = flask_sqlalchemy.SQLAlchemy(app)
db.init_app(app)
db.app = app
db.create_all()
db.session.commit()

CONNECTED = 0
CHANNEL = "get user list"
TASK_CHANNEL = "task list"

import models

# Emit's list of users from users table
def emit_user_list(channel):
    all_users = [
        db_username.username for db_username in db.session.query(models.Users).all()
    ]

    all_profile_pics = [
        db_profile_img.profile_img
        for db_profile_img in db.session.query(models.Users).all()
    ]

    socketio.emit(
        channel,
        {
            "all_users": all_users,
            "all_profile_pics": all_profile_pics,
        },
    )


def create_and_send_email(receiver_email):
    print("Sending email")
    result = db.session.query(models.Users).filter(
        models.Users.username == "CS490 ProjectManager"
    )
    user = result[0].username
    sender_email = "cs490.projectmanager@gmail.com"
    port = 465  # For SSL
    # Create a secure SSL context
    context = ssl.create_default_context()
    message = """
    Hello {},
    
    You have created a task on the Project Manager app!
    """.format(
        user
    )

    server = smtplib.SMTP_SSL("smtp.gmail.com", port, context=context)
    server.login(sender_email, email_password)
    server.sendmail(sender_email, receiver_email, message)


# Emits list of
def emit_task_list(channel, user_gc):
    user_projs = [
        (db_projs.proj_name, db_projs.proj_id)
        for db_projs in db.session.query(models.Projects).filter(
            models.Projects.group_code == user_gc
        )
    ]

    user_tasks = [
        (db_tasks.title, db_tasks.proj_id)
        for db_tasks in db.session.query(models.Tasks).filter(
            models.Tasks.proj_id in user_projs[i] for i in range(len(user_projs))
        )
    ]

    socketio.emit(channel, {"projects": user_projs, "tasks": user_tasks})


@app.route("/")
def index():
    emit_user_list(CHANNEL)
    return flask.render_template("index.html")


@socketio.on("connect")
def on_connect():
    global CONNECTED
    print("Someone connected!")
    print("CONNECTED NUMBER: " + str(CONNECTED))
    emit_user_list(CHANNEL)
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
    db.session.add(models.Users(uname, email, img, gc))
    db.session.commit()
    sid = request.sid
    socketio.emit("connected", {"email": email}, sid)
    emit_user_list(CHANNEL)
    socketio.emit("login_status", {"loginStatus": login_status})
    emit_task_list(TASK_CHANNEL, gc)


# Gets information from create project page
@socketio.on("create project")
def on_create_project(data):
    print("Received new project data: ", data)
    project_name = data["projectName"]
    project_description = data["projectDescription"]
    group_code = data["groupCode"]
    project_users = data["selectedUsers"]
    db.session.add(models.Projects(group_code, project_name, project_description))
    db.session.commit()


# Gets information from create task page
@socketio.on("create task")
def on_create_task(data):
    print("Received new task data: ", data)
    email = data["email"]
    title = data["title"]
    description = data["description"]
    deadline = data["deadline"]
    db.session.add(models.Tasks(title, description, deadline))
    db.session.commit()
    create_and_send_email(email)


if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )
