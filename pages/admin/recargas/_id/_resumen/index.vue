<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <Hero :title="`Recarga #${$route.params.id} - Tabla resumen de datos`" :subtitle="`${recarga.establecimiento != null ? recarga.establecimiento.nombre : ''} para el mes de ${recarga.mes} año ${recarga.anio}.`"  />
    <div class="container.is-fullhd">
      <MenuTotales :recarga="recarga" />
      <div class="card p-6 m-6">
        <MenuRecarga :codigo="$route.params.id" />
        <div class="columns">
          <div class="column">
            <div class="field">
              <div class="control is-medium is-loading">
                <input class="input is-medium is-rounded" type="text" placeholder="Buscar funcionarios por rut, nombre o apellidos...">
              </div>
            </div>
            <div class="table-container pt-2">
              <table class="table is-striped is-narrow is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th>Beneficio</th>
                    <template v-if="!loadGrupoUno">
                      <th>Rut</th>
                    </template>
                    <template v-if="!loadGrupoUno">
                      <th>Nombres</th>
                    </template>
                    <template v-else>
                      <th>Apellidos</th>
                    </template>
                    <th>Turno</th>
                    <template v-if="(recarga.total_grupos != null)">
                      <th>
                        <el-link :underline="false" :disabled="(recarga.total_grupos[0].total_ausentismos > 0 ? false : true)" @click.prevent="openGrupo(1)" :type="loadGrupoUno ? 'warning' : 'info' ">{{recarga.total_grupos[0].nombre_grupo}} <i :class="loadGrupoUno ? 'el-icon-minus' : 'el-icon-plus' "></i></el-link>
                      </th>
                      <template v-if="loadGrupoUno">
                        <td v-for="(tipo, index) in recarga.total_grupos[0].tipos_ausentismos" :key="index">
                          <i>{{tipo.sigla}}</i>
                        </td>
                      </template>
                      <th>
                        <el-link :underline="false" :disabled="(recarga.total_grupos[1].total_ausentismos > 0 ? false : true)" @click.prevent="openGrupo(2)" :type="loadGrupoDos ? 'warning' : 'info' ">{{recarga.total_grupos[1].nombre_grupo}} <i :class="loadGrupoDos ? 'el-icon-minus' : 'el-icon-plus' "></i></el-link>
                      </th>
                      <template v-if="loadGrupoDos">
                        <td v-for="(tipo, index) in recarga.total_grupos[0].tipos_ausentismos" :key="index">
                          <i>{{tipo.sigla}}</i>
                        </td>
                      </template>
                      <th>
                        <el-link :underline="false" :disabled="(recarga.total_grupos[2].total_ausentismos > 0 ? false : true)" @click.prevent="openGrupo(3)" :type="loadGrupoTres ? 'warning' : 'info' ">{{recarga.total_grupos[2].nombre_grupo}} <i :class="loadGrupoTres ? 'el-icon-minus' : 'el-icon-plus' "></i></el-link>
                      </th>
                      <template v-if="loadGrupoTres">
                        <td v-for="(tipo, index) in recarga.total_grupos[0].tipos_ausentismos" :key="index">
                          <i>{{tipo.sigla}}</i>
                        </td>
                      </template>
                    </template>
                    <th>Días a cancelar</th>
                    <th>Tipo de pago</th>
                    <th>Monto a cancelar</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th></th>
                    <template v-if="!loadGrupoUno">
                      <th></th>
                    </template>
                    <th></th>
                    <th></th>
                    <th><abbr>{{(recarga.total_grupos != null) && (recarga.total_grupos[0].total_ausentismos)}}</abbr></th>
                    <template v-if="(recarga.total_grupos != null) && (loadGrupoUno)">
                      <td v-for="(tipo, index) in recarga.total_grupos[0].tipos_ausentismos" :key="index"></td>
                    </template>
                    <th><abbr>{{(recarga.total_grupos != null) && (recarga.total_grupos[1].total_ausentismos)}}</abbr></th>
                    <th><abbr>{{(recarga.total_grupos != null) && (recarga.total_grupos[2].total_ausentismos)}}</abbr></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th></th>
                    <template v-if="!loadGrupoUno">
                      <th></th>
                    </template>
                    <th></th>
                    <th></th>
                    <th><abbr><el-button size="mini" icon="el-icon-delete" circle></el-button></abbr></th>
                    <template v-if="(recarga.total_grupos != null) && (loadGrupoUno)">
                      <th v-for="(tipo, index) in recarga.total_grupos[0].tipos_ausentismos" :key="index"></th>
                    </template>
                    <th><abbr><el-button size="mini" icon="el-icon-delete" circle></el-button></abbr></th>
                    <th><abbr><el-button size="mini" icon="el-icon-delete" circle></el-button></abbr></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </tfoot>
                <tbody>
                  <tr v-for="(funcionario, index) in funcionarios" :key="index">
                    <td>
                      <el-tooltip :content="`${!funcionario.beneficio ? `No` : `Si`}`" placement="top">
                          <el-switch v-loading.lock="loadingIndex && indexClickFuncionario === index" :disabled="loadingIndex" @change="editBeneficio(index, funcionario.id)" :active-value="!funcionario.beneficio" :inactive-value="funcionario.beneficio" inactive-color="#F1948A" active-color="#13ce66"></el-switch>
                      </el-tooltip>
                    </td>
                    <template v-if="!loadGrupoUno">
                      <td>{{funcionario.rut_completo}}</td>
                    </template>
                    <template v-if="!loadGrupoUno">
                      <td>{{funcionario.nombre_completo}}</td>
                    </template>
                    <template v-else>
                      <td>{{funcionario.apellidos}}</td>
                    </template>
                    <td><el-tag size="mini" :type="funcionario.turno != null ? (funcionario.turno ? 'warning' : 'success') : 'danger' " disable-transitions>{{`${funcionario.turno != null ? `${funcionario.turno ? 'Si' : 'No'}` : `--`}`}}</el-tag></td>
                    <td><strong>{{funcionario.total_grupos[0].total_ausentismos}}</strong></td>
                    <template v-if="loadGrupoUno">
                      <td v-for="(tipo, index) in funcionario.total_grupos[0].tipos_ausentismos" :key="index">{{tipo.total}}</td>
                    </template>
                    <td><strong>{{funcionario.total_grupos[1].total_ausentismos}}</strong></td>
                    <td><strong>{{funcionario.total_grupos[2].total_ausentismos}}</strong></td>
                    <td>{{funcionario.dias_cancelar}}</td>
                    <td>{{(funcionario.tipo_pago != null ? funcionario.tipo_pago : '--')}}</td>
                    <td>{{`$${Intl.NumberFormat('de-DE').format(funcionario.total_cancelar)}`}}</td>
                    <td><nuxt-link  :to="`/admin/recargas/${$route.params.id}/funcionario/${funcionario.uuid}/turnos`"><el-button size="mini" type="primary" icon="el-icon-view" circle></el-button></nuxt-link></td>
                  </tr>
                </tbody>
              </table>
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

export default {
    middleware: "auth",
    head() {
        return {
            title: `Tabla resumen #${this.$route.params.id}`
        };
    },
    data(){
      return{
        beneficio:true,
        grupo_dos_open:false,
        grupo_tres_open:false
      };
    },
    created() {
        this.getRecarga(this.$route.params.id);
        this.getFuncionarios(this.$route.params.id);
        this.getGruposAusentismos();

    },
    mounted(){
      this.createdValueGrupoUno();
      this.createdValueGrupoDos();
      this.createdValueGrupoTres();
    },
    computed: {
        ...mapGetters({
            loadingSpinner: "recargas/resumen/fullScreenLoading",
            loadingIndex:'recargas/resumen/loadingIndex',
            recarga: "recargas/resumen/recarga",
            grupos:'modulos/modulos/gruposAusentismos',
            funcionarios:'recargas/resumen/funcionarios',
            indexClickFuncionario:'recargas/resumen/indexClickFuncionario',
            loadGrupoUno:'recargas/cookies/loadGrupoUno',
            loadGrupoDos:'recargas/cookies/loadGrupoDos',
            loadGrupoTres:'recargas/cookies/loadGrupoTres',
        }),
        index_click_funcionario:{
          get() {
            return this.$store.state.recargas.resumen.index_click_funcionario;
          },
          set(newValue) {
            this.$store.commit('recargas/resumen/SET_INDEX_CLICK_FUNCTIONARIO', newValue);
          }
        },
    },
    methods: {
        ...mapActions({
            getRecarga: "recargas/resumen/returnRecarga",
            getFuncionarios: "recargas/resumen/getFuncionarios",
            getGruposAusentismos: "modulos/modulos/getGruposAusentismos",
            changeBeneficioFuncionario:'recargas/resumen/changeBeneficioFuncionario',
            changeValueGrupoUno:'recargas/cookies/changeValueGrupoUno',
            createdValueGrupoUno:'recargas/cookies/createdValueGrupoUno',
            changeValueGrupoDos:'recargas/cookies/changeValueGrupoDos',
            createdValueGrupoDos:'recargas/cookies/createdValueGrupoDos',
            changeValueGrupoTres:'recargas/cookies/changeValueGrupoTres',
            createdValueGrupoTres:'recargas/cookies/createdValueGrupoTres',
        }),
        editBeneficio:function(index, funcionario_id){
          this.index_click_funcionario = index;
          let data = {
            user_id:funcionario_id,
            codigo_recarga:this.$route.params.id
          };
          this.changeBeneficioFuncionario(data);
        },
        openGrupo:function(value){
          if(value === 1){
            this.changeValueGrupoUno(!this.loadGrupoUno);
          }else if (value === 2){
            this.changeValueGrupoDos(!this.loadGrupoDos);
          }else{
            this.changeValueGrupoDos(!this.loadGrupoTres);
          }
        },
    },
    components: { MenuRecarga, MenuTotales }
}
</script>

<style>

</style>
