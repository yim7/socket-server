from routes import (
    current_user,
    Template,
    html_response,
)


def index(request):
    """
    主页的处理函数, 返回主页的响应
    """
    u = current_user(request)
    body = Template.render('index.html', username=u.username)
    return html_response(body)


def static(request):
    """
    静态资源的处理函数, 读取图片并生成响应返回
    """
    filename = request.query['file']
    path = 'static/' + filename
    with open(path, 'rb') as f:
        header = b'HTTP/1.x 200 OK\r\n\r\n'
        img = header + f.read()
        return img


def route_dict():
    d = {
        '/': index,
        '/static': static,
    }
    return d
