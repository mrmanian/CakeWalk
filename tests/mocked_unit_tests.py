import unittest
import unittest.mock as mock
import os
import sys
import inspect


current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)
from alchemy_mock.mocking import UnifiedAlchemyMagicMock
import app
from app import CHANNEL
import models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"


class RequestObj:
    def __init__(self):
        return

    def sid(self):
        return "test_sid"


class sslObj:
    def __init__(self):
        return None

    def create_default_context(self):
        return 0


class smtplibObj:
    def __init__(self):
        return None

    def SMTP_SSL(self, email, port, context):
        return smtp_sslObj(email, port, context)


class smtp_sslObj:
    def __init__(self, email, port, context):
        return None

    def login(self, sender_email, email_password):
        return None

    def sendmail(self, sender_email, receiver_email, message):
        return None


class SQLObject:
    def __init__(self, username, group_code):
        self.username = username
        self.group_code = group_code

    def all(self):
        return "abc"

    def filter(self, boolean):
        return Table()


class Table:
    def __init__(self):
        return

    def all(self):
        return [SQLObject("test USER", "gc")]

    def filter(self, boolean):
        return [SQLObject("test USER", "gc")]

    def scalar(self):
        return True


class SessionObject:
    def __init__(self):
        return

    def add(self, table):
        return

    def commit(self):
        return

    def query(self, table):
        return Table()


class SQLObject2:
    def __init__(self, username, group_code):
        self.username = username
        self.group_code = group_code

    def all(self):
        return ["abc"]

    def filter(self, boolean):
        return Table()


class Table2:
    def __init__(self):
        return

    def filter(self, boolean):
        return SQLObject2("test USER", "gc")

    def scalar(self):
        return None


class SessionObject2:
    def __init__(self):
        return

    def add(self, table):
        return

    def commit(self):
        return

    def query(self, table):
        return Table2()


class Unit_TestCase_Mock(unittest.TestCase):
    @mock.patch("builtins.print")
    def test_on_connect(self, mock_print):
        app.on_connect()
        mock_print.assert_called_with("Someone connected!")

    @mock.patch("builtins.print")
    def test_on_disconnect(self, mock_print):
        app.on_disconnect()
        mock_print.assert_called_with("Someone disconnected!")

    @mock.patch("flask.templating._render", return_value="")
    def test_mocked_render(self, mocked):
        test_client = app.app.test_client()
        test_client.get("/")
        self.assertEqual(mocked.called, True)

    def test_on_newlogin(self):
        data = {
            "uname": "Jake",
            "email": "jake@gmail.com",
            "imageurl": "https://google.com",
            "password": "testpassword",
        }
        with mock.patch("app.db.session", SessionObject()):
            with mock.patch("app.request", RequestObj()):
                app.on_newlogin(data)

    @mock.patch("app.socketio")
    def test_emit_user_list(self, mocked_socket):
        session = UnifiedAlchemyMagicMock()
        with mock.patch("app.db.session", session):
            app.emit_user_list(CHANNEL, "sid")
            self.assertEqual(mocked_socket.emit.call_count, 1)

    @mock.patch("app.socketio")
    def test_emit_task_list(self, mocked_socket):
        session = UnifiedAlchemyMagicMock()
        with mock.patch("app.db.session", session):
            app.emit_task_list(CHANNEL, "sid")
            self.assertEqual(mocked_socket.emit.call_count, 1)

    @mock.patch("app.create_and_send_email")
    def test_on_forgot_password(self, send_email):
        session = UnifiedAlchemyMagicMock()
        session.add(models.Users("Jake", "jake@gmail.com", "password", "img", "xyzabc"))
        with mock.patch("app.db.session", SessionObject2()):
            app.on_forgot_password({"email": "jake@gmail.com"})
            app.create_and_send_email.assert_called_once_with(
                "jake@gmail.com", "\n    Hello {},\n    This is your password: a."
            )

    @mock.patch("app.create_and_send_email")
    def test_on_create_task_success(self, send_email):
        session = UnifiedAlchemyMagicMock()
        session.add(models.Participants("testEmail.edu", "gc"))
        session.add(
            models.Projects(
                "gc", "testProj", "Create HomePage using React, HTML, and CSS"
            )
        )
        with mock.patch("app.db.session", session):
            with mock.patch("app.ssl", sslObj()):
                with mock.patch("app.smtplib", smtplibObj()):
                    app.on_create_task(
                        {
                            "email": "testEmail.edu",
                            "title": "Create HomePage",
                            "description": "Create HomePage using React, HTML, and CSS",
                            "deadline": "2020-11-06",
                            "project": "testProj",
                        }
                    )
                    app.create_and_send_email.assert_called_once_with(
                        "testEmail.edu",
                        "\n    Hello {},\n    \n    You have created a task on the Project Manager app!\n    ",
                    )

    def test_on_send_email(self):
        with mock.patch("app.db.session", SessionObject()):
            with mock.patch("app.ssl", sslObj()):
                with mock.patch("app.smtplib", smtplibObj()):
                    app.create_and_send_email("testEmail", "testmessage")

    def test_on_create_project_success(self):
        session = UnifiedAlchemyMagicMock()
        session.add(models.Users("Jake", "jake@gmail.com", "password", "img", "xyzabc"))
        with mock.patch("app.db.session", SessionObject()):
            with mock.patch("app.ssl", sslObj()):
                with mock.patch("app.smtplib", smtplibObj()):
                    app.on_create_project(
                        {
                            "projectName": "testproject",
                            "projectDescription": "test",
                            "code": "xyzabc",
                            "selectedUsers": ["mike", "aarati", "jake", "devin"],
                            "email": "jake@gmail.com",
                        }
                    )

    def test_on_select_task(self):
        session = UnifiedAlchemyMagicMock()
        data = {
            "selectedTask": ["Landing Page"],
            "email": "jake",
        }
        with mock.patch("app.db.session", session):
            app.on_select_task(data)
            session.query.assert_called_once()

    def test_on_complete_task(self):
        session = UnifiedAlchemyMagicMock()
        data = {
            "selectedTask": ["Landing Page"],
            "email": "jake",
            "completed": "true",
        }

        with mock.patch("app.db.session", session):
            app.on_select_task(data)
        session.query.assert_called_once()

    def test_on_complete(self):
        session = UnifiedAlchemyMagicMock()
        session.add(
            models.Tasks(
                "mockTitle", "test", "11-04-2020", "abc", "aarati", "completed"
            )
        )
        data = {
            "email": "jake",
            "t": "true",
        }
        with mock.patch("app.db.session", session):
            app.on_complete_task(data)

    @mock.patch("app.emit_task_list")
    def test_emit_proj(self, emit_task_list):
        app.emit_proj({"gc": "345gbfdsfa"})
        emit_task_list.assert_called_once_with("task list", "345gbfdsfa")

    def test_on_verify_login(self):
        with mock.patch("app.request", RequestObj()):
            app.on_verifylogin(
                {"email": "aarati@email.com", "password": "testpassword"}
            )

    def test_reload(self):
        app.on_reload_page()

    def test_on_update_password(self):
        session = UnifiedAlchemyMagicMock()
        session.add(models.Users("Jake", "email@email", "password", "role", "img"))
        with mock.patch("app.db.session", session):
            app.on_update_password({"email": "email@email", "new_pass": "password"})

    def test_on_data(self):
        session = UnifiedAlchemyMagicMock()
        session.add(models.Users("Jake", "email@email", "password", "role", "img"))
        session.add(models.Participants("email@email", "gc"))
        session.add(models.Projects("gc", "testName", "testDescription"))
        session.add(
            models.Tasks("testTitle", "testDescription", "date", "gc", "owner", "done")
        )
        with mock.patch("app.db.session", session):
            with mock.patch("app.request", RequestObj()):
                app.on_data({"email": "email@email"})

    def test_on_update_pic(self):
        session = UnifiedAlchemyMagicMock()
        session.add(models.Users("Jake", "email@email", "password", "role", "img"))
        with mock.patch("app.db.session", session):
            app.on_update_pic({"email": "email@email", "image": "img"})

    def test_on_update_role(self):
        session = UnifiedAlchemyMagicMock()
        session.add(models.Users("Jake", "email@email", "password", "role", "img"))
        with mock.patch("app.db.session", session):
            app.on_update_role({"email": "email@email", "role": "role"})

    def emit_proj_list(self):
        session = UnifiedAlchemyMagicMock()
        session.add(
            models.Projects(
                "gc", "testProj", "Create HomePage using React, HTML, and CSS"
            )
        )
        with mock.patch("app.db.session", session):
            app.emit_proj_list(CHANNEL, "sid", ["gc"])


if __name__ == "__main__":
    unittest.main()
