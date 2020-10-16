import flask_sqlalchemy
from app import db


class Chatlog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120))
    message = db.Column(db.String(500))
    imageurl = db.Column(db.String(1000))
    urltype = db.Column(db.String(10))
    
    def __init__(self, u, m, i, t):
        self.message = m
        self.username = u
        self.imageurl = i
        self.urltype = t
    def __repr__(self):
       return '< %i : %s : %d : %s>' % (self.imageurl, self.username, self.message, self.urltype)