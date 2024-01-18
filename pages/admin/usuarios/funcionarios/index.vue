<template>
  <div>
    <HeroPage namepage="Funcionarios" />
    <div class="container.is-fullhd">
      <div class="card p-6 m-6">
        <div class="columns">
          <div class="column is-full">
            <div class="field">
              <div class="control is-medium" :class="(fullScreenLoading ? 'is-loading': '')">
                <el-input
                    autofocus
                    placeholder="Buscar funcionarios por rut, nombre, apellidos o email..."
                    v-model="input_query"
                    @keyup.native="keySearchInput"
                    >
                </el-input>
              </div>
            </div>
            <div class="table-container pt-2">
              <div class="field">
                <div class="columns">
                  <div class="column is-11">
                    <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
                  </div>
                  <div class="column is-1">
                    <el-button v-if="hasPermission('funcionario.create')" @click.prevent="modalAddFuncionario" size="mini" type="warning" icon="el-icon-plus" class="is-right" circle></el-button>
                  </div>
                </div>
              </div>
                <table class="table  is-narrow is-hoverable is-fullwidth" v-loading="fullScreenLoading" >
                  <thead>
                    <tr>
                      <th>Rut</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Último contrato</th>
                      <th>Establecimiento</th>
                      <th>Último pago</th>
                      <th>Monto último pago</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="(funcionarios) && (funcionarios.length)">
                      <tr v-for="(funcionario, index) in funcionarios" :key="index" :class="(index_color === index ? 'row-selected' : '')">
                        <td>{{funcionario.rut_completo}}</td>
                        <td>{{funcionario.apellidos}} {{funcionario.nombres}}</td>
                        <td>{{funcionario.email ? funcionario.email : '--'}}</td>
                        <td>{{funcionario.contrato ? `${funcionario.contrato.fecha_inicio} / ${funcionario.contrato.fecha_termino}` : '--'}}</td>
                        <td>{{funcionario.esquema ? funcionario.esquema.establecimiento : '--'}}</td>
                        <td>{{funcionario.esquema ? `${funcionario.esquema.mes_beneficio} / ${funcionario.esquema.anio_beneficio}` : '--'}}</td>
                        <td>{{funcionario.esquema ? funcionario.esquema.monto_total_cancelar_format : '--'}}</td>
                        <td>
                          <nuxt-link v-if="hasPermission('funcionario.update')" @click.native="editFuncionario(index)" :to="{path: `/admin/usuarios/funcionarios`, query: { id: funcionario.uuid }}"><el-button size="mini" type="primary" icon="el-icon-edit" circle></el-button></nuxt-link>
                        </td>
                      </tr>
                    </template>
                    <template v-else>
                      <div class="columns">
                        <div class="column is-full">
                          <div class="tabs is-toggle is-toggle-rounded is-small is-centered">
                            <el-empty class="is-centered" description="Sin resultados" :image-size="100"></el-empty>
                          </div>
                        </div>
                      </div>
                    </template>
                  </tbody>
                </table>
                <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
                  <a class="pagination-previous" v-if="pagination.current_page > 1" @click.prevent="changePage(pagination.current_page - 1)">Volver</a>
                  <a class="pagination-next" v-if="pagination.current_page < pagination.last_page" @click.prevent="changePage(pagination.current_page + 1)">Siguiente pagina</a>
                  <ul class="pagination-list">
                    <li v-for="page in pagesNumber" :key="page" class="active">
                      <a class="pagination-link" :class="(page === isActived ? 'is-current' : '')" @click.prevent="changePage(page)" >{{page}}</a>
                    </li>
                  </ul>
                </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="slide-fade">
      <div v-if="show_modal_editar" class="modal is-large" :class="show_modal_editar ? 'is-active' : '' ">
        <ModalEditar />
      </div>
    </Transition>
    <Transition name="slide-fade">
      <div v-if="show_modal_add" class="modal is-large" :class="show_modal_add ? 'is-active' : '' ">
        <ModalAdd />
      </div>
    </Transition>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import ModalAdd from '../../../../components/admin/usuarios/Funcionarios/ModalAdd.vue';
import ModalEditar from '../../../../components/admin/usuarios/Funcionarios/ModalEditar.vue';
import HeroPage from '../../../../components/admin/usuarios/HeroPage.vue'
export default {
  components: { HeroPage, ModalEditar, ModalAdd },
  middleware: "auth",
  head() {
    return {
        title: `Funcionarios`
    };
  },
  created(){
    this.getFuncionarios();
    this.getRolesPermissions();
  },
  data(){
    return{
      setTimeoutBuscador:'',
      index_color:undefined,
    };
  },
  computed:{
    ...mapGetters({
      fullScreenLoading:'usuarios/funcionarios/main/fullScreenLoading',
      funcionarios:'usuarios/funcionarios/main/funcionarios',
      pagination:'usuarios/funcionarios/main/pagination',
      offset:'usuarios/funcionarios/main/offset'
    }),
    permissions() {
      return this.$store.state.usuarios.administradores.main.permissions;
    },
    input_query:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.filtro.input;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_FILTRO_INPUT', newValue);
      }
    },
    current_page:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.pagination.current_page;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_CURRENT_PAGE', newValue);
      }
    },
    show_modal_editar:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.show_modal_editar;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_MODAL_EDITAR', newValue);
      }
    },
    show_modal_add:{
      get() {
        return this.$store.state.usuarios.funcionarios.main.show_modal_add;
      },
      set(newValue) {
        this.$store.commit('usuarios/funcionarios/main/SET_MODAL_ADD', newValue);
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
        getFuncionarios:'usuarios/funcionarios/main/getFuncionarios',
        getRolesPermissions:'usuarios/administradores/main/getRolesPermissions'
    }),
    keySearchInput:function(){
      if(this.input_query.length > 1){
          this.current_page = 1;
          clearTimeout(this.setTimeoutBuscador);
          this.setTimeoutBuscador = setTimeout(this.getFuncionarios, 500);
      }
    },
    changePage(page) {
      this.current_page = page;
      this.getFuncionarios();
    },
    editFuncionario:function(index){
      this.show_modal_editar = true;
      this.changeColorSelected(index);
    },
    changeColorSelected:function(index){
      if(this.index_color === undefined){
          this.index_color = index;
      }else if(this.index_color != index){
          this.index_color = index;
      }
    },
    modalAddFuncionario:function(){
      this.show_modal_add = true;
    },
    hasPermission:function(permission){
      return this.permissions.includes(permission);
    }
  }
}
</script>

<style>

</style>
