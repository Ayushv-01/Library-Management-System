from flask import  current_app as app , request , jsonify ,render_template , send_file
from flask_security import auth_required,roles_required , current_user
from .security import datastore
from .model import db , Request , Books , Log , IssueBook , Section , Feedback ,User
from werkzeug.security import generate_password_hash , check_password_hash
import validators
from datetime import datetime , timedelta
import io 
from .cache_instance import cache

# from .model import User,db
# from werkzeug.security import check_password_hash
@app.get('/')
def home():
    return render_template('index.html')


@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return 'Welcome Admin'


@app.post('/user-login')
def user_login():
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({"message": "Username is required"}), 400
    
    if not data.get('password'):
        return jsonify({"message": "Password is required"}), 400
    
    user = datastore.find_user(username=username)
    # print(user.roles)
    if user is None:
        return jsonify({"message": "User not found"}), 404
    else:
        if check_password_hash(user.password, data.get('password')):
            update =User.query.filter_by(id=user.id)
            update.last_login_at = datetime.utcnow()
            db.session.commit()
            return jsonify({"token": user.get_auth_token() , "email":user.email , "role":user.roles[0].name , "id":user.id})

        else:
            return {"message": "Invalid credentials"}, 400
        

@app.post('/user-register')
def user_signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password=data.get('password')
     
    if not username:
        return jsonify({"message":  "Username not provided"}), 400
    if not email:
        return jsonify({"message":  "Email not provided"}), 400
    if not validators.email(email):
        return jsonify({"message":  "Invalid email"}), 400
    if not password:
        return jsonify({"message":  "Password not provided"}), 400
    if len(password)<4:
        return jsonify({"message":  "Password too short"}), 400
    duplicate_email = datastore.find_user(email=email)
    if duplicate_email is not None:
        return jsonify({"message":  "Email already exists"}), 400
    duplicate_user = datastore.find_user(username=username)
    if duplicate_user is not None:
        return jsonify({"message":  "Username already exists"}), 400
    else:
        user =datastore.create_user(username=username ,email=email ,password= generate_password_hash(password) ,last_login_at=datetime.utcnow(), roles=['user'])
        db.session.commit()
        return jsonify({"token": user.get_auth_token() , "email":user.email , "role":user.roles[0].name , "id":user.id})
    


@app.get('/request/<int:book_id>')
@auth_required("token")
def request_book(book_id):
    try: 
        user_id = current_user.id    
        number_of_request = Request.query.filter_by(user_id=user_id).all()
        if len(number_of_request)>=5:
            return {"message": "Request limit reached!!"} , 403
        else:
            
            req = Request.query.filter_by(user_id = user_id , book_id = book_id).first()
            already_issued = IssueBook.query.filter_by(user_id=user_id,book_id=book_id).first()
            if req :
                return {"message": "Book Already requested !!"} , 400
            if already_issued:
                return {'message': 'Book already issued'}, 400
            else:
                new_request = Request(user_id = current_user.id,
                                book_id =  book_id,
                                user_name = current_user.username,
                                book_name = Books.query.get(book_id).book_name)
                
                new_log = Log(user_id = current_user.id,
                                book_id =  book_id,
                                user_name = current_user.username,
                                book_name = Books.query.get(book_id).book_name,
                                status="Requested",
                                date = datetime.utcnow())

                db.session.add(new_request)
                db.session.add(new_log)
                db.session.commit()
                return {"message": "Book Requested Successfully"} , 200

    except Exception as e:
        return {"message": "Something went wrong"} , 500
        

@app.get('/view_request')
@auth_required("token")
@roles_required("admin")
def view_request():
    try :
        user_request = Request.query.all()
        d=[]
        for i in user_request:
            d.append({"id":i.id,"user_name":i.user_name,"book_name":i.book_name})
        
        return d ,200
    
    except Exception as e:
        return {"message": "Something went wrong"} , 500

@app.get('/view_issue_book')
@auth_required("token")
@roles_required("admin")
def view_issue_book():
    try: 
        issue_book = IssueBook.query.all()
        b=[]
        for i in issue_book:
            b.append({"id":i.id,"user_name":i.user_name,"book_name":i.book_name , "issue_date":i.date_of_issue, "return_date":i.return_date})
        return b ,200

    except Exception as e:
        return {"message": "Something went wrong"} , 500


@app.get('/approve_request/<int:request_id>')
@auth_required("token")
@roles_required("admin")
def approve_request(request_id):
    try :
        req = Request.query.get(request_id)
        new_issue = IssueBook(user_id = req.user_id,
                            book_id = req.book_id,
                            user_name = req.user_name,
                            book_name = req.book_name,
                            date_of_issue = datetime.utcnow().date(),
                            return_date = (datetime.utcnow()+timedelta(days=7)).date()
                            )
        print((datetime.utcnow()+timedelta(days=7)).date())

        new_log = Log(user_id = req.user_id,
                    book_id = req.book_id,
                    user_name = req.user_name,
                    book_name = req.book_name,
                    status="Approved",
                    date = datetime.utcnow().date())
        
        db.session.add(new_issue)
        db.session.add(new_log)
        db.session.delete(req)
        db.session.commit()
        return {"message": "Request Approved"} , 200
    
    except Exception as e:
        return {"message": "Something went wrong"} , 500


@app.get('/reject_request/<int:request_id>')
@auth_required("token")
@roles_required("admin")
def reject_request(request_id):
    try :
        req = Request.query.get(request_id)
        new_log = Log(user_id = req.user_id,
                    book_id = req.book_id,
                    user_name = req.user_name,
                    book_name = req.book_name,
                    status="Rejected",
                    date = datetime.utcnow().date())
        
        db.session.add(new_log)
        db.session.delete(req)
        db.session.commit()
        return {"message": "Request Rejected"} , 200

    except Exception as e:
        return {"message": "Something went wrong"} , 500


@app.get('/revoke/<int:issue_id>')
@auth_required("token")
def revoke(issue_id):
    try :
        issue = IssueBook.query.get(issue_id)
        
        log = Log(user_id=issue.user_id,
                book_id=issue.book_id,
                user_name=issue.user_name,
                book_name=issue.book_name,
                status="Revoked",
                date=datetime.utcnow().date()
                )

        db.session.add(log)
        db.session.delete(issue)
        db.session.commit()

        return {"message": "Book revoked"} , 200
    
    except Exception as e:
        return {"message": "Something went wrong"} , 500
    

@app.get('/return/<int:book_id>')
@auth_required("token")
@roles_required("user")
def return_book(book_id):
    try:
        issue = IssueBook.query.filter_by(user_id=current_user.id,book_id=book_id).first()
        log = Log(user_id=current_user.id,
                book_id=issue.book_id,
                user_name=current_user.username,
                book_name=issue.book_name,
                status="Returned",
                date=datetime.utcnow().date()
                )
        db.session.add(log)
        db.session.delete(issue)
        db.session.commit()
        return {"message": "Book returned"} , 200
    except Exception as e:
        return {"message": "Something went wrong"} , 500

@app.get('/my_books')
@auth_required("token")
@roles_required("user")
def my_books():
    try:
        issue_books = IssueBook.query.filter_by(user_id=current_user.id).all()
        b=[]
        for i in issue_books:
            book = Books.query.get(i.book_id)
            section = Section.query.get(book.section_id)
            b.append({"id":i.id,"book_id":i.book_id,"author":book.author_name,"section":section.section_name,"book_name":i.book_name , "return_date":i.return_date , "price":book.price})
        return b, 200
    except Exception as e:
        return {"message": "Something went wrong"} , 500
    


@app.get('/read_book/<int:book_id>')
@auth_required('token')
def read_book(book_id):
    try:
        book = Books.query.get(book_id)
        user_id = current_user.id
        is_book_issued = IssueBook.query.filter_by(user_id=user_id,book_id=book_id).first()
        if is_book_issued or current_user.roles[0].name=="admin":
            return send_file(
            io.BytesIO(book.file),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'{book.book_name}.pdf') , 200
        else:
            return {"message":"You are not authorized to see this book"},403
    except Exception as e:
        return {"message": "Something went wrong"} , 500
    

@app.post('/give_feedback/<int:book_id>')
@auth_required('token')
@roles_required('user')
def give_feedback(book_id):
    try:
        feed = Feedback.query.filter_by(user_id=current_user.id,book_id=book_id).first()
        print(feed)
        if feed:
            return {"message": "Feedback already given"} , 400
        else:
            data = request.get_json()
            print(data)
            if data['feedback_text'] == "":
                return {"message": "Feedback cannot be empty"} , 400
            new_feed = Feedback(user_id = current_user.id,
                                book_id=book_id,
                                feedback=data['feedback_text']
                                )
            db.session.add(new_feed)
            db.session.commit()
            return {"message": "Thank you for giving Feedback"} , 200

    except Exception as e:
        return jsonify({"message": e}) , 500
    

@app.get('/read_feedback/<int:book_id>')
@auth_required('token')
def read_feedback(book_id):
    try:
        feed = Feedback.query.filter_by(book_id=book_id).all()
        b=[]
        for i in feed:
            b.append({"feedback":i.feedback})
        return b, 200
    except Exception as e:
        return {"message": "Something went wrong"} , 500
    


@app.get('/logs')
@auth_required('token')
@roles_required('user')
@cache.cached(timeout=30,key_prefix='log')
def logs():
    try :
        user_id = current_user.id
        logs = Log.query.filter_by(user_id=user_id).all()
        b=[]
        if logs:
            for i in logs:
                b.append({"user_name":i.user_name,"book_name":i.book_name,"status":i.status,"date":i.date})
            return b, 200
    except Exception as e:
        return {"message": "Something went wrong"} , 500
    

@app.get('/all_logs')
@auth_required('token')
@roles_required('admin')
@cache.cached(timeout=30,key_prefix='all_logs')
def all_logs():
    try :
        logs = Log.query.all()
        b=[]
        for i in logs:
            b.append({"user_name":i.user_name,"book_name":i.book_name,"status":i.status,"date":i.date})
        return b, 200
    except Exception as e:
        return {"message": "Something went wrong"} , 500
    

@app.get('/all_sections')
@auth_required('token')
def all_sections():
    try:
        sections = Section.query.all()
        b=[]
        for i in sections:
            b.append({"id":i.id,"section_name":i.section_name})
        return b, 200
    except Exception as e:
        return {"message": "Something went wrong"} , 500
    
@app.post('/search')
@auth_required('token')
def search():
    book_name = request.args.get('book_name','')
    author_name = request.args.get('author_name','')
    section = request.args.get('section',None,type=int)


    # print("b",book_name, "a",author_name , "s",section)
    query = Books.query
    if book_name:
        query = query.filter(Books.book_name.like(f"{book_name}%"))
    if author_name:
        query = query.filter(Books.author_name.like(f"{author_name}%"))
    if section is not None:
        query = query.filter(Books.section_id==section)

    result = query.all()
    book_list=[]
    # print(result)
    for i in result:
        b_id = i.id
        b_name = i.book_name
        a_name = i.author_name
        sec_id = i.section_id
        sec_name = Section.query.get(sec_id).section_name
        book_list.append({"id":b_id , "book_name":b_name , "author_name":a_name , "section":sec_name})
    # print(book_list)
    return book_list , 200
