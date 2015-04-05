from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    # Examples:
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', 'main.views.game', name='game'),
    url(r'^admin/', include(admin.site.urls)),
]
