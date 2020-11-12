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


class Unit_TestCase_Mock(unittest.TestCase):
    def mocked_emit_user_list(self, channel):
        return

    def mock_db_insert(self, session):
        session.add(models.Users("Jake", "jake@gmail.com", "https://google.com", ""))

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
        session = UnifiedAlchemyMagicMock()
        data = {
            "uname": "Jake",
            "email": "jake@gmail.com",
            "imageurl": "https://google.com",
        }
        with mock.patch("app.db.session", session):
            with mock.patch("app.request", RequestObj()):
                app.on_newlogin(data)
                session.query.assert_called_once()

    @mock.patch("app.socketio")
    def test_emit_user_list(self, mocked_socket):
        session = UnifiedAlchemyMagicMock()
        with mock.patch("app.db.session", session):
            app.emit_user_list(CHANNEL)
            self.assertEqual(mocked_socket.emit.call_count, 1)
    
    def test_on_create_task_success(self):
        session = UnifiedAlchemyMagicMock()
        session.add(models.Users("Jake", "jake@gmail.com", "", ""))
        print("not here")
        print(session.query(models.Users).all())
        with mock.patch("app.db.session", session):
            with mock.patch("app.smtplib", smtplibObj()):
                app.on_create_task(
                    {
                        "email": "jake@gmail.com",
                        "title": "Create HomePage",
                        "description": "Create HomePage using React, HTML, and CSS",
                        "deadline": "2020-11-06",
                    }
                )
        
    def test_on_create_project_success(self):
        session2 = UnifiedAlchemyMagicMock()
        session2.add(models.Users("Jake", "jake@gmail.com", "", ""))
        print("here")
        print(session2.query(models.Users).all())
        with mock.patch("app.db.session", session2):
            with mock.patch("app.smtplib", smtplibObj()):
                app.on_create_project(
            {           "projectName": "testproject",
                        "projectDescription": "test",
                        "code": "xyzabc",
                        "selectedUsers": "aarati",
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


if __name__ == "__main__":
    unittest.main()
