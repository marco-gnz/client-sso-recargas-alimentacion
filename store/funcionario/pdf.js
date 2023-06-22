export const actions = {
  openCartola({ commit}, data){
    const url = `${process.env.NUXT_ENV_BASE_URL}/funcionario/cartola/${data.uuid_esquema}`;
    window.open(url, '_blank');
  }
};
