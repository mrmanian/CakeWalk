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

    @mock.patch("app.socketio")
    def test_disconnected_emit(self, mocked_socket):
        app.on_disconnect()
        self.assertEqual(mocked_socket.emit.call_count, 1)

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
                query = session.query(models.Users).first()
                self.assertEqual(query.username, "Jake")
                self.assertEqual(query.email, "jake@gmail.com")
                self.assertEqual(query.profile_img, "https://google.com")

    @mock.patch("app.socketio")
    def test_emit_user_list(self, mocked_socket):
        session = UnifiedAlchemyMagicMock()
        with mock.patch("app.db.session", session):
            app.emit_user_list(CHANNEL)
            self.assertEqual(mocked_socket.emit.call_count, 1)

    """
    def test_create_and_send_email_success(self):
        session = UnifiedAlchemyMagicMock()
        with mock.patch("app.db.session", session):
            with mock.patch("app.smtplib", smtplibObj()):
                app.create_and_send_email("email")
    """

    def test_on_create_task_success(self):
        session = UnifiedAlchemyMagicMock()
        with mock.patch("app.db.session", session):
            with mock.patch("app.smtplib", smtplibObj()):
                app.on_create_task(
                    {
                        "email": "testEmail.edu",
                        "title": "Create HomePage",
                        "description": "Create HomePage using React, HTML, and CSS",
                        "deadline": "2020-11-06",
                    }
                )

    def test_on_create_project_success(self):
        session = UnifiedAlchemyMagicMock()
        data = {
            "projectName": "Mike",
            "projectDescription": "This is a description",
            "groupCode": "38n5hHdk35",
            "selectedUsers": ["Mike", "Jake", "Aarati", "Devin"],
        }
        with mock.patch("app.db.session", session):
            with mock.patch("app.request", RequestObj()):
                app.on_create_project(data)
                query = session.query(models.Projects).first()
                self.assertEqual(query.proj_name, "Mike")
                self.assertEqual(query.p_description, "This is a description")
                self.assertEqual(query.group_code, "38n5hHdk35")
                
    def test_on_select_task(self):
        session = UnifiedAlchemyMagicMock()
        data = {
            "titles": ["Landing Page"],
            "owner" : "jake",
        }
        with mock.patch("app.db.session", session):
            app.on_select_task(data)
            query = session.query(models.Tasks).first()
            self.assertEqual(query.task_owner, "jake")
            self.assertEqual(query.title, "Landing Page")

if __name__ == "__main__":
    unittest.main()
