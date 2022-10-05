<template>
  <div>
    <Hero title="Listado de recargas" subtitle="Listado de todas las recargas registradas en sistema" />
    <div class="container.is-fullhd">
      <div class="card p-6 m-6">
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
      </div>
      <div class="card p-6 m-6">
        <div class="columns">
          <!-- <div class="column"><button class="button modal-button is-link is-inverted is-pulled-right"> Ingresar nuevo mes</button></div> -->
          <nuxt-link :to="{name:'admin-recargas-ingresar'}">Ingresar nueva recarga</nuxt-link>
        </div>
        <table class="table is-striped is-narrow is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Código</th>
              <th>Año</th>
              <th>Mes</th>
              <th>N° funcionarios</th>
              <th>N° vigentes</th>
              <th>N° no vigentes</th>
              <th>Total pagado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>#3678</th>
              <th>2021</th>
              <td>enero</td>
              <td>720</td>
              <td>710</td>
              <td>10</td>
              <td>$42.934.736</td>
              <td><el-tag size="mini" type="success">ESTADO</el-tag></td>
              <td>
                <el-dropdown>
                    <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item  icon="el-icon-document-copy">Ver más</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
              </td>
            </tr>
            <tr class="is-selected">
              <th>#2172</th>
              <th>2021</th>
              <td>febero</td>
              <td>722</td>
              <td>712</td>
              <td>8</td>
              <td>$43.115.274</td>
              <td><el-tag size="mini" type="warning">ESTADO</el-tag></td>
              <td>
                <el-dropdown>
                    <span class="el-dropdown-link">Acción<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item  icon="el-icon-document-copy">Ver más</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal" :class="modalOpen ? 'is-active' : '' ">
      <ModalAdd />
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import ModalAdd from '../../../components/admin/recargas/modal-add.vue';
export default {
    name: "IndexPage",
    middleware: "auth",
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
            showModalFlag: false
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
    computed:{
      ...mapGetters({
        modalOpen:'recargas/modaladd/openModal'
      })
    },
    methods: {
        ...mapMutations({
          changeStatusModal: "recargas/modaladd/SET_OPEN",
        }),
        displayProductModal(route) {
            console.log("open!");
            /* this.showModalFlag = true; */
            this.changeStatusModal(true);
            window.history.pushState({}, null, route.path);
        },
        hideProductModal() {
            this.activeModal = null;
            window.history.pushState({}, null, this.$route.path);
        }
    },
    components: { ModalAdd }
}
</script>
