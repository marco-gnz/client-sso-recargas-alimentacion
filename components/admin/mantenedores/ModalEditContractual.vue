<template>
  <div>
    <div class="modal is-large" :class="show_modal_edit ? 'is-active' : '' ">
      <div class="modal-background" @click.prevent="closeModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Editar {{currentRouteQuery.tipo}}</p>
          <button class="delete" aria-label="close" @click.prevent="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <template v-if="loadingShow">
                <el-skeleton style="width: 100%" animated>
                  <template slot="template">
                    <div style="padding: 14px;">
                      <div class="field">
                        <div class="columns">
                          <div class="column">
                            <el-skeleton-item variant="p" style="width: 100%" />
                          </div>
                          <div class="column">
                            <el-skeleton-item variant="p" style="width: 100%" />
                          </div>
                        </div>
                      </div>
                      <div class="field">
                        <div class="columns">
                          <div class="column">
                            <el-skeleton-item variant="p" style="width: 100%" />
                          </div>
                          <div class="column">
                            <el-skeleton-item variant="p" style="width: 100%" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-skeleton>
              </template>
              <template v-else>
                <div class="field">
                  <label class="label required">Ingrese código SIRH</label>
                  <input v-model="contractual_cod_sirh" type="text" class="input" placeholder="Ingrese código SIRH">
                  <p v-if="errors && errors.cod_sirh" class="help is-danger">{{errors.cod_sirh != null ? errors.cod_sirh[0] : ''}}</p>
                </div>
                <div class="field">
                  <label class="label required">Ingrese nombre</label>
                  <input v-model="contractual_name" type="text" class="input" placeholder="Ingrese nombre">
                  <p v-if="errors && errors.nombre" class="help is-danger">{{errors.nombre != null ? errors.nombre[0] : ''}}</p>
                </div>
              </template>
              <div class="field">
                <div class="columns">
                  <div class="column">
                    <button class="button is-link is-light" :class="(loadingAction ? 'is-loading' : '')" @click.prevent="editarContractual">Editar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  created(){
    const data = {
      tipo:this.$nuxt.$route.query.tipo,
      id:this.$nuxt.$route.query.id,
    };
    this.getDatoContractual(data);
  },
  computed:{
    ...mapGetters({
      loadingShow:'mantenedores/main/loadingShow',
      loadingAction:'mantenedores/main/loadingAction'
    }),
    currentRouteQuery(){
      return this.$nuxt.$route.query;
    },
    show_modal_edit:{
      get() {
        return this.$store.state.mantenedores.main.modal_edit;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_MODAL_EDIT', newValue);
      }
    },

    contractual_cod_sirh:{
      get() {
        return this.$store.state.mantenedores.main.contractual.cod_sirh;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_CONTRACTUAL_COD_SIRH', newValue);
      }
    },
    contractual_name:{
      get() {
        return this.$store.state.mantenedores.main.contractual.name;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_CONTRACTUAL_NAME', newValue);
      }
    },
    errors:{
      get() {
        return this.$store.state.mantenedores.main.errors;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_ERRORS', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      getDatoContractual:'mantenedores/main/getDatoContractual',
      updateContractual:'mantenedores/main/updateContractual'
    }),
    closeModal:function(){
      this.show_modal_edit = false;
      this.contractual_cod_sirh = '';
      this.contractual_name = '';
      this.errors = {};
      this.$router.back();
    },
    editarContractual:function(){
      const data = {
        id:this.currentRouteQuery.id,
        tipo:this.currentRouteQuery.tipo
      };
      this.updateContractual(data);
    }
  }
}
</script>

<style>

</style>
