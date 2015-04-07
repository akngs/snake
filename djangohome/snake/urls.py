from django.conf.urls import include, url
from django.contrib import admin

import main.views


urlpatterns = [
    # Examples:
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', main.views.game, name='game'),
    url(r'^highscores/', main.views.HighscoreView.as_view()),
    url(r'^admin/', include(admin.site.urls)),
]
