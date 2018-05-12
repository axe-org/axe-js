import router from './router'
import data from './data'
import event from './event'
import {setupWebViewJavascriptBridge} from './base'

export default {
  router: router,
  data: data,
  event: event,
  setupWebViewJavascriptBridge: setupWebViewJavascriptBridge
}
