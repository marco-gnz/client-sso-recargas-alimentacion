import Vue from 'vue'

Vue.directive("lowercase", {
  update: function (el) {
      el.value = el.value.toLowerCase()
      el.dispatchEvent(new Event('input'));
  }
});
