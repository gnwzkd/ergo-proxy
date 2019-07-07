# ergo-proxy

二狗代理，基于 WebSocket 的 HTTP(S) 内网转发工具，命名来源于同名冻鳗《Ergo Proxy》（死亡代理人）。

## 特性

内网穿透，但没 [frp](https://github.com/fatedier/frp)、[ngrok](https://ngrok.com) 那么强大，它仅能转发 HTTP(S)，由于基于 WebSocket，客户端与服务端之间的连接可以被 nginx、Apache 等服务器反向代理，也可以使用 CDN。

## 原理

这类工具都有类似的原理，无非是建立双工连接转发数据包。

## 使用

- 服务端

  ```shell
  $ npm run server # 配合 pm2
  # or
  $ yarn server # 同上
  # or
  $ node . server # 裸奔
  # or
  $ node . server -c /path/to/config.json # 指定配置文件路径
  ```

- 客户端

  ```shell
  $ npm run client # 配合 pm2
  # or
  $ yarn client # 同上
  # or
  $ node . client # 裸奔
  # or
  $ node . client -c /path/to/config.json # 指定配置文件路径
  ```

## 配置文件

- 服务端

  ```javascript
  {
      "parked": "a.test.com", // 为 WebSocket 连接绑定的域名，非必须，目的是不占用被代理域名的路径
      "listen": "127.0.0.1", // 本地监听地址
      "port": 7676, // 本地监听端口
      "path": "/ergouConnecting", // WebSocket 接口的路径，与客户端保持一致
      "token": "7a081dea-e342-495e-9108-9e0f3b791d77" // token，用于认证
  }
  ```

- 客户端

  ```javascript
  {
      "serverAddr": "a.test.com", // 服务器地址
      "serverPort": 7676, // 服务器端口
      "path": "/ergouConnecting", // 服务器 WebSocket 接口路径
      "ssl": false, // 是否使用 SSL
      "token": "7a081dea-e342-495e-9108-9e0f3b791d77", // token，用于认证
      "localAddr": "127.0.0.1", // 要代理的本地服务器 IP
      "localPort": 8087, // 本地服务器端口
      "localProtocol": "http", // 协议，允许值 http、https
      "domains": ["a.test.com", "b.test.com", "c.test.com"] // 虚拟主机域名列表
  }
  ```

## 许可协议

[WTFPL](http://www.wtfpl.net/)