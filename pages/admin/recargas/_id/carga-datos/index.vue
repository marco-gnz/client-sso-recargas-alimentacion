<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <template v-if="recarga">
      <Hero namepage="Carga masiva de datos" :recarga="recarga" />
    </template>
    <div class="container.is-fullhd">
      <MenuTotales  :recarga="recarga"/>
      <Funcionarios v-if="openModalFuncionarios" />
      <Validaciones v-if="openModalGrupos" :codigo="$route.params.id"/>
      <Ausentismos v-if="openModalAusentismos" :codigo="$route.params.id" />
      <Asistencia />
      <Viaticos v-if="openModalViaticos" :codigo="$route.params.id" />
      <Feriados v-if="openModalFeriados" />
      <turnos :codigo="$route.params.id" />
      <div class="card p-2 m-2">
         <MenuRecarga :codigo="$route.params.id" :recarga="recarga" />
        <template v-if="opciones">
          <div class="columns">
            <div class="column" v-for="(opcion, index) in opciones" :key="index">
              <div class="tile is-parent">
                <article class="tile is-child box">
                  <p class="title is-6">{{opcion.title}}</p>
                  <p class="subtitle" v-if="opcion.is_permission"><button :disabled="opcion.disabled || recarga.last_status_value !== 0" @click.prevent="opcion.click" class="button is-primary is-inverted"><span>Cargar <i class="el-icon-upload2"></i></span></button></p>
                  <div class="content">
                    <p class="is-size-7"><i>Reciente: {{opcion.last_item ? opcion.last_item  : '--'}}</i></p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </template>
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
import Feriados from '../../../../../components/admin/recargas/files/feriados.vue';
import Viaticos from '../../../../../components/admin/recargas/files/viaticos.vue';
export default {
    middleware: 'auth',
    components: { MenuRecarga, MenuTotales, Funcionarios, Validaciones, Ausentismos, Turnos, Asistencia, Feriados, Viaticos },
    head() {
        return {
            title: `Carga de datos #${this.$route.params.id}`
        };
    },
    created() {
        this.getRolesPermissions();
        this.getRecarga(this.$route.params.id);
    },
    computed:{
      ...mapGetters({
          openModalFuncionarios: "recargas/datos/modalFuncionarios",
          loadingSpinner: "recargas/recargas/fullScreenLoading",
          recarga: "recargas/recargas/recarga",
          openModalGrupos: "recargas/grupos/modalGrupos",
          openModalAusentismos: "recargas/ausentismos/modal",
          openModalFeriados:'recargas/feriados/modal',
          openModalViaticos:'recargas/viaticosResumen/openModalViaticos'
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
        },
        permissions() {
          return this.$store.state.usuarios.administradores.main.permissions;
        },
        opciones(){
          let opciones = [
            {title:'Feriados', button:'Definir feriados', click:this.clickOpenModalFeriados, is_permission: this.hasPermission('regla.update'), last_item:this.recarga.last_feriado },
            {title:'Reglas y grupos', button:'Definir reglas', click:this.clickOpenModalGrupos, disabled: false, is_permission:this.hasPermission('regla.create'), last_item:this.recarga.last_regla },
            {title:'Funcionarios/Contratos', button:'Definir funcionarios', click:this.clickOpenModalFuncionarios, is_permission:this.hasPermission('contrato.create'), last_item:this.recarga.last_contrato},
            {title:'Asignaciones 3° y 4°', button:'Definir turnos', click:this.clickOpenModalTurnos, is_permission:this.hasPermission('asignacion.create'), last_item:this.recarga.last_asignacion },
            {title:'Asistencias (Días libres)', button:'Definir asistencia', click:this.clickOpenModalAsistencia, is_permission:this.hasPermission('turno.create'), last_item:this.recarga.last_asistencia },
            {title:'Ausentismos', button:'Definir ausentismos', click:this.clickOpenModalAusentismos, is_permission:this.hasPermission('ausentismo.create'), last_item:this.recarga.last_ausentismo },
            {title:'Viáticos', button:'Definir viaticos', click:this.clickOpenModalViaticos, is_permission:this.hasPermission('viatico.create'), last_item:this.recarga.last_viatico },
            {title:'Capacitaciones', button:'Definir capacitaciones', click:this.clickOpenModalAusentismos, is_permission:this.hasPermission('capacitacion.create'), last_item:null }
          ]
          return opciones;
        }
    },
    methods:{
      ...mapActions({
            getRecarga: "recargas/recargas/returnRecargaCargaDatos",
            getRolesPermissions:'usuarios/administradores/main/getRolesPermissions',
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
        },
        clickOpenModalFeriados:function(){
          this.$store.commit('recargas/feriados/SET_MODAL', true);
        },
        clickOpenModalViaticos:function(){
          this.$store.commit('recargas/viaticosResumen/SET_MODAL', true);
        },
        hasPermission:function(permission){
          return this.permissions.includes(permission);
        }
    }
}
</script>

<style>

</style>
