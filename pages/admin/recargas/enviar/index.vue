<template>
    <div class="container.is-fullhd">
      <div class="card p-6 m-6">
        <h2 class="subtitle">Enviar reporte de recarga de beneficio a funcionario</h2> <i>Se enviará en un archivo pdf.</i>
        <div class="columns">
          <div class="column pt-6 is-centered">
            <div class="field">
                <label class="label">Ingrese rut de funcionario beneficiario</label>
                <input v-model="enviar.rut" class="input" type="email" placeholder="Ingrese rut (formato 12345678-K)">
            </div>
            <div class="field">
                <label class="label">Seleccione año y mes de recarga de beneficio</label>
                <el-date-picker
                    :disabled="!enviar.rut"
                    v-model="enviar.fecha"
                    format="MM-yyyy"
                    value-format="yyyy-MM-dd"
                    class="element-select is-rounded"
                    type="month"
                    placeholder="Seleccione año y mes ">
                </el-date-picker>
            </div>
            <div class="field">
                <label class="label">Ingrese correo electrónico a enviar reporte</label>
                <input :disabled="!enviar.rut || !enviar.fecha" v-model="enviar.email" class="input" type="email" placeholder="Ingrese correo electrónico">
            </div>
            <div class="field">
              <div class="buttons is-right">
                <button :disabled="!enviar.rut || !enviar.fecha || !enviar.email"  v-loading.fullscreen.lock="fullscreenLoading" class="button is-link is-light is-fullwidth is-rounded">Enviar reporte</button>
              </div>
            </div>
          </div>
          <div class="column">
            <figure class="image is-16by9">
              <img class="is-rounded" src="https://img.freepik.com/vector-gratis/enviar-concepto-correo-electronico_24908-60320.jpg?w=1060&t=st=1665062730~exp=1665063330~hmac=a7ba707ed06c77089b3efa0cc8877e95facd556290cc24d0df0bc832d2e474ab">
            </figure>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  middleware: 'auth',
  data(){
    return{
      fullscreenLoading:false,
      enviar:{
        rut:'',
        fecha:'',
        email:''
      }
    };
  },
  methods:{

  }
}
</script>

<style>

</style>
