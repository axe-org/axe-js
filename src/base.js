// 判断函数
export const is = {
  types: [
    'Number',
    'Boolean',
    'String',
    'Object',
    'Array',
    'Date',
    'RegEpx',
    'Window',
    'HTMLDocument'
  ]
}
is.types.forEach(function (type) {
  is[type] = (function (type) {
    return function (obj) {
      return Object.prototype.toString.call(obj) === '[object ' + type + ']'
    }
  }(type))
})

// data 构造方法
export function AXEData () {
  this.datas = {}
}
// 这里输入的data 为 {type : "xxx",value:"xxx"}
export function parseAxeData (data) {
  let ret
  if (data.type && data.value) {
    if (data.type === 'Number') {
      ret = Number(data.value)
    } else if (data.type === 'Boolean') {
      ret = data.value === 'true'
    } else if (data.type === 'String') {
      ret = data.value
    } else if (data.type === 'Array' || data.type === 'Object') {
      ret = JSON.parse(data.value)
    } else if (data.type === 'Model') {
      ret = JSON.parse(data.value)
    } else if (data.type === 'Image' || data.type === 'Data') {
      // 返回的 base64的字符串。
      ret = data.value
    } else if (data.type === 'Date') {
      ret = new Date()
      ret.setTime(data.value)
    }
  }
  return ret
}

AXEData.prototype = {
  // 设置方法， 设置时要指明类型
  setNumber: function (key, value) {
    if (key && value && is.String(key)) {
      if (is.Number(value)) {
        this.setObjectForKey(key, {
          value: '' + value,
          type: 'Number'
        })
      }
    }
  },
  setBoolean: function (key, value) {
    if (key && is.String(key)) {
      if (is.Boolean(value)) {
        this.setObjectForKey(key, {
          value: '' + value,
          type: 'Boolean'
        })
      }
    }
  },
  setString: function (key, value) {
    if (key && value && is.String(key)) {
      if (is.String(value)) {
        this.setObjectForKey(key, {
          value: value,
          type: 'String'
        })
      }
    }
  },
  setArray: function (key, value) {
    if (key && value && is.String(key)) {
      if (is.Array(value)) {
        this.setObjectForKey(key, {
          value: JSON.stringify(value),
          type: 'Array'
        })
      }
    }
  },
  // object 或者 称为字典类型。 与 model类型是有区别的。
  setObject: function (key, value) {
    if (key && value && is.String(key)) {
      if (is.Object(value)) {
        this.setObjectForKey(key, {
          value: JSON.stringify(value),
          type: 'Object'
        })
      }
    }
  },
  // model 与 map的区别在于， model 的空值，必须设置为 null ,否则原生会发生异常！！！
  setModel: function (key, value) {
    if (key && value && is.String(key)) {
      if (is.Object(value)) {
        this.setObjectForKey(key, {
          value: JSON.stringify(value),
          type: 'Model'
        })
      }
    }
  },
  // 设置 图片 ， 为图片数据的base64结果
  setImage: function (key, value) {
    if (key && value && is.String(key)) {
      if (is.String(value)) {
        this.setObjectForKey(key, {
          value: value,
          type: 'Image'
        })
      }
    }
  },
  // 设置 data 类型， 实际也是 base64字符串。
  setData: function (key, value) {
    if (key && value && is.String(key)) {
      if (is.String(value)) {
        this.setObjectForKey(key, {
          value: value,
          type: 'Data'
        })
      }
    }
  },
  // 设置 Date类型
  setDate: function (key, value) {
    if (key && value && is.String(key)) {
      if (is.Date(value)) {
        this.setObjectForKey(key, {
          value: '' + Date.parse(value),
          type: 'Date'
        })
      }
    }
  },
  // 以上的设置方法，  对于  shared data 和  createData 是相同的，
  // 但是以下方法不同。 createData 使用以下3个实现。
  // 获取数据时， 不需要指明类型.
  // undefined 表示出错， 而 null 表示key 值不存在，为空。
  get: function (key) {
    if (is.String(key)) {
      let item = this.datas[key]
      if (item) {
        return parseAxeData(item)
      } else {
        return null
      }
    }
    return undefined
  },
  // 删除，必须使用这个方法，而不是设置为空。
  removeItem: function (key) {
    if (key && is.String(key)) {
      this.datas[key] = undefined
    }
  },
  setObjectForKey: function (key, obj) {
    // 这个是实际的写方法。
    this.datas[key] = obj
  }
}

export function setupWebViewJavascriptBridge (callback) {
  if (window.WebViewJavascriptBridge) { return callback(window.WebViewJavascriptBridge) }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback) }
  window.WVJBCallbacks = [callback]
  var WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'https://__bridge_loaded__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
}
