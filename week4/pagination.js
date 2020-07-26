Vue.component('pagination', {
  template: '#pagination',
  data() {
    return {};
  },
  props: {
    pages: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  mounted() {
    console.log('page')
  },
  methods: {
    emitPages(item) {
      this.$emit('emit-pages', item);
    },
  },
});