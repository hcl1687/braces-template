import Vue from './instance/vue'
import installGlobalAPI from './global-api'

installGlobalAPI(Vue)
Vue.version = '1.0.26'

export default Vue
