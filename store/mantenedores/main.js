import { Notification } from 'element-ui';
export const state = () => ({
  urls:[
    {query:'cargo', name:'Cargos', icon:'el-icon-s-operation'},
    {query:'unidad', name:'Unidades', icon:'el-icon-s-operation'},
    {query:'asignacion', name:'Proceso de asignación', icon:'el-icon-s-operation'}
  ],
  cargos:[],
  unidades:[],
  procesos:[],
  data:[],
  current_route_query:null,
  current_route_full_name:null,
  current_route_name:null,
  pagination: {
    total: 0,
    current_page: 0,
    per_page: 0,
    last_page: 0,
    from: 0,
    to: 0
  },
  offset: 3,
  loading_data:false,
  loading_data_show:false,
  filtro:{
    input:''
  },
  modal_add:false,
  modal_edit:false,
  loading_action:false,
  contractual:{
    cod_sirh:'',
    name:''
  },
  errors:{}
});

export const mutations = {
  SET_DATA(state, data){
    state.data = data;
  },
  SET_CURRENT_PAGE(state, value){
    state.pagination.current_page = value;
  },
  SET_PAGINATION(state, value){
    state.pagination = value;
  },
  SET_LOADING_DATA(state, value){
    state.loading_data = value;
  },
  SET_LOADING_DATA_SHOW(state, value){
    state.loading_data_show = value;
  },
  SET_FILTRO_INPUT(state, value){
    state.filtro.input = value;
  },
  SET_MODAL_ADD(state, value){
    state.modal_add = value;
  },
  SET_MODAL_EDIT(state, value){
    state.modal_edit = value;
  },
  SET_LOADING_ACTION(state, value){
    state.loading_action = value;
  },

  SET_CONTRACTUAL(state, value){
    state.contractual = value;
  },
  SET_CONTRACTUAL_COD_SIRH(state, value){
    state.contractual.cod_sirh = value;
  },
  SET_CONTRACTUAL_NAME(state, value){
    state.contractual.name = value;
  },
  SET_ERRORS(state, value){
    state.errors = value;
  },
  SET_NEW_CONTRACTUAL(state, value){
    state.data.unshift(value);
  },
  SET_REFRESH(state){
    state.contractual.cod_sirh = '';
    state.contractual.name = '';
    state.errors = {};
  },
  SET_UPDATE_DATA(state, value){
    const indice = state.data.findIndex(d => d.id === value.id);
    state.data.splice(indice, 1, value);
  },
};

export const getters = {
  urls(state){
    return state.urls;
  },
  data(state){
    return state.data;
  },
  pagination(state){
    return state.pagination;
  },
  offset(state){
    return state.offset;
  },
  loadingData(state){
    return state.loading_data;
  },
  loadingShow(state){
    return state.loading_data_show;
  },
  modalAdd(state){
    return state.modal_add;
  },
  modalEdit(state){
    return state.modal_edit;
  },
  loadingAction(state){
    return state.loading_action;
  },
  errors(state){
    return state.errors;
  }
};

export const actions = {
  async getDatoContractual({commit, state}, data){
    commit('SET_LOADING_DATA_SHOW', true);
    const url = `/api/admin/mantenedores/contractual`;
    const params = {
      tipo: data.tipo,
      id:data.id
    };

    await this.$axios.$get(url, {
      params:params
    }).then(response => {
      commit('SET_LOADING_DATA_SHOW', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_CONTRACTUAL', response.data);
      }
    }).catch(error => {
      commit('SET_LOADING_DATA_SHOW', false);
      console.log(error);
    });
  },
  async getDatosContractuales({commit, state}, data){
    commit('SET_LOADING_DATA', true);
    const url = `/api/admin/mantenedores/contractuales`;
    const params = {
      tipo: data.tipo,
      page:state.pagination.current_page,
      input:state.filtro.input
    };

    await this.$axios.$get(url, {
      params:params
    }).then(response => {
      commit('SET_LOADING_DATA', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_DATA', response.data);
        commit('SET_PAGINATION', response.pagination);
      }
    }).catch(error => {
      commit('SET_LOADING_DATA', false);
      console.log(error);
    });
  },
  async storeContractual({commit, state}, data){
    commit('SET_LOADING_ACTION', true);
    const url = `/api/admin/mantenedores/contractuales/${data}`;

    const values = {
      tipo:data,
      cod_sirh:state.contractual.cod_sirh,
      nombre:state.contractual.name
    };

    await this.$axios.$post(url, values).then(response => {
      commit('SET_LOADING_ACTION', false);
      console.log(response);
      if(response.status === 'Success'){
        commit('SET_NEW_CONTRACTUAL', response.data);
        commit('SET_REFRESH');
        commit('SET_MODAL_ADD', false);
        Notification.success(
          {type: "success", title: response.title}
        );
      }else{
        Notification.error(
          {type: "error", message: 'Error de servidor.'}
        );
      }
    }).catch(error => {
      commit('SET_LOADING_ACTION', false);
      commit('SET_ERRORS', error.response.data.errors);
      console.log(error);
    });
  },
  async updateContractual({commit, state}, data){
    commit('SET_LOADING_ACTION', true);
    const url = `/api/admin/mantenedores/contractuales/${data.id}/${data.tipo}`;

    const values = {
      id:data.id,
      tipo:data.tipo,
      cod_sirh:state.contractual.cod_sirh,
      nombre:state.contractual.name
    };

    await this.$axios.$put(url, values).then(response => {
      console.log(response);
      commit('SET_LOADING_ACTION', false);
      if(response.status === 'Success'){
        commit('SET_UPDATE_DATA', response.data);
        commit('SET_REFRESH');
        commit('SET_MODAL_EDIT', false);
        Notification.success(
          {type: "success", title: response.title}
        );
      }else{
        Notification.error(
          {type: "error", message: 'Error de servidor.'}
        );
      }
      this.$router.back();
    }).catch(error => {
      commit('SET_LOADING_ACTION', false);
      commit('SET_ERRORS', error.response.data.errors);
      console.log(error);
    });
  }
};
