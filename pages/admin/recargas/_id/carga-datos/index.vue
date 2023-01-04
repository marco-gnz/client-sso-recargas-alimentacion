<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <Hero :title="`Recarga #${$route.params.id} - Carga masiva de datos`" :subtitle="`${recarga.establecimiento != null ? recarga.establecimiento.nombre : ''} para el mes de ${recarga.mes} año ${recarga.anio}.`"  />
    <div class="container.is-fullhd">
      <MenuTotales  :recarga="recarga"/>
      <Funcionarios v-if="openModalFuncionarios" />
      <Validaciones v-if="openModalGrupos" :codigo="$route.params.id" />
      <Ausentismos v-if="openModalAusentismos" :codigo="$route.params.id" />
      <Asistencia />
      <turnos :codigo="$route.params.id" />
      <div class="card p-6 m-6">
        <MenuRecarga :codigo="$route.params.id" />
        <div class="columns">
          <div class="column is-2" v-for="(opcion, index) in opciones" :key="index">
            <div class="tile is-parent">
              <article class="tile is-child box">
                <p class="title is-6">{{opcion.title}}</p>
                <p class="subtitle"><button :disabled="opcion.disabled" @click.prevent="opcion.click" class="button is-primary is-inverted"><span>Cargar <i class="el-icon-upload2"></i></span></button></p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import MenuRecarga from '../../../../../components/admin/recargas/MenuRecarga.vue';
import MenuTotales from '../../../../../components/admin/recargas/MenuTotales.vue';
import Funcionarios from '../../../../../components/admin/recargas/files/funcionarios.vue';
import Validaciones from '../../../../../components/admin/recargas/grupos/validaciones.vue';
import Ausentismos from '../../../../../components/admin/recargas/files/ausentismos.vue';
import Turnos from '../../../../../components/admin/recargas/files/turnos.vue';
import Asistencia from '../../../../../components/admin/recargas/files/asistencia.vue';
export default {
    middleware: 'auth',
    components: { MenuRecarga, MenuTotales, Funcionarios, Validaciones, Ausentismos, Turnos, Asistencia },
    head() {
        return {
            title: `Carga de datos #${this.$route.params.id}`
        };
    },
    data(){
      return{
        opciones:[
          {title:'Reglas y grupos', button:'Definir reglas', click:this.clickOpenModalGrupos, disabled: this.disabledReglas},
          {title:'Funcionarios', button:'Definir funcionarios', click:this.clickOpenModalFuncionarios},
          {title:'Asistencias', button:'Definir asistencia', click:this.clickOpenModalAsistencia},
          {title:'Turnos', button:'Definir turnos', click:this.clickOpenModalTurnos},
          {title:'Ausentismos', button:'Definir ausentismos', click:this.clickOpenModalAusentismos},
          {title:'Capacitaciones', button:'Definir capacitaciones', click:this.clickOpenModalAusentismos}
        ]
      };
    },
    created() {
        this.getRecarga(this.$route.params.id);
        this.getGruposAusentismos();
    },
    computed:{
      ...mapGetters({
          openModalFuncionarios: "recargas/datos/modalFuncionarios",
          loadingSpinner: "recargas/recargas/fullScreenLoading",
          recarga: "recargas/recargas/recarga",
          openModalGrupos: "recargas/grupos/modalGrupos",
          openModalAusentismos: "recargas/ausentismos/modal",
        }),
        file_funcionarios:{
          get() {
            return this.$store.state.recargas.datos.files.funcionarios;
          },
          set(newValue) {
            this.$store.commit('recargas/datos/SET_FILE_FUNCIONARIOS', newValue);
          }
        },
        disabledReglas(){
          let disabled = false;
          if(this.recarga.disabled_reglas){
            disabled = true;
          }
          return disabled;
        }
    },
    methods:{
      ...mapActions({
            getRecarga: "recargas/recargas/returnRecarga",
            getGruposAusentismos: 'modulos/modulos/getGruposAusentismos',
        }),
        clickOpenModalFuncionarios:function(){
          this.$store.commit('recargas/datos/SET_MODAL_FUNCIONARIOS', true);
        },
        clickOpenModalGrupos:function(){
          this.$store.commit('recargas/grupos/SET_MODAL_GRUPOS', true);
        },
        clickOpenModalAusentismos:function(){
          this.$store.commit('recargas/ausentismos/SET_MODAL', true);
        },
        clickOpenModalTurnos:function(){
          this.$store.commit('recargas/turnos/SET_MODAL', true);
        },
        clickOpenModalAsistencia:function(){
          this.$store.commit('recargas/asistencia/SET_MODAL', true);
        }
    }
}
</script>

<style>

</style>
