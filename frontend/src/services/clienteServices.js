import api from './api';

const clienteServices = {
  // Função para buscar todos os clientes no Django (GET)
  getClientes: async () => {
    try {
      const resposta = await api.get('clientes/'); // Puxa da URL base + 'clientes/'
      return resposta.data;
    } catch (erro) {
      console.error("Erro ao buscar clientes:", erro);
      return [];
    }
  }
};

export default clienteServices;