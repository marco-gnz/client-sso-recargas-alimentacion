<template>
  <div>
    <div class="modal" :class="modalOpen ? 'is-active' : '' ">
      <ModalAdd />
      {{modalOpen}}
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import ModalAdd from '../../../components/admin/recargas/modal-add.vue';
export default {
    components: { ModalAdd },
    middleware: 'auth',
    head() {
        return {
            title: "Ingresar recarga"
        };
    },
    mounted(){
      this.changeStatusModal(true);
      this.getEstablecimientos();
    },
    computed:{
      ...mapGetters({
        modalOpen:'recargas/recargas/openModal',
        establecimientos:'modulos/modulos/establecimientos'
      }),
    },
    methods:{
      ...mapMutations({
        changeStatusModal: "recargas/recargas/SET_OPEN",
      }),
      ...mapActions({
            getEstablecimientos: 'modulos/modulos/getEstablecimientos',
        }),
    }
}
</script>

<style>

</style>
