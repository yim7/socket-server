// Weibo API
// 获取所有 weibo
var apiWeiboAll = function (callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
//    r = ajax('GET', path, '', callback)
//    callback(r)
}

var apiWeiboAdd = function (form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}


var apiWeiboDelete = function (weibo_id, callback) {
    var path = `/api/weibo/delete?id=${weibo_id}`
    ajax('GET', path, '', callback)
}


var apiWeiboUpdate = function (form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}


var commentTemplate = function (comment) {
    var t = `
        <div class="comment-cell" data-id="${comment.id}">
            <span class="comment-title">${comment.content}</span>
            <span class="comment-author"> by ${comment.username}</span>
            <button class="pure-button pure-button-primary comment-delete">删除</button>
            <button class="pure-button pure-button-primary comment-edit">编辑</button>
        </div>
        `
    return t
}

var weiboTemplate = function (weibo) {
// WEIBO DOM
    var commentHtml = ``
    var comments = weibo.comments
    if (comments !== undefined) {
        for (var i = 0; i < comments.length; i++) {
            var c = comments[i]
            commentHtml += commentTemplate(c)
        }
    }

    var t = `
        <div class="weibo-cell" data-id="${weibo.id}">
            <span class="weibo-title">${weibo.content}</span>
            <span class="weibo-author"> by ${weibo.username}</span>
            <span>创建时间：${weibo.created_time}</span>
            <span>更新时间：${weibo.updated_time}</span>
            <button class="pure-button pure-button-primary weibo-delete">删除</button>
            <button class="pure-button pure-button-primary weibo-edit">编辑</button>
            <br>
            <div>
                <input class="comment-add-input">
            </div>
            <button class="pure-button pure-button-primary comment-add">添加评论</button>
            <p>评论:</p>
            <div class="comment-list">
                ${commentHtml}
            </div>
            <br>
        </div>
    `
    return t
}

var weiboUpdateTemplate = function (title) {
// WEIBO DOM
    var t = `
        <div class="weibo-update-form">
            <div>
                <textarea class="weibo-update-input" >${title}</textarea>
            </div>
            <div class="button">
                <button class="pure-button pure-button-primary weibo-update">更新</button>
            </div>           
        </div>
    `
    return t
}


var insertWeibo = function (weibo) {
    var weiboCell = weiboTemplate(weibo)
    // 插入 WEIBO-list
    var weiboList = e('#id-weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
}


var insertUpdateForm = function (title, weiboCell) {
    var updateForm = weiboUpdateTemplate(title)
    weiboCell.insertAdjacentHTML('afterend', updateForm)
}


var loadWeibo = function () {

    apiWeiboAll(function (weibos) {
        log('load all weibos', weibos)
        // 循环添加到页面中
        for (var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)
        }
    })
}

var bindEventWeiboAdd = function () {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function () {
        var input = e('#id-input-weibo')
        var title = input.value
        log('click add', title)
        var form = {
            content: title,
        }
        apiWeiboAdd(form, function (weibo) {
            // 收到返回的数据, 插入到页面中
            insertWeibo(weibo)
        })
    })
}


var bindEventWeiboDelete = function () {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function (event) {
        log(event)
        // 我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        log('被点击的元素', self)
        // 通过比较被点击元素的 class
        // 来判断元素是否是我们想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('weibo-delete')) {
            log('点到了删除按钮')
            weiboId = self.parentElement.dataset['id']
            apiWeiboDelete(weiboId, function (r) {
                log('apiWeiboDelete', r.message)
                // 删除 self 的父节点
                if (r.message != '没有更改权限') {
                    self.parentElement.remove()
                }
                alert(r.message)
            })
        } else {
            log('点到了 weibo cell')
        }
    })
}


var bindEventWeiboEdit = function () {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function (event) {
        log(event)
        // 我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        log('被点击的元素', self)
        // 通过比较被点击元素的 class
        // 来判断元素是否是我们想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('weibo-edit')) {
            log('点到了编辑按钮')
            weiboCell = self.closest('.weibo-cell')
            weiboId = weiboCell.dataset['id']
            var weiboSpan = e('.weibo-title', weiboCell)
            var title = weiboSpan.innerText
            var weiboEdit = e('.weibo-edit', weiboCell)
            // 插入编辑输入框
            insertUpdateForm(title, weiboEdit)
        } else {
            log('点到了 weibo cell')
        }
    })
}

var bindEventWeiboUpdate = function () {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function (event) {
        log(event)
        // 我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        log('被点击的元素', self)
        // 通过比较被点击元素的 class
        // 来判断元素是否是我们想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('weibo-update')) {
            log('点到了更新按钮')
            weiboCell = self.closest('.weibo-cell')
            weiboId = weiboCell.dataset['id']
            log('update weibo id', weiboId)
            input = e('.weibo-update-input', weiboCell)
            title = input.value
            var form = {
                id: weiboId,
                content: title,
            }

            apiWeiboUpdate(form, function (weibo) {
                // 收到返回的数据, 插入到页面中
                log('apiWeiboUpdate', weibo)
                if (weibo.message != '没有更改权限') {
                    var weiboSpan = e('.weibo-title', weiboCell)
                    weiboSpan.innerText = weibo.content
                } else {
                    alert(weibo.message)
                }
                var updateForm = e('.weibo-update-form', weiboCell)
                updateForm.remove()
            })
        } else {
            log('点到了 weibo cell')
        }
    })
}


var bindWeiboEvents = function () {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
}


