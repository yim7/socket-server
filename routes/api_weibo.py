from utils import log
from routes import json_response, current_user, login_required
from models.weibo import Weibo
from models.comment import Comment
from models.user import User


def all(request):
    weibos = Weibo.all_json()
    for w in weibos:
        u = User.find_by(id=w['user_id'])
        w['username'] = u.username
        comments = Comment.find_all(weibo_id=w['id'])
        w['comments'] = [coment.json() for coment in comments]
        for c in w['comments']:
            u = User.find_by(id=c['user_id'])
            c['username'] = u.username
    return json_response(weibos)


def add(request):
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    form = request.json()
    # 创建一个 weibo
    u = current_user(request)
    t = Weibo.add(form, u.id)
    t.username = u.username
    # 把创建好的 weibo 返回给浏览器
    return json_response(t.json())


def delete(request):
    weibo_id = int(request.query['id'])
    comments = Comment.find_all(weibo_id=weibo_id)
    for c in comments:
        Comment.delete(id=c.id)
    Weibo.delete(weibo_id)
    d = dict(
        message="成功删除 weibo"
    )
    return json_response(d)


def update(request):
    form = request.json()
    log('api weibo update form', form)
    t = Weibo.update(form)
    return json_response(t.json())


def comment_add(request):
    u = current_user(request)
    form = request.json()
    w = Weibo.find_by(id=int(form['weibo_id']))
    comment = Comment.add(form, u.id, w.id)
    comment.username = u.username
    log('comment add', comment)

    return json_response(comment.json())


def comment_delete(request):
    comment_id = int(request.query['id'])
    Comment.delete(comment_id)
    d = dict(
        message="成功删除 comment"
    )
    return json_response(d)


def comment_update(request):
    form = request.json()
    log('api comment update form', form)
    t = Comment.update(form)
    return json_response(t.json())


def error(request):
    d = dict(
        message="没有更改权限"
    )
    return json_response(d)


def weibo_owner_required(route_function):
    def f(request):
        log('weibo_owner_required')
        u = current_user(request)
        if 'id' in request.query:
            weibo_id = request.query['id']
        else:
            weibo_id = request.json()['id']
        w = Weibo.find_by(id=int(weibo_id))

        if w.user_id == u.id:
            return route_function(request)
        else:
            return error(request)

    return f


def comment_owner_required(route_function):
    def f(request):
        log('comment_owner_required')
        u = current_user(request)
        if 'id' in request.query:
            comment_id = request.query['id']
        else:
            comment_id = request.json()['id']

        c = Comment.find_by(id=int(comment_id))
        w = Weibo.find_by(id=int(c.weibo_id))

        if c.user_id == u.id:
            return route_function(request)
        elif w.user_id == u.id:
            return route_function(request)
        else:
            return error(request)

    return f


def route_dict():
    d = {
        '/api/weibo/all': login_required(all),
        '/api/weibo/add': login_required(add),
        '/api/weibo/delete': login_required(weibo_owner_required(delete)),
        '/api/weibo/update': login_required(weibo_owner_required(update)),
        '/api/comment/add': login_required(comment_add),
        '/api/comment/delete': login_required(comment_owner_required(comment_delete)),
        '/api/comment/update': login_required(comment_owner_required(comment_update)),
    }
    return d
