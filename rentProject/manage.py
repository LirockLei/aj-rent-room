
from flask import Flask
from flask_script import Manager

from app.home_views import home_blue
from app.models import db
from app.order_views import order_blue
from app.user_views import user_blue

app = Flask(__name__)

app.register_blueprint(blueprint=user_blue, url_prefix='/user')
app.register_blueprint(blueprint=home_blue, url_prefix='/home')
app.register_blueprint(blueprint=order_blue, url_prefix='/order')

# 初始化数据库的配置
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@119.23.253.128:3306/aj8'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

app.secret_key = '123ashufaihsufifs'

manager = Manager(app)

if __name__ == '__main__':
    manager.run()