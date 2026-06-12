from rest_framework import serializers
from .models import Veiculo

class VeiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Veiculo
        fields = ['id', 'marca', 'modelo', 'tipo', 'cor', 'placa', 'cliente', 'ano']
        read_only_fields = ['id']