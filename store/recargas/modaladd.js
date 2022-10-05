export const state = () => ({
  open:false
});

export const mutations = {
  SET_OPEN(state, value){
    state.open = value;
  }
};

export const getters = {
  openModal(state){
    return state.open;
  }
};
