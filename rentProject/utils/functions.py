from functools import wraps

from flask import session, redirect, url_for


def is_login(func):
    @wraps(func)
    def check_status(*args, **kwargs):
        try:
            session['user_id']
            return func(*args, **kwargs)
        except Exception as e:
            return redirect(url_for('user.login'))
    return check_status
