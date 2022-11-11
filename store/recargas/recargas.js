import { Notification } from 'element-ui';
import { DateTime} from 'luxon';

export const state = () => ({
  open:false,
  openEdit:false,
  recargas: [],
  fullscreenloading:false,
  errors:{},
  form:{
    establecimiento_id:'',
    fecha:'',
    total_dias_habiles:'',
    monto_dia:''
  },
  recarga:{}
});

export const mutations = {
  //modal
  SET_OPEN(state, value){
    state.open = value;
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
  SET_FECHA(state, value){
    state.form.fecha = value;
  },
  SET_TOTAL_DIAS_HABILES(state, value){
    state.form.total_dias_habiles = value;
  },
  SET_MONTO_DIA(state, value){
    state.form.monto_dia = value;
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
      fecha:state.form.fecha != null ? state.form.fecha : null,
      anio:state.form.fecha != null ? parseInt(DateTime.fromISO(state.form.fecha).toFormat('yyyy')) : null,
      mes:state.form.fecha != null ? parseInt(DateTime.fromISO(state.form.fecha).toFormat('LL')) : null,
      total_dias_habiles:state.form.total_dias_habiles,
      monto_dia:state.form.monto_dia
    };
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

  async updateDatosPrincipales({commit, state}, id){
    try {
      commit('SET_LOADING', true);
      const url = `/api/admin/recargas/recarga/datos-principales/${id}`;
      const newValues = {
        total_dias_habiles:state.form.total_dias_habiles != '' ? state.form.total_dias_habiles  : state.recarga.total_dias_habiles,
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


