from django.db import models

# Create your models here.
class Insumos(models.Model):
  nome = models.CharField(max_length=255)
  marca = models.CharField(max_length=255)
  descricao = models.TextField()
  quantidade = models.FloatField(default=0.0)

  def __str__(self):
    return f"{self.nome} - {self.marca}"
  
class Procedimento(models.Model):
    # RN01 e RN06: Obrigatório e Único
    nome = models.CharField(max_length=255, unique=True, error_messages={
        'unique': "Já existe um procedimento cadastrado com este nome."
    })
    # RN01: Obrigatório
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    # RN01: Obrigatório. Deixei como CharField para você poder usar formatos como "02:00" ou "30 min"
    tempo_medio = models.CharField(max_length=50)
    # RN01: Obrigatório
    descricao = models.TextField()
    
    # RN05: Exclusão Lógica (Suspensão)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.nome