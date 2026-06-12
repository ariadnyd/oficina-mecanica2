from django.db import models

class Veiculo(models.Model):
    # Campos obrigatórios solicitados
    marca = models.CharField(max_length=50, verbose_name="Marca")
    modelo = models.CharField(max_length=100, verbose_name="Modelo")
    tipo = models.CharField(max_length=50, verbose_name="Tipo") # Ex: Carro, Moto, Caminhão
    cor = models.CharField(max_length=30, verbose_name="Cor")
    placa = models.CharField(max_length=10, unique=True, verbose_name="Placa")
    ano = models.IntegerField(verbose_name="Ano", null=True, blank=True)

    cliente = models.ForeignKey(
        'clientes.Cliente',          # Caminho no formato 'NomeDoApp.NomeDoModel'
        on_delete=models.CASCADE,    
        related_name='veiculos'      # Facilita buscar os veículos de um cliente depois
    )

    # Função para mostrar o nome bonito do veículo no painel de admin
    def __str__(self):
        return f"{self.marca} {self.modelo} ({self.placa}) - {self.ano}"
