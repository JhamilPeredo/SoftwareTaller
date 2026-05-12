from django.db import models


class Rol(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'roles'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Usuario(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=255)
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True, related_name='usuarios')
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'usuarios'
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
