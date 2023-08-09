<template>
  <div>
    <template v-if="tipo_reajuste === 0">
      <thead>
        <tr>
          <th>Total días ajustes pendientes</th>
          <th>Nuevo ajuste</th>
          <th>Pendientes + nuevo ajuste</th>
          <th>Monto a añadir</th>
          <th>Días a cancelar <strong>*</strong></th>
          <th>Monto a pagar</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{new_esquema_calculo.total_dias_ajustes_pendiente}}</td>
          <td>{{new_esquema_calculo.dias_reajuste}}</td>
          <td>{{new_esquema_calculo.total_dias_ajustes_calculo}}</td>
          <td>{{new_esquema_calculo.monto_ajuste_format}}</td>
          <td>{{new_esquema_calculo.dias_cancelar}}</td>
          <td>{{new_esquema_calculo.monto_cancelar}}</td>
        </tr>
      </tbody>
    </template>
    <template v-if="tipo_reajuste === 1">
      <thead>
        <tr>
          <th>Total monto ajustes pendientes</th>
          <th>Nuevo ajuste</th>
          <th>Pendientes + nuevo ajuste</th>
          <th>Monto a pagar</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{new_esquema_calculo.total_monto_ajustes_pendiente}}</td>
          <td>{{new_esquema_calculo.monto_ajuste_format}}</td>
          <td>{{new_esquema_calculo.total_monto_calculo}}</td>
          <td>{{new_esquema_calculo.total_monto_cancelar}}</td>
        </tr>
      </tbody>
    </template>
    <div class="field">
      <div class="notification is-info is-light">
        Una vez ingresado el reajuste, será calculado en el total siempre y cuando este sea <strong>aprobado por un Administrador autorizado</strong>.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['tipo_reajuste', 'new_esquema_calculo']
}
</script>

<style>

</style>
