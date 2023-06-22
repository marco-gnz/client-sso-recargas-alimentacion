<template>
  <div>
    <div class="modal-background" @click.prevent="hideModalEditar"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Editar funcionario</p>
        <button class="delete" aria-label="close" @click.prevent="hideModalEditar"></button>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <template v-if="loadinFuncionario">
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
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <label class="label">Rut</label>
                      <div class="control">
                        <input class="input" type="number" placeholder="Ingrese rut" v-model="rut">
                        <p v-if="errors && errors.rut" class="help is-danger">{{errors.rut != null ? errors.rut[0] : ''}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <label class="label">DV</label>
                      <div class="control">
                        <input class="input" type="text" placeholder="Ingrese DV" v-model="dv">
                        <p v-if="errors && errors.dv" class="help is-danger">{{errors.dv != null ? errors.dv[0] : ''}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <label class="label">Nombre</label>
                      <div class="control">
                        <input class="input" type="text" placeholder="Ingrese nombre" v-model="nombres">
                        <p v-if="errors && errors.nombres" class="help is-danger">{{errors.nombres != null ? errors.nombres[0] : ''}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <label class="label">Apellidos</label>
                      <div class="control">
                        <input class="input" type="text" placeholder="Ingrese apellidos" v-model="apellidos">
                        <p v-if="errors && errors.apellidos" class="help is-danger">{{errors.apellidos != null ? errors.apellidos[0] : ''}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <label class="label">Correo electrónico</label>
                      <div class="control">
                        <input class="input" type="email" placeholder="Ingrese correo electrónico" v-model="email">
                        <p v-if="errors && errors.email" class="help is-danger">{{errors.email != null ? errors.email[0] : ''}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="columns">
                  <div class="column">
                    <button class="button is-link is-light" :class="(loadingEditFuncionario ? 'is-loading' : '')" @click.prevent="editarFuncionario">Editar</button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  created(){
    if(this.$route.query.id){
      this.show_modal_editar = true;
      this.getFuncionario(this.$route.query.id);
    }
  },
  computed:{
    ...mapGetters({
      loadinFuncionario:'usuarios/funcionarios/main/loadinFuncionario',
      errors:'usuarios/funcionarios/main/errors',
      loadingEditFuncionario:'usuarios/funcionarios/main/loadingEditFuncionario',
    }),
    show_modal_editar:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.show_modal_editar;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_MODAL_EDITAR', newValue);
      }
    },

    rut:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.funcionario.rut;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_FUNCIONARIO_RUT', newValue);
      }
    },
    dv:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.funcionario.dv;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_FUNCIONARIO_DV', newValue);
      }
    },
    nombres:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.funcionario.nombres;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_FUNCIONARIO_NOMBRES', newValue);
      }
    },
    apellidos:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.funcionario.apellidos;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_FUNCIONARIO_APELLIDOS', newValue);
      }
    },
    email:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.funcionario.email;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_FUNCIONARIO_EMAIL', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
        getFuncionario: 'usuarios/funcionarios/main/getFuncionario',
        editFuncionarioAction: 'usuarios/funcionarios/main/editFuncionario',
      }),
    hideModalEditar:function(){
      this.show_modal_editar = false;
      this.$router.back();
    },
    editarFuncionario:function(){
      this.editFuncionarioAction(this.$route.query.id);
    }
  }
}
</script>

<style>

</style>
