import { is, setupWebViewJavascriptBridge, AXEData } from './base'

// 本地记录 事件与回调
let registeredEvents
// 事件接口。
// 注册函数
let registerFunc = function (eventName, callback) {
  if (is.String(eventName) && typeof callback === 'function') {
    if (!registeredEvents) {
      registeredEvents = {}
      //  注册回调处理
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler('axe_event_callback', function (data) {
          // 将data 转换为 AXEData.
          var name = data['name']
          var payload = data['payload']
          if (payload) {
            let axeData = new AXEData()
            // 该data 满足格式。
            axeData.datas = payload
            payload = axeData
          }
          let callbackList = registeredEvents[name]
          if (callbackList) {
            // 如果有回调，则读取回调。
            for (let index in callbackList) {
              callbackList[index](payload)
            }
          }
        })
      })
    }
    let callbackList = registeredEvents[eventName]
    if (!callbackList) {
      callbackList = []
      registeredEvents[eventName] = callbackList
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('axe_event_register', eventName)
      })
    }
    callbackList.push(callback)
  }
}
// 取消注册函数 , 需要注意，这里取消监听，会直接删掉当前网页的这个 eventName的全部监听。
let cancelRegisterFunc = function (eventName) {
  if (is.String(eventName)) {
    registeredEvents[eventName] = undefined
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('axe_event_remove', eventName)
    })
  }
}
// 发送事件通知
let postEventFunc = function (eventName, data) {
  // 因为 axe的目标是 业务模块之间的交互，所以不考虑本地的监听。
  if (is.String(eventName)) {
    let event = {}
    event['name'] = eventName
    if (data) {
      if (Object.getPrototypeOf(data) !== AXEData.prototype) {
        return
      }
      event['data'] = data.datas
    }
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('axe_event_post', event)
    })
  }
}

export default {
  postEvent: postEventFunc,
  registerListener: registerFunc,
  removeListener: cancelRegisterFunc
}
