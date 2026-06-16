import api from './api'; 

const procedimentoServices = {
  getProcedimentos: async (filtros = {}) => {
    try {
      const resposta = await api.get('procedimentos/', { params: filtros });
      return resposta.data;
    } catch (erro) {
      console.error("Erro ao buscar procedimentos:", erro);
      throw erro;
    }
  },
  cadastrarProcedimento: async (dados) => {
    try {
      const resposta = await api.post('procedimentos/', dados);
      return resposta.data;
    } catch (erro) {
      if (erro.response && erro.response.data) throw erro.response.data;
      throw erro;
    }
  },
  editarProcedimento: async (id, dados) => {
    try {
      const resposta = await api.patch(`procedimentos/${id}/`, dados);
      return resposta.data;
    } catch (erro) {
      if (erro.response && erro.response.data) throw erro.response.data;
      throw erro;
    }
  },
  excluirProcedimento: async (id) => {
    try {
      const resposta = await api.delete(`procedimentos/${id}/`);
      return resposta.data;
    } catch (erro) {
      if (erro.response && erro.response.data) throw erro.response.data;
      throw erro;
    }
  }
};

export default procedimentoServices;