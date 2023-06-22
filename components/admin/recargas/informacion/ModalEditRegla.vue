<template>
  <div>
    <div class="modal is-large" :class="open_modal_edit_regla ? 'is-active' : '' ">
      <div class="modal-background" @click.prevent="hideModalEditRegla"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Editar regla</p>
          <button class="delete" aria-label="close" @click.prevent="hideModalEditRegla"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <template v-if="loadingRegla">
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
                        <label class="label required">Seleccione grupo</label>
                        <div class="control">
                          <el-select v-model="regla_grupo" :clearable="false" placeholder="Seleccione grupo" class="element-select">
                            <el-option
                              v-for="grupo in gruposAusentismos"
                              :key="grupo.id"
                              :label="grupo.nombre"
                              :value="grupo.id">
                            </el-option>
                          </el-select>
                          <p v-if="errors && errors.grupo" class="help is-danger">{{errors.grupo != null ? errors.grupo[0] : ''}}</p>
                        </div>
                      </div>
                      <div class="field">
                        <template v-if="regla_grupo === 1">
                          <div class="columns">
                            <div class="column">
                              <label class="label">Habilitar días</label>
                              <el-checkbox v-model="active_tipo_dias">{{active_tipo_dias ? 'Si' : 'No'}}</el-checkbox>
                            </div>
                            <div class="column">
                              <label class="label" :class="(active_tipo_dias ? 'required' : '')">Tipo de días</label>
                              <el-radio-group v-model="tipo_dias">
                                <el-radio :disabled="!active_tipo_dias" :label="true">Hábiles</el-radio>
                                <el-radio :disabled="!active_tipo_dias" :label="false">Naturales</el-radio>
                              </el-radio-group>
                            </div>
                          </div>
                        </template>
                        <template v-if="regla_grupo === 2">
                          <div class="columns">
                            <div class="column">
                              <label class="label required">Seleccione meridianos</label>
                              <div class="control">
                                  <el-checkbox-group v-model="regla_meridianos">
                                    <el-checkbox v-for="meridiano in meridianos" :label="meridiano.id" :key="meridiano.id">{{meridiano.nombre}}</el-checkbox>
                                  </el-checkbox-group>
                                <p v-if="errors && errors.meridianos" class="help is-danger">{{errors.meridianos != null ? errors.meridianos[0] : ''}}</p>
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-if="regla_grupo === 3">
                          <div class="columns">
                            <div class="column">
                              <label class="label required">Seleccione horario</label>
                              <div class="control">
                                <template v-if="regla.horarios">
                                  <div class="columns" v-for="(horario, index) in regla.horarios" :key="index">
                                    <div class="column">
                                      <label class="label required">Hora inicio</label>
                                      <el-time-picker
                                        size="mini"
                                        :clearable="false"
                                        format="HH:mm"
                                        value-format="HH:mm"
                                        class="element-style"
                                        :value="horario.hora_inicio_value"
                                        @input="updateHorarioValue(index, 'hora_inicio_value', $event)"
                                        placeholder="Hora inicio"
                                        >
                                      </el-time-picker>
                                    </div>
                                    <div class="column">
                                      <label class="label required">Hora término</label>
                                      <el-time-picker
                                        size="mini"
                                        :clearable="false"
                                        format="HH:mm"
                                        value-format="HH:mm"
                                        class="element-style"
                                        :value="horario.hora_termino_value"
                                        @input="updateHorarioValue(index, 'hora_termino_value', $event)"
                                        placeholder="Hora término"
                                        >
                                      </el-time-picker>
                                    </div>
                                  </div>
                                </template>
                                <p v-if="errors && errors.hora_inicio" class="help is-danger">{{errors.hora_inicio != null ? errors.hora_inicio[0] : ''}}</p>
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                      <div class="field">
                        <div class="columns">
                          <div class="column">
                            <button class="button is-link is-light" :class="(loadingEditRegla ? 'is-loading' : '')" @click.prevent="updateRegla">Editar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
  data(){
    return{
      turnos_options:[
        {id:1, nombre:'Turnante'},
        {id:0, nombre:'No turnante'}
      ]
    };
  },
  created(){
    this.getRegla(this.$route.query.id);
    this.getGruposAusentismos();
    this.getMeridianos();
  },
  computed:{
    ...mapGetters({
      regla:'recargas/recargas/regla',
      loadingRegla:'recargas/recargas/loadingRegla',
      regla:'recargas/recargas/regla',
      gruposAusentismos: "modulos/modulos/gruposAusentismos",
      meridianos: "modulos/modulos/meridianos",
      errors:'recargas/recargas/errorsRegla',
      loadingEditRegla:'recargas/recargas/loadingEditRegla'
    }),
    open_modal_edit_regla:{
      get() {
        return this.$store.state.recargas.recargas.modal_edit_regla;
      },
      set(newValue) {
        this.$store.commit('recargas/recargas/SET_MODAL_EDIT_REGLA', newValue);
      }
    },
    regla_grupo:{
      get() {
        return this.$store.state.recargas.recargas.regla.grupo_id;
      },
      set(newValue) {
        this.$store.commit('recargas/recargas/SET_REGLA_GRUPO', newValue);
      }
    },
    active_tipo_dias:{
      get() {
        return this.$store.state.recargas.recargas.regla.active_tipo_dias;
      },
      set(newValue) {
        this.$store.commit('recargas/recargas/SET_REGLA_ACTIVE_TIPO_DIAS', newValue);
      }
    },
    tipo_dias:{
      get() {
        return this.$store.state.recargas.recargas.regla.tipo_dias;
      },
      set(newValue) {
        this.$store.commit('recargas/recargas/SET_REGLA_TIPO_DIAS', newValue);
      }
    },
    regla_turno:{
      get() {
        return this.$store.state.recargas.recargas.regla.turno_funcionario;
      },
      set(newValue) {
        this.$store.commit('recargas/recargas/SET_REGLA_TURNO', newValue);
      }
    },
    regla_meridianos:{
      get() {
        return this.$store.state.recargas.recargas.regla.meridianos;
      },
      set(newValue) {
        this.$store.commit('recargas/recargas/SET_REGLA_MERIDIANOS', newValue);
      }
    },
    regla_hora_inicio_turnante:{
      get() {
        return this.$store.state.recargas.recargas.regla.hora_inicio;
      },
      set(newValue) {
        this.$store.commit('recargas/recargas/SET_REGLA_HORA_INICIO', newValue);
      }
    },
    regla_hora_termino_turnante:{
      get() {
        return this.$store.state.recargas.recargas.regla.hora_termino;
      },
      set(newValue) {
        this.$store.commit('recargas/recargas/SET_REGLA_HORA_TERMINO', newValue);
      }
    },
  },
  methods:{
    ...mapActions({
      getGruposAusentismos: 'modulos/modulos/getGruposAusentismos',
      getRegla:'recargas/recargas/getRegla',
      getMeridianos: 'modulos/modulos/getMeridianos',
      updateReglaAction:'recargas/recargas/updateRegla',
    }),
    hideModalEditRegla:function(){
      this.open_modal_edit_regla = false;
      this.$router.back();
    },
    updateHorarioValue(index, atributo, valor) {
      let data = {
        index:index,
        atributo:atributo,
        valor:valor
      };
      this.$store.commit('recargas/recargas/SET_HORA_REGLA', data);
    },
    updateRegla:function(){
      const data = {
        id_regla:this.$route.query.id,
        active_tipo_dias:this.active_tipo_dias,
        tipo_dias:this.tipo_dias,
        grupo_id:this.regla_grupo,
        meridianos:this.regla_meridianos,
        horarios:this.regla.horarios,
      };
      this.updateReglaAction(data);
    }
  }
}
</script>

<style>

</style>
