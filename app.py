from os.path import join, dirname
import os
import smtplib
import ssl
from dotenv import load_dotenv
import flask
import flask_socketio
import flask_sqlalchemy
from sqlalchemy import func, any_
from flask import request

app = flask.Flask(__name__)

dotenv_path = join(dirname(__file__), "sql.env")
load_dotenv(dotenv_path)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

database_uri = os.environ["DATABASE_URL"]
# email_password = os.environ["EMAIL_PASSWORD"]
app.config["SQLALCHEMY_DATABASE_URI"] = database_uri

db = flask_sqlalchemy.SQLAlchemy(app)
db.init_app(app)
db.app = app
db.create_all()
db.session.commit()

CHANNEL = "get user list"
TASK_CHANNEL = "task list"


import models

# Emit's list of users from users table
def emit_user_list(channel):
    all_users = [
        db_username.email for db_username in db.session.query(models.Users).all()
    ]
    all_profile_pics = [
        db_profile_img.profile_img
        for db_profile_img in db.session.query(models.Users).all()
    ]
    # print("Extracting user information.")
    socketio.emit(
        channel,
        {
            "all_users": all_users,
            "all_profile_pics": all_profile_pics,
        },
    )


# Emits list of tasks from tasks table
def emit_task_list(channel, user_gc=["abc"]):
    all_projs = []
    all_tasks = []
    all_comp_tasks = []

    for gc in user_gc:
        proj_names = [
            db_proj.proj_name
            for db_proj in db.session.query(models.Projects).filter(
                models.Projects.group_code == gc
            )
        ]

        user_tasks = [
            (
                db_task.title,
                db_task.task_owner,
                db_task.complete_status,
                db_task.t_description,
                db_task.date,
            )
            for db_task in db.session.query(models.Tasks).filter(
                models.Tasks.group_code == gc
            )
        ]
        completed_tasks = [
            (db_task.title, db_task.task_owner, db_task.complete_status)
            for db_task in db.session.query(models.Tasks).filter(
                models.Tasks.group_code == gc, models.Tasks.complete_status == "T"
            )
        ]

        all_projs.append(proj_names)
        all_tasks.append(user_tasks)
        all_comp_tasks.append(completed_tasks)

    socketio.emit(
        channel,
        {
            "projects": all_projs,
            "tasks": all_tasks,
            "completed_tasks": all_comp_tasks,
        },
    )


def create_and_send_email(receiver_email, message):
    user = [
        db_username.username
        for db_username in db.session.query(models.Users).filter(
            models.Users.email == receiver_email
        )
    ]
    sender_email = "cs490.projectmanager@gmail.com"
    port = 465  # For SSL
    # Create a secure SSL context
    context = ssl.create_default_context()
    message = message.format(user[0])

    server = smtplib.SMTP_SSL("smtp.gmail.com", port, context=context)
    # server.login(sender_email, email_password)
    server.sendmail(sender_email, receiver_email, message)
    print("Sent email to user.")


@socketio.on("emit")
def emit(data):
    email = data["email"]
    # gc = db.session.query(models.Users.group_code).filter(models.Users.email == email)
    gc = [
        db_par.group_code
        for db_par in db.session.query(models.Participants).filter(
            models.Participants.email == email
        )
    ]
    emit_user_list(CHANNEL)
    emit_task_list(TASK_CHANNEL, gc)


@socketio.on("emit gc")
def emit_proj(data):
    emit_task_list(TASK_CHANNEL, data["gc"])


# Send user email of their password
@socketio.on("forgot password")
def on_forgot_password(data):
    email = data["email"]
    password = (
        db.session.query(models.Users.password)
        .filter(models.Users.email == email)
        .all()
    )

    message = (
        """
    Hello {},
    
    This is your password: """
        + str(password[0][0])
        + "."
    )
    # create_and_send_email(email, message)


# Adds user data to user table on login
@socketio.on("newlogin")
def on_newlogin(data):
    print("Got an event for new user", data["uname"])
    login_status = True
    uname = data["uname"]
    email = data["email"]
    password = data["password"]
    img = data["imageurl"]
    exists = db.session.query(db.exists().where(models.Users.email == email)).scalar()
    if not exists:
        db.session.add(models.Users(uname, email, password, img))
        db.session.commit()
    sid = request.sid
    socketio.emit("login_status", {"loginStatus": login_status, "email": email}, sid)


# Verify user login credentials
@socketio.on("verifylogin")
def on_verifylogin(data):
    email = data["email"]
    password = data["password"]
    verify_email = db.session.query(
        db.exists().where(models.Users.email == email)
    ).scalar()
    verify_password = db.session.query(
        db.exists().where(models.Users.password == password)
    ).scalar()
    if verify_email and verify_password:
        sid = request.sid
        socketio.emit("login_status", {"loginStatus": True, "email": email}, sid)
    else:
        sid = request.sid
        socketio.emit("login_status", {"loginStatus": False, "email": email}, sid)


# Gets information from create project page
@socketio.on("create project")
def on_create_project(data):
    print("Received new project data: ", data)
    project_name = data["projectName"]
    project_description = data["projectDescription"]
    group_code = data["code"]
    project_users = data["selectedUsers"]
    email = data["email"]
    db.session.add(models.Projects(group_code, project_name, project_description))
    db.session.commit()
    for user in project_users:
        db.session.add(models.Participants(user, group_code))
        db.session.commit()
    message = """
    Hello {},
    
    You have created a project on the Project Manager app!
    """
    # create_and_send_email(email, message)


# Gets information from create task page
@socketio.on("create task")
def on_create_task(data):
    print("Received new task data: ", data)
    email = data["email"]
    title = data["title"]
    description = data["description"]
    deadline = data["deadline"]
    complete_status = "F"
    gc = db.session.query(models.Users.group_code).filter(models.Users.email == email)
    owner = ""
    db.session.add(
        models.Tasks(title, description, deadline, gc, owner, complete_status)
    )
    db.session.commit()
    message = """
    Hello {},
    
    You have created a task on the Project Manager app!
    """
    # create_and_send_email(email, message)


@socketio.on("task selection")
def on_select_task(data):
    print("User selected tasks: ", data)
    titles = data["selectedTask"]
    owner = data["email"]
    for task in titles:
        db.session.query(models.Tasks).filter(models.Tasks.title == task).update(
            {models.Tasks.task_owner: owner}
        )
        db.session.commit()


@socketio.on("complete task")
def on_complete_task(data):
    print("Completed Tasks: ", data)
    titles = data["completed"]
    owner = data["email"]
    cs = "T"
    for task in titles:
        print(task)
        db.session.query(models.Tasks).filter(
            models.Tasks.title == task, models.Tasks.task_owner == owner
        ).update({models.Tasks.complete_status: cs})
        db.session.commit()


@socketio.on("reload")
def on_reload_page():
    # socketio.emit("reload", sid)
    socketio.emit("reload")


@socketio.on("data")
def on_data(data):
    email = data["email"]
    group_code = (
        db.session.query(models.Participants.group_code)
        .filter(models.Participants.email == email)
        .all()
    )
    username = (
        db.session.query(models.Users.username)
        .filter(models.Users.email == email)
        .all()
    )
    password = (
        db.session.query(models.Users.password)
        .filter(models.Users.email == email)
        .all()
    )
    role = db.session.query(models.Users.role).filter(models.Users.email == email).all()
    profile_img = (
        db.session.query(models.Users.profile_img)
        .filter(models.Users.email == email)
        .all()
    )
    total_projects = (
        db.session.query(func.count(models.Projects.group_code))
        .filter(models.Projects.group_code.like(any_(group_code)))
        .all()
    )
    total_tasks = (
        db.session.query(func.count(models.Tasks.task_owner))
        .filter(models.Tasks.group_code.like(any_(group_code)))
        .all()
    )
    completed_tasks = (
        db.session.query(func.count(models.Tasks.complete_status))
        .filter(models.Tasks.group_code.like(any_(group_code)))
        .filter(models.Tasks.complete_status == "T")
        .all()
    )
    socketio.emit(
        "data",
        {
            "profileImg": profile_img,
            "role": role,
            "password": password,
            "username": username,
            "totalProjects": total_projects,
            "totalTasks": total_tasks,
            "completedTasks": completed_tasks,
        },
    )


@socketio.on("update profile pic")
def on_update_pic(data):
    email = data["email"]
    new_pic = data["image"]
    db.session.query(models.Users).filter(models.Users.email == email).update(
        {models.Users.profile_img: new_pic}
    )
    db.session.commit()


@socketio.on("update role")
def on_update_role(data):
    email = data["email"]
    new_role = data["role"]
    db.session.query(models.Users).filter(models.Users.email == email).update(
        {models.Users.role: new_role}
    )
    db.session.commit()


@socketio.on("update password")
def on_update_password(data):
    email = data["email"]
    new_pass = data["new_pass"]
    db.session.query(models.Users).filter(models.Users.email == email).update(
        {models.Users.password: new_pass}
    )
    db.session.commit()


@app.route("/")
def index():
    return flask.render_template("index.html")


@socketio.on("connect")
def on_connect():
    print("Someone connected!")


@socketio.on("disconnect")
def on_disconnect():
    print("Someone disconnected!")


if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )
