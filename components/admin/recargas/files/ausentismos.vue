<template>
  <div>
    <div class="modal is-large" :class="openModalAusentismos ? 'is-active' : '' ">
      <div class="modal-background"></div>
      <div class="modal-card" style="width: 80%;">
        <header class="modal-card-head">
          <p class="modal-card-title">Carga masiva de grupo de ausentismos</p>
          <button class="delete" aria-label="close" @click.prevent="hideAusentismosModal"></button>
        </header>

        <section class="modal-card-body p-6">
          <el-steps :active="paso" align-center>
            <el-step title="Paso 1" description="Grupo de ausentismo"></el-step>
            <el-step title="Paso 2" description="Descripción de columnas "></el-step>
            <el-step title="Paso 3" description="Seleccionar archivo"></el-step>
            <el-step title="Paso 4" description="Verificar datos"></el-step>
            <el-step title="Paso 5" description="Importación exitosa"></el-step>
          </el-steps>
        </section>
        <section v-if="paso === 0" class="modal-card-body">
          <div class="columns">
            <div class="column is-4 is-offset-4">
              <h6 class="title is-6">Seleccione grupo a importar</h6>
              <div class="field">
                <div class="columns">
                  <div class="column" v-for="(grupo, index) in grupos" :key="index">
                    <el-radio-group v-model="grupo_value" @change="getReglasGrupo">
                      <el-tooltip class="item" effect="dark" :content="`${grupo.descripcion}`" placement="top-start">
                        <el-radio-button :label="grupo.id">{{grupo.nombre}}</el-radio-button>
                      </el-tooltip>
                    </el-radio-group>
                  </div>
                </div>
              </div>
              <div class="field">
                <template v-if="reglas.length">
                  <el-tag size="mini" type="success">{{`${Intl.NumberFormat('de-DE').format(reglas.length)} ${reglas.length > 1 ? `tipos de ausentismos` : `tipo de ausentismo`}`}}</el-tag>
                  <table class="table is-fullwidth" v-loading="loadingReglas" element-loading-text="Cargando reglas...">
                    <thead>
                      <tr>
                        <th>Tipo de ausentismo</th>
                        <th>Regla</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(regla, index) in reglas" :key="index">
                        <td>{{regla.tipo_ausentismo.nombre}}</td>
                        <td>
                          <template v-if="grupo_value === 1">
                            DC
                          </template>
                          <template v-if="grupo_value === 2">
                            {{`${regla.meridianos.length ? regla.meridianos.map(m => m.nombre).join(' - ') : '--'}`}}
                          </template>
                          <template v-if="grupo_value === 3">
                            {{`${regla.hora_inicio != null && regla.hora_termino != null ? `${DateTime.fromISO(regla.hora_inicio).toFormat('T')} / ${DateTime.fromISO(regla.hora_termino).toFormat('T')}` : '--'}`}}
                          </template>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </template>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot buttons is-right">
          <button :disabled="paso === 0" v-if="paso != 4" @click.prevent="volver" class="button is-rounded">Volver</button>
          <button v-if="paso < 2" @click.prevent="siguiente" v-loading.fullscreen.lock="loadingSpinner" class="button is-info is-rounded">Siguiente</button>
          <button v-if="paso === 2" class="button is-primary is-rounded" v-loading.fullscreen.lock="loadingSpinner">Cargar datos</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  props:['codigo'],
  data(){
    return{
      radio1:''
    };
  },
  computed:{
    ...mapGetters({
      openModalAusentismos: "recargas/ausentismos/modal",
      paso: "recargas/ausentismos/paso",
      loadingSpinner:'recargas/ausentismos/fullScreenLoading',
      grupos:'modulos/modulos/gruposAusentismos',
      reglas:'recargas/ausentismos/reglas',
      loadingReglas:'recargas/ausentismos/loadingReglas',
    }),
    grupo_value:{
      get() {
        return this.$store.state.recargas.ausentismos.carga.grupo_id;
      },
      set(newValue) {
        this.$store.commit('recargas/ausentismos/SET_GRUPO', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      closeModal:'recargas/ausentismos/closeModal',
      getReglasGrupoAction:'recargas/ausentismos/getReglas'
    }),
    getReglasGrupo:function(){
      const data = {
        grupo_id:this.grupo_value,
        recarga_codigo:this.codigo
      };
      this.getReglasGrupoAction(data);
    },
    hideAusentismosModal:function(){
      this.closeModal();
    },
    volver:function(){
      this.$store.commit('recargas/ausentismos/SET_NEGATIVE_PASO_MODAL');
    },
    siguiente:function(){
      this.$store.commit('recargas/ausentismos/SET_POSITIVE_PASO_MODAL');
    }
  }
}
</script>

<style>

</style>
