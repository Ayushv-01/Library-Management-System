from flask_restful import Resource,Api , reqparse , marshal_with , fields 
from flask import request
from flask_security import auth_required , roles_required , current_user 
from werkzeug.datastructures import FileStorage
from .model import Books ,db , Section , Request , Log , IssueBook , Feedback
from datetime import datetime
import magic 
from application.cache_instance import cache

api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument('book_name',type=str,help='Book name is required and should be a string' ,required=True)
parser.add_argument('description' , type=str ,help='Description is required and should be string',required=True)
parser.add_argument('author_name' ,type=str,help='It is required and should be a string',required=True)
parser.add_argument('file',type=FileStorage,help='It is required and should be a File',required=True)
parser.add_argument('price',type=int,help='Price is required and should be integer',required=True)

books_fields = {
    'id': fields.Integer,
    'book_name': fields.String,
    'author_name' : fields.String,
    'description': fields.String,
    'price': fields.Integer
}

section_parser = reqparse.RequestParser()
section_parser.add_argument('section_name',type=str,help='Section name is required and should be a string' ,required=True)
section_parser.add_argument('description' , type=str ,help='Description is required and should be string',required=True)
section_fields = {
    'id': fields.Integer,
    'section_name': fields.String,
    'description': fields.String,
    'date_created': fields.DateTime(dt_format='iso8601')
}




class Book(Resource):
    
    @auth_required('token')
    # @roles_required('admin')
    # @cache.cached(timeout=30,key_prefix='get_all_book')
    def get(self,sec_id=None):
        if sec_id is None:
            all_book = Books.query.all()
        else:
            all_book = Books.query.filter_by(section_id=sec_id).all()
        d=[]
        # print(all_book[0].section_name)
        for book in all_book:
            section = Section.query.get(book.section_id)
            d.append({'id':book.id,'book_name':book.book_name,'author_name':book.author_name,'description':book.description,'price':book.price,'section_name':section.section_name})
        # print(all_book)
        return d
    
    @auth_required('token')
    @roles_required('admin')
    def post(self,sec_id):
        
        data = request.form

        file = request.files.get('file')
        print(data)

        if not data['book_name']:
            return {'message':'Book name is required'},400
        if not data['author_name']:
            return {'message':'Author name is required'},400
        if not data['description']:
            return {'message':'Description is required'},400
        if not data['price']:
            return {'message':'Price is required'},400
        
        book = Books.query.filter_by(book_name=data['book_name']).first()
        print(book)
        if book:
            return {'message':'Book already exists'},400

        if file:
            mime_type = magic.from_buffer(file.read(1024), mime=True)
            if mime_type != 'application/pdf':
                return {'message':'File should be pdf'},400
            else:
                book = Books(book_name=data['book_name'],author_name=data['author_name'],description=data['description'],price=data['price'],file=file.read(),section_id=sec_id)
                db.session.add(book)
                db.session.commit()
                return {'message':'Book created successfully'},200
        else :
            return {'message':'File is required'},400
        
    @auth_required('token')
    @roles_required('admin')
    def put(self , book_id):
        book = Books.query.filter_by(id=book_id).first()
        request_book = Request.query.filter_by(book_id=book_id).all()
        log_book = Log.query.filter_by(book_id=book_id).all()
        issued_book = IssueBook.query.filter_by(book_id=book_id).all()
        if not book:
            return {'message':'Book not found'},404
        data = request.form
        file = request.files.get('file')

        # print(data['section'])

        if data['book_name']:
            existing_book = Books.query.filter(Books.book_name.ilike(data.get('book_name'))).first()
            if existing_book:
                return {'message':'Book already exists, Please Enter Different Name'},400
            else:
                book.book_name = data['book_name']
                for book_request in request_book:
                    book_request.book_name = data['book_name']
                for book_log in log_book:
                    book_log.book_name = data['book_name']
                for book_issue in issued_book:
                    book_issue.book_name = data['book_name']
        if data['author_name']:
            book.author_name = data['author_name']
        if data['description']:
            book.description = data['description']
        if data['price']:
            book.price = data['price']
        if data['section']:
            book.section_id = data['section']   
        if file:
            mime_type = magic.from_buffer(file.read(1024), mime=True)
            if mime_type != 'application/pdf':
                return {'message':'File should be pdf'},400
            else:
                book.file = file.read()
        db.session.commit()
        return {'message':'Book updated successfully'},200

    @auth_required('token')
    @roles_required('admin')
    def delete(self,book_id):
        book = Books.query.filter_by(id=book_id).first()

        if not book:
            return {'message':'Book not found'},404
        else:
            issue_book = IssueBook.query.filter_by(book_id=book_id).all()
            request_book = Request.query.filter_by(book_id=book_id).all()
        
            for i in issue_book:
                db.session.delete(i)
            for j in request_book:
                db.session.delete(j)
            
            db.session.delete(book)
            db.session.commit()
            return {'message':'Book deleted successfully'},200

api.add_resource(Book,'/books' , '/books/<int:sec_id>' , '/books/delete/<int:book_id>' , '/books/update/<int:book_id>')


class Sections(Resource):
    @auth_required('token')
    @roles_required('admin')
    @cache.cached(timeout=30,key_prefix='get_section')
    @marshal_with(section_fields)
    def get(self):
        all_section = Section.query.all()
        # print(all_section[0].book_name)
        return all_section
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = section_parser.parse_args()
        date = datetime.utcnow()
        sec_name = args['section_name']
        description = args['description']
        if not sec_name:
            return {'message':'Section name is required'},400
        if not description:
            return {'message':'Description is required'},400
        
        check_section = Section.query.filter_by(section_name=sec_name).first()
        if check_section:
            return {'message':'Section already exists'},400
        else: 
            section = Section(section_name=args['section_name'],description=args['description'],date_created=date)
            db.session.add(section)
            db.session.commit()
            return {'message':'Section created successfully'},200

    @auth_required('token')
    @roles_required('admin')    
    def put(self,section_id):
        sec = Section.query.filter_by(id=section_id).first()
        if not sec:
            return {'message':'Section not found'},404
        else:
            data = request.get_json()
            if data.get('section_name'):
                existing_section = Section.query.filter(Section.section_name.ilike(data.get('section_name'))).first()
                if existing_section:
                    return {'message': 'Section already exists. Please enter a different name.'}, 400
                else:
                    sec.section_name = data.get('section_name')
            if data.get('description'):
                sec.description = data.get('description')
            db.session.commit()
            return {'message':'Section updated successfully'},200
        
    @auth_required('token')
    @roles_required('admin')    
    def delete(self,section_id):
        this_section = Section.query.get(section_id)
        
        if not this_section:
            return {'message':'Section not found'},404
        else:            
            this_sec_book = this_section.section_detail
            print(this_sec_book)
            for book in this_sec_book:
                b = Books.query.get(book.id)
                issue_book = IssueBook.query.filter_by(book_id=book.id).all()
                for i in issue_book:
                    db.session.delete(i)
                request = Request.query.filter_by(book_id=book.id).all()
                for j in request:
                    db.session.delete(j)
                feedback = Feedback.query.filter_by(book_id=book.id).all()
                for k in feedback:
                    db.session.delete(k)
                log = Log.query.filter_by(book_id=book.id).all()
                for l in log:
                    db.session.delete(l)
                db.session.delete(b)
            db.session.delete(this_section)
            db.session.commit()
            cache.clear()
            return {'message':'Section deleted successfully'},200

api.add_resource(Sections,'/sections','/sections/<int:section_id>')



class UserDetail(Resource):
    @auth_required('token')
    def get(self):
        detail=[]
        detail.append({"role":current_user.roles[0].name ,"email":current_user.email , "name":current_user.username})

        return detail , 200

api.add_resource(UserDetail,'/user')
    