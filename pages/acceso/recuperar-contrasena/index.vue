<template>
  <div>
    <div class="container.is-fullhd">
      <div class="card p-6 m-6">
        <Titulo />
        <div class="columns">
          <div class="column pt-6 is-centered">
            <Menu />
            <div class="field">
                <label class="label">Ingrese correo electrónico</label>
                <input class="input is-rounded" type="email" placeholder="Ingrese correo electrónico">
            </div>
            <div class="field">
              <div class="buttons is-right">
                <a class="button is-link is-light is-rounded">Enviar</a>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="is-flex is-align-items-center is-justify-content-center pt-6">
              <figure class="image is-512x512">
                <img class="is-rounded" src="~/assets/img/contrasena.webp" style="max-height: 500px; max-width: 500px;">
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '../../../components/autenticacion/Menu.vue';
import Titulo from '../../../components/autenticacion/Titulo.vue';
export default {
    name: "IndexPage",
    middleware: 'guest',
    head() {
        return {
            title: "Recuperar contraseña"
        };
    },
    components: {Menu, Titulo }
}
</script>
