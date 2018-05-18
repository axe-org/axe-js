declare module 'axe4js' {
  export interface Data {
    /**
      * 全局共享的数据， 单例。
      */
    readonly sharedData: SharedData;
    /**
      * 构建一个用于传输的数据的Payload类型。
      */
    create(): Payload;
  }

  export interface Router {
    /**
     * 使用路由进行页面跳转。
     * @param url 跳转的具体URL， 不建议在URL上拼接参数。
     * @param payload 携带数据
     * @param callback 回调处理
     */
    route(url: string, payload?: Payload, callback?: (payload?: Payload) => void ): void;
    /**
     * 进行回调。 
     * 对于向其他模块暴露路由的界面，如果有回调处理的逻辑，则在路由跳转后调用该函数返回数据。
     * 该函数内部检测当前是否有人回调需要执行
     * 需要注意，回调时会自动关闭当前页面。
     * @param payload 数据。
     */
    callback(payload?: Payload): void;
    /**
     * 使用路由跳转到当前页面后，获取这次路由跳转时所携带的数据
     * 获取数据是一个异步过程，所以通过这个函数来检测与获取数据
     * @param callback 处理负载数据。
     */
    getRouteInfo(callback?: (payload?: RouterInfo) => void): void;
  }

  export interface Event {
    /**
     * 发送事件通知
     * @param event 事件名 
     * @param payload 数据
     */
    postEvent(event: string, payload?: Payload);
    /**
     * 注册监听。 
     * @param event 事件名
     * @param callback 回调。
     */
    registerListener(event: string, callback: (payload?: Payload) => void): void;
    /**
     * 取消监听。
     * 需要注意，取消的是当前页面的所有该时间的监听。
     * @param event 
     */
    removeListener(event: string);
  }

  export interface RouterInfo {
    /**
     * 路由跳转时，传递的参数
     */
    readonly payload: Payload;
    /**
     * 当前是否有回调。
     */
    readonly needCallback: boolean;
  }

  export interface Payload {
    /**
      * 设置 Number 类型
      */
    setNumber(key: string, value: number):void;
    /**
      * 设置 Boolean 类型
      */
    setBoolean(key: string, value: boolean):void;
    /**
      * 设置 String 类型
      */
    setString(key: string, value: string):void;
    /**
      * 设置 Array 类型
      */
    setArray(key: string, value: array<any>):void;
    /**
      * 设置 Object 类型 ,对于iOS中的NSDictionary , java中的 Map
      */
    setObject(key: string, value: object):void;
    /**
      * 设置 Model 类型
      * Model类型为前后端交互操作中的model类型
      */
    setModel(key: string, value: object):void;
    /**
      * 设置 二进制数据， 对应iOS中的 NSData， java中的 Byte Array . 
      * 而在 js中读取和设置的是 base64的字符串。
      * @param value 值， 为base64字符串。
      */
    setByte(key: string, value: string):void;
    /**
      * 设置 图片类型，对应iOS中的 UIImage, Java中的 Image类型。
      * 而在 js中读取和设置的是 base64的uri字符串 ， 如 data:image/jpeg;base64,xxxx
      * @param value 值， 为base64的uri字符串。
      */
    setImage(key: string, value: string):void;
    /**
      * 设置 Date类型 对应iOS中的 NSDate， java中的 Date . 
      * 
      * @param value 值， Date类型。
      */
    setDate(key: string, value: date):void;
    /**
      * 删除某项数据。
      * 
      */
    removeItem(key: string):void;
    /**
     * JS中的读取方法，不需要指定类型，而是根据约束去读， 所以API文档一定要写清楚。
     * undefined 表示出错。 而null表示为空。
     * @param key 
     */
    get(key: string):any;
  }

  export interface SharedData extends Payload {
    /**
     * 共享数据不能使用 同步的get方法， 必须使用异步的get 方法。
     * @param key 
     * @param callback 
     */
    get(key: string, callback: (any) => void): void;
  }

  /**
   * 路由
   */
  export var router: Router;
  /**
   * 数据
   */
  export var data: Data;
  /**
   * 事件
   */
  export var event: Event;

  /**
   * 最后附带一下 WebViewJavaScriptBridge， 该js桥接的使用见
   * https://github.com/marcuswestin/WebViewJavascriptBridge
   */
  export function setupWebViewJavascriptBridge(callback: (JavascriptBridge: object) => void):void;
}