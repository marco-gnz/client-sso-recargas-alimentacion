<template>
  <div>
    <div class="modal is-large" :class="openModalAusentismos ? 'is-active' : '' ">
      <div class="modal-background"></div>
      <div class="modal-card" style="width: 80%;">
        <header class="modal-card-head">
          <p class="modal-card-title">Carga masiva de grupo de ausentismos</p>
          <button class="delete" aria-label="close" @click.prevent="hideAusentismosModal"></button>
        </header>

        <section class="modal-card-body p-6">
          <el-steps :active="paso" align-center>
            <el-step title="Paso 1" description="Grupo de ausentismo"></el-step>
            <el-step title="Paso 2" description="Descripción de columnas"></el-step>
            <el-step title="Paso 3" description="Seleccionar archivo"></el-step>
            <el-step title="Paso 4" description="Verificar datos"></el-step>
            <el-step title="Paso 5" description="Importación exitosa"></el-step>
          </el-steps>
        </section>
        <section v-if="paso === 0" class="modal-card-body">
          <div class="columns">
            <div class="column is-4 is-offset-4">
              <h6 class="title is-6">Seleccione grupo a importar</h6>
              <div class="field">
                <div class="columns">
                  <div class="column" v-for="(grupo, index) in grupos" :key="index">
                    <el-radio-group v-model="grupo_value" @change="getReglasGrupo">
                      <el-tooltip class="item" effect="dark" :content="`${grupo.descripcion}`" placement="top-start">
                        <el-radio-button :label="grupo.id">{{grupo.nombre}}</el-radio-button>
                      </el-tooltip>
                    </el-radio-group>
                  </div>
                </div>
              </div>
              <div class="field">
                <template v-if="reglas.length">
                  <el-tag size="mini" type="success">{{`${Intl.NumberFormat('de-DE').format(reglas.length)} ${reglas.length > 1 ? `tipos de ausentismos` : `tipo de ausentismo`}`}}</el-tag>
                  <table class="table is-fullwidth" v-loading="loadingReglas" element-loading-text="Cargando reglas...">
                    <thead>
                      <tr>
                        <th>Tipo de ausentismo</th>
                        <th>Regla</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(regla, index) in reglas" :key="index">
                        <td>{{regla.tipo_ausentismo.nombre}}</td>
                        <td>
                          <template v-if="grupo_value === 1">
                            DC
                          </template>
                          <template v-if="grupo_value === 2">
                            {{`${regla.meridianos.length ? regla.meridianos.map(m => m.nombre).join(' - ') : '--'}`}}
                          </template>
                          <template v-if="grupo_value === 3">
                            {{`${regla.hora_inicio != null && regla.hora_termino != null ? `${DateTime.fromISO(regla.hora_inicio).toFormat('T')} / ${DateTime.fromISO(regla.hora_termino).toFormat('T')}` : '--'}`}}
                          </template>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </template>
              </div>
            </div>
          </div>
        </section>
        <section v-if="paso === 1" class="modal-card-body">
          <h6>Lass siguientes columnas son compatibles para realizar la carga masiva de ausentismos para el grupo {{grupo_value}}.</h6>
          <div class="columns">
            <div class="column is-half">
              <label class="label">Posición columnas (2 max)</label>
              <input type="number" class="input is-rounded" v-model="row_grupo_uno">
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
                <tr v-for="(columna, index) in columnas_grupo_uno" :key="index">
                  <td><input type="text" class="input is-rounded" v-model="columna.nombre_columna" v-lowercase></td>
                  <td>{{columna.formato}}</td>
                  <td><el-tag :type="columna.required ? 'success' : 'warning'" disable-transitions>{{`${columna.required ? 'Si' : 'No'}`}}</el-tag></td>
                  <td>{{columna.descripcion}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section v-if="paso === 2" class="modal-card-body">
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
                  <div v-if="!file_ausentismo" class="el-upload__text">Click para cargar archivo excel (Formato .XLSX)</div>
                  <span v-else>{{this.file_ausentismo.name}}</span>
                </el-upload>
                <template v-if="ausentismos.length && !errors_file">
                  <el-result icon="success" title="Archivo analizado correctamente" :subTitle="`${ausentismos.length} ${ausentismos.length > 1 ? `registros analizados` : `registros analizado`}`">
                    <template slot="extra">
                      <el-button type="danger" size="medium">Remover archivo</el-button>
                    </template>
                  </el-result>
                </template>
                <template v-if="errorColumn.status === 'Error'">
                  <el-result icon="error" :title="errorColumn.message" subTitle="Favor verificar nuevamente el nombre de las columnas en el paso anterior.">
                    <template slot="extra">
                      <el-button type="danger" size="medium">Remover archivo</el-button>
                    </template>
                  </el-result>
                </template>
                <template v-if="errors_file != null">
                    <el-result icon="error" title="Error al analizar archivo">
                      <template slot="extra">
                        <el-button type="danger" size="medium">Remover archivo</el-button>
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
        <section v-if="paso === 3" class="modal-card-body">
          <div class="columns">
            <div class="column">
              <template v-if="ausentismos.length">
                <h4 class="title is-4">Listado de registros</h4>
                <span class="tag is-primary is-light">{{`${ausentismos.length} ${ausentismos.length > 1 ? `registros` : `registro` }`}}</span>
                <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th v-for="(fila, index) in filas" :key="index">{{index}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(ausentismo, index) in ausentismos" :key="index">
                      <th v-for="(a, index) in ausentismo" :key="index">{{a}}</th>
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
        <section v-if="paso === 4 && successImport" class="modal-card-body">
          <div class="columns">
            <div class="column">
              <el-result icon="success" title="Operación realizada con éxito" :subTitle="`${successMessagge}`">
              </el-result>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot buttons is-right">
          <button v-if="paso === 4 && successImport" @click.prevent="hideAusentismosModal" class="button is-rounded">Cerrar</button>
          <button :disabled="paso === 0" v-if="paso != 4" @click.prevent="volver" class="button is-rounded">Volver</button>
          <button v-if="paso < 3" :disabled="disabledButton" @click.prevent="siguiente" v-loading.fullscreen.lock="loadingSpinner" class="button is-info is-rounded">Siguiente</button>
          <button :disabled="!successImport" v-if="paso === 3" class="button is-primary is-rounded" @click.prevent="storeGrupoUno" v-loading.fullscreen.lock="loadingSpinner">Cargar datos</button>
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
    return{
      radio1:'',
      grupo_select:[],
      columnas_grupo_uno:[]

    };
  },
  mounted(){
    this.getColumnsGrupoUno();
  },
  computed:{
    ...mapGetters({
      openModalAusentismos: "recargas/ausentismos/modal",
      paso: "recargas/ausentismos/paso",
      loadingSpinner:'recargas/ausentismos/fullScreenLoading',
      grupos:'modulos/modulos/gruposAusentismos',
      reglas:'recargas/ausentismos/reglas',
      loadingReglas:'recargas/ausentismos/loadingReglas',
      ausentismos:'recargas/ausentismos/ausentismos',
      filas: "recargas/ausentismos/filas",
      successImport: "recargas/ausentismos/successImport",
      successMessagge: "recargas/ausentismos/successMessagge",
      errorColumn: "recargas/ausentismos/errorsColumn",
    }),
    row_grupo_uno:{
        get() {
          return this.$store.state.modulos.columnasexcel.row_columnas_grupo_uno;
        },
        set(newValue) {
          this.$store.commit('modulos/columnasexcel/SET_COLUMNA_GRUPO_UNO', newValue);
        }
      },
    grupo_value:{
      get() {
        return this.$store.state.recargas.ausentismos.carga.grupo_id;
      },
      set(newValue) {
        this.$store.commit('recargas/ausentismos/SET_GRUPO', newValue);
      }
    },
    file_ausentismo:{
      get() {
        return this.$store.state.recargas.ausentismos.carga.file;
      },
      set(newValue) {
        this.$store.commit('recargas/ausentismos/SET_FILE', newValue);
      }
    },
    errors_file:{
      get() {
        return this.$store.state.recargas.ausentismos.errors_file;
      },
      set(newValue) {
        this.$store.commit('recargas/ausentismos/SET_ERRORS_FILE', newValue);
      }
    },
    disabledButton(){
      let value = false;

      if(this.paso === 0 && !this.grupo_value){
        value = true;
      }else if(this.paso === 2 && !this.file_ausentismo){
        value = true;
      }else if((this.paso === 2 && this.errors_file) || (this.paso === 2 && this.errorColumn)){
        value = true;
      }

      return value;
    }
  },
  methods:{
    ...mapActions({
      closeModal:'recargas/ausentismos/closeModal',
      getReglasGrupoAction:'recargas/ausentismos/getReglas',
      loadFileAction:'recargas/ausentismos/uploadFileAusentismo',
      storeFileGrupoUnoAction:'recargas/ausentismos/storeFileGrupoUno',
    }),
    async getColumnsGrupoUno(){
      const url       = '/api/admin/modulos/columnas/grupo-uno';
      const response  = await this.$axios.$get(url);
      this.columnas_grupo_uno   = response;
    },
    getReglasGrupo:function(){
      const data = {
        grupo_id:this.grupo_value,
        recarga_codigo:this.codigo
      };
      if(this.grupo_value === 1){
        this.grupo_select = this.columnas_grupo_uno;
      }else if (this.grupo_value === 2){
        this.grupo_select = this.columnas_grupo_dos;
      }else{
        this.grupo_select = this.columnas_grupo_tres;
      }
      this.getReglasGrupoAction(data);
    },
    uploadFileHtml:function(){
      if(this.file_ausentismo){
        const data = {
          recarga_codigo:this.codigo,
          grupo_id:this.grupo_value,
          file:this.file_ausentismo,
          columnas:this.columnas_grupo_uno,
          row_columnas:this.row_grupo_uno
        };
        this.loadFileAction(data);
      }else{
        this.$message.error('Por favor seleccione archivo');
      }
    },
    handleAvatarSuccess(res, file) {
      this.file_ausentismo = file.raw;
      this.imageUrl = URL.createObjectURL(file.raw);
      if(this.file_ausentismo){
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
    storeGrupoUno:function(){
      const data = {
          recarga_codigo:this.codigo,
          grupo_id:this.grupo_value,
          file:this.file_ausentismo,
          columnas:this.columnas_grupo_uno,
          row_columnas:this.row_grupo_uno
        };
      this.storeFileGrupoUnoAction(data);
    },
    hideAusentismosModal:function(){
      this.closeModal();
    },
    volver:function(){
      this.$store.commit('recargas/ausentismos/SET_NEGATIVE_PASO_MODAL');
    },
    siguiente:function(){
      this.$store.commit('recargas/ausentismos/SET_POSITIVE_PASO_MODAL');
    }
  }
}
</script>

<style>

</style>
