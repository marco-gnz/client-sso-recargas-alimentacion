<template>
  <div>
    <div class="modal-background" @click.prevent="hideModalAdd"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Ingresar funcionario</p>
        <button class="delete" aria-label="close" @click.prevent="hideModalAdd"></button>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
             <div class="field">
              <div class="columns">
                <div class="column">
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
                        <button class="button is-link is-light" :class="(loadingAddFuncionario ? 'is-loading' : '')" @click.prevent="addFuncionario">Ingresar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  computed:{
    ...mapGetters({
      errors:'usuarios/funcionarios/main/newsErrors',
      loadingAddFuncionario:'usuarios/funcionarios/main/loadingAddFuncionario',
    }),
    show_modal_add:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.show_modal_add;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_MODAL_ADD', newValue);
      }
    },
    rut:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.new_funcionario.rut;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_NEW_FUNCIONARIO_RUT', newValue);
      }
    },
    dv:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.new_funcionario.dv;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_NEW_FUNCIONARIO_DV', newValue);
      }
    },
    nombres:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.new_funcionario.nombres;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_NEW_FUNCIONARIO_NOMBRES', newValue);
      }
    },
    apellidos:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.new_funcionario.apellidos;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_NEW_FUNCIONARIO_APELLIDOS', newValue);
      }
    },
    email:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.new_funcionario.email;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_NEW_FUNCIONARIO_EMAIL', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      addFuncionarioAction:'usuarios/funcionarios/main/addFuncionario'
    }),
     hideModalAdd:function(){
      this.show_modal_add = false;
    },
    addFuncionario:function(){
      this.addFuncionarioAction();
    }
  }
}
</script>

<style>

</style>
