<template>
  <div>
    <div class="modal is-large" :class="openModalGrupos ? 'is-active' : '' ">
      <div class="modal-background"></div>
      <div class="modal-card" style="width: 80%;">
        <header class="modal-card-head">
          <p class="modal-card-title">Definir reglas para tipos de ausentismo</p>
          <button class="delete" aria-label="close" @click.prevent="hideGrupostModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <h5 class="title is-5">Listado de ausentismos</h5>
              <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th>Recarga</th>
                    <th>Tipo de ausentismo</th>
                    <th>Grupo</th>
                    <th>Regla</th>
                    <th>Definir regla</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(g, index) in grupos" :key="index">
                    <th>
                      #{{codigo}}
                    </th>
                    <th>
                      {{g.nombre}}
                      <p v-if="(errors) && (errors[`reglas.${index}.recarga_id`])" class="help is-danger">{{errors[`reglas.${index}.recarga_id`][0]}}</p>
                    </th>
                    <th>
                      <el-select size="mini" class="element-style" v-model="g.grupo_id" @change="changeRegla(index, g.grupo_id)" placeholder="Seleccione grupo">
                        <el-option
                          v-for="grupo in gruposAusentismos"
                          :key="grupo.id"
                          :label="grupo.nombre"
                          :value="grupo.id">
                        </el-option>
                      </el-select>
                      <p v-if="(errors) && (errors[`reglas.${index}.grupo_id`])" class="help is-danger">{{errors[`reglas.${index}.grupo_id`][0]}}</p>
                    </th>
                    <th>
                      <el-checkbox :disabled="g.grupo_id === 1" v-model="g.active">{{g.active ? 'Si' : 'No'}}</el-checkbox>
                      <p v-if="(errors) && (errors[`reglas.${index}.active`])" class="help is-danger">{{errors[`reglas.${index}.active`][0]}}</p>
                    </th>
                    <th>
                      <template v-if="g.grupo_id === 2 && g.active">
                        <el-checkbox-group v-model="g.meridiano">
                          <el-checkbox v-for="meridiano in meridianos" :label="meridiano.id" :key="meridiano.id">{{meridiano.nombre}}</el-checkbox>
                        </el-checkbox-group>
                        <p v-if="(errors) && (errors[`reglas.${index}.meridiano`])" class="help is-danger">{{errors[`reglas.${index}.meridiano`][0]}}</p>
                      </template>
                      <template v-if="g.grupo_id === 3 && g.active">
                        <el-time-picker
                          size="mini"
                          :clearable="false"
                          format="HH:mm"
                          value-format="HH:mm"
                          class="element-style"
                          v-model="g.hora_inicio"
                          placeholder="Hora inicio"
                          >
                        </el-time-picker>
                        <el-time-picker
                          size="mini"
                          :clearable="false"
                          format="HH:mm"
                          value-format="HH:mm"
                          class="element-style"
                          v-model="g.hora_termino"
                          placeholder="Hora término"
                          >
                        </el-time-picker>
                        <p v-if="(errors) && (errors[`reglas.${index}.hora_inicio`])" class="help is-danger">{{errors[`reglas.${index}.hora_termino`][0]}}</p>
                      </template>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot buttons is-right">
          <button class="button is-primary is-rounded" @click.prevent="storeReglas">Ingresar reglas</button>
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
      value1:[]
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
        console.log(response);
      }).catch(error => {
        console.log(error);
      });
    },
    storeReglas:function(){
      this.storeReglasAction(this.grupos);
    },
    changeRegla:function(index, value){
      if(value != 1){
        this.grupos[index].active       = true;
        this.grupos[index].meridiano    = [];
        this.grupos[index].hora_inicio  = '';
        this.grupos[index].hora_termino = '';
      }
    }
  }
}
</script>

<style>

</style>
