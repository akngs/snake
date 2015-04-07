# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_auto_20150407_0825'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='highscore',
            name='rank',
        ),
        migrations.AlterField(
            model_name='highscore',
            name='score',
            field=models.IntegerField(verbose_name=b'score', db_index=True),
        ),
    ]
