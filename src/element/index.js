import { Select, Option, OptionGroup, Dialog } from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(OptionGroup)
    Vue.use(Dialog)
  }
}
export default element
