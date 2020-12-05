from app import db


class Users(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    role = db.Column(db.String(255))
    profile_img = db.Column(db.String(10000))

    def __init__(self, u, e, p, r, i):
        self.username = u
        self.email = e
        self.password = p
        self.role = r
        self.profile_img = i

    def __repr__(self):
        return "< %s : %s : %s : %s : %s >" % (
            self.profile_img,
            self.username,
            self.email,
            self.password,
            self.role,
        )


class Projects(db.Model):
    proj_id = db.Column(db.Integer, primary_key=True)
    group_code = db.Column(db.String(10))
    proj_name = db.Column(db.String(500))
    p_description = db.Column(db.String(10000))

    def __init__(self, gc, pn, d):
        self.group_code = gc
        self.proj_name = pn
        self.p_description = d

    def __repr__(self):
        return "< %s : %s : %s >" % (
            self.group_code,
            self.proj_name,
            self.p_description,
        )


class Tasks(db.Model):
    task_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    t_description = db.Column(db.String(10000))
    date = db.Column(db.String(255))
    group_code = db.Column(db.String(10))
    task_owner = db.Column(db.String(255))
    complete_status = db.Column(db.String(10))

    def __init__(self, t, td, d, gc, to, cs):
        self.title = t
        self.t_description = td
        self.date = d
        self.group_code = gc
        self.task_owner = to
        self.complete_status = cs

    def __repr__(self):
        return "< %s : %s : %s : %s : %s : %s >" % (
            self.title,
            self.t_description,
            self.date,
            self.group_code,
            self.task_owner,
            self.complete_status,
        )


class Participants(db.Model):
    par_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255))
    group_code = db.Column(db.String(10))

    def __init__(self, e, gc):
        self.email = e
        self.group_code = gc

    def __repr__(self):
        return "< %s : %s >" % (self.email, self.group_code)
