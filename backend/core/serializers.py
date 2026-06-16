from rest_framework import serializers
from .models import Insumos, Procedimento

class InsumosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insumos
        fields = '__all__'
        read_only_fields = ['is_active'] 

class ProcedimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Procedimento
        fields = ['id', 'nome', 'valor', 'tempo_medio', 'descricao', 'is_active']
        read_only_fields = ['is_active']