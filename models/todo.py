import time
from models import Model


class Todo(Model):
    """
    TODO 类
    """

    def __init__(self, form):
        super().__init__(form)
        self.title = form.get('title', '')
        self.user_id = form.get('user_id', None)

    @classmethod
    def add(cls, form, user_id):
        t = Todo(form)
        t.user_id = user_id
        t.created_time = int(time.time())
        t.updated_time = t.created_time
        t.save()

        return t

    @classmethod
    def update(cls, form):
        todo_id = int(form['id'])
        t = Todo.find_by(id=todo_id)
        t.title = form['title']
        t.updated_time = int(time.time())
        t.save()
        return t
