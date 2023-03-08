<template>
  <div>
    <section class="hero bd-hero bd-is-basic pt-5">
      <div class="hero-body">
        <div class="bd-hero-heading">
            <h1 class="title algolia-lvl0">{{namepage}}</h1>
            <div class="subtitle is-4 algolia-lvl1">
              <p>{{recarga.establecimiento != null ? recarga.establecimiento : ''}} <i class="el-icon-arrow-right has-text-danger"></i>  {{ recarga.mes_calculo }}/{{ recarga.anio_calculo }} <i class="el-icon-arrow-right has-text-danger"></i> {{ recarga.mes_beneficio }}/{{ recarga.anio_beneficio }} <i class="el-icon-arrow-right has-text-danger"></i> {{ funcionario.nombre_completo }} ({{funcionario.rut_completo}})</p>
            </div>
          </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props:['title', 'subtitle', 'namepage', 'funcionario', 'recarga']
}
</script>

<style>

</style>
