import { Notification } from 'element-ui';
export const state = () => ({
  loading_publicar_planilla:false,
  modal_publicar_planilla:false,
  modal_generar_planilla:false,
  modal_add_esquema:false,
  loading_publicar:false,
  loading_search_funcionario:false,
  loading_store_esquema:false,
  advertencias_recarga:[],
  errores_recarga:[],
  others_alertas:[],
  fullscreenloading:false,
  recarga:{},
  funcionarios:[],
  loading_index:false,
  index_click_funcionario:undefined,
  index_click_reemplazo:undefined,
  loading_days_in_date:false,
  loading_tabla_resumen:false,
  loading_generar_planilla:false,
  loading_delete_data:false,
  reajuste:{
    rebaja_dias:0,
    fecha_inicio:'',
    fecha_termino:'',
    calculo_dias:true,
    tipo_ausentismo_id:'',
    tipo_incremento_id:'',
    tipo_reajuste:0,
    valor_dia:0,
    observacion:'',
    advertencias:[],
    errores:[],
    total_dias:0,
    diff_days:0,
    monto_ajuste:0,
    monto_ajuste_format:0,
    calculo:''
  },
  reajuste_errors:{},
  loading_reajuste:false,
  modal_reajuste:false,
  modal_show_errores:false,
  filtro:{
    input:'',
    tipo_ingreso:[],
    fecha_alejamiento:[],
    beneficio:[],
    reemplazo:[],
    turno_asignaciones:[],
    is_turno:[],
    errores:[],
    ajustes:[],
    leyes:[],
    unidades:[],
    horas:[],
    equals_unidad:true,
    ordenamiento:[],
    load_grupo:null,
    tipo_ausentismo:[],
    centro_costo:[]
  },
  pagination: {
    total: 0,
    current_page: 0,
    per_page: 0,
    last_page: 0,
    from: 0,
    to: 0
  },
  offset: 5,
  index_selected_table:undefined,
  ordenamientos:[
    {index:0, nombre:'active', order:'ASC'},
    {index:1, nombre:'funcionario.apellidos', order:'ASC'},
    {index:2, nombre:'es_turnante', order:'ASC'},
    {index:3, nombre:'calculo_contrato', order:'ASC'},
    {index:4, nombre:'calculo_turno', order:'ASC'},
    {index:5, nombre:'calculo_grupo_uno', order:'ASC'},
    {index:6, nombre:'calculo_grupo_dos', order:'ASC'},
    {index:7, nombre:'calculo_grupo_tres', order:'ASC'},
    {index:8, nombre:'calculo_viaticos', order:'ASC'},
    {index:9, nombre:'calculo_dias_ajustes', order:'ASC'},
    {index:10, nombre:'total_dias_cancelar', order:'ASC'},
    {index:11, nombre:'total_monto_ajuste', order:'ASC'},
    {index:12, nombre:'monto_total_cancelar', order:'ASC'},
  ],
  loading_generar_planilla_action:false,
  campos_planilla:[],
  campos_selected:[],
  errors_campos_planilla:{},
  new_esquema:{
    input:'',
    funcionario_id:'',
    recargas_id:[],
  },
  funcionarios_not_recarga:[],
  funcionario_recargas:[],
  loading_status_marcados:false,
  modal_status_marcados:false,
  esquemas_checked:[],
  checked_all:false,
  loading_send_cartolas:false,
  funcionario_manual_ausentismos:[],
  funcionario_manual_viaticos:[],
  funcionario_manual_asistencias:[],
  funcionario_manual_asignaciones:[],
  funcionario_manual_contratos:[],
  recargas_adicional:[],
  loading_delete_esquema_manual:false,
  loading_pre_calculo:false
});

export const mutations = {
  SET_FUNCIONARIO_MANUAL_AUSENTISMOS(state, value){
    state.funcionario_manual_ausentismos = value;
  },
  SET_FUNCIONARIO_MANUAL_VIATICOS(state, value){
    state.funcionario_manual_viaticos = value;
  },
  SET_FUNCIONARIO_MANUAL_ASISTENCIAS(state, value){
    state.funcionario_manual_asistencias = value;
  },
  SET_FUNCIONARIO_MANUAL_ASIGNACIONES(state, value){
    state.funcionario_manual_asignaciones = value;
  },
  SET_FUNCIONARIO_MANUAL_CONTRATOS(state, value){
    state.funcionario_manual_contratos = value;
  },

  SET_MODAL_STATUS_MARCADOS(state, value){
    state.modal_status_marcados = value;
  },
  SET_ESQUEMAS_CHECKED(state, value){
    state.esquemas_checked = value;
  },
  SET_CHECKED_ALL(state, value){
    state.checked_all = value;
  },
  SET_LOADING_PUBLICAR_PLANILLA(state, value){
    state.loading_publicar_planilla = value;
  },
  SET_MODAL_PUBLICAR_PLANILLA(state, value){
    state.modal_publicar_planilla = value;
  },
  SET_MODAL_GENERAR_PLANILLA(state, value){
    state.modal_generar_planilla = value;
    if(!value){
      state.campos_selected = [];
      state.errors_campos_planilla = {};
    }
  },
  SET_MODAL_ADD_ESQUEMA(state, value){
    state.modal_add_esquema = value;
  },
  SET_CAMPOS_PLANILLA(state, value){
    state.campos_planilla = value;
  },
  SET_CAMPOS_PLANILLA_SELECTED(state, value){
    state.campos_selected = value;
  },
  SET_ERRORS_CAMPOS_PLANILLA_SELECTED(state, value){
    state.errors_campos_planilla = value;
  },
  SET_LOADING_PUBLICAR(state, value){
    state.loading_publicar = value;
  },
  SET_LOADING_GENERAR_PLANILLA(state, value){
    state.loading_generar_planilla = value;
  },
  SET_LOADING_GENERAR_PLANILLA_ACTION(state, value){
    state.loading_generar_planilla_action = value;
  },
  SET_ADVERTENCIAS_RECARGA(state, value){
    state.advertencias_recarga = value;
  },
  SET_ERRORES_RECARGA(state, value){
    state.errores_recarga = value;
  },
  SET_OTHERS_ALERTAS(state, value){
    state.others_alertas = value;
  },
  SET_LOADING(state, value){
    state.fullscreenloading = value;
  },
  SET_LOADING_TABLA_RESUMEN(state, value){
    state.loading_tabla_resumen = value;
  },
  SET_RECARGA(state, recarga){
    state.recarga = recarga;
  },
  SET_FUNCIONARIOS(state, funcionarios){
    state.funcionarios = funcionarios;
  },
  SET_UPDATE_FUNCIONARIO(state, funcionario){
    const i = state.funcionarios.findIndex(f => f.id === funcionario.id);
    state.funcionarios.splice(i, 1, funcionario);
  },
  SET_UPDATE_FUNCIONARIO_CHECKED(state, funcionarioId){

    const funcionario = state.funcionarios.find(f => f.id === funcionarioId);
    console.log(funcionario);
    if (funcionario) {
      let status = funcionario.checked ? true : false;
      funcionario.checked = !status;
    }
  },
  SET_LOADING_INDEX(state, value){
    return state.loading_index = value;
  },
  SET_INDEX_CLICK_FUNCTIONARIO(state, value){
    state.index_click_funcionario = value;
  },
  SET_INDEX_CLICK_REEMPLAZO(state, value){
    state.index_click_reemplazo = value;
  },

  SET_LOADING_ESQUEMA_MANUAL(state, value){
    state.loading_store_esquema = value;
  },
  SET_SQUEMA_MANUAL(state, value){
    state.funcionarios.unshift(value);
  },
  SET_CLOSE_MODAL_ADD_ESQUEMA(state){
    state.new_esquema.input = '';
    state.new_esquema.funcionario_id = '';
    state.new_esquema.recargas_id = [];
    state.modal_add_esquema = false;
    state.funcionarios_not_recarga = [];
    state.funcionario_recargas = [];
  },

  NEW_ESQUEMA_FUNCIONARIO(state, value){
    state.new_esquema.funcionario_id = value;
  },
  NEW_ESQUEMA_FUNCIONARIO_RECARGAS(state, value){
    state.new_esquema.recargas_id = value;
  },

  SET_LOADING_MARCADOS(state, value){
    state.loading_status_marcados = value;
  },

  SET_REAJUSTE_FECHA_INICIO(state, value){
    state.reajuste.fecha_inicio = value;
  },
  SET_REAJUSTE_FECHA_TERMINO(state, value){
    state.reajuste.fecha_termino = value;
  },
  SET_REAJUSTE_TOTAL_DIAS(state, value){
    state.reajuste.total_dias = value;
  },
  SET_REAJUSTE_CALCULO_DIAS(state, value){
    state.reajuste.calculo_dias = value;
  },
  SET_REAJUSTE_REBAJA_DIAS(state, value){
    state.reajuste.rebaja_dias = value;
  },
  SET_REAJUSTE_TIPO_AUSENTISMO(state, value){
    state.reajuste.tipo_ausentismo_id = value;
  },
  SET_REAJUSTE_TIPO_INCREMENTO(state, value){
    state.reajuste.tipo_incremento_id = value;
  },
  SET_ADVERTENCIAS(state, value){
    state.reajuste.advertencias = value;
  },
  SET_ERRORES(state, value){
    state.reajuste.errores = value;
  },
  SET_REAJUSTE_VALOR_DIA(state, value){
    state.reajuste.valor_dia = value;
  },
  SET_REAJUSTE_OBSERVACION(state, value){
    state.reajuste.observacion = value;
  },
  SET_REAJUSTE_ERRORS(state, value){
    state.reajuste_errors = value;
  },
  SET_REAJUSTE_TOTAlES(state, value){
    state.reajuste.total_dias           = value.total_dias;
    state.reajuste.monto_ajuste         = value.monto_ajuste;
    state.reajuste.monto_ajuste_format  = value.monto_ajuste_format;
    state.reajuste.diff_days            = value.diff_days;
  },
  SET_REAJUSTE_MONTO_TOTAlES(state, value){
    state.reajuste.total_dias           = value.total_dias;
    state.reajuste.monto_ajuste         = value.monto_ajuste;
    state.reajuste.monto_ajuste_format  = value.monto_ajuste_format;
    state.reajuste.diff_days            = value.diff_days;
    state.reajuste.monto_ajuste         = value.monto_ajuste;
    state.reajuste.monto_ajuste_format  = value.monto_ajuste_format;
  },
  SET_REAJUSTE_PRE_CALCULO(state, value){
    state.reajuste.calculo = value;
  },
  SET_FUNCIONARIO_RECARGAS(state, value){
    state.funcionario_recargas = value;
  },

  SET_FUNCIONARIOS_NOT_RECARGA(state, value){
    state.funcionarios_not_recarga = value;
  },
  SET_LOADING_REAJUSTE(state, value){
    state.loading_reajuste = value;
  },
  SET_LOADING_SEARCH_FUNCIONARIO(state, value){
    state.loading_search_funcionario = value;
  },
  SET_MODAL_REAJUSTE(state, value){
    state.modal_reajuste = value;
    if(!value){
      for(let key in state.reajuste){
        state.reajuste[key] = '';
      }
      state.reajuste.rebaja_dias = 0;
      state.reajuste.calculo_dias = true;
      state.reajuste.calculo = '';
      state.reajuste.tipo_reajuste = 0;
      state.reajuste.valor_dia = 0;
      state.reajuste.advertencias = [];
      state.reajuste.errores = [];
      state.reajuste.total_dias = 0;
      state.reajuste.monto_ajuste = 0;
      state.reajuste.monto_ajuste_format = 0;
      state.reajuste_errors = {};
      state.reajuste.diff_days = 0;
    }
  },
  REFRESH_CAMPOS_REAJUSTE(state){
    for(let key in state.reajuste){
      state.reajuste[key] = '';
    }
    state.reajuste.rebaja_dias = 0;
    state.reajuste.calculo_dias = true;
    state.reajuste.calculo = '';
    state.reajuste.tipo_reajuste = 0;
    state.reajuste.valor_dia = 0;
    state.reajuste.advertencias = [];
    state.reajuste.errores = [];
    state.reajuste.total_dias = 0;
    state.reajuste.monto_ajuste = 0;
    state.reajuste.monto_ajuste_format = 0;
    state.reajuste_errors = {};
    state.reajuste.diff_days = 0;
  },
  SET_LOADING_DAYS_IN_DATE(state, value){
    state.loading_days_in_date = value;
  },
  SET_CURRENT_PAGE(state, value){
    state.pagination.current_page = value;
  },
  SET_PAGINATION(state, value){
    state.pagination = value;
  },
  SET_FILTRO_INPUT(state, value){
    state.filtro.input = value;
  },
  SET_FILTRO_TIPO_INGRESO(state, value){
    state.filtro.tipo_ingreso = value;
  },
  SET_FILTRO_FECHA_ALEJAMIENTO(state, value){
    state.filtro.fecha_alejamiento = value;
  },
  SET_FILTRO_BENEFICIO(state, value){
    state.filtro.beneficio = value;
  },
  SET_FILTRO_REEMPLAZO(state, value){
    state.filtro.reemplazo = value;
  },
  SET_FILTRO_TURNO_ASIGNACIONES(state, value){
    state.filtro.turno_asignaciones = value;
  },
  SET_FILTRO_TURNO(state, value){
    state.filtro.is_turno = value;
  },
  SET_FILTRO_AJUSTES(state, value){
    state.filtro.ajustes = value;
  },
  SET_FILTRO_ERRORES(state, value){
    state.filtro.errores = value;
  },
  SET_FILTRO_LEYES(state, value){
    state.filtro.leyes = value;
  },
  SET_FILTRO_UNIDADES(state, value){
    state.filtro.unidades = value;
  },
  SET_FILTRO_HORAS(state, value){
    state.filtro.horas = value;
  },
  SET_EQUALS_UNIDADES(state, value){
    state.filtro.equals_unidad = value;
  },
  SET_FILTRO_ORDENAMIENTO(state, value){
    state.filtro.ordenamiento = value;
  },
  SET_FILTRO_GRUPO(state, value){
    state.filtro.load_grupo = value;
  },
  SET_FILTRO_TIPO_AUSENTISMO(state, value){
    state.filtro.tipo_ausentismo = value;
  },
  SET_FILTRO_CENTRO_COSTO(state, value){
    state.filtro.centro_costo = value;
  },
  SET_INDEX_SELECTED_TABLE(state, value){
    state.index_selected_table = value;
  },
  SET_MODAL_ERRORES(state, value){
    state.modal_show_errores = value;
  },
  SET_ORDENACION(state, value){
    state.filtro.ordenamiento = value;
  },
  SET_VALUE_ORDENACION(state, value){
    const element = state.filtro.ordenamiento.find(order => order.nombre === value.nombre);
    const index   = state.filtro.ordenamiento.indexOf(element);

    if((!element) && (index <= 0)){
      let new_value = {...value};
      state.filtro.ordenamiento.push(new_value);
    }else{
      if((element) && (element.order === 'ASC')){
        element.order = 'DESC';
      }else if((element) && (element.order === 'DESC')){
        state.filtro.ordenamiento.splice(index, 1);
      }
    }
  },
  LOADING_DELETE_DATA(state, value){
    state.loading_delete_data = value;
  },
  LOADING_SEND_CARTOLA(state, value){
    state.loading_send_cartolas = value;
  },
  SET_RECARGAS_ADICIONAL(state, value){
    state.recargas_adicional = value;
  },
  SET_LOADING_DELETE_ESQUEMA_MANUAL(state, value){
    state.loading_delete_esquema_manual = value;
  },
  DELETE_ESQUEMA(state, value){
    state.funcionarios = state.funcionarios.filter(f => f.id !== value);
  },
  SET_LOADING_PRE_CALCULO(state, value){
    state.loading_pre_calculo = value;
  }
};

export const getters = {
  funcionarioManualAusentismos(state){
    return state.funcionario_manual_ausentismos;
  },
  funcionarioManualViaticos(state){
    return state.funcionario_manual_viaticos;
  },
  funcionarioManualAsistencias(state){
    return state.funcionario_manual_asistencias;
  },
  funcionarioManualAsignaciones(state){
    return state.funcionario_manual_asignaciones;
  },
  funcionarioManualContratos(state){
    return state.funcionario_manual_contratos;
  },
  loadingPublicarPlanilla(state){
    return state.loading_publicar_planilla;
  },
  loadingMarcados(state){
    return state.loading_status_marcados;
  },
  loadingPublicar(state){
    return state.loading_publicar;
  },
  advertenciasRecarga(state){
    return state.advertencias_recarga;
  },
  erroresRecarga(state){
    return state.errores_recarga;
  },
  othersAlertas(state){
    return state.others_alertas;
  },
  recarga(state){
    return state.recarga;
  },
  fullScreenLoading(state){
    return state.fullscreenloading;
  },
  funcionarios(state){
    return state.funcionarios;
  },
  loadingIndex(state){
    return state.loading_index;
  },
  indexClickFuncionario(state){
    return state.index_click_funcionario;
  },
  reajusteErrors(state){
    return state.reajuste_errors;
  },
  loadingReajuste(state){
    return state.loading_reajuste;
  },
  modalReajuste(state){
    return state.modal_reajuste;
  },
  loadingDaysInDate(state){
    return state.loading_days_in_date;
  },
  pagination(state){
    return state.pagination;
  },
  diffDays(state){
    return state.reajuste.diff_days;
  },
  offset(state){
    return state.offset;
  },
  loadingTablaResumen(state){
    return state.loading_tabla_resumen;
  },
  ordenamientos(state){
    return state.ordenamientos;
  },
  filtroOrder(state){
    return state.filtro.ordenamiento;
  },
  reajuste(state){
    return state.reajuste;
  },
  camposPlanilla(state){
    return state.campos_planilla;
  },
  loadingSearchFuncionario(state){
    return state.loading_search_funcionario;
  },
  funcionariosNotRecarga(state){
    return state.funcionarios_not_recarga;
  },
  funcionarioRecargas(state){
    return state.funcionario_recargas;
  },
  loadingStoreEsquema(state){
    return state.loading_store_esquema;
  },
  erroresCamposPlanilla(state){
    return state.errors_campos_planilla;
  },
  loadingGenerarPlanilla(state){
    return state.loading_generar_planilla_action;
  },
  loadingDeleteData(state){
    return state.loading_delete_data;
  },
  loadingSendCartolas(state){
    return state.loading_send_cartolas;
  },
  recargasAdicional(state){
    return state.recargas_adicional;
  },
  loadingDeleteEsquemaManual(state){
    return state.loading_delete_esquema_manual;
  },
  loadingPreCalculo(state){
    return state.loading_pre_calculo;
  }
};

export const actions = {
  async getPublicarPlanilla({ commit }, data){
    commit('SET_LOADING_PUBLICAR_PLANILLA', true);
    const url = `/api/admin/recarga/${data}/resumen/publicar`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_PUBLICAR_PLANILLA', false);
      if(response.status === 'Success'){
        commit('SET_ADVERTENCIAS_RECARGA', response.advertencias);
        commit('SET_ERRORES_RECARGA', response.errores);
        commit('SET_OTHERS_ALERTAS', response.others_alertas);
      }
    }).catch(error => {
      commit('SET_LOADING_PUBLICAR_PLANILLA', false);
      console.log(error);
    });
  },
  async publicarPlanilla({ commit }, data){
    commit('SET_LOADING_PUBLICAR', true);
    const url = `/api/admin/recarga/${data}/resumen/publicar`;
    await this.$axios.$post(url).then(response => {
      commit('SET_LOADING_PUBLICAR', false);
      if(response.status === 'Success'){
        if(response.value === true){
          Notification.error({
            title: 'Error',
            message: response.message
          });
        }else{
          Notification.success({
            title: 'Publicada',
            message: response.message
          });
          commit('SET_RECARGA', response.recarga);
        }
        commit('SET_MODAL_PUBLICAR_PLANILLA', false);
      }
    }).catch(error => {
      commit('SET_LOADING_PUBLICAR', false);
      console.log(error);
    });
  },
  async getGenerarPlanilla({ commit }, data){
    commit('SET_LOADING_GENERAR_PLANILLA', true);
    const url = `/api/admin/recarga/${data}/resumen/generar`;
    await this.$axios.$get(url).then(response => {
      commit('SET_LOADING_GENERAR_PLANILLA', false);
      if(response.status === 'Success'){
        commit('SET_CAMPOS_PLANILLA', response.campos);
      }
    }).catch(error => {
      commit('SET_LOADING_GENERAR_PLANILLA', false);
      console.log(error);
    });
  },
  async generarPlanillaAction({ commit, state }, data){
    commit('SET_LOADING_GENERAR_PLANILLA_ACTION', true);
    let campos_id = state.campos_selected.map(function(c){
      return c.id;
    });
    let campos_slug = state.campos_selected.map(function(c){
      return c.slug;
    });
    let campos_nombre = state.campos_selected.map(function(c){
      return c.nombre;
    });
    const data_x = {
      codigo:data.codigo,
      campos_id:campos_id,
      campos_slug: campos_slug,
      campos_nombre:campos_nombre
    };
    const url = `/api/admin/recarga/${data.codigo}/resumen/generar`;
    await this.$axios.$post(url, data_x, {responseType: 'blob'}).then(response => {
      console.log(response);
      commit('SET_LOADING_GENERAR_PLANILLA_ACTION', false);
        commit('SET_ERRORS_CAMPOS_PLANILLA_SELECTED', {});
        if(response){
          const blob = new Blob([response], { type: 'application/vnd.ms-excel' });
          const url_2 = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url_2;
          a.download = 'planilla_resumen.xlsx';
          a.click();
          window.URL.revokeObjectURL(url_2);
          Notification.success(
            {type: "success", title: 'Archivo generado.'}
          );
        }else{
          Notification.error(
            {type: "error", message: 'Error al generar archivo.'}
          );
        }
    }).catch(error => {
      commit('SET_ERRORS_CAMPOS_PLANILLA_SELECTED', error.response.data.errors);
      commit('SET_LOADING_GENERAR_PLANILLA_ACTION', false);
      console.log(error);
    });
  },
  async getFuncionarios({commit, state}, codigo_recarga){
    try {
      commit('SET_LOADING_TABLA_RESUMEN', true);
      const url = `/api/admin/recargas/recarga/${codigo_recarga}/funcionarios?page=${state.pagination.current_page}`;
      await this.$axios.$get(url, {params:state.filtro}).then(response => {
        commit('SET_LOADING_TABLA_RESUMEN', false);
        console.log(response);
        if(response.status === 'Success'){
          commit('SET_FUNCIONARIOS', response.users);
          commit('SET_RECARGA', response.recarga);
          commit('SET_PAGINATION', response.pagination);
        }else{
          this.$router.push({name: 404});
        }
      }).catch(error => {
        commit('SET_LOADING_TABLA_RESUMEN', false);
        this.$router.push({name: 404});
      });
    } catch (error) {
      console.log(error);
    }
  },
  async changeBeneficioFuncionario({ commit }, data){
    commit('SET_LOADING_INDEX', true);
    const url = '/api/admin/recargas/recarga/funcionario/beneficio';
    await this.$axios.$post(url, data).then(response => {
      commit('SET_LOADING_INDEX', false);
      if(response.status === 'Success'){
        commit('SET_UPDATE_FUNCIONARIO', response.user);
        commit('SET_RECARGA', response.recarga);

        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_INDEX', false);
      console.log(error);
    });
  },
  async changeTurnoFuncionario({ commit }, data){
    commit('SET_LOADING_INDEX', true);
    const url = '/api/admin/recargas/recarga/funcionario/turno';
    await this.$axios.$post(url, data).then(response => {
      commit('SET_LOADING_INDEX', false);
      if(response.status === 'Success'){
        commit('SET_UPDATE_FUNCIONARIO', response.user);
        commit('SET_RECARGA', response.recarga);

        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_INDEX', false);
      console.log(error);
    });
  },
  async changeReemplazoFuncionario({ commit }, data){
    commit('SET_LOADING_INDEX', true);
    const url = '/api/admin/recargas/recarga/funcionario/reemplazo';
    await this.$axios.$post(url, data).then(response => {
      commit('SET_LOADING_INDEX', false);
      if(response.status === 'Success'){
        commit('SET_UPDATE_FUNCIONARIO', response.user);
        commit('SET_RECARGA', response.recarga);

        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_INDEX', false);
      console.log(error);
    });
  },
  async getDaysInDate({ commit }, data){
    commit('SET_LOADING_DAYS_IN_DATE', true);
    const url = '/api/admin/days-in-date';
    await this.$axios.$get(url, {
      params:data
    }).then(response => {
      commit('SET_LOADING_DAYS_IN_DATE', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_REAJUSTE_TOTAlES', response.totales);
        commit('SET_REAJUSTE_PRE_CALCULO', response.totales.new_esquema);
      }
    }).catch(error => {
      commit('SET_LOADING_DAYS_IN_DATE', false);
      console.log(error);
    });
  },
  async getMontoInDays({ commit }, data){
    commit('SET_LOADING_DAYS_IN_DATE', true);
    const url = '/api/admin/monto-in-days';
    await this.$axios.$get(url, {
      params:data
    }).then(response => {
      commit('SET_LOADING_DAYS_IN_DATE', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_REAJUSTE_MONTO_TOTAlES', response.totales);
        commit('SET_REAJUSTE_PRE_CALCULO', response.totales.new_esquema);
      }
    }).catch(error => {
      commit('SET_LOADING_DAYS_IN_DATE', false);
      console.log(error);
    });
  },
  async storeReajusteResumen({ commit}, data){
    commit('SET_LOADING_REAJUSTE', true);
    const url = '/api/admin/recargas/recarga/funcionario/reajuste';
    await this.$axios.$post(url, data).then(response => {
      commit('SET_LOADING_REAJUSTE', false);
      if(response.status === 'Success'){
        commit('SET_UPDATE_FUNCIONARIO', response.esquema);
        commit('SET_RECARGA', response.recarga);
        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
        commit('REFRESH_CAMPOS_REAJUSTE');
        commit('SET_MODAL_REAJUSTE', false);
      }
    }).catch(error => {
      commit('SET_LOADING_REAJUSTE', false);
      commit('SET_REAJUSTE_ERRORS', error.response.data.errors);
      console.log(error);
    });
  },
  async getFuncionariosNotRecarga({commit, state}, data){
    commit('SET_LOADING_SEARCH_FUNCIONARIO', true);
    const url = `/api/admin/recargas/recarga/${data.codigo}/not-funcionarios`;

    await this.$axios.$get(url, {params:data}).then(response => {
      console.log(response);
      commit('SET_LOADING_SEARCH_FUNCIONARIO', false);
      if(response.status === 'Success'){
        commit('SET_FUNCIONARIOS_NOT_RECARGA', response.funcionarios);
      }
    }).catch(error => {
      commit('SET_LOADING_SEARCH_FUNCIONARIO', false);
      console.log(error);
    });
  },
  async storeEsquemaManual({commit, state}, data){
    commit('SET_LOADING_ESQUEMA_MANUAL', true);
    const url = `/api/admin/recargas/recarga/funcionario/store-manual`;
    await this.$axios.$post(url, data).then(response => {
      console.log(response);
      commit('SET_LOADING_ESQUEMA_MANUAL', false);
      if(response.status === 'Success'){
        commit('SET_SQUEMA_MANUAL', response.esquema);
        commit('SET_RECARGA', response.recarga);
        commit('SET_INDEX_SELECTED_TABLE', 0);
        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
        commit('SET_CLOSE_MODAL_ADD_ESQUEMA');
        commit('NEW_ESQUEMA_FUNCIONARIO_RECARGAS', []);
        commit('SET_FUNCIONARIO_MANUAL_AUSENTISMOS', []);
        commit('SET_FUNCIONARIO_MANUAL_VIATICOS', []);
        commit('SET_FUNCIONARIO_MANUAL_ASISTENCIAS', []);
        commit('SET_FUNCIONARIO_MANUAL_ASIGNACIONES', []);
        commit('SET_FUNCIONARIO_MANUAL_CONTRATOS', []);
      }
    }).catch(error => {
      commit('SET_LOADING_ESQUEMA_MANUAL', false);
      console.log(error);
    });
  },
  async updateStatusMarcados({commit, dispatch}, data){
    console.log(data);
    commit('SET_LOADING_MARCADOS', true);
    const codigo_recarga = data.codigo;
    const url = `/api/admin/recargas/recarga/${codigo_recarga}/resumen/status-esquemas`;
    await this.$axios.$post(url, data).then(response => {
      console.log(response);
      commit('SET_LOADING_MARCADOS', false);
      if(response.status === 'Success'){
        dispatch('getFuncionarios', codigo_recarga);
        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
        commit('SET_MODAL_STATUS_MARCADOS', false);
        commit('SET_ESQUEMAS_CHECKED', []);
        commit('SET_CHECKED_ALL', false);
      }
    }).catch(error => {
      commit('SET_LOADING_MARCADOS', false);
      console.log(error);
    });
  },
  async deleteDataRecarga({ commit, state }, data){
    commit('LOADING_DELETE_DATA', true);
    const url = `/api/admin/recargas/recarga/${data.codigo_recarga}/resumen/delete/${data.modulo}`;

    await this.$axios.$post(url, state.filtro).then(response => {
      commit('LOADING_DELETE_DATA', false);
      console.log(response);
      if(response.status === 'Success'){
        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
        commit('SET_RECARGA', response.recarga);
        commit('SET_FUNCIONARIOS', response.users);
      }else{
        Notification.error(
          {type: "error", title: response.title, message: response.message}
        );
      }
    }).catch(error => {
      commit('LOADING_DELETE_DATA', false);
      console.log(error);
    });
  },
  async sendCartolas({ commit }, data){
    commit('LOADING_SEND_CARTOLA', true);
    const url = `/api/admin/recarga/${data}/emails/send`;

    await this.$axios.$post(url).then(response => {
      commit('LOADING_SEND_CARTOLA', false);
      console.log(response);
      if(response.status === 'Success'){
        Notification.success(
          {type: "success", title: response.title, message: response.message, duration: 0}
        );
      }else{
        Notification.error(
          {type: "error", title: response.title, message: response.message}
        );
      }
    }).catch(error => {
      commit('LOADING_SEND_CARTOLA', false);
      console.log(error);
    });
  },
  closeModalAddEsquema({commit}){
    commit('SET_MODAL_ADD_ESQUEMA', false);
    commit('NEW_ESQUEMA_FUNCIONARIO', '');
    commit('NEW_ESQUEMA_FUNCIONARIO_RECARGAS', []);
    commit('SET_FUNCIONARIO_MANUAL_AUSENTISMOS', []);
    commit('SET_FUNCIONARIO_MANUAL_VIATICOS', []);
    commit('SET_FUNCIONARIO_MANUAL_ASISTENCIAS', []);
    commit('SET_FUNCIONARIO_MANUAL_ASIGNACIONES', []);
    commit('SET_FUNCIONARIO_MANUAL_CONTRATOS', []);
  },
  async getRecargasAdicionales({ commit }, data){
    const url = `/api/admin/recargas/recarga/${data.codigo_recarga}/funcionario/${data.funcionario_id}/recargas-adicional`;

    await this.$axios.$get(url).then(response => {
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_RECARGAS_ADICIONAL', response.recargas);
      }
    }).catch(error => {
      console.log(error);
    });
  },
  async getDatosContractualesFuncionario({ commit }, data){
    console.log(data);
    const url = `/api/admin/recargas/recarga/${data.codigos_recarga}/funcionario/${data.funcionario_id}`;

    await this.$axios.$get(url).then(response => {
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_FUNCIONARIO_MANUAL_AUSENTISMOS', response.ausentismos);
        commit('SET_FUNCIONARIO_MANUAL_VIATICOS', response.viaticos);
        commit('SET_FUNCIONARIO_MANUAL_ASISTENCIAS', response.asistencias);
        commit('SET_FUNCIONARIO_MANUAL_ASIGNACIONES', response.asignaciones);
        commit('SET_FUNCIONARIO_MANUAL_CONTRATOS', response.contratos);
      }
    }).catch(error => {
      console.log(error);
    });
  },
  async deleteEsquema({ commit }, data){
    commit('SET_LOADING_DELETE_ESQUEMA_MANUAL', true);
    const url = `/api/admin/recargas/recarga/funcionario/${data}/delete`;
    await this.$axios.$delete(url).then(response => {
      console.log(response);
      commit('SET_LOADING_DELETE_ESQUEMA_MANUAL', false);
      if(response.status === 'Success'){
        commit('DELETE_ESQUEMA', data);
        commit('SET_RECARGA', response.recarga);
        Notification.success(
          {type: "success", title: response.title, message: response.message}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_DELETE_ESQUEMA_MANUAL', false);
      console.log(error);
    });
  }
};
