import flask_sqlalchemy
from app import db


class Chatlog(db.Model):
    msg_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120))
    message = db.Column(db.String(500))
    
    def __init__(self, u, m):
        self.message = m
        self.user = u
    
    def __repr__(self):
       return '<%s : %d>' % (self.user, self.message)