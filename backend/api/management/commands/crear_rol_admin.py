from django.core.management.base import BaseCommand
from api.models import Rol


class Command(BaseCommand):
    help = 'Crea el rol admin por defecto'

    def handle(self, *args, **kwargs):
        rol, created = Rol.objects.get_or_create(nombre='admin')
        if created:
            self.stdout.write(self.style.SUCCESS('Rol "admin" creado exitosamente.'))
        else:
            self.stdout.write('El rol "admin" ya existe.')
