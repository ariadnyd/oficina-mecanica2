from django.db import models
from veiculos.models import Veiculo
from core.models import Procedimento

class OrdemServico(models.Model):
    STATUS_CHOICES = [
        ('aberto', 'Em aberto'),
        ('finalizado', 'Finalizado'),
        ('cancelado', 'Cancelado'),
    ]
    veiculo = models.ForeignKey(Veiculo, on_delete=models.CASCADE, related_name='ordens_servico')
    procedimentos = models.ManyToManyField(Procedimento, blank=True)
    data_abertura = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='aberto',
        verbose_name="Status"
    )
    
    def __str__(self):
        return f"OS #{self.id} - {self.veiculo.placa} ({self.get_status_display()})"