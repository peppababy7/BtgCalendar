import BtgCalendar from './btg-calendar.vue';
export default BtgCalendar;
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('btg-calendar', BtgCalendar);
}
