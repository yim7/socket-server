from models import Model
from models.comment import Comment
import time


class Weibo(Model):
    """
    微博类
    """

    def __init__(self, form):
        super().__init__(form)
        self.content = form.get('content', '')
        self.user_id = form.get('user_id', None)

    @classmethod
    def add(cls, form, user_id):
        w = Weibo(form)
        w.user_id = user_id
        w.created_time = int(time.time())
        w.updated_time = w.created_time
        w.save()
        return w

    @classmethod
    def update(cls, form):
        weibo_id = int(form['id'])
        w = Weibo.find_by(id=weibo_id)
        w.content = form['content']
        w.updated_time = int(time.time())
        w.save()
        return w

    def comments(self):
        cs = Comment.find_all(weibo_id=self.id)
        return cs
