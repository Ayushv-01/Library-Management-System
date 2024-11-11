from flask import Flask
from flask_security import SQLAlchemyUserDatastore , Security
from application.model import db , Log , IssueBook
from datetime import datetime
from config import DevelopmentConfig
from application.resources import api
from application.security import datastore
from application.worker import celery_init_app
from application.task import daily_reminder , send_monthly_report
from celery.schedules import crontab
from celery import shared_task
from application.cache_instance import cache


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
   
    app.security = Security(app,datastore)
    cache.init_app(app)
    with app.app_context():
        import application.routes

    return app

app = create_app()
celery_app = celery_init_app(app)


@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        10.0,
        daily_reminder.s('Daily Reminder'),
    )
    sender.add_periodic_task(
        100.0
        ,send_monthly_report.s(),name="reminder every 30 second")
    
    sender.add_periodic_task(30,job.s())
        

@shared_task(ignore_result=True)
def job():
    with app.app_context():
        print('entered job')
        issued_book = IssueBook.query.all()
        for iss_book in issued_book:
            if iss_book.return_date <= datetime.today().date() :
                log = Log(user_id=iss_book.user_id,
                          book_id=iss_book.book_id,
                          user_name=iss_book.user_name,
                          book_name=iss_book.book_name,
                          status='Revoked Automatically',
                          date=datetime.today().date())
                db.session.add(log)
                db.session.delete(iss_book)
        
        db.session.commit()
        print('exiting job')


if __name__=='__main__':
    app.run(debug=True)
