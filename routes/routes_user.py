from urllib.parse import unquote_plus
from uuid import uuid4

from models.session import Session
from routes import (
    Template,
    current_user,
    html_response,
    redirect
)

from utils import log
from models.user import User


def login(request):
    """
    登录页面的路由函数
    """
    form = request.form()
    u, result = User.login(form)
    if not u.is_guest():
        # 设置一个随机字符串来当session_id
        session_id = str(uuid4())
        form = dict(
            session_id=session_id,
            user_id=u.id,
        )
        Session.new(form)

        headers = {
            'Set-Cookie': 'session_id={}; path=/'.format(session_id)
        }
    else:
        headers = {}

    return redirect('/user/login/view?result={}'.format(result), headers)


def login_view(request):
    u = current_user(request)
    result = request.query.get('result', '')
    result = unquote_plus(result)

    body = Template.render(
        'login.html',
        username=u.username,
        result=result,
    )
    return html_response(body)


def register(request):
    """
    注册页面的路由函数
    """
    form = request.form()

    u, result = User.register(form)
    log('register post', result)

    return redirect('/user/register/view?result={}'.format(result))


def register_view(request):
    result = request.query.get('result', '')
    result = unquote_plus(result)

    body = Template.render('register.html', result=result)
    return html_response(body)


def route_dict():
    r = {
        '/user/login': login,
        '/user/login/view': login_view,
        '/user/register': register,
        '/user/register/view': register_view,
    }
    return r
