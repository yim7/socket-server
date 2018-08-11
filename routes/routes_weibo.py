from routes import (
    Template,
    html_response,
    login_required,
)


def index(request):
    """
    weibo 首页的路由函数
    """
    body = Template.render('weibo_index.html')
    return html_response(body)


def route_dict():
    """
    路由字典
    key 是路由(路由就是 path)
    value 是路由处理函数(就是响应)
    """
    d = {
        '/weibo/index': login_required(index),
    }
    return d
