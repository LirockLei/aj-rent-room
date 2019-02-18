import os
import uuid

from flask import Blueprint, render_template, session, jsonify, request

from app.models import User, Area, House, Facility, HouseImage
from utils.functions import is_login

home_blue = Blueprint('home', __name__)


# 我的房源
@home_blue.route('/myHouse/', methods=['GET'])
def my_house():
    return render_template('myhouse.html')


# 房源信息显示
@home_blue.route('/house_info/', methods=['GET'])
def house_info():
    user = User.query.get(session['user_id'])
    if all([user.id_name, user.id_card]):
        return jsonify({'code': 200, 'msg': '请求成功'})
    return jsonify({'code': 250, 'msg': '请求失败'})


# 发布新房源
@home_blue.route('/newHouse/', methods=['GET'])
@is_login
def new_house():
    return render_template('newhouse.html')


@home_blue.route('/newHouse/', methods=['POST'])
@is_login
def my_new_house():
    # 生成对象
    house = House()
    # 获取参数
    title = request.form.get('title')
    price = request.form.get('price')
    area_id = request.form.get('area_id')
    address = request.form.get('address')
    room_count = request.form.get('room_count')
    acreage = request.form.get('acreage')
    unit = request.form.get('unit')
    capacity = request.form.get('capacity')
    beds = request.form.get('beds')
    deposit = request.form.get('deposit')
    min_days = request.form.get('min_days')
    max_days = request.form.get('max_days')
    # 获取设施参数
    facilities = request.form.getlist('facility')
    for facility_id in facilities:
        facility = Facility.query.get(facility_id)
        # 多对多关联
        house.facilities.append(facility)
    # 提交参数
    house.user_id = session['user_id']
    house.title = title
    house.price = price
    house.area_id = area_id
    house.address = address
    house.room_count = room_count
    house.acreage = acreage
    house.unit = unit
    house.capacity = capacity
    house.beds = beds
    house.deposit = deposit
    house.min_days = min_days
    house.max_days = max_days
    house.add_update()
    print(house.id)
    return jsonify({'code': 200, 'msg': '请求成功', 'house_id': house.id})


# 地区接口
@home_blue.route('/area_info/', methods=['GET'])
def area_info():
    areas = Area.query.all()
    data = []
    for area in areas:
        dict1 = {}
        dict1['area_id'] = area.id
        dict1['area_name'] = area.name
        data.append(dict1)
    return jsonify({'code': 200, 'msg': '请求成功', 'data': data})


# 设施接口
@home_blue.route('/facility_info/', methods=['GET'])
def facility_info():
    facilities = Facility.query.all()
    data = [facility.to_dict() for facility in facilities]
    return jsonify({'code': 200, 'msg': '请求成功', 'data': data})


# 房屋图片
@home_blue.route('/house_image/', methods=['POST'])
def house_image():
    house_image = request.files.get('house_image')
    house_id = request.form.get('house_id')
    # 获取房屋对象
    house = House.query.get(house_id)
    # 保存图片
    if house_image and house:
        # 获取项目根路径
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # 获取媒体文件路径
        MEDIA_DIR = os.path.join(BASE_DIR, 'static/media')
        # 随机生成图片名称
        filename = str(uuid.uuid4())
        i = house_image.mimetype.split('/')[-1:][0]
        image = filename + '.' + i
        # 拼接图片地址
        path = os.path.join(MEDIA_DIR, image)
        house_image.save(path)
        # 修改并保存对象属性到数据库
        houseImage = HouseImage()
        houseImage.house_id = house_id
        image_url = '/static/media/' + image
        houseImage.url = image_url
        houseImage.add_update()
        # 创建房屋首图
        if not house.index_image_url:
            house.index_image_url = image_url
            house.add_update()
        return jsonify({'code': 200, 'msg': '请求成功', 'image_url': image_url})
    return jsonify({'code': 250, 'msg': '请求失败'})


# 显示房屋信息
@home_blue.route('/show_house/', methods=['GET'])
def show_house():
    houses = House.query.all()
    data = [house.to_dict() for house in houses]
    return jsonify({'code': 200, 'msg': '请求成功', 'data': data})


# 房屋详情
@home_blue.route('/detail/', methods=['GET'])
def detail_info():
    return render_template('detail.html')


@home_blue.route('/detail/<int:id>/', methods=['GET'])
def detail(id):
    house = House.query.get(id).to_full_dict()
    return jsonify({'code': 200, 'msg': '请求成功', 'house': house})


# 搜索
@home_blue.route('/search/', methods=['GET'])
def search():
    return render_template('search.html')


@home_blue.route('/my_search/', methods=['GET'])
def my_search():
    area_id = request.args.get('area_id')
    houses = House.query.filter_by(area_id=area_id).all()
    data = [house.to_full_dict() for house in houses]
    return jsonify({'code': 200, 'msg': '请求成功', 'data': data})


