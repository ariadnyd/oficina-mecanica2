from rest_framework import serializers
from .models import Insumos
from .models import Procedimento

class InsumosSerializer(serializers.ModelSerializer):
  class Meta:
    model = Insumos
    fields = '__all__'

class ProcedimentoSerializer(serializers.ModelSerializer):
  class Meta:
    model = Procedimento
    fields = ['id', 'nome', 'valor', 'tempo_medio', 'descricao', 'is_active']
    read_only_fields = ['is_active']