<template>
  <div>
    <div class="container.is-fullhd">
      <!-- <div class="card p-6 m-6">
        <div class="columns">
          <div class="column">
            <label class="label">Seleccione año de carga</label>
              <el-select v-model="search.anio" clearable collapse-tags placeholder="Seleccione año" class="element-select">
                <el-option
                  v-for="year in years"
                  :key="year"
                  :label="year"
                  :value="year">
                </el-option>
              </el-select>
          </div>
          <div class="column">
            <label class="label">Seleccione meses</label>
            <el-select v-model="search.meses" :disabled="!search.anio" multiple collapse-tags clearable placeholder="Seleccione meses" class="element-select">
              <el-option
                v-for="month in months"
                :key="month.id"
                :label="month.nombre"
                :value="month.id">
              </el-option>
            </el-select>
          </div>
        </div>
      </div> -->
      <div class="card p-6 m-6">
        <div class="columns">
          <nuxt-link v-if="hasPermission('recarga.create')" class="button modal-button is-link is-inverted is-pulled-right" :to="{name:'admin-recargas-ingresar'}">Ingresar nueva recarga</nuxt-link>
        </div>
        <template v-if="recargas.length">
          <table class="table is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Código</th>
                <th>Establecimiento</th>
                <th>Beneficio</th>
                <th>N° de funcionarios</th>
                <th>Valor día</th>
                <th>Total pagar</th>
                <th>Total sobrante</th>
                <th>Estado actual</th>
                <th>Habilitado</th>
                <!-- <th>Acciones</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(recarga, index) in recargas" :key="index" @click.prevent="redirectToRecarga(recarga)" class="click">
                <td>#{{recarga.codigo}}</td>
                <td>{{recarga.establecimiento != null ? recarga.establecimiento.sigla : '--'}}</td>
                <td>{{recarga.mes_beneficio}} / {{recarga.anio_beneficio}}</td>
                <td>{{recarga.users_count}}</td>
                <td>{{recarga.monto_dia}}</td>
                <td>{{recarga.total_pagado}}</td>
                <td>{{recarga.total_pagado_not}}</td>
                <td>{{recarga.last_status}}</td>
                <td @click.prevent.stop="">
                  <template v-if="hasPermission('recarga.status')">
                    <el-tooltip :content="`Habilitado: ${!recarga.active ? `No` : `Si`}`" placement="top">
                        <el-switch :active-value="!recarga.active" :inactive-value="recarga.active" @change="editStatus(recarga.id)" active-color="#13ce66" v-loading.fullscreen.lock="loadingSpinner"></el-switch>
                    </el-tooltip>
                  </template>
                </td>
                <!-- <td @click.prevent.stop="">
                  <el-dropdown>
                      <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                      <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item  icon="el-icon-document-copy">Ver más</el-dropdown-item>
                      </el-dropdown-menu>
                  </el-dropdown>
                </td> -->
              </tr>
            </tbody>
          </table>
        </template>
        <template v-else>
          <div class="col-md-12">
              <el-empty :image-size="90">
                  <div class="row" slot="description">
                  <div class="col-md-12"><span>No se encontraron recargas...</span></div>
                  </div>
              </el-empty>
          </div>
        </template>
      </div>
    </div>
    <div class="modal" :class="modalOpen ? 'is-active' : '' ">
      <ModalAdd />
    </div>
    <div v-if="showModal" class="modal-route">
      <div class="modal-content">
        <nuxt-child></nuxt-child>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
import ModalAdd from '../../../components/admin/recargas/modal-add.vue';
export default {
    name: "IndexPage",
    middleware: 'auth',
    head() {
        return {
            title: "Recargas"
        };
    },
    data() {
        return {
            search: {
                anio: "",
                meses: []
            },
            years: [
                "2020",
                "2021",
                "2022"
            ],
            months: [
                { id: "01", nombre: "Enero"
                },
                { id: "02", nombre: "Febrero"
                },
                { id: "03", nombre: "Marzo"
                },
            ],
            value: "",
            showModalFlag: false,
        };
    },
    beforeRouteLeave(to, from, next) {
        if (to.name === "admin-recargas-ingresar") {
            this.displayProductModal(to);
        }
        else {
            next();
        }
    },
    mounted(){
      this.getEstablecimientos();
      this.getRecargas();
    },
    created(){
      this.getRolesPermissions();
    },
    computed:{
      ...mapGetters({
        modalOpen:'recargas/recargas/openModal',
        recargas:'recargas/recargas/recargas',
        establecimientos:'modulos/modulos/establecimientos',
        loadingSpinner:'recargas/recargas/fullScreenLoading',
      }),
      permissions() {
        return this.$store.state.usuarios.administradores.main.permissions;
      },
      showModal() {
        return this.$route.matched.length;
      }
    },
    methods: {
        ...mapMutations({
          changeStatusModal: "recargas/recargas/SET_OPEN",
        }),
        ...mapActions({
            getRecargas: 'recargas/recargas/getRecargas',
            getEstablecimientos: 'modulos/modulos/getEstablecimientos',
            changeStatusRecarga: 'recargas/recargas/changeStatusRecarga',
            getRolesPermissions:'usuarios/administradores/main/getRolesPermissions',
        }),
        redirectToRecarga:function(recarga){
          this.$router.push({
            name:'admin-recargas-id',
            params:{id:recarga.codigo}
          });
        },
        async editStatus(id){
          this.changeStatusRecarga(id);
        },
        displayProductModal:function(route) {
            /* this.showModalFlag = true; */
            this.changeStatusModal(true);
            window.history.pushState({}, null, route.path);
        },
        hideProductModal:function() {
            this.activeModal = null;
            window.history.pushState({}, null, this.$route.path);
        },
        hasPermission:function(permission){
          return this.permissions.includes(permission);
        }
    },
    components: { ModalAdd }
}
</script>
<style>

</style>
