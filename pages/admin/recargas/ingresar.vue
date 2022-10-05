<template>
  <div>
    <div class="modal" :class="modalOpen ? 'is-active' : '' ">
      <ModalAdd />
      {{modalOpen}}
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import ModalAdd from '../../../components/admin/recargas/modal-add.vue';
export default {
    components: { ModalAdd },
    head() {
        return {
            title: "Ingresar"
        };
    },
    mounted(){
      this.changeStatusModal(true);

    },
    computed:{
      ...mapGetters({
        modalOpen:'recargas/modaladd/openModal'
      }),
    },
    methods:{
      ...mapMutations({
        changeStatusModal: "recargas/modaladd/SET_OPEN",
      }),
    }
}
</script>

<style>

</style>
