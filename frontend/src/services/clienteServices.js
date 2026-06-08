import api from './api';

const clienteServices = {
  getClientes: async () => {
    try {
      const resposta = await api.get('clientes/');
      return resposta.data;
    } catch (erro) {
      console.error("Erro ao buscar clientes:", erro);
      return [];
    }
  },

  cadastrarCliente: async (dadosCliente) => {
    try {
      const resposta = await api.post('clientes/', dadosCliente);
      // Retorna exatamente a resposta do Django (que tem o campo "mensagem")
      return resposta.data; 
    } catch (erro) {
      // Se o erro veio do Django, nós repassamos os dados exatos do erro!
      if (erro.response && erro.response.data) {
        throw erro.response.data; 
      }
      throw erro; // Se for erro de internet/servidor fora do ar
    }
  }
};

export default clienteServices;