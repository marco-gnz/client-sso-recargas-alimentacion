<template>
  <div>
    <section class="hero bd-hero bd-is-basic pt-5">
      <div class="hero-body">
        <div class="bd-hero-heading">
            <h1 class="title algolia-lvl0">{{namepage}}</h1>
            <div class="subtitle is-4 algolia-lvl1">
              <p>{{esquema.recarga_establecimiento}} <i class="el-icon-arrow-right has-text-danger"></i>  {{ esquema.recarga_mes_calculo }}/{{ esquema.recarga_anio_calculo }} <i class="el-icon-arrow-right has-text-danger"></i> {{ esquema.recarga_mes_beneficio }}/{{ esquema.recarga_anio_beneficio }} <i class="el-icon-arrow-right has-text-danger"></i> {{ esquema.funcionario_nombre_completo }} ({{esquema.funcionario_rut_completo}})</p>
            </div>
          </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  props:['namepage'],
  computed:{
    ...mapGetters({
          esquema: "esquemas/esquemaFuncionario/esquema"
      }),
    }
}
</script>

<style>

</style>
