<template>
  <div>
    <div class="modal-background" @click.prevent="hideModalShow"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Detalle de ajuste</p>
        <button class="delete" aria-label="close" @click.prevent="hideModalShow"></button>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <template v-if="fullScreenLoading">
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
              <table class="table is-striped is-narrow is-hoverable is-fullwidth">
                <tbody>
                  <tr>
                    <th>Rut funcionario:</th>
                    <td>{{ ajuste.rut_funcionario != null ? ajuste.rut_funcionario : '--' }}</td>
                  </tr>
                  <tr>
                    <th>Nombres funcionario:</th>
                    <td>{{ ajuste.nombres_funcionario != null ? ajuste.nombres_funcionario : '--' }}</td>
                  </tr>
                  <tr>
                    <th>Tipo de ajuste:</th>
                    <td>{{ ajuste.tipo_reajuste_nombre }}</td>
                  </tr>
                  <tr>
                    <th>Fecha:</th>
                    <td>{{ ajuste.fecha_inicio}} / {{ ajuste.fecha_termino}}</td>
                  </tr>
                  <tr>
                    <th>Días periodo:</th>
                    <td>{{ ajuste.dias_periodo}}</td>
                  </tr>
                  <tr>
                    <th>Días hábiles:</th>
                    <td>{{ ajuste.dias_periodo_habiles}}</td>
                  </tr>
                  <tr>
                    <th>Total días:</th>
                    <td><span class="tag is-success is-light"><strong>{{ ajuste.total_dias}}</strong></span></td>
                  </tr>
                  <tr>
                    <th>Tipo:</th>
                    <td>{{ ajuste.incremento_nombre}}</td>
                  </tr>
                  <template v-if="ajuste.tipo_reajuste === 1">
                    <tr>
                      <th>Valor de día:</th>
                      <td>{{ ajuste.valor_dia}}</td>
                    </tr>
                    <tr>
                      <th>Monto de ajuste:</th>
                      <td>{{ ajuste.monto_ajuste}}</td>
                    </tr>
                  </template>
                  <tr>
                    <th>Causal:</th>
                    <td>
                      <template v-if="ajuste.incremento">
                        {{ ajuste.tipo_incremento != null ? ajuste.tipo_incremento : '-' }}
                      </template>
                      <template v-else>
                        {{ ajuste.tipo_ausentismo != null ? ajuste.tipo_ausentismo : '' }}
                      </template>
                    </td>
                  </tr>
                  <tr>
                    <th>DC cartola actual:</th>
                    <td>{{ajuste.esquema_dc}}</td>
                  </tr>
                  <tr>
                    <th>MC cartola actual:</th>
                    <td>{{ajuste.esquema_mc}}</td>
                  </tr>
                  <tr>
                    <th>Tipo de ingreso:</th>
                    <td>{{ajuste.tipo_carga}}</td>
                  </tr>
                  <tr>
                    <th>Ingresado por:</th>
                    <td>{{ ajuste.user_created_by}}</td>
                  </tr>
                  <tr>
                    <th>Fecha de ingreso:</th>
                    <td>{{ ajuste.date_created_user}}</td>
                  </tr>
                </tbody>
              </table>
              <div class="field">
                <label class="label">Observación de reajuste</label>
                <p class="has-text-justified">{{ ajuste.observacion }}</p>
              </div>
              <div class="field">
                <label class="label">Advertencias / Errores asociados</label>
                <template v-if="(ajuste.alertas) && (ajuste.alertas.length)">
                  <div class="table">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(alerta, index) in ajuste.alertas" :key="index">
                        <td>{{alerta.tipo}}</td>
                        <td>{{alerta.observacion}}</td>
                      </tr>
                    </tbody>
                  </div>
                </template>
                <template v-else>
                  <p>--</p>
                </template>
              </div>
              <div class="field">
                <h5 class="subtitle is-5 has-text-centered">Contratos</h5>
                <div class="select">
                  <select v-model="filtroPeriodo" @change="getContratos">
                    <option selected value="" disabled>-- Seleccione periodo de contrato --</option>
                    <option v-for="(periodo, index) in periodos" :key="index" :value="periodo.date">{{periodo.month}}-{{periodo.year}}</option>
                  </select>
                </div>
              </div>
              <div class="field box">
                <template v-if="contratos.length">
                  <div class="field">
                    <table class="table  is-narrow is-hoverable is-fullwidth" v-loading="loadingContratos">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Unidad</th>
                          <th>Cargo</th>
                          <th>Ley</th>
                          <th>Hora</th>
                          <th>C.Costo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(contrato, index) in contratos" :key="index">
                          <td>{{contrato.fecha_inicio_periodo}} / {{contrato.fecha_termino_periodo}} ({{contrato.total_dias_habiles_contrato_periodo}})</td>
                          <td>{{contrato.unidad_nombre}}</td>
                          <td>{{contrato.cargo_nombre}}</td>
                          <td>{{contrato.ley_nombre}}</td>
                          <td>{{contrato.hora_nombre}}</td>
                          <td>{{contrato.centro_costo ? contrato.centro_costo : '--'}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
                <template v-else>
                  <span>Sin contratos...</span>
                </template>
              </div>
              <div class="field pt-2">
                <h5 class="subtitle is-5 has-text-centered">Historial de estados</h5>
                <div class="block">
                  <el-timeline>
                    <el-timeline-item :size="(index ? 'normal' : 'large')" :icon="(index ? '' : 'el-icon-more')" :color="estado.color" v-for="(estado, index) in ajuste.estados" :key="index" :timestamp="`${estado.created_at}`" placement="top">
                      <el-card :shadow="(index ? 'never' : 'always')">
                        <div class="content">
                          <p class="has-text-justified">{{ estado.observacion }}</p>
                          <br>
                          <div class="columns">
                            <div class="column">
                              <p class="is-size-7">{{ estado.user_created_by }}</p>
                            </div>
                            <div class="column">
                              <p class="has-text-right"><el-tag effect="dark" size="mini" :type="(estado.status === 0 ? 'info' : (estado.status === 1 ? 'success' : 'danger'))">{{ estado.status_nombre}}</el-tag></p>
                            </div>
                          </div>
                        </div>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  created(){
    if(this.$route.query.id){
      this.showModal = true;
      this.getAjuste(this.$route.query.id);
    }
  },
  computed:{
    ...mapGetters({
      ajuste: "recarga/ajusteShow/ajuste",
      fullScreenLoading:'recarga/ajusteShow/fullScreenLoading',
      contratos: "recarga/ajusteShow/contratos",
      periodos: "recarga/ajusteShow/periodos",
      loadingContratos: "recarga/ajusteShow/loadingContratos",
    }),
    showModal:{
        get() {
          return this.$store.state.recargas.reajustes.modal_show;
        },
        set(newValue) {
          this.$store.commit('recargas/reajustes/SET_MODAL_SHOW', newValue);
        }
      },
      filtroPeriodo:{
        get() {
          return this.$store.state.recarga.ajusteShow.filtro.periodo;
        },
        set(newValue) {
          this.$store.commit('recarga/ajusteShow/SET_FILTRO_PERIODO', newValue);
        }
      },
    currentRouteName() {
      return this.$nuxt.$route.path;
    },
  },
  methods:{
    ...mapActions({
        getAjuste: 'recarga/ajusteShow/getAjuste',
        getContratosAction:'recarga/ajusteShow/getContratos'
      }),
    getContratos:function(){
      const data = {
        ajuste_uuid:this.ajuste.uuid,
        periodo:this.filtroPeriodo
      };
      this.getContratosAction(data);
    },
    hideModalShow:function() {
      this.showModal = false;
      this.$store.commit('recarga/ajustes/SET_MODAL_SHOW', false);
      this.filtroPeriodo = '';
      this.$router.back();
    },
  }
}
</script>

<style>

</style>
