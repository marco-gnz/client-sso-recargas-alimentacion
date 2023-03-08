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
  recarga:{}
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
    commit('SET_LOADING', true);
    const url = `/api/admin/recargas/regla/eliminar/${data}`;

    await this.$axios.delete(url).then(response => {
      commit('SET_LOADING', false);
      console.log(response.data);
      if(response.data.status === 'Success'){
        commit('DELETE_REGLA_IN_RECARGA', data);
        Notification.success(
          {type: "success", title: response.data.title}
        );
      }
    }).catch(error => {
      commit('SET_LOADING', false);
      console.log(error);
    });
  },

  async updateDatosPrincipales({commit, state}, id){
    try {
      commit('SET_LOADING', true);
      const url = `/api/admin/recargas/recarga/datos-principales/${id}`;
      const newValues = {
        monto_dia:state.form.monto_dia != '' ? state.form.monto_dia : state.recarga.monto_dia
      };

      await this.$axios.$put(url, newValues).then(response => {
        commit('SET_LOADING', false);
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
        commit('SET_LOADING', false);
        commit('SET_ERRORS', error.response.data.errors);
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  }
};


