var apiCommentAdd = function (form, callback) {
    var path = '/api/comment/add'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function (comment_id, callback) {
    var path = `/api/comment/delete?id=${comment_id}`
    ajax('GET', path, '', callback)
}

var apiCommentUpdate = function (form, callback) {
    var path = '/api/comment/update'
    ajax('POST', path, form, callback)
}

var commentUpdateTemplate = function (title) {
// WEIBO DOM
    var t = `
        <div class="comment-update-form">
            <input class="comment-update-input" value="${title}">
            <button class="pure-button pure-button-primary comment-update">更新</button>
        </div>
    `
    return t
}

var insertComment = function (comment, commentList) {
    var commentCell = commentTemplate(comment)
    commentList.insertAdjacentHTML('beforeend', commentCell)
}

var insertCommentUpdateForm = function (title, commentCell) {
    var updateForm = commentUpdateTemplate(title)
    commentCell.insertAdjacentHTML('beforeend', updateForm)
}

var bindEventCommentAdd = function () {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function (event) {
        log(event)
        var self = event.target
        log('被点击的元素', self)
        log(self.classList)
        if (self.classList.contains('comment-add')) {
            log('点到了添加评论按钮')
            weiboCell = self.closest('.weibo-cell')
            weiboId = weiboCell.dataset['id']
            var input = e('.comment-add-input', weiboCell)
            var commentList = e('.comment-list', weiboCell)
            var form = {
                content: input.value,
                weibo_id: weiboId
            }
            apiCommentAdd(form, function (comment) {
                // 收到返回的数据, 插入到页面中
                insertComment(comment, commentList)
            })
        } else {
            log('点到了 weibo cell')
        }
    })
}

var bindEventCommentDelete = function () {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function (event) {
        log(event)
        var self = event.target
        log('被点击的元素', self)
        log(self.classList)
        if (self.classList.contains('comment-delete')) {
            log('点到了删除按钮')
            commentId = self.parentElement.dataset['id']
            apiCommentDelete(commentId, function (r) {
                log('apiCommentDelete', r.message)
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

var bindEventCommentEdit = function () {
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
        if (self.classList.contains('comment-edit')) {
            log('点到了编辑按钮')
            commentCell = self.closest('.comment-cell')
            commentId = commentCell.dataset['id']
            var commentSpan = e('.comment-title', commentCell)
            var title = commentSpan.innerText
            // 插入编辑输入框
            insertCommentUpdateForm(title, commentCell)
        } else {
            log('点到了 weibo cell')
        }
    })
}

var bindEventCommentUpdate = function () {
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
        if (self.classList.contains('comment-update')) {
            log('点到了更新按钮')
            commentCell = self.closest('.comment-cell')
            commentId = commentCell.dataset['id']
            log('update comment id', commentId)
            input = e('.comment-update-input', commentCell)
            title = input.value
            var form = {
                id: commentId,
                content: title,
            }

            apiCommentUpdate(form, function (comment) {
                // 收到返回的数据, 插入到页面中
                log('apiCommentUpdate', comment)
                if (comment.message != '没有更改权限') {
                    var commentSpan = e('.comment-title', commentCell)
                    commentSpan.innerText = comment.content

                } else {
                    alert(comment.message)
                }
                var updateForm = e('.comment-update-form', commentCell)
                updateForm.remove()
            })
        } else {
            log('点到了 weibo cell')
        }
    })
}

var bindCommentEvents = function () {
    bindEventCommentAdd()
    bindEventCommentDelete()
    bindEventCommentEdit()
    bindEventCommentUpdate()
}

var __main = function () {
    bindWeiboEvents()
    bindCommentEvents()
    loadWeibo()
}

__main()