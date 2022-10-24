<template>
  <div>
    <div class="modal is-large" :class="openModalFuncionarios ? 'is-active' : '' ">
      <div class="modal-background"></div>
      <div class="modal-card" style="width: 80%;">
        <header class="modal-card-head">
          <p class="modal-card-title">Carga masiva de funcionarios</p>
          <button class="delete" aria-label="close" @click.prevent="hideProductModal"></button>
        </header>

        <section class="modal-card-body p-6">
          <el-steps :active="paso" align-center>
            <el-step title="Paso 1" description="Descripción de columnas"></el-step>
            <el-step title="Paso 2" description="Seleccionar archivo"></el-step>
            <el-step title="Paso 3" description="Verificar datos"></el-step>
            <el-step title="Paso 4" description="Importación exitosa"></el-step>
          </el-steps>
        </section>
        <section v-if="paso === 0" class="modal-card-body">
          <h6>Las siguientes columnas son compatibles para realizar la carga masiva de datos.</h6>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="orden"
              label="Orden"
              width="180"
              column-key="orden"
            >
            </el-table-column>
            <el-table-column
              prop="nombre_columna"
              label="Nombre columna"
              width="180"
              column-key="nombre_columna"
            >
            </el-table-column>
            <el-table-column
              prop="format"
              label="Formato"
              width="180">
            </el-table-column>
            <el-table-column
              prop="tag"
              label="Requerida"
              width="100"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.tag ? 'success' : 'warning'"
                  disable-transitions>{{`${scope.row.tag ? 'Si' : 'No'}`}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              label="Descripción">
            </el-table-column>
          </el-table>
        </section>
        <section v-if="paso === 1" class="modal-card-body">
          <div class="columns">
            <div class="column">
              <div class="field">
                <el-upload
                  class="avatar-uploader"
                  :action="`#`"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <i class="el-icon-files"></i>
                  <div v-if="!file_funcionario" class="el-upload__text">Click para cargar archivo excel (Formato .XLSX)</div>
                  <span v-else>{{this.file_funcionario.name}}</span>
                </el-upload>
                <template v-if="funcionarios.length">
                  <el-result icon="success" title="Archivo analizado correctamente" :subTitle="`${funcionarios.length} ${funcionarios.length > 1 ? `registros analizados` : `registros analizado`}`">
                    <template slot="extra">
                      <el-button type="danger" size="medium" @click.prevent="removeFile">Remover archivo</el-button>
                    </template>
                  </el-result>
                </template>
                <template v-if="errors_file != null">
                    <el-result icon="error" title="Error al analizar archivo">
                      <template slot="extra">
                        <el-button type="danger" size="medium" @click.prevent="removeFile">Remover archivo</el-button>
                        {{`${errors_file.length} ${errors_file.length > 1 ? `errores` : `error`}`}}
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
          </div>
        </section>
        <section v-if="paso === 2" class="modal-card-body">
          <div class="columns">
            <div class="column">
              <template v-if="funcionarios.length">
                <h4 class="title is-4">Listado de registros</h4>
                <span class="tag is-primary is-light">{{`${funcionarios.length} ${funcionarios.length > 1 ? `registros` : `registro` }`}}</span>
                <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th v-for="(fila, index) in filas" :key="index">{{index}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(funcionario, index) in funcionarios" :key="index" :class="funcionario.existe === 'Si' ? 'existe' : '' ">
                      <th v-for="(f, index) in funcionario" :key="index">{{f}}</th>
                    </tr>
                  </tbody>
                </table>
              </template>
              <template v-if="errors_file != null">
                <el-result icon="error" title="Error al analizar archivo">
                  <template slot="extra">
                    {{`${errors_file.length} ${errors_file.length > 1 ? `errores` : `error`}`}}
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
        <section v-if="paso === 3 && successImport" class="modal-card-body">
          <div class="columns">
            <div class="column">
              <el-result icon="success" title="Operación realizada con éxito" :subTitle="`${successMessagge}`">
              </el-result>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot buttons is-right">
          <button v-if="paso === 3 && successImport" @click.prevent="hideProductModal" class="button is-rounded">Cerrar</button>
          <button :disabled="paso === 0" v-if="paso != 3" @click.prevent="volver" class="button is-rounded">Volver</button>
          <button v-if="paso < 2" :disabled="disabledButton" @click.prevent="siguiente" v-loading.fullscreen.lock="loadingSpinner" class="button is-info is-rounded">Siguiente</button>
          <button v-if="paso === 2" class="button is-primary is-rounded" v-loading.fullscreen.lock="loadingSpinner" @click.prevent="loadAndStoreFuncionario">Cargar datos</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  data(){
    return{
      url:process.env.BASE_URL,
      imageUrl:'',
      tableData: [{
          orden:'A1',
          nombre_columna: 'rut',
          format: 'Numérico',
          tag: true,
          description: 'Rut de funcionario'
        }, {
          orden:'B1',
          nombre_columna: 'dv',
          format: 'Texto',
          tag: true,
          description: 'Dígito verificador'
        },{
          orden:'C1',
          nombre_columna: 'nombres',
          format: 'Texto',
          tag: true,
          description: 'Nombre de funcionario'
        }, {
          orden:'D1',
          nombre_columna: 'apellidos',
          format: 'Texto',
          tag: true,
          description: 'Apellidos de funcionario'
        },{
          orden:'E1',
          nombre_columna: 'email',
          format: 'Email',
          tag: false,
          description: 'Dirección de correo electrónico'
        }]
    };
  },
  computed:{
    ...mapGetters({
      loadingSpinner:'recargas/datos/fullScreenLoading',
      paso: "recargas/datos/pasoModalFuncionario",
      openModalFuncionarios: "recargas/datos/modalFuncionarios",
      recarga: "recargas/recargas/recarga",
      filas: "recargas/datos/filas",
      funcionarios: "recargas/datos/funcionarios",
      successImport: "recargas/datos/successImport",
      successMessagge: "recargas/datos/successMessagge",
      }),
      errors_file:{
        get() {
          return this.$store.state.recargas.datos.errors_file;
        },
        set(newValue) {
          this.$store.commit('recargas/datos/SET_ERRORS_FILE', newValue);
        }
      },
      file_funcionario:{
        get() {
          return this.$store.state.recargas.datos.files.funcionarios;
        },
        set(newValue) {
          this.$store.commit('recargas/datos/SET_FILE_FUNCIONARIOS', newValue);
        }
      },
      disabledButton(){
        let value = false;

        if(this.paso === 1 && !this.file_funcionario){
          value = true;
        }else if(this.paso === 1 && this.errors_file){
          value = true;
        }

        return value;
      }
  },
  methods:{
    ...mapActions({
      loadFileAction:'recargas/datos/uploadFileFuncionarios',
      uploadFuncionariosStoreAction:'recargas/datos/uploadFuncionariosStore',
      closeModal:'recargas/datos/closeModal'
    }),
    hideProductModal:function(){
      this.closeModal();
    },
    /* loadFile:function(event){
      console.log(event.target.files[0]);
      this.file_funcionario = event.target.files[0];
      if(this.file_funcionario){
        this.uploadFileHtml();
      }
    }, */
    uploadFileHtml:function(){
      if(this.file_funcionario){
        const data = {
          codigo_recarga:this.recarga.codigo,
          file:this.file_funcionario
        };
        this.loadFileAction(data);
      }else{
        this.$message.error('Por favor seleccione archivo');
      }
    },
    loadAndStoreFuncionario:function(){
      if(this.file_funcionario){
        const data = {
          codigo_recarga:this.recarga.codigo,
          file:this.file_funcionario
        };
        this.uploadFuncionariosStoreAction(data);
      }else{
        this.$message.error('Por favor seleccione archivo');
      }
    },
    handleAvatarSuccess(res, file) {
      console.log(file);
      this.file_funcionario = file.raw;
      this.imageUrl = URL.createObjectURL(file.raw);
      if(this.file_funcionario){
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
    removeFile:function(){
        this.file_funcionario = '';
        this.errors_file = null;
        this.$store.commit('recargas/datos/SET_FUNCIONARIOS', []);
    },
    volver:function(){
      this.$store.commit('recargas/datos/SET_NEGATIVE_PASO_MODAL_FUNCIONARIO');
    },
    siguiente:function(){
      this.$store.commit('recargas/datos/SET_POSITIVE_PASO_MODAL_FUNCIONARIO');
    }
  }
}
</script>

<style>
.modal-card-foot{
  justify-content: flex-end;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100%;
  margin: auto;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .existe{
    outline: 1px rgba(221, 110, 110, 0.342) solid !important;
    background-color: rgba(221, 110, 110, 0.342) !important;
  }
</style>
