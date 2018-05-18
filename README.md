# axe-js

使用 `WebViewJavaScriptBridge` 以支持在`h5`页面中使用 `axe`.

## 使用 

	npm install axe4js --save

## 接口声明

见 [main.d.ts](src/main.d.ts)文件

## 数据类型说明 

#### 基础数据类型

* Number : 数字
* String : 字符串
* Array: 列表
* Object ： 对象

需要注意，如果要在`js`模块中使用原生设置的 `Array`和`Object`对象，就要求原生传入的是纯基础数据类型，其中不能设置特殊类型。

#### 特殊类型

* Image : 图片，`js`中设置和获取的图片类型为 ， `data:image/jpeg;base64,xxx` 这种形式的`URI`形式的字符串。  
* Data： 数据类型， 对于`ios`中的`NSData`类型。 `js`中设置和获取的是 `base64字符串`.
* Date: 时间类型
* Boolean: 

这里我们实现了 `js`模块和原生模块之间的特殊类型传递。

#### Model类型

在Axe中提及的 Model类型，指可以进行序列化，且一般从后台获取的Model类型。

`JS`中设置的`Model`类型，是一个`Object`对象，键值需要是基础数据类型，不能嵌套一些特殊类型。

> 如果声明了一个`model`类型， 在设置时，一定要包含所有的`key`值， 对于空值，一定要设置为`null`类型。

如，我们在文档中声明了一个`model` ：

	{
		userName,
	}

当设置的`model`类型，`userName`为空时， 必须要设置为`null`，而不是默认的`undefined` 。 否则原生模块获取时会出错。

如果一个原生模块要传递`Model`给`JS`模块，则该`Model`类型，必须是纯基础数据类型构成，不能包含特殊类型。

## 注意Event

事件回调是一个闭包， 而闭包会持有对象，容易导致内存泄漏 （当路由跳转时，新页面监听了事件，然后在路由返回到之前页面，则这个监听没有释放，就可能导致内存泄漏，且事件发送时会产生异常）。

所以事件监听要特别注意，在 [demo-test-h5](https://github.com/axe-org/demo-test-h5) 中，我们实现了两种 基于`Vue`单页面应用的`Event`封装， 以避免 重复注册和内存泄漏。

## 使用示例

* [demo-login-h5](https://github.com/axe-org/demo-login-h5)
* [demo-test-h5](https://github.com/axe-org/demo-test-h5)

## 注意事项

1. 所有的js模块注册的监听，都是UI监听，即只有当页面在前台展示时，才会调用。
2. axe主要用于业务模块间的信息传递和数据共享，不要用于模块内的业务逻辑。
3. sharedData的`get`接口是异步接口
4. 在模块声明时，要说明跳转是否支持回调，以及是否必须拥有回调。
5. 路由信息的获取，与路由回调，都是跟随`webview`的，所以如果是单页面应用，需要注意这一点，避免在B页面错误地获取了A页面的信息和回调了A页面的回调函数。
