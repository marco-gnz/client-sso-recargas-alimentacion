<template>
  <div>
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

    <div class="modal" :class="showModalFlag ? 'is-active' : '' ">
      <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Ingresar nuevo mes</p>
            <button class="delete" aria-label="close"></button>
          </header>
          <section class="modal-card-body">
            <div class="columns">
              <div class="column">
                <label class="label">Seleccione año y mes de carga</label>
                <el-date-picker
                  class="element-select"
                  type="month"
                  placeholder="Seleccione año y mes ">
                </el-date-picker>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success">Ingresar</button>
          </footer>
        </div>
    </div>

    <!-- <div class="modal" :class="{'is-active': showModalFlag}">
      <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Ingresar nuevo mes</p>
            <button class="delete" aria-label="close" @click.prevent="closeModal"></button>
          </header>
          <section class="modal-card-body">
            <div class="columns">
              <div class="column">
                <label class="label">Seleccione año y mes de carga</label>
                <el-date-picker
                  class="element-select"
                  type="month"
                  placeholder="Seleccione año y mes ">
                </el-date-picker>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success">Ingresar</button>
          </footer>
        </div>
    </div> -->
  </div>

</template>

<script>
export default {
    data() {
      return {
        search:{
          anio:'',
          meses:[]
        },
        years:[
          '2020',
          '2021',
          '2022'
        ],
        months:[
          {id:'01',
          nombre:'Enero'
          },
          {id:'02',
          nombre:'Febrero'
          },
          {id:'03',
          nombre:'Marzo'
          },
        ],
        value: '',
        showModalFlag:false
      }
    },
    beforeRouteLeave(to, from, next) {

      if (to.name === "admin-recargas-ingresar") {
        this.displayProductModal(to);
      } else {
        next();
      }
  },
    methods:{
      displayProductModal(route) {
        console.log('open!');
        this.showModalFlag = true;
        window.history.pushState({}, null, route.path);
      },
      showModal() {
        this.showModalFlag = true;
      },
      closeModal:function(){
        this.showModalFlag = false;
      }
    }
  }
</script>

<style>
.element-select{
  width: 100% !important;
  margin: auto !important;
}
</style>
