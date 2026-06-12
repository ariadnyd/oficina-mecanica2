import api from './api';

const veiculoServices = {
  // A função recebe um objeto "filtros" (que pode ter cpf ou cliente_id)
  getVeiculos: async (filtros = {}) => {
    try {
      // O axios é super inteligente: se você passa "params", ele monta a URL sozinho!
      // Ex: vira /veiculos/?cpf=123 ou /veiculos/?cliente_id=5
      const resposta = await api.get('veiculos/', { params: filtros });
      return resposta.data;
    } catch (erro) {
      console.error("Erro ao buscar veículos:", erro);
      throw erro;
    }
  }
};

export default veiculoServices;