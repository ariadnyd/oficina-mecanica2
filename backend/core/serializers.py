from rest_framework import serializers
from .models import Insumos

class InsumosSerializer(serializers.ModelSerializer):
  class Meta:
    model = Insumos
    fields = '__all__'