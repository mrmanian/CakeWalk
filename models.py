import flask_sqlalchemy
from app import db


class users(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(255))
    profile_img = db.Column(db.String(500))
    group_code = db.Column(db.String(10))
    
    def __init__(self, u, e, i, gc):
        self.username = u
        self.email = e
        self.profile_img = i
        self.group_code = gc
        
    def __repr__(self):
       return '< %i : %s : %d : %s>' % (self.profile_img, self.username, self.email, self.group_code)