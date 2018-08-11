from models import Model
from models.user import User
import time


class Comment(Model):
    """
    评论类
    """

    def __init__(self, form, user_id=-1):
        super().__init__(form)
        self.content = form.get('content', '')
        self.user_id = form.get('user_id', user_id)
        self.weibo_id = int(form.get('weibo_id', -1))
        self.created_time = form.get('created_time', -1)
        self.updated_time = form.get('updated_time', -1)

    def user(self):
        u = User.find_by(id=self.user_id)
        return u

    @classmethod
    def add(cls, form, user_id, weibo_id):
        c = Comment(form)
        c.user_id = user_id
        c.weibo_id = weibo_id
        c.created_time = int(time.time())
        c.updated_time = c.created_time
        c.save()
        return c

    @classmethod
    def update(cls, form):
        comment_id = int(form['id'])
        c = Comment.find_by(id=comment_id)
        c.content = form['content']
        c.updated_time = int(time.time())
        c.save()
        return c
