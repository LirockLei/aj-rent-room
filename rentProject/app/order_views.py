from datetime import datetime

from flask import Blueprint, render_template, request, jsonify, session

from app.models import House, Order
from utils.functions import is_login

order_blue = Blueprint('order', __name__)


# 订单
@order_blue.route('/orders/', methods=['GET'])
@is_login
def orders():
    return render_template('orders.html')


@order_blue.route('/my_order/', methods=['POST'])
@is_login
def my_order():
    house_id = request.form.get('house_id')
    begin_date = datetime.strptime(request.form.get('begin_date'), '%Y-%m-%d')
    end_date = datetime.strptime(request.form.get('end_date'), '%Y-%m-%d')

    house = House.query.get(house_id)

    order = Order()
    order.user_id = session['user_id']
    order.house_id = house_id
    order.begin_date = begin_date
    order.end_date = end_date
    order.days = (end_date - begin_date).days + 1
    order.house_price = house.price
    order.amount = order.days * order.house_price

    order.add_update()

    return jsonify({'code': 200, 'msg': '请求成功'})


@order_blue.route('/my_order/', methods=['GET'])
def see_my_order():
    orders = Order.query.filter_by(user_id=session['user_id'])
    orders_list = [order.to_dict() for order in orders]
    return jsonify({'code': 200, 'msg': '请求成功', 'orders_list': orders_list})


# 预定
@order_blue.route('/booking/', methods=['GET'])
def booking():
    return render_template('booking.html')


# 评价
@order_blue.route('/comment/', methods=['POST'])
def comment():
    # 获取参数
    comment = request.form.get('comment')
    orderId = request.form.get('orderId')

    # 获取订单对象
    order = Order.query.filter_by(id=orderId).first()

    # 更改并保存属性
    order.comment = comment
    order.status = 'COMPLETE'
    order.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


# 客户订单
@order_blue.route('/lorders/', methods=['GET'])
def lorders():
    return render_template('lorders.html')


@order_blue.route('/my_lorders/', methods=['GET'])
def my_lorders():
    orders = Order.query.all()
    data = [order.to_dict() for order in orders]
    return jsonify({'code': 200, 'msg': '请求成功', 'data': data})


# 改变订单状态
@order_blue.route('/order_accept/', methods=['POST'])
def order_accept():
    order_id = request.form.get('order_id')
    order = Order.query.filter_by(id=order_id).first()
    # 修改订单的状态
    order.status = 'WAIT_PAYMENT'
    order.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


@order_blue.route('/order_reject/', methods=['POST'])
def order_reject():
    order_id = request.form.get('order_id')
    order = Order.query.filter_by(id=order_id).first()
    # 修改订单的状态
    order.status = 'REJECTED'
    order.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


