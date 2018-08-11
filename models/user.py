from models import Model
from models.user_role import UserRole

import hashlib


class User(Model):
    """
    User 类
    """

    def __init__(self, form):
        super().__init__(form)
        self.username = form.get('username', '')
        self.password = form.get('password', '')
        self.role = form.get('role', UserRole.normal)

    @staticmethod
    def guest():

        form = dict(
            role=UserRole.guest,
            username='【游客】',
        )
        u = User(form)
        return u

    def is_guest(self):
        return self.role == UserRole.guest

    @staticmethod
    def salted_password(password, salt='$!@><?>HUI&DWQa`'):
        """$!@><?>HUI&DWQa`"""
        salted = password + salt
        hash = hashlib.sha256(salted.encode('ascii')).hexdigest()
        return hash

    @classmethod
    def login(cls, form):
        salted = cls.salted_password(form['password'])
        u = User.find_by(username=form['username'], password=salted)
        if u is not None:
            result = '登录成功'
            return u, result
        else:
            result = '用户名或者密码错误'
            return User.guest(), result

    @classmethod
    def register(cls, form):
        if len(form['username']) < 2 or len(form['password']) < 2:
            result = '用户名密码长度必须大于2'
            u = User.guest()
        elif cls.find_by(username=form['username']):
            result = '用户名已被注册'
            u = User.guest()
        else:
            form['password'] = cls.salted_password(form['password'])
            u = User.new(form)
            result = '注册成功'

        return u, result
