<template>
  <div>
    <div class="modal is-large" :class="modalEditAsistencia ? 'is-active' : '' ">
        <div class="modal-background" @click.prevent="hideModalAsistencia"></div>
        <div class="modal-card" style="width: 50%;">
            <header class="modal-card-head">
                <p class="modal-card-title">Editar tipo de turno en asistencia</p>
                <button class="delete" aria-label="close" @click.prevent="hideModalAsistencia"></button>
            </header>
            <section class="modal-card-body">
              <template v-if="loadingAsistencia">
                <el-skeleton-item variant="h4" class="title is-4" style="width: 50%" /><br>
                <el-skeleton-item variant="h4" class="subtitle is-4" style="width: 30%" />
              </template>
              <template v-else>
                <h4 class="title is-4">{{asistencia != null ? `${asistencia.funcionario_nombres}` : ''}}</h4>
                <h4 class="subtitle is-4">{{asistencia != null ? `Fecha: ${asistencia.fecha}` : ''}}</h4>
              </template>
              <div class="columns">
                <div class="column">
                  <div class="field">
                      <label class="label required">Seleccione tipo de turno</label>
                      <template v-if="loadingAsistencia">
                        <el-skeleton-item variant="select" class="subtitle is-4" style="width: 30%" />
                      </template>
                      <template v-else>
                        <el-select class="element-style" v-model="tipo_turno_asistencia" placeholder="Seleccione tipo de turno">
                          <el-option
                          v-for="tipo in tiposAsistenciaTurnos"
                          :key="tipo.id"
                          :label="`${tipo.descripcion} (${tipo.nombre})`"
                          :value="tipo.id">
                          </el-option>
                      </el-select>
                      <p v-if="errors && errors.tipo_asistencia_turno_id" class="help is-danger">{{errors.tipo_asistencia_turno_id[0]}}</p>
                      </template>
                  </div>
                  <div class="field">
                    <label class="label required">Observación</label>
                    <textarea v-model="observacion" class="textarea has-fixed-size" placeholder="Ingrese motivo, causa u otra observación..."></textarea>
                    <p v-if="errors && errors.observacion" class="help is-danger">{{errors.observacion[0]}}</p>
                  </div>
                  <div class="field">
                      <div class="buttons is-right">
                        <button class="button is-link is-light" :class="(setLoadingAction ? 'is-loading' : '')" :disabled="(disabledButton || loadingAsistencia)" @click.prevent="editAsistencia">Editar</button>
                      </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <template v-if="(asistencia.observaciones) && (asistencia.observaciones.length)">
                    <h6 class="subtitle is-6">Historial de modificaciones</h6>
                    <el-timeline>
                      <el-timeline-item
                        v-for="(ob, index) in asistencia.observaciones"
                        :key="index"
                        :timestamp="`Turno: ${ob.tipo_asistencia_nombre} - ${ob.user_created_by} ${ob.created_at}`">
                        {{ob.observacion != null ? ob.observacion : ''}}
                      </el-timeline-item>
                    </el-timeline>
                  </template>
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
      if(this.$route.query.id){
        this.findAsistencia(this.$route.query.id);
        this.modalEdit = true;
      }
    },
    computed:{
        ...mapGetters({
            modalEditAsistencia: "recargas/asistenciaResumen/modalEditAsistencia",
            tiposAsistenciaTurnos:'modulos/modulos/tiposAsistenciaTurnos',
            setLoadingAction:'recargas/asistenciaResumen/setLoadingAction',
            errors:'recargas/asistenciaResumen/errors',
            asistencia:'recargas/asistenciaResumen/asistencia',
            loadingAsistencia:'recargas/asistenciaResumen/loadingAsistencia'
        }),
        tipo_turno_asistencia:{
            get() {
                return this.$store.state.recargas.asistenciaResumen.asistenciaSelected.tipo_asistencia_turno_id;
            },
            set(newValue) {
                this.$store.commit('recargas/asistenciaResumen/SET_TIPO_ASISTENCIA_TURNO', newValue);
            }
        },
        observacion:{
            get() {
                return this.$store.state.recargas.asistenciaResumen.asistenciaSelected.observacion;
            },
            set(newValue) {
                this.$store.commit('recargas/asistenciaResumen/SET_TIPO_OBSERVACION_TURNO', newValue);
            }
        },
        modalEdit:{
          get() {
            return this.$store.state.recargas.asistenciaResumen.modal_edit_asistencia;
          },
          set(newValue) {
            this.$store.commit('recargas/asistenciaResumen/SET_MODAL_EDIT', newValue);
          }
        },
        disabledButton(){
            let disabled = true;
            if((this.asistencia) && (this.asistencia.tipo_asistencia_turno_id != this.tipo_turno_asistencia)){
                disabled = false;
            }
            return disabled;
        }
    },
    methods:{
        ...mapActions({
            updateAsistencia:"recargas/asistenciaResumen/updateAsistencia",
            findAsistencia:"recargas/asistenciaResumen/findAsistencia",
        }),
        hideModalAsistencia:function(){
            this.$store.commit('recargas/asistenciaResumen/SET_MODAL_EDIT', false);
            this.$router.back();
        },
        editAsistencia:function(){
            let data = {
                id:this.asistencia.id,
                tipo_asistencia_turno_id:this.tipo_turno_asistencia,
                observacion:this.observacion
            };

            this.updateAsistencia(data);
        }
    }
}
</script>

<style>

</style>
