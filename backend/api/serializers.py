from rest_framework import serializers
from .models import Rol, Usuario


class RolSerializer(serializers.ModelSerializer):
    total_usuarios = serializers.SerializerMethodField()

    class Meta:
        model = Rol
        fields = ['id', 'nombre', 'creado_en', 'total_usuarios']

    def get_total_usuarios(self, obj):
        return obj.usuarios.count()


class UsuarioSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'apellido', 'email', 'username', 'password', 'rol', 'rol_nombre', 'creado_en']

    def create(self, validated_data):
        # En producción usar hashing; aquí simple para demo
        return Usuario.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
