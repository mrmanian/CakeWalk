import flask_sqlalchemy
from app import db


class Chatlog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120))
    message = db.Column(db.String(500))
    imageurl = db.Column(db.String(1000))
    
    def __init__(self, u, m, i):
        self.message = m
        self.username = u
        self.imageurl = i
    
    def __repr__(self):
       return '< %i : %s : %d>' % (self.imageurl, self.username, self.message)