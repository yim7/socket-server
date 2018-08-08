import socket

s = socket.socket()


# 服务器的 host 为 0.0.0.0, 表示接受任意 ip 地址的连接
host = '0.0.0.0'
port = 2000

s.bind((host, port))

s.listen()

# 用一个无限循环来处理请求
while True:
    # 当有客户端过来连接的时候, s.accept 函数就会返回 2 个值
    # 分别是 连接 和 客户端 ip 地址
    print('before accept')
    connection, address = s.accept()
    print('after accept')

    # recv 可以接收客户端发送过来的数据
    # 参数是要接收的字节数
    # 返回值是一个 bytes 类型
    request = b''
    buffer_size = 1024
    while True:
        r = connection.recv(buffer_size)
        request += r
        # 取到的数据长度不够 buffer_size 的时候，说明数据已经取完了。
        if len(r) < buffer_size:
            break

    print('ip and request, {}\n{}'.format(address, request.decode()))


    http_response = "HTTP/1.1 233 very OK\r\n\r\n<h1>Hello World!</h1>"
    response = http_response.encode()

    # 用 sendall 发送给客户端
    connection.sendall(response)
    # 发送完毕后, 关闭本次连接
    connection.close()
