from django.contrib import admin
import models


class HighscoreAdmin(admin.ModelAdmin):
    list_filter = ('mode',)


admin.site.register(models.Highscore, HighscoreAdmin)
