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
                  <label class="label">Ingrese código SIRH</label>
                  <input v-model="variacion_cod_sirh" type="text" class="input" placeholder="Ingrese código SIRH">
                  <p v-if="errors && errors.cod_sirh" class="help is-danger">{{errors.cod_sirh != null ? errors.cod_sirh[0] : ''}}</p>
                </div>
                <div class="field">
                  <label class="label required">Ingrese nombre</label>
                  <input v-model="variacion_name" type="text" class="input" placeholder="Ingrese nombre">
                  <p v-if="errors && errors.nombre" class="help is-danger">{{errors.nombre != null ? errors.nombre[0] : ''}}</p>
                </div>
                <div class="field">
                  <label class="label required">Ingrese sigla</label>
                  <input v-model="variacion_sigla" type="text" class="input" placeholder="Ingrese sigla">
                  <p v-if="errors && errors.sigla" class="help is-danger">{{errors.sigla != null ? errors.sigla[0] : ''}}</p>
                </div>
              </template>
              <div class="field">
                <div class="columns">
                  <div class="column">
                    <button class="button is-link is-light" :class="(loadingAction ? 'is-loading' : '')" @click.prevent="editarVariacion">Editar</button>
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
    this.getVariacion(data);
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

    variacion_cod_sirh:{
      get() {
        return this.$store.state.mantenedores.main.variacion.cod_sirh;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_VARIACION_COD_SIRH', newValue);
      }
    },
    variacion_name:{
      get() {
        return this.$store.state.mantenedores.main.variacion.name;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_VARIACION_NAME', newValue);
      }
    },
    variacion_sigla:{
      get() {
        return this.$store.state.mantenedores.main.variacion.sigla;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_VARIACION_SIGLA', newValue);
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
      getVariacion:'mantenedores/main/getVariacion',
      updateVariacion:'mantenedores/main/updateVariacion'
    }),
    closeModal:function(){
      this.show_modal_edit = false;
      this.variacion_cod_sirh = '';
      this.variacion_name = '';
      this.variacion_sigla = '';
      this.errors = {};
      this.$router.back();
    },
    editarVariacion:function(){
      const data = {
        id:this.currentRouteQuery.id,
        tipo:this.currentRouteQuery.tipo
      };
      this.updateVariacion(data);
    }
  }
}
</script>

<style>

</style>
