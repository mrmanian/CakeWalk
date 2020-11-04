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
from alchemy_mock.mocking import AlchemyMagicMock


class Unit_TestCase_Mock(unittest.TestCase):
    
    def mocked_emit_user_list(self, channel):
        return
    
    @mock.patch('app.socketio')
    def test_connected_emit(self, mocked_socket, message_method):
        message_method.side_effect = self.mocked_emit_user_list("channel")
        app.on_connect()
        self.assertEqual(mocked_socket.emit.call_count, 1)
        
    @mock.patch('app.socketio')
    def test_disconnected_emit(self, mocked_socket, message_method):
        message_method.side_effect = self.mocked_emit_user_list("channel")
        app.on_disconnect()
        self.assertEqual(mocked_socket.emit.call_count, 1)
        
    
        
    