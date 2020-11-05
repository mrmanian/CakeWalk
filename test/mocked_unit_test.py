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
import app
from alchemy_mock.mocking import UnifiedAlchemyMagicMock
import models

class Unit_TestCase_Mock(unittest.TestCase):
    
    def mocked_emit_user_list(self, channel):
        return
    
    def mock_db_insert(self, session):
        session.add(models.users("Jake", "jake@gmail.com", "https://google.com", ""))
        
        
    @mock.patch('app.socketio')
    def test_disconnected_emit(self, mocked_socket):
        app.on_disconnect()
        self.assertEqual(mocked_socket.emit.call_count, 1)
        
    def test_on_newlogin(self):
        session = UnifiedAlchemyMagicMock()
        data = {'uname' : 'Jake', 'email' : 'jake@gmail.com', 'imageurl' : 'https://google.com'}
        with mock.patch('app.db.session', session):
            app.on_newlogin(data)
            query = session.query(models.users).first()
            self.assertEqual(query.username, "Jake")
            self.assertEqual(query.email, "jake@gmail.com")
            self.assertEqual(query.profile_img, "https://google.com")
    
    
    @mock.patch('app.socketio')
    def test_emit_user_list(self, mocked_socket):
        session = UnifiedAlchemyMagicMock()
        with mock.patch('app.db.session', session):
            app.emit_user_list()
            self.assertEqual(mocked_socket.emit.call_count, 1)
            
        
        
        
    
    
        
if __name__ == "__main__":
    unittest.main()
    