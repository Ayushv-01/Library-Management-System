from flask_sqlalchemy import SQLAlchemy 
from flask_security import UserMixin , RoleMixin 

db = SQLAlchemy()

from sqlalchemy import LargeBinary


class UserRole(db.Model):
    __tablename__='user_role'
    id = db.Column(db.Integer(),primary_key=True)
    user_id = db.Column(db.Integer(),db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'))


class User(db.Model , UserMixin):
    id = db.Column(db.Integer(),primary_key=True,autoincrement=True)
    username = db.Column(db.String(length=30),nullable=False,unique=True)
    email = db.Column(db.String(length=50),nullable=False)
    password = db.Column(db.String(length=60),nullable=False)
    last_login_at = db.Column(db.Date())
    fs_uniquifier = db.Column(db.String(255),unique=True,nullable=False)
    active = db.Column(db.Boolean())
    roles = db.relationship('Role' , secondary='user_role' , backref = db.backref('user',lazy='dynamic'))
    


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(),primary_key=True)
    name= db.Column(db.String(30),unique=True)
    description = db.Column(db.String(255))

class Books(db.Model):
    id = db.Column(db.Integer(),primary_key=True,autoincrement=True)
    book_name = db.Column(db.String(length=100),nullable=False,unique=True)
    author_name = db.Column(db.String(length=100),nullable=False)
    description = db.Column(db.String())
    price = db.Column(db.Integer())
    file = db.Column(db.BLOB)
    section_id = db.Column(db.Integer(),db.ForeignKey('section.id'),nullable=False)
    section = db.relationship('Section' , backref='section_detail')

class Section(db.Model):
    id = db.Column(db.Integer(),primary_key=True,autoincrement=True)
    section_name = db.Column(db.String(),nullable=False,unique=True)
    date_created = db.Column(db.Date(),nullable=False)
    description = db.Column(db.String(),nullable=False)

class IssueBook(db.Model):
    id = db.Column(db.Integer(),primary_key=True,autoincrement=True)
    user_id = db.Column(db.Integer(),db.ForeignKey('user.id'),nullable=False)
    book_id = db.Column(db.Integer(),db.ForeignKey('books.id'),nullable=False)
    user_name =  db.Column(db.String(),nullable=False)
    book_name = db.Column(db.String(),nullable=False)
    date_of_issue = db.Column(db.Date())
    return_date = db.Column(db.Date())

class Request(db.Model):
    id = db.Column(db.Integer(),primary_key=True,autoincrement=True)
    user_id = db.Column(db.Integer(),db.ForeignKey('user.id'),nullable=False)
    book_id = db.Column(db.Integer(),db.ForeignKey('books.id'),nullable=False)
    user_name =  db.Column(db.String(),nullable=False)
    book_name = db.Column(db.String(),nullable=False)

class Log(db.Model):
    id = db.Column(db.Integer(),primary_key=True,autoincrement=True)
    user_id = db.Column(db.Integer(),db.ForeignKey('user.id'),nullable=False)
    book_id = db.Column(db.Integer(),db.ForeignKey('books.id'),nullable=False)
    user_name =  db.Column(db.String(),nullable=False)
    book_name = db.Column(db.String(),nullable=False)
    status = db.Column(db.String())
    date = db.Column(db.Date())


class Feedback(db.Model):
    id = db.Column(db.Integer(),primary_key=True,autoincrement=True)
    user_id = db.Column(db.Integer(),db.ForeignKey('user.id'),nullable=False)
    book_id = db.Column(db.Integer(),db.ForeignKey('books.id'),nullable=False)
    feedback = db.Column(db.String(),nullable=True)
    book = db.relationship('Books', backref='feedbacks')

