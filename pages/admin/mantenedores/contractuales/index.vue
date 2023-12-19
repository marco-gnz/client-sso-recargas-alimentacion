<template>
  <div>
    <HeroPage namepage="Cargos / Unidades / Proceso de asignación" />
    <div class="container.is-fullhd">
      <div class="card p-6 m-6">
        <div class="columns">
          <div class="column is-full">
            <div class="table-container pt-2">
              <div class="field">
                <div class="columns">
                  <div class="column is-11">
                    <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
                  </div>
                  <div class="column is-1">
                    <el-button @click.prevent="openModal" v-if="hasPermission('mantenedor.create')" size="mini" type="warning" icon="el-icon-plus" class="is-right" circle></el-button>
                  </div>
                </div>
              </div>
              <div class="field">
                <MenuContractuales />
              </div>
              <div class="field">
                <div class="control is-medium">
                  <el-input
                      autofocus
                      placeholder="Buscar..."
                      v-model="filtroInput"
                      @keyup.native="keySearchInput"
                      >
                  </el-input>
                </div>
              </div>
              <div class="field">
                <div class="columns">
                  <div class="column">
                    <div class="table-container pt-2">
                      <template v-if="(data) && (data.length)">
                         <table class="table is-narrow is-hoverable is-fullwidth" v-loading="loadingData">
                            <thead>
                              <tr>
                                <th>Cod. SIRH</th>
                                <th>Nombre</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(element, index) in data" :key="index">
                                <td>{{element.cod_sirh? element.cod_sirh : '--'}}</td>
                                <td>{{element.name ? element.name : '--'}}</td>
                                <td>
                                  <nuxt-link v-if="hasPermission('mantenedor.update')" @click.native="editContractual(index)" :to="{path: `/admin/mantenedores/contractuales`, query: {tipo:currentRouteQuery, id: element.id }}"><el-button size="mini" type="primary" icon="el-icon-edit" circle></el-button></nuxt-link>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
                            <a class="pagination-previous" v-if="pagination.current_page > 1" @click.prevent="changePage(pagination.current_page - 1)">Volver</a>
                            <a class="pagination-next" v-if="pagination.current_page < pagination.last_page" @click.prevent="changePage(pagination.current_page + 1)">Siguiente pagina</a>
                            <ul class="pagination-list">
                              <li v-for="page in pagesNumber" :key="page" class="active">
                                <a class="pagination-link" :class="(page === isActived ? 'is-current-search' : '')" @click.prevent="changePage(page)" >{{page}}</a>
                              </li>
                            </ul>
                          </nav>
                      </template>
                      <template v-else>
                        <el-empty class="is-centered" description="Sin resultados" :image-size="100"></el-empty>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="slide-fade">
      <div v-if="show_modal_add" class="modal is-large" :class="show_modal_add ? 'is-active' : '' ">
        <ModalAddContractual />
      </div>
    </Transition>
    <Transition name="slide-fade">
      <div v-if="show_modal_edit" class="modal is-large" :class="show_modal_edit ? 'is-active' : '' ">
        <ModalEditContractual />
      </div>
    </Transition>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import MenuContractuales from '../../../../components/admin/mantenedores/Menu-contractuales.vue';
import ModalAddContractual from '../../../../components/admin/mantenedores/ModalAddContractual.vue';
import ModalEditContractual from '../../../../components/admin/mantenedores/ModalEditContractual.vue';
import HeroPage from '../../../../components/admin/usuarios/HeroPage.vue'
export default {
  components: { HeroPage, MenuContractuales, ModalAddContractual, ModalEditContractual },
  middleware: "auth",
  head() {
    return {
        title: `Datos contractuales`
    };
  },
  data(){
    return{
      setTimeoutBuscador:'',
    };
  },
  created(){
    this.actionGetDatosContractuales();
    this.isOpenModalEdit();
  },
  computed:{
    ...mapGetters({
      data:'mantenedores/main/data',
      loadingData:'mantenedores/main/loadingData',
      pagination:'mantenedores/main/pagination',
      offset:'mantenedores/main/offset',
    }),
    currentRouteQuery(){
      return this.$nuxt.$route.query.tipo;
    },
    permissions() {
      return this.$store.state.usuarios.administradores.main.permissions;
    },
    show_modal_add:{
      get() {
        return this.$store.state.mantenedores.main.modal_add;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_MODAL_ADD', newValue);
      }
    },
    show_modal_edit:{
      get() {
        return this.$store.state.mantenedores.main.modal_edit;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_MODAL_EDIT', newValue);
      }
    },
    current_page:{
      get() {
        return this.$store.state.mantenedores.main.pagination.current_page;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_CURRENT_PAGE', newValue);
      }
    },
    filtroInput:{
      get() {
        return this.$store.state.mantenedores.main.filtro.input;
      },
      set(newValue) {
        this.$store.commit('mantenedores/main/SET_FILTRO_INPUT', newValue);
      }
    },
    isActived: function () {
        return this.pagination.current_page;
    },
    pagesNumber: function () {
        if (!this.pagination.to) {
            return [];
        }
        var from = this.pagination.current_page - this.offset;
        if (from < 1) {
            from = 1;
        }
        var to = from + (this.offset * 2);
        if (to >= this.pagination.last_page) {
            to = this.pagination.last_page;
        }
        var pagesArray = [];
        while (from <= to) {
            pagesArray.push(from);
            from++;
        }
        return pagesArray;
    }
  },
  methods:{
    ...mapActions({
      getDatosContractuales:'mantenedores/main/getDatosContractuales'
    }),
    hasPermission:function(permission){
      return this.permissions.includes(permission);
    },
    actionGetDatosContractuales:function(){
      const data = {
        tipo:this.currentRouteQuery
      };
      this.getDatosContractuales(data);
    },
    changePage:function(page){
      this.current_page = page;
      this.actionGetDatosContractuales();
    },
    openModal:function(){
      this.show_modal_add = true;
    },
    keySearchInput:function(){
      if(this.filtroInput.length > 1){
          this.current_page = 1;
          clearTimeout(this.setTimeoutBuscador);
          this.setTimeoutBuscador = setTimeout(this.actionGetDatosContractuales, 500);
      }
    },
    editContractual:function(index){
      this.show_modal_edit = true;
    },
    isOpenModalEdit(){
      const id = this.$nuxt.$route.query.id;
      const tipo = this.$nuxt.$route.query.tipo;

      if(id != null && tipo != null){
        this.editContractual();
      }
    }
  }
}
</script>

<style>

</style>
