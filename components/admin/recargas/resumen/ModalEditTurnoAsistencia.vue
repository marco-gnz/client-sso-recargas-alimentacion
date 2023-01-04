<template>
  <div>
    <div class="modal is-large" :class="modalEditAsistencia ? 'is-active' : '' ">
        <div class="modal-background"></div>
        <div class="modal-card" style="width: 50%;">
            <header class="modal-card-head">
                <p class="modal-card-title">Editar tipo de turno ({{asistencia != null ? `${asistencia.funcionario_nombres} | ${asistencia.fecha}` : ''}})</p>
                <button class="delete" aria-label="close" @click.prevent="hideModalAsistencia"></button>
            </header>

            <section class="modal-card-body">
                <div class="columns">
                    <div class="column">
                        <div class="field">
                            <label class="label">Seleccione tipo de turno</label>
                            <el-select class="element-style" v-model="tipo_turno_asistencia" placeholder="Seleccione tipo de turno">
                                <el-option
                                v-for="tipo in tiposAsistenciaTurnos"
                                :key="tipo.id"
                                :label="`${tipo.descripcion} (${tipo.nombre})`"
                                :value="tipo.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="field">
                            <div class="buttons is-right">
                                <button class="button is-link is-light" :class="(setLoadingAction ? 'is-loading' : '')" :disabled="disabledButton" @click.prevent="editAsistencia">Editar</button>
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
    props:['asistencia'],
    computed:{
        ...mapGetters({
            modalEditAsistencia: "recargas/asistenciaResumen/modalEditAsistencia",
            tiposAsistenciaTurnos:'modulos/modulos/tiposAsistenciaTurnos',
            setLoadingAction:'recargas/asistenciaResumen/setLoadingAction'
        }),
        tipo_turno_asistencia:{
            get() {
                return this.$store.state.recargas.asistenciaResumen.asistenciaSelected.tipo_asistencia_turno_id;
            },
            set(newValue) {
                this.$store.commit('recargas/asistenciaResumen/SET_TIPO_ASISTENCIA_TURNO', newValue);
            }
        },
        disabledButton(){
            let disabled = true;
            if((this.asistencia) && (this.asistencia.tipo_asistencia_turno.id != this.tipo_turno_asistencia)){
                disabled = false;
            }
            return disabled;
        }
    },
    methods:{
        ...mapActions({
            updateAsistencia:"recargas/asistenciaResumen/updateAsistencia"
        }),
        hideModalAsistencia:function(){
            this.$store.commit('recargas/asistenciaResumen/SET_MODAL_EDIT', false);
        },
        editAsistencia:function(){
            let data = {
                id:this.asistencia.id,
                tipo_asistencia_turno_id:this.tipo_turno_asistencia
            };

            this.updateAsistencia(data);
        }
    }
}
</script>

<style>

</style>
