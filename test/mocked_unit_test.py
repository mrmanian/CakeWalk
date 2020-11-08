import unittest
import unittest.mock as mock
from unittest.mock import patch, Mock
import os
import sys
import inspect
current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)
import json
from alchemy_mock.mocking import UnifiedAlchemyMagicMock
import app
from app import CHANNEL
import models
KEY_INPUT = "input"
KEY_EXPECTED = "expected"

class Unit_TestCase_Mock(unittest.TestCase):
    """Unit Tests for app.py"""
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
#______________________________________________________________________________________________________

class MockSSLContext:
        def __init__(self, wrap_socket, status_code):
            self.wrap_socket = wrap_socket
            self.status_code = status_code
            
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
        
class sendMailObj:
    def __init__(self):
        return None
    def sendmail(self):
        return None
    def login(self):
        return None
        
    
class test_create_task(unittest.TestCase):
    def test_create_and_send_email_success(self):
        session = UnifiedAlchemyMagicMock()
        with mock.patch("app.db.session", session):
            with mock.patch("app.smtplib", smtplibObj()):
                app.create_and_send_email()
     
if __name__ == "__main__":
    unittest.main()
