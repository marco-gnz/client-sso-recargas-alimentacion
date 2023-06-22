<template>
    <div class="container.is-fullhd">
      <div class="card p-6 m-6">
        <h2 class="subtitle">Enviar cartola</h2>
        <div class="columns">
          <div class="column">
            <div class="field">
                <label class="label">Buscar funcionario beneficiario</label>
                <el-select
                    no-data-text="No se encontaron resultados..."
                    class="element-style"
                    v-model="form_funcionario"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="Busque por rut, nombre o apellidos del funcionario..."
                    :remote-method="searchFuncionarios"
                    :loading="loadingSearchFuncionario"
                    @change="searchEsquemas">
                    <el-option
                      v-for="funcionario in funcionarios"
                      :key="funcionario.uuid"
                      :label="`${funcionario.nombre_completo}`"
                      :value="funcionario.uuid">
                      <span style="float: left">{{ funcionario.nombre_completo }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ funcionario.rut_completo }}</span>
                    </el-option>
                </el-select>
                <p v-if="errors && errors.funcionario_id" class="help is-danger">{{errors.funcionario_id[0]}}</p>
            </div>
            <div class="field">
                <label class="label">Seleccione mes y año de recarga de beneficio</label>
                <el-select :disabled="!form_funcionario" v-model="form_esquema" multiple collapse-tags size="small" class="element-style" placeholder="Seleccione cartola">
                  <el-option
                    v-for="esquema in esquemas"
                    :key="esquema.uuid"
                    :label="`${esquema.anio_beneficio} - ${esquema.mes_beneficio}`"
                    :value="esquema.uuid">
                    <span style="float: left">{{ `${esquema.establecimiento} ${esquema.anio_beneficio} - ${esquema.mes_beneficio} `}}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ `${esquema.beneficio}`}}</span>
                  </el-option>
                </el-select>
                <p v-if="errors && errors.esquema_id" class="help is-danger">{{errors.esquema_id[0]}}</p>
            </div>
            <div class="field">
                <label class="label">Ingrese correo electrónico a enviar reporte</label>
                <input :disabled="!form_esquema" v-model="form_email" class="input" type="email" placeholder="Ingrese correo electrónico">
                <p v-if="errors && errors.email" class="help is-danger">{{errors.email[0]}}</p>
            </div>
            <div class="field">
              <div class="buttons is-right">
                <button :disabled="!form_funcionario || !form_esquema.length || !form_email" :class="(loadingEnviarCartola ? 'is-loading' : '')" class="button is-link is-light is-fullwidth is-rounded" @click.prevent="enviarCartolaAction">Enviar cartola</button>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="is-flex is-align-items-center is-justify-content-center pt-6">
              <figure class="image is-512x512">
                <img class="is-rounded" src="~/assets/img/enviar.webp" style="max-height: 200px; max-width: 200px;">
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
  middleware: 'auth',
  head() {
      return {
          title: "Enviar cartola"
      };
  },
  computed:{
    ...mapGetters({
      loadingSearchFuncionario:'esquemas/enviar/loadingSearchFuncionario',
      funcionarios:'esquemas/enviar/funcionarios',
      esquemas:'esquemas/enviar/esquemas',
      loadingEnviarCartola:'esquemas/enviar/loadingEnviarCartola',
      errors:'esquemas/enviar/errors'
    }),
    form_funcionario:{
      get(){
        return this.$store.state.esquemas.enviar.form.funcionario_id;
      },
      set(newValue){
        this.$store.commit('esquemas/enviar/SET_FORM_FUNCIONARIO_ID', newValue);
      }
    },
    form_esquema:{
      get(){
        return this.$store.state.esquemas.enviar.form.esquema_id;
      },
      set(newValue){
        this.$store.commit('esquemas/enviar/SET_FORM_ESQUEMA_ID', newValue);
      }
    },
    form_email:{
      get(){
        return this.$store.state.esquemas.enviar.form.email;
      },
      set(newValue){
        this.$store.commit('esquemas/enviar/SET_FORM_EMAIL', newValue);
      }
    }
  },
  methods:{
    ...mapActions({
      getSearchFuncionario:'esquemas/enviar/getSearchFuncionario',
      getEsquemasFuncionario:'esquemas/enviar/getEsquemasFuncionario',
      enviarCartola:'esquemas/enviar/enviarCartola'
    }),
    searchFuncionarios:function(query){
      const data = {
        input:query
      };
      this.getSearchFuncionario(data);
      if(this.form_esquema){
        this.form_esquema = [];
      }
    },
    searchEsquemas:function(){
      this.getEsquemasFuncionario();
    },
    enviarCartolaAction:function(){
      this.enviarCartola();
    }
  }
}
</script>

<style>

</style>
