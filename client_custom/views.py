
from django.http import HttpResponse, Http404
from django.contrib.auth.decorators import login_required
from django.core.context_processors import request
from django.shortcuts import render, get_object_or_404
from django.forms.models import inlineformset_factory,modelformset_factory

from top.main.models import *
from top.planning.models import PlannedOther 
from top.vouchers.models import *
from top.main import quotelib
from models import *
from forms import *
	
from top.suppliers.models import *

@login_required
def test(request): return render_to_response('test.html')

@login_required
def quote_german (request, fn, id):
    q = get_object_or_404(Quote,pk=id)
    hotels = quotelib.hotels(q)
    return render(request, 'file/quote/print_german.html',{
        'file': q.file,
        'quote': q,
        'hotels': hotels['hotels'],
        'others_sum': quotelib.others(q),
        'others_g': PlannedOther.objects.filter(file=q.file, isglobal=True,ispublished=True),
        'others_p': PlannedOther.objects.filter(file=q.file, isglobal=False,ispublished=True),
        'pricing_tbl': q.sum (False),
        'single_suppliment': hotels['ss'],
        'child_reduction': hotels['cr'],
        'third_reduction': hotels['tr'],
        'sites': quotelib.sites(q),
        'rests': quotelib.rests(q),
    })


@login_required
def print_french_quote (request, fn, id):
        q = get_object_or_404(Quote,pk=id)
        if q.ispublished: return HttpResponse(q.externalhtml)

        return render(request,'file/quote/print_french.html',quotelib.quote2external(q))

@login_required
def hotels_banks(request):
	from top.suppliers.models import Hotel,HotelChain
	return render(request, 'hotels_banks.html',{'hotels':Hotel.objects.filter(active=True)})

@login_required
def new_wire (request):
	suppliers = []
	for v in AbstractVoucher.objects.filter(paid=False,approved2=True):
		try:
			sup = v.child().plan.supplier
			if sup not in suppliers: suppliers.append(sup)
			try:
				if sup.chain not in suppliers: suppliers.append(sup.chain)
			except: pass
		except: pass
	suppliers.sort()

	return render(request, 'accounting/wire/new.html',{'suppliers': suppliers})

@login_required
def create_wire (request,sup_kind,id):
	vouchers = []
	for v in AbstractVoucher.objects.filter(paid=False,approved2=True):
		try:
			if sup_kind == 'h': 
				sup = get_object_or_404(Hotel,pk=id)
				if sup.id == v.child().plan.supplier.id: vouchers.append(v.id)
			if sup_kind == 'c': 
				sup = get_object_or_404(HotelChain,pk=id)
				if sup.id == v.child().plan.supplier.chain.id: vouchers.append(v.id)
		except: pass
	WireVoucherFormSet = modelformset_factory(AbstractVoucher,form=SWireVouchersForm,extra=0)
	formset = WireVoucherFormSet(queryset=AbstractVoucher.objects.filter(pk__in=vouchers))
	form = SWireTransferForm()
	return render(request, 'accounting/wire/create.html',{'sup':sup,'vouchers':vouchers,'form':form,'formset':formset})

@login_required
def pay_wire(request,sup_kind,id):
	from top.suppliers.models import Hotel as AbstractSupplier
	if sup_kind == 'h': sup = get_object_or_404(Hotel,pk=id)
	elif sup_kind == 'c': sup = get_object_or_404(HotelChain,pk=id)
	else: raise Http404
	res = '00'
	if request.method == "POST":
		SWireVoucherFormSet = modelformset_factory(AbstractVoucher,form=SWireVouchersForm,extra=0)
		formset = SWireVoucherFormSet(request.POST)
		form = SWireTransferForm(request.POST)
		res = '11'
		if form.is_valid() and formset.is_valid():
			res += '22'
			formset.save()
			wt = form.save(commit=False)
			if sup_kind == 'h': wt.supplier = sup
			elif sup_kind == 'c': wt.supplier2 = sup
			wt = form.save()
			for f in formset:
				v = f.instance
#				v.sub_total = f.instance.child().calc()
				v.reduction = float(v.sub_total) * float(f.cleaned_data['reductionp'])
				v.total = v.sub_total-v.reduction
				v.paid = True
				v.save()
				wt.vouchers.add(v)
			wt.save()
			wt.calc()
			return render(request, 'accounting/swire/pay.html',{'wt':wt})
#		print formset.errors
	return HttpResponse('An Error Accurd:'+res)

@login_required
def list_wires(request):
    return render(request, 'accounting/wire/list.html',{'wts':SWireTransfer.objects.all().order_by('-date')})

@login_required
def print_wire(request,id):
    wt = get_object_or_404(SWireTransfer,pk=id)
    return render(request, 'accounting/swire/pay.html',{'wt':wt})

