from celery import shared_task
from .model import db , User , Log , Role
import time , io 
from datetime import datetime , timedelta
from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText 
from jinja2 import Template


SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'ayushverma@gmail.com'
SENDER_PASSWORD = ''

def send_email_daily(to , subject , content_body):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to
    msg['Subject'] = subject
    msg.attach(MIMEText(content_body, 'html'))
    s = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    s.send_message(msg=msg)
    s.quit()

def send_email_monthly(to , subject , content_body):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to
    msg['Subject'] = subject
    msg.attach(MIMEText(content_body, 'html'))
    s = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    s.send_message(msg=msg)
    s.quit()

@shared_task(ignore_result=True)
def daily_reminder(subject):

    users = User.query.filter(User.roles.any(Role.name=='user')).all()
    for user in users :
        if user.last_login_at != datetime.utcnow().date():
            with open('./templates/daily_reminder.html', 'r') as f:
                template = Template(f.read())
                send_email_daily(user.email,subject,template.render(user=user.username))
    return "Daily Reminder sent"


@shared_task(ignore_result=True)
def send_monthly_report():
    users = User.query.filter(User.roles.any(Role.name=='user')).all()
    start_date = datetime.utcnow().replace(day=1)-timedelta(days=30)
    for user in users:
        books = Log.query.filter(
            Log.user_id == user.id,
            Log.date >= datetime.utcnow() - timedelta(days=30),
            Log.date < datetime.utcnow()
        ).all()

        requested =0
        issued =0
        for book in books:
            if book.status=="Requested":
                requested+=1
            elif book.status=="Approved":
                issued+=1

        data = {"user":user.username,"requested":requested,"issued":issued , "month_of_report":start_date.strftime("%B %Y")} 
        with open('./templates/monthly_report.html', 'r') as f:
            template = Template(f.read())
            send_email_monthly(user.email, "Monthly Report",template.render(data= data))
    
    return "Monthly Report Sent Successfully"

