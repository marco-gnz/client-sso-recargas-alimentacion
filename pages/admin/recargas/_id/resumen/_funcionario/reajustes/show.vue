<template>
  <div>
    <!-- <div v-if="modalShow" class="modal" :class="modalShow ? 'is-active' : '' ">
      <modal-show-reajuste />
    </div> -->
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import ModalShowReajuste from '../../../../../../../components/admin/recargas/reajustes/ModalShowReajuste.vue';
export default {
  components: { ModalShowReajuste },
  middleware: 'auth',
    head() {
        return {
            title: "Ver recarga"
        };
    },
    /* mounted(){
      const data = {
        uuid:this.$route.query.id
      };
      this.getReajuste(data);
    }, */
    computed:{
      ...mapGetters({
        modalShow:'recargas/reajustes/modalShow',
        establecimientos:'modulos/modulos/establecimientos'
      }),
    },
    methods:{
      ...mapActions({
        getReajuste: 'recargas/reajustes/getReajuste',
      }),
    }

}
</script>

<style>

</style>
