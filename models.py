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
       
class Projects(db.Model):
    proj_id = db.Column(db.Integer, primary_key=True)
    group_code = db.Column(db.Integer)
    proj_name = db.Column(db.String(500))
    p_description = db.Column(db.String(1000))
    
    def __init__(self, pi, gc, pn, d):
        self.proj_id = pi
        self.group_code = gc
        self.proj_name = pn
        self.p_description = d
        
    def __repr__(self):
        return '< %i : %d : %d >' % (self.group_code, self.proj_name, self.description)
    
class Tasks(db.Model):
    task_id = db.Column(db.Integer, primary_key=True)
    proj_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    title = db.Column(db.String(255))
    t_description = db.Column(db.String(1000))
    date = db.Column(db.String(255))
    
    def __init__(self, ti, pi, ui, t, td, d):
        self.task_id = ti
        self.proj_id = pi
        self.user_id = ui
        self.title = t
        self.t_description = td
        self.date = d
        
    def __repr__(self):
        return '< %s : %s : %s : %s >' % (self.title, self.title, self.t_description, self.date)