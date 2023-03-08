<template>
  <div>
    <div class="modal is-large" :class="openModalViaticos ? 'is-active' : '' ">
      <div class="modal-background" @click.prevent="hideViaticosModal"></div>
      <div class="modal-card" style="width: 80%;">
        <header class="modal-card-head">
          <p class="modal-card-title">Carga masiva de viáticos</p>
          <button class="delete" aria-label="close" @click.prevent="hideViaticosModal"></button>
        </header>
        <section class="modal-card-body p-6">
          <el-steps :active="paso" align-center finish-status="success">
            <el-step title="Paso 1" description="Descripción de columnas"></el-step>
            <el-step title="Paso 2" description="Seleccionar archivo"></el-step>
            <el-step title="Paso 3" description="Verificar datos"></el-step>
            <el-step title="Paso 4" description="Importación exitosa"></el-step>
          </el-steps>
        </section>
        <section v-if="paso === 0" class="modal-card-body">
          <h6>Las siguientes columnas son compatibles para realizar la carga masiva de datos.</h6>
          <div class="columns">
            <div class="column is-half">
              <label class="label">Posición columnas (2 max)</label>
              <input type="number" class="input is-rounded" @input="updateValue" :value="row_columnas">
            </div>
          </div>
          <div class="table-container">
            <table class="table is-fullwidth">
              <thead>
                <tr>
                  <th>Nombre columna</th>
                  <th>Formato</th>
                  <th>Requerida</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(columna, index) in columnas" :key="index">
                  <td><input type="text" class="input is-rounded" v-model="columna.nombre_columna" v-lowercase></td>
                  <td>{{columna.formato}}</td>
                  <td><el-tag :type="columna.required ? 'success' : 'warning'" disable-transitions>{{`${columna.required ? 'Si' : 'No'}`}}</el-tag></td>
                  <td>{{columna.descripcion}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section v-if="paso === 1" class="modal-card-body">
          <div class="columns">
            <div class="column">
              <el-upload
                  class="avatar-uploader"
                  :action="`#`"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <i class="el-icon-files"></i>
                  <div v-if="!file_viaticos" class="el-upload__text">Click para cargar archivo excel (Formato .XLSX)</div>
                  <span v-else>{{this.file_viaticos.name}}</span>
                </el-upload>
                <template v-if="viaticos.length && !errors_file">
                  <el-result icon="success" title="Archivo analizado correctamente" :subTitle="`${viaticos.length} ${viaticos.length > 1 ? `registros analizados` : `registros analizado`}`">
                  </el-result>
                </template>
                <template v-if="errorColumn.status === 'Error'">
                  <el-result icon="error" :title="errorColumn.message" subTitle="Favor verificar nuevamente el nombre de las columnas o la posición de columnas en el paso anterior.">
                    <template slot="extra">
                      <el-button type="danger" size="medium">Remover archivo</el-button>
                    </template>
                  </el-result>
                </template>
                <template v-if="errors_file != null">
                    <el-result icon="error" title="Error al analizar archivo" :subTitle="`${errors_file.length} ${errors_file.length > 1 ? `errores` : `error`}`">
                      <template slot="extra">
                        <el-button type="danger" size="medium">Remover archivo</el-button>
                        <table class="table is-fullwidth">
                          <thead>
                            <tr>
                              <th>N° de fila</th>
                              <th>Atributo</th>
                              <th>Error</th>
                              <th>Valores</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(e, index) in errors_file" :key="index">
                              <th>{{e.row}}</th>
                              <th>{{e.attribute}}</th>
                              <th>{{e.errors.map(m => m).join(', ')}}</th>
                              <th>{{e.values}}</th>
                            </tr>
                          </tbody>
                        </table>
                      </template>
                    </el-result>
                </template>
            </div>
          </div>
        </section>
        <section v-if="paso === 2" class="modal-card-body">
          <div class="columns">
            <div class="column">
              <template v-if="viaticos.length">
                <h4 class="title is-4">Listado de registros</h4>
                <span class="tag is-primary is-light">{{`${viaticos.length} ${viaticos.length > 1 ? `registros` : `registro` }`}}</span>
                <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th v-for="(fila, index) in filas" :key="index">{{index}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(viatico, index) in viaticos" :key="index">
                      <td v-for="(a, index) in viatico" :key="index">{{a}}</td>
                    </tr>
                  </tbody>
                </table>
              </template>
              <template v-if="!successImport">
                <el-result icon="error" title="Error al cargar archivo">
                  <template slot="extra">
                    <span>Existe un error en el archivo. Favor volver y analizar nuevamente.</span>
                  </template>
                </el-result>
              </template>
            </div>
          </div>
        </section>
        <section v-if="paso === 3 && successImport" class="modal-card-body">
          <div class="columns">
            <div class="column">
              <el-result icon="success" title="Operación realizada con éxito" :subTitle="`${successMessagge}`">
              </el-result>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot buttons is-right">
          <button v-if="paso === 3 && successImport" @click.prevent="hideViaticosModal" class="button is-rounded">Cerrar</button>
          <button :disabled="paso === 0" v-if="paso != 3" @click.prevent="volver" class="button is-rounded">Volver</button>
          <button v-if="paso < 2" :disabled="disabledButton" @click.prevent="siguiente" v-loading.fullscreen.lock="loadingSpinner" class="button is-info is-rounded">Siguiente</button>
          <button :disabled="!successImport" v-if="paso === 2" class="button is-primary is-rounded" v-loading.fullscreen.lock="loadingSpinner" @click.prevent="storeViaticos">Cargar datos</button>
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
    return {
      columnas:[]
    };
  },
  mounted(){
    this.getColumnsViaticos();
  },
  computed:{
    ...mapGetters({
      loadingSpinner:'recargas/viaticosResumen/fullScreenLoading',
      paso: "recargas/viaticosResumen/paso",
      viaticos: "recargas/viaticosResumen/viaticos",
      openModalViaticos:'recargas/viaticosResumen/openModalViaticos',
      successImport: "recargas/viaticosResumen/successImport",
      errorColumn: "recargas/viaticosResumen/errorsColumn",
      filas: "recargas/viaticosResumen/filas",
      successMessagge: "recargas/viaticosResumen/successMessagge",
    }),
    row_columnas:{
      get() {
        return this.$store.state.modulos.columnasexcel.row_columnas_viaticos;
      },
      set(newValue) {
        this.$store.commit('modulos/columnasexcel/SET_COLUMNA_VIATICOS', newValue);
      }
    },
    file_viaticos:{
      get() {
        return this.$store.state.recargas.viaticosResumen.carga.file;
      },
      set(newValue) {
        this.$store.commit('recargas/viaticosResumen/SET_FILE', newValue);
      }
    },
    errors_file:{
      get() {
        return this.$store.state.recargas.viaticosResumen.errors_file;
      },
      set(newValue) {
        this.$store.commit('recargas/viaticosResumen/SET_ERRORS_FILE', newValue);
      }
    },
    disabledButton(){
      let value = false;
      if(this.paso === 1 && !this.file_viaticos){
        value = true;
      }else if((this.paso === 1 && this.errors_file) || (this.paso === 1 && this.errorColumn)){
        value = true;
      }

      return value;
    }
  },
  methods:{
    ...mapActions({
      closeModal:'recargas/viaticosResumen/closeModal',
      loadFileAction:'recargas/viaticosResumen/uploadFileViaticos',
      storeFileViaticosAction:'recargas/viaticosResumen/storeFileViaticos'
    }),
    async getColumnsViaticos(){
      const url       = '/api/admin/modulos/columnas/viaticos';
      const response  = await this.$axios.$get(url);
      this.columnas   = response;
    },
    uploadFileHtml:function(){
      if(this.file_viaticos){
        const data = {
          recarga_codigo:this.codigo,
          file:this.file_viaticos,
          columnas:this.columnas,
          row_columnas:this.row_columnas
        };
        this.loadFileAction(data);
      }else{
        this.$message.error('Por favor seleccione archivo');
      }
    },
    handleAvatarSuccess(res, file) {
      this.file_viaticos = file.raw;
      if(this.file_viaticos){
        this.uploadFileHtml();
      }
    },
    beforeAvatarUpload(file) {
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isXLSX) {
        this.$message.error('El archivo debe ser formato .XLSX');
      }
      return isXLSX;
    },
    storeViaticos:function(){
      if(this.file_viaticos){
        const data = {
          recarga_codigo:this.codigo,
          file:this.file_viaticos,
          columnas:this.columnas,
          row_columnas:this.row_columnas
        };
        this.storeFileViaticosAction(data);
      }else{
        this.$message.error('Por favor seleccione archivo');
      }
    },
    updateValue(event) {
      const value = event.target.value
      if (String(value).length <= 2) {
        this.row_columnas = value
      }
      this.$forceUpdate()
    },
    hideViaticosModal:function(){
      this.closeModal();
    },
    volver:function(){
      this.$store.commit('recargas/viaticosResumen/SET_NEGATIVE_PASO_MODAL_FUNCIONARIO');
    },
    siguiente:function(){
      this.$store.commit('recargas/viaticosResumen/SET_POSITIVE_PASO_MODAL_FUNCIONARIO');
    }
  }
}
</script>

<style>

</style>
