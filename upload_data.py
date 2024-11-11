from main import app 
from application.security import datastore
from application.model import db,Role
from flask_security import hash_password
from datetime import datetime
from werkzeug.security import  generate_password_hash
with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name='admin' , description='User is an admin')
    datastore.find_or_create_role(name='user' , description='General User')
    db.session.commit()

    if not datastore.find_user(email='admin@gmail.com'):
        datastore.create_user(username='Librarian' ,email='admin@gmail.com',last_login_at=datetime.utcnow() , password= generate_password_hash("1234"),roles=['admin'])
    # if not datastore.find_user(email='user@gmail.com'):
    #     datastore.create_user(username='ayush' ,email='user@gmail.com' ,password= generate_password_hash("1234") ,roles=['user'] )
    
    db.session.commit()

