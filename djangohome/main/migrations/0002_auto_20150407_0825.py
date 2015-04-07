# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='highscore',
            name='rank',
            field=models.IntegerField(unique=True, verbose_name=b'rank'),
        ),
        migrations.AlterUniqueTogether(
            name='highscore',
            unique_together=set([]),
        ),
    ]
