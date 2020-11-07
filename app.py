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
CHANNEL = "get user list"

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
    uname = data["uname"]
    email = data["email"]
    img = data["imageurl"]
    gc = ""
    db.session.add(models.Users(uname, email, img, gc))
    db.session.commit()

    emit_user_list(CHANNEL)


# Gets information from create project page
@socketio.on("create project")
def on_create_project(data):
    print("Received project information for group code: ", data["groupCode"])
    project_name = data["projectName"]
    project_description = data["projectDescription"]
    group_code = data["groupCode"]
    project_users = data["selectedUsers"]
    print(project_users)
    db.session.add(models.Projects(group_code, project_name, project_description))
    db.session.commit()


if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )
