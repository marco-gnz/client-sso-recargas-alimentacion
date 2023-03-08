<template>
  <div>
    <div class="modal is-large" :class="openModalGrupos ? 'is-active' : '' ">
      <div class="modal-background"></div>
      <div class="modal-card" style="width: 80%;">
        <header class="modal-card-head">
          <p class="modal-card-title">Definir reglas para tipos de ausentismo en la recarga #{{codigo}}</p>
          <button class="delete" aria-label="close" @click.prevent="hideGrupostModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <h5 class="title is-5">Listado de ausentismos no asociados a la recarga</h5>
              <template v-if="grupos.length">
                <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th>Tipo de ausentismo</th>
                      <th>Grupo</th>
                      <th>
                        <el-tooltip class="item" effect="dark" content="Si regla esta habilitada, se contará para realizar cálculos." placement="top-start">
                          <span>Regla</span>
                        </el-tooltip>
                      </th>
                      <th>
                        <el-tooltip class="item" effect="dark" content="Turno aplica para grupo 2 y 3." placement="top-start">
                          <span>Turno</span>
                        </el-tooltip>
                      </th>
                      <th>Definir regla</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(g, index) in grupos" :key="index">
                      <td>
                        <span class="is-size-7">{{g.nombre}}</span>
                        <p v-if="(errors) && (errors[`reglas.${index}.recarga_id`])" class="help is-danger">{{errors[`reglas.${index}.recarga_id`][0]}}</p>
                      </td>
                      <th>
                        <el-select size="mini" class="element-style" v-model="g.grupo_id" @change="changeRegla(index, g.n_grupo)" placeholder="Seleccione grupo">
                          <el-option
                            v-for="grupo in gruposAusentismos"
                            :key="grupo.id"
                            :label="grupo.n_grupo"
                            :value="grupo.id">
                          </el-option>
                        </el-select>
                        <p v-if="(errors) && (errors[`reglas.${index}.grupo_id`])" class="help is-danger">{{errors[`reglas.${index}.grupo_id`][0]}}</p>
                      </th>
                      <th>
                        <el-checkbox v-model="g.active">{{g.active ? 'Si' : 'No'}}</el-checkbox>
                        <p v-if="(errors) && (errors[`reglas.${index}.active`])" class="help is-danger">{{errors[`reglas.${index}.active`][0]}}</p>
                      </th>
                      <th>
                        <el-select :disabled="g.grupo_id === 1" size="mini" class="element-style" v-model="g.turno" @change="changeRegla(index, g.grupo_id)" placeholder="Seleccione grupo">
                          <el-option
                            v-for="turno in turnos_options"
                            :key="turno.id"
                            :label="turno.nombre"
                            :value="turno.id">
                          </el-option>
                        </el-select>
                        <p v-if="(errors) && (errors[`reglas.${index}.turno`])" class="help is-danger">{{errors[`reglas.${index}.turno`][0]}}</p>
                      </th>
                      <th>
                        <template v-if="g.grupo_id === 2 && g.active">
                          <template v-if="g.turno === 1">
                            <el-checkbox-group v-model="g.meridiano_turnante">
                              <el-checkbox v-for="meridiano in meridianos" :label="meridiano.id" :key="meridiano.id">{{meridiano.nombre}}</el-checkbox>
                            </el-checkbox-group>
                          </template>
                          <template v-else>
                            <el-checkbox-group v-model="g.meridiano_no_turnante">
                              <el-checkbox v-for="meridiano in meridianos" :label="meridiano.id" :key="meridiano.id">{{meridiano.nombre}}</el-checkbox>
                            </el-checkbox-group>
                          </template>
                          <p v-if="(errors) && (errors[`reglas.${index}.meridiano_turnante`])" class="help is-danger">{{errors[`reglas.${index}.meridiano_turnante`][0]}}</p>
                          <p v-if="(errors) && (errors[`reglas.${index}.meridiano_no_turnante`])" class="help is-danger">{{errors[`reglas.${index}.meridiano_no_turnante`][0]}}</p>
                        </template>
                        <template v-if="g.grupo_id === 3 && g.active">
                          <div class="columns">
                            <template v-if="g.turno === 1">
                              <div class="column">
                                <el-time-picker
                                  size="mini"
                                  :clearable="false"
                                  format="HH:mm"
                                  value-format="HH:mm"
                                  class="element-style"
                                  v-model="g.hora_inicio_turnante"
                                  placeholder="Hora inicio"
                                  >
                                </el-time-picker>
                              </div>
                              <div class="column">
                                <el-time-picker
                                  size="mini"
                                  :clearable="false"
                                  format="HH:mm"
                                  value-format="HH:mm"
                                  class="element-style"
                                  v-model="g.hora_termino_turnante"
                                  placeholder="Hora término"
                                  >
                                </el-time-picker>
                              </div>
                            </template>
                            <template v-else>
                              <div class="column">
                                <el-time-picker
                                  size="mini"
                                  :clearable="false"
                                  format="HH:mm"
                                  value-format="HH:mm"
                                  class="element-style"
                                  v-model="g.hora_inicio_no_turnante"
                                  placeholder="Hora inicio"
                                  >
                                </el-time-picker>
                              </div>
                              <div class="column">
                                <el-time-picker
                                  size="mini"
                                  :clearable="false"
                                  format="HH:mm"
                                  value-format="HH:mm"
                                  class="element-style"
                                  v-model="g.hora_termino_no_turnante"
                                  placeholder="Hora término"
                                  >
                                </el-time-picker>
                              </div>
                            </template>
                          </div>
                          <div class="columns">
                            <div class="column">
                              <p v-if="(errors) && (errors[`reglas.${index}.hora_inicio_turnante`])" class="help is-danger">{{errors[`reglas.${index}.hora_inicio_turnante`][0]}}</p>
                              <p v-if="(errors) && (errors[`reglas.${index}.hora_inicio_no_turnante`])" class="help is-danger">{{errors[`reglas.${index}.hora_inicio_no_turnante`][0]}}</p>
                            </div>
                            <div class="column">
                              <p v-if="(errors) && (errors[`reglas.${index}.hora_termino_turnante`])" class="help is-danger">{{errors[`reglas.${index}.hora_termino_turnante`][0]}}</p>
                              <p v-if="(errors) && (errors[`reglas.${index}.hora_termino_no_turnante`])" class="help is-danger">{{errors[`reglas.${index}.hora_termino_no_turnante`][0]}}</p>
                            </div>
                          </div>
                        </template>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </template>
              <template v-else>
                <el-empty :image-size="90">
                  <div class="row" slot="description">
                  <div class="col-md-12"><span>Ya se han agregado todos los tipos de ausentismo...</span></div>
                  </div>
              </el-empty>
              </template>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot buttons is-right">
          <button :disabled="!grupos.length" class="button is-primary is-rounded" @click.prevent="storeReglas">Ingresar {{grupos.length > 1 ? 'reglas' : 'regla'}}</button>
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
      value:'',
      checked:false,
      grupos:[],
      checkedCities:[],
      value1:[],
      turnos_options:[
        {id:1, nombre:'Turnante'},
        {id:2, nombre:'No turnante'}
      ]
    };
  },
  computed:{
    ...mapGetters({
      openModalGrupos: "recargas/grupos/modalGrupos",
      tiposAusentismos: "modulos/modulos/tiposAusentismos",
      gruposAusentismos: "modulos/modulos/gruposAusentismos",
      meridianos: "modulos/modulos/meridianos",
      errors: "recargas/grupos/errors",
    }),
  },
  mounted(){
    this.getTiposAusentismos();
    /* this.getGruposAusentismos(); */
    this.getGrupoAusentismos();
    this.getMeridianos();
  },
  methods:{
    ...mapActions({
      getTiposAusentismos: 'modulos/modulos/getTiposAusentismos',
      /* getGruposAusentismos: 'modulos/modulos/getGruposAusentismos', */
      getMeridianos: 'modulos/modulos/getMeridianos',
      storeReglasAction: 'recargas/grupos/storeReglas',
    }),
    hideGrupostModal:function(){
      this.$store.commit('recargas/grupos/SET_MODAL_GRUPOS', false);
    },
    async getGrupoAusentismos(){
      const url = `/api/admin/recargas/grupos-ausentismos/${this.codigo}`;

      await this.$axios.$get(url).then(response => {
        this.grupos = response;
      }).catch(error => {
        console.log(error);
      });
    },
    storeReglas:function(){
      this.storeReglasAction(this.grupos);
    },
    changeRegla:function(index, n_grupo){
      if(n_grupo === 2){
        this.grupos[index].active       = true;
        this.grupos[index].hora_inicio_turnante  = '';
        this.grupos[index].hora_termino_turnante = '';
        this.grupos[index].hora_inicio_no_turnante  = '';
        this.grupos[index].hora_termino_no_turnante = '';
      }else if(3){
        this.grupos[index].meridiano_turnante       = [];
        this.grupos[index].meridiano_no_turnante    = [];
      }


    }
  }
}
</script>

<style>

</style>
