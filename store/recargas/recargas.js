import { Notification } from 'element-ui';
import { DateTime} from 'luxon';

export const state = () => ({
  open:false,
  openEdit:false,
  recargas: [],
  feriados:[],
  reglas:[],
  fullscreenloading:false,
  errors:{},
  form:{
    establecimiento_id:'',
    fecha_beneficio:'',
    fecha_calculo:'',
    monto_dia:''
  },
  recarga:{},
  modal_edit_regla:false,
  loading_regla:false,
  loading_edit_regla:false,
  regla:null,
  errors_regla:{},
  loading_edit_datos_principales:false,
  loading_delete_regla:false
});

export const mutations = {
  //modal
  SET_OPEN(state, value){
    state.open = value;
  },
  SET_FERIADOS(state, value){
    state.feriados = value;
  },
  SET_REGLAS(state, value){
    state.reglas = value;
  },

  SET_RECARGAS(state, recargas){
    state.recargas = recargas;
  },
  SET_RECARGA(state, recarga){
    state.recarga = recarga;
  },
  ADD_RECARGA(state, recarga){
    state.recargas.unshift(recarga);
  },
  SET_LOADING(state, value){
    state.fullscreenloading = value;
  },
  SET_ERRORS(state, value){
    state.errors = value;
  },
  SET_RECARGA_FIND(state, recarga){
    const indice = state.recargas.findIndex(r => r.id === recarga.id);
    state.recargas.splice(indice, 1, recarga);
  },
  REFRESH_CAMPOS(state){
    for(let key in state.form){
      state.form[key] = '';
    }
    state.errors = {};
  },

  //form
  SET_ESTABLECIMIENTO(state, value){
    state.form.establecimiento_id = value;
  },
  SET_FECHA_BENEFICIO(state, value){
    state.form.fecha_beneficio = value;
  },
  SET_FECHA_CALCULO(state, value){
    state.form.fecha_calculo = value;
  },
  SET_MONTO_DIA(state, value){
    state.form.monto_dia = value;
  },
  DELETE_FERIADO_IN_RECARGA(state, value){
    state.feriados = state.feriados.filter(f => f.id !== value);
  },
  DELETE_REGLA_IN_RECARGA(state, value){
    state.reglas = state.reglas.filter(r => r.id !== value);
  },

  SET_MODAL_EDIT_REGLA(state, value){
    state.modal_edit_regla = value;
  },
  SET_LOADING_REGLA(state, value){
    state.loading_regla = value;
  },
  SET_REGLA_ERRORS(state, value){
    state.errors_regla = value;
  },
  SET_REGLA(state, value){
    state.regla = value;
  },
  SET_REGLA_GRUPO(state, value){
    state.regla.grupo_id = value;
  },
  SET_REGLA_ACTIVE_TIPO_DIAS(state, value){
    state.regla.active_tipo_dias = value;
  },
  SET_REGLA_TIPO_DIAS(state, value){
    state.regla.tipo_dias = value;
  },
  SET_REGLA_TURNO(state, value){
    state.regla.turno_funcionario = value;
  },
  SET_REGLA_MERIDIANOS(state, value){
    state.regla.meridianos = value;
  },
  SET_REGLA_HORA_INICIO(state, value){
    state.regla.hora_inicio = value;
  },
  SET_REGLA_HORA_TERMINO(state, value){
    state.regla.hora_termino = value;
  },
  SET_LOADING_EDIT_REGLA(state, value){
    state.loading_edit_regla = value;
  },
  SET_UPDATE_REGLA(state, value){
    const indice = state.reglas.findIndex(r => r.id === value.id);
    state.reglas.splice(indice, 1, value);
  },
  SET_HORA_REGLA(state, value){
    let index                             = value.index;
    let atributo                          = value.atributo;
    let new_value                         = value.valor;
    state.regla.horarios[index][atributo] = new_value;
  },
  SET_LOADING_UPDATE_DATOS_PRINCIPALES(state, value){
    state.loading_edit_datos_principales = value;
  },
  SET_LOADING_DELETE_REGLA(state, value){
    state.loading_delete_regla = value;
  }
};

export const getters = {
  openModal(state){
    return state.open;
  },
  formRecarga(state){
    return state.form;
  },
  errors(state){
    return state.errors;
  },
  recargas(state){
    return state.recargas;
  },
  recarga(state){
    return state.recarga;
  },
  fullScreenLoading(state){
    return state.fullscreenloading;
  },
  feriados(state){
    return state.feriados;
  },
  reglas(state){
    return state.reglas;
  },
  loadingRegla(state){
    return state.loading_regla;
  },
  errorsRegla(state){
    return state.errors_regla;
  },
  regla(state){
    return state.regla;
  },
  loadingEditRegla(state){
    return state.loading_edit_regla;
  },
  loadingEditDatosPersonales(state){
    return state.loading_edit_datos_principales;
  },
  loadingDeleteRegla(state){
    return state.loading_delete_regla;
  }
};

export const actions = {
  async getRecargas({ commit }){
    const response = await this.$axios.$get('/api/admin/recargas/response');
    commit('SET_RECARGAS', response.data);
  },

  async storeRecarha({commit, state}){
    const data = {
      establecimiento_id:state.form.establecimiento_id,
      anio_beneficio:state.form.fecha_beneficio != null ? parseInt(DateTime.fromISO(state.form.fecha_beneficio).toFormat('yyyy')) : null,
      mes_beneficio:state.form.fecha_beneficio != null ? DateTime.fromISO(state.form.fecha_beneficio).toFormat('LL') : null,
      anio_calculo:state.form.fecha_calculo != null ? parseInt(DateTime.fromISO(state.form.fecha_calculo).toFormat('yyyy')) : null,
      mes_calculo:state.form.fecha_calculo != null ? DateTime.fromISO(state.form.fecha_calculo).toFormat('LL') : null,
      monto_dia:state.form.monto_dia
    };
    console.log(data);
    commit('SET_LOADING', true);
    const url   = `/api/admin/recargas/add`;
    await this.$axios.$post(url, data).then(response => {
      commit('SET_LOADING', false);

      if(response.status === 'Success'){
        commit('SET_OPEN', false);
        commit('ADD_RECARGA', response.data);
        Notification.success(
          {type: "success", title: response.title}
        );
        commit('REFRESH_CAMPOS');
      }
    }).catch(error => {
      commit('SET_ERRORS', error.response.data.errors);
      commit('SET_LOADING', false);
      console.log(error);
    });
  },

  async changeStatusRecarga({commit}, id){
    commit('SET_LOADING', true);
    const url = `/api/admin/recargas/recarga/status/${id}`;

    this.$axios.$put(url).then(response => {
      commit('SET_LOADING', false);
      if(response.status === 'Success'){
        commit('SET_RECARGA_FIND', response.data);
        Notification.success(
          {type: "success", title: response.title}
          );
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },

  async returnRecarga({commit}, codigo){
    try {
      commit('SET_LOADING', true);
      const url = `/api/admin/recargas/recarga/${codigo}`;

      await this.$axios.$get(url).then(response => {
        commit('SET_LOADING', false);
        if(response.status === 'Success'){
          commit('SET_RECARGA', response.data);
          commit('SET_FERIADOS', response.data.feriados);
          commit('SET_REGLAS', response.data.reglas);
        }else{
          this.$router.push({name: 404});
        }
      }).catch(error => {
        commit('SET_LOADING', false);
        this.$router.push({name: 404});
      });
    } catch (error) {
      console.log(error);
    }
  },
  async returnRecargaCargaDatos({commit}, codigo){
    try {
      commit('SET_LOADING', true);
      const url = `/api/admin/recargas/recarga/${codigo}/carga-datos`;

      await this.$axios.$get(url).then(response => {
        commit('SET_LOADING', false);
        if(response.status === 'Success'){
          commit('SET_RECARGA', response.data);
        }else{
          this.$router.push({name: 404});
        }
      }).catch(error => {
        commit('SET_LOADING', false);
        this.$router.push({name: 404});
      });
    } catch (error) {
      console.log(error);
    }
  },
  async deleteFeriadoInRecarga({commit}, data){
    commit('SET_LOADING', true);
    const url = `/api/admin/recargas/feriados/eliminar/${data.id_recarga}/${data.codigo_recarga}`;

    await this.$axios.put(url).then(response => {
      commit('SET_LOADING', false);
      console.log(response.data);
      if(response.data.status === 'Success'){
        commit('DELETE_FERIADO_IN_RECARGA', data.id_recarga);
        Notification.success(
          {type: "success", title: response.data.title}
        );
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },

  async deleteReglaInRecarga({commit}, data){
    commit('SET_LOADING_DELETE_REGLA', true);
    const url = `/api/admin/recargas/regla/eliminar/${data}`;

    await this.$axios.delete(url).then(response => {
      commit('SET_LOADING_DELETE_REGLA', false);
      console.log(response.data);
      if(response.data.status === 'Success'){
        commit('DELETE_REGLA_IN_RECARGA', data);
        Notification.success(
          {type: "success", title: response.data.title}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_DELETE_REGLA', false);
      console.log(error);
    });
  },

  async updateDatosPrincipales({commit, state}, id){
    try {
      commit('SET_LOADING_UPDATE_DATOS_PRINCIPALES', true);
      const url = `/api/admin/recargas/recarga/datos-principales/${id}`;
      const newValues = {
        monto_dia:state.form.monto_dia != '' ? state.form.monto_dia : state.recarga.monto_dia
      };

      await this.$axios.$put(url, newValues).then(response => {
        commit('SET_LOADING_UPDATE_DATOS_PRINCIPALES', false);
        if(response.status === 'Success'){
          commit('SET_RECARGA', response.data);
          Notification.success(
            {type: "success", title: response.title}
          );
          commit('REFRESH_CAMPOS');
        }else{
          this.$router.push({name: 404});
        }
      }).catch(error => {
        commit('REFRESH_CAMPOS');
        commit('SET_LOADING_UPDATE_DATOS_PRINCIPALES', false);
        commit('SET_ERRORS', error.response.data.errors);
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  },
  async getRegla({ commit, state }, id){
    commit('SET_LOADING_REGLA', true);
    const url = `/api/admin/recargas/regla/${id}`;
    await this.$axios.get(url).then(response => {
      commit('SET_LOADING_REGLA', false);
      console.log(response.data);
      if(response.data.status === 'Success'){
        commit('SET_REGLA', response.data.regla);
      }
    }).catch(error => {
      commit('SET_LOADING_REGLA', false);
      console.log(error);
    });
  },
  async updateRegla({ commit, state }, data){
    commit('SET_LOADING_EDIT_REGLA', true);
    const url = `/api/admin/recargas/regla/${data.id_regla}`;
    await this.$axios.$put(url, data).then(response => {
      commit('SET_LOADING_EDIT_REGLA', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_UPDATE_REGLA', response.regla);
        commit('SET_MODAL_EDIT_REGLA', false);
        this.$router.back();
        Notification.success(
          {type: "success", title: response.title}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_EDIT_REGLA', false);
      console.log(error);
    });
  }
};


