# axe-js

axe interface using in javascript

## 使用 

	npm install axe4js --save

## 接口声明

见 [main.d.ts](src/main.d.ts)文件

#### 使用示例

* [demo-login-h5](https://github.com/axe-org/demo-login-h5)
* [demo-test-h5](https://github.com/axe-org/demo-test-h5)

## 注意事项

1. 所有的js模块注册的监听，都是UI监听，即只有当页面在前台展示时，才会调用。
2. axe主要用于业务模块间的信息传递和数据共享，不要用于模块内的业务逻辑。
3. sharedData的`get`接口是异步接口
4. 回调的处理 ，目前逻辑是这样的： 在模块声明时，说明一个接口是否支持回调，以及是否必须拥有回调。

