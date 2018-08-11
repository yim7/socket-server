# socket-server
一个用socket实现的简单 web 框架，使用自制简易ORM框架保存数据，用Jinja2渲染模版。

前端用pure.css美化样式，使用Ajax技术实现不用刷新更新数据。

![DEMO](https://github.com/yim7/socket-server/blob/master/demo.gif)

## 功能
- [x] 用户注册、登录

- [x] 使用hash和加盐的方式保存密码

- [x] 用随机数实现了session功能

- [x] 实现用户权限验证，必须登录才能评论，只有微博和评论的作者才能修改和删除

- [x] 微博和评论的增删改查

  

## 运行

```bash
python server.py
```

打开 http://localhost:5000/ 就可以访问了

