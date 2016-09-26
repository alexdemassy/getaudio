import { createMobxStore } from 'mobx-noclass';
export default createMobxStore({
  value: 0,
  next() {
    return this.value + 1;
  },
  previous() {
    return this.value - 1;
  }
},
{
  inc() {
    return this.value++;
  },
  dec() {
    return this.value--;
  }
});