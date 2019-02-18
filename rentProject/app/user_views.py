import os
import random
import re
import uuid

from flask import Blueprint, render_template, jsonify, session, request

from app.models import User, House
from utils.functions import is_login

user_blue = Blueprint('user', __name__)


# 注册
@user_blue.route('/register/', methods=['GET'])
def register():
    return render_template('register.html')


@user_blue.route('/register/', methods=['POST'])
def my_register():
    # 获取参数
    mobile = request.form.get('mobile')
    imagecode = request.form.get('imagecode')
    passwd = request.form.get('passwd')
    passwd2 = request.form.get('passwd2')
    # 验证所有参数是否填写
    if not all([mobile, imagecode, passwd, passwd2]):
        return jsonify({'code': 1001, 'msg': '请填写完整参数'})
    # 验证手机号
    if not re.match('^1[3456789]\d{9}$', mobile):
        return jsonify({'code': 1002, 'msg': '手机号格式不正确'})
    # 验证图片验证码
    if session['img_code'] != imagecode:
        return jsonify({'code': 1003, 'msg': '验证码不正确'})
    # 验证密码和确认密码是否一致
    if passwd != passwd2:
        return jsonify({'code': 1004, 'msg': '两次密码不一致'})
    # 验证手机号是否被注册
    user = User.query.filter_by(phone=mobile).first()
    if user:
        return jsonify({'code': 1005, 'msg': '手机号已被注册'})
    # 创建注册信息
    user = User()
    user.phone = mobile
    user.name = mobile
    user.password = passwd
    user.add_update()
    return jsonify({'code': 200, 'msg': '注册成功'})


# 验证码
@user_blue.route('/code/', methods=['GET'])
def get_code():
    # 获取验证码
    # 方式一：后端生成图片，并返回验证码图片的地址(不推荐)
    # 方式二：后端只生成随机参数，返回给页面，在页面中再生成图片(前端做)
    s = '1234567890qwertyuiopasdfghJKLZXCVBNMASDFGH'
    code = ''
    for i in range(4):
        code += random.choice(s)
    session['img_code'] = code
    return jsonify({'code': 200, 'msg': '请求成功', 'data': code})


# 登录
@user_blue.route('/login/', methods=['GET'])
def login():
    return render_template('login.html')


@user_blue.route('/login/', methods=['POST'])
def my_login():
    # 获取参数
    mobile = request.form.get('mobile')
    password = request.form.get('passwd')
    # 验证手机号
    if not mobile:
        return jsonify({'code': 2001, 'msg': '手机号不能为空'})
    if not re.match('^1[3456789]\d{9}$', mobile):
        return jsonify({'code': 2002, 'msg': '手机号格式不正确'})
    # 验证账号密码
    user = User.query.filter(User.phone == mobile).first()
    if not user:
        return jsonify({'code': 2003, 'msg': '该手机号尚未注册，请先注册'})
    if not user.check_pwd(password):
        return jsonify({'code': 2004, 'msg': '密码输入错误'})
    session['user_id'] = user.id
    return jsonify({'code': 200, 'msg': '登录成功'})


# 首页
@user_blue.route('/index/', methods=['GET'])
def index():
    return render_template('index.html')


@user_blue.route('/index_info/', methods=['GET'])
def index_info():
    houses = House.query.all()
    if len(houses) <= 3:
        data = [house.to_dict() for house in houses]
    else:
        data = [house.to_dict() for house in houses[:3]]
    return jsonify({'code': 200, 'msg': '请求成功', 'data': data})


# 个人中心
@user_blue.route('/mine/', methods=['GET'])
@is_login
def mine():
    return render_template('my.html')


# 个人信息
@user_blue.route('/user_info/', methods=['GET'])
def user_info():
    user_id = session['user_id']
    if user_id:
        user = User.query.filter_by(id=user_id).first()
        return jsonify({'code': 200, 'msg': '请求成功', 'data': user.to_basic_dict()})
    return jsonify({'code': 250, 'msg': '请求失败'})


# 修改个人信息
@user_blue.route('/profile/', methods=['GET'])
@is_login
def profile():
    return render_template('profile.html')


@user_blue.route('/profile/', methods=['POST'])
@is_login
def my_profile():
    # 获取参数
    avatar = request.files.get('avatar')
    # 获取当前登录对象
    user_id = session['user_id']
    user = User.query.get(user_id)
    # 验证并保存图片
    if avatar:
        # 获取项目根路径
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # 获取媒体文件路径
        MEDIA_DIR = os.path.join(BASE_DIR, 'static/media')
        # 随机生成图片名称
        filename = str(uuid.uuid4())
        a = avatar.mimetype.split('/')[-1:][0]
        icon = filename + '.' + a
        # 拼接图片地址
        path = os.path.join(MEDIA_DIR, icon)
        # 保存到本地
        avatar.save(path)
        # 修改并保存对象属性到数据库
        user.avatar = icon
        user.add_update()
        return jsonify({'code': 200, 'msg': '修改成功'})

    name = request.form.get('name')
    if name:
        # 验证用户名
        user0 = User.query.filter(User.name == name).first()
        if user0:
            return jsonify({'code': 3001, 'msg': '用户名已存在，请重新输入'})
        user.name = name
        user.add_update()
        return jsonify({'code': 200, 'msg': '修改成功'})


# 退出
@user_blue.route('/logout/', methods=['GET'])
def logout():
    session['user_id'] = ''
    return jsonify({'code': 200, 'msg': '退出成功'})


# 实名认证
@user_blue.route('/auth/', methods=['GET'])
def auth():
    return render_template('auth.html')


@user_blue.route('/auth/', methods=['POST'])
def my_auth():
    real_name = request.form.get('real_name')
    # 验证姓名
    if not real_name:
        return jsonify({'code': 5001, 'msg': '姓名不能为空'})
    id_card = request.form.get('id_card')
    # 验证身份证号码
    if not re.match('^[1-9]\d{7}((0\d)|(1[0-2]))'
                    '(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))'
                    '(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$', id_card):
        return jsonify({'code': 5002, 'msg': '身份证格式不正确'})
    # 验证身份证号是否已认证
    user1 = User.query.filter(User.id_card == id_card).first()
    if user1:
        return jsonify({'code': 5003, 'msg': '该身份证号已被认证'})
    # 获取当前登录对象
    user_id = session['user_id']
    user = User.query.get(user_id)
    # 将信息存入数据库
    user.id_card = id_card
    user.id_name = real_name
    user.add_update()
    return jsonify({'code': 200, 'msg': '实名认证成功'})


@user_blue.route('/auth_info/', methods=['GET'])
def auth_info():
    user_id = session['user_id']
    user = User.query.filter_by(id=user_id).first()
    if all([user.id_card, user.id_name]):
        return jsonify({'code': 200, 'msg': '请求成功', 'data': user.to_auth_dict()})
    return jsonify({'code': 250, 'msg': '请求失败'})






