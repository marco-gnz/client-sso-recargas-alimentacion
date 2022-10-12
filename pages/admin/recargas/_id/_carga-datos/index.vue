<template>
  <div>
    <Hero :title="`Recarga #${$route.params.id} - Carga masiva de datos`" />
    <div class="container.is-fullhd">
      <MenuTotales />
      <div class="card p-6 m-6">
        <MenuRecarga :codigo="$route.params.id" />
        <div class="columns">
          <div class="column is-one-quarter">
            <h5 class="title is-5">1. Carga de funcionarios</h5>
            <div class="field">
              <div class="file is-warning is-boxed">
                <label class="file-label">
                  <input  class="file-input" type="file" name="resume">
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="el-icon-upload2"></i>
                    </span>
                    <span class="file-label">
                      Cargar archivo
                    </span>
                    <span class="file-name">
                      Archivo_2017-07-29 at 15.54.25.png
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div class="column is-one-quarter">
            <h5 class="title is-5">2. Carga de permisos "X"</h5>
            <div class="field">
              <div class="file is-warning is-boxed">
                <label class="file-label">
                  <input  class="file-input" type="file" name="resume">
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="el-icon-upload2"></i>
                    </span>
                    <span class="file-label">
                      Cargar archivo
                    </span>
                    <span class="file-name">
                      Archivo_2017-07-29 at 15.54.25.png
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuRecarga from '../../../../../components/admin/recargas/MenuRecarga.vue';
import MenuTotales from '../../../../../components/admin/recargas/MenuTotales.vue';
export default {
    middleware: 'auth',
    components: { MenuRecarga, MenuTotales },
    head() {
        return {
            title: `Carga datos #${this.$route.params.id}`
        };
    },
}
</script>

<style>

</style>
