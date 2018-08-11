from models.todo import Todo
from routes import (
    redirect,
    Template,
    current_user,
    html_response,
    login_required,
)
from utils import log


def index(request):
    """
    todo 首页的路由函数
    """
    body = Template.render('todo_index.html')
    return html_response(body)


def route_dict():
    d = {
        '/todo/index': login_required(index),
    }
    return d
