from django.conf.urls import *

urlpatterns = patterns('client_custom.views',
#	(r'^file/(?P<fn>\d+)/quotes/(?P<id>\d+)/print/german/$', 'quote_german'),
	(r'^accounting/hotels/$', 'hotels_banks'),
	url(r'^accounting/wire/new/$', 'new_wire'),
	url(r'^accounting/wire/(?P<id>\d+)/$', 'print_wire'),
	url(r'^accounting/wire/list/$', 'list_wires'),
	url(r'^accounting/wire/create/(?P<sup_kind>\w)/(?P<id>\d+)/$', 'create_wire'),
	url(r'^accounting/wire/create/(?P<sup_kind>\w)/(?P<id>\d+)/pay/$', 'pay_wire'),

	url(r'^test/$', 'test'),
	url(r'^file/(?P<fn>\d+)/quotes/(?P<id>\d+)/print/german/$', 'quote_german'),
	url(r'^file/(?P<fn>\d+)/quotes/(?P<id>\d+)/print/french/$', 'print_french_quote'),
)

