
from django.forms import *

from top.vouchers.models import *
from models import *


class SWireVouchersForm(ModelForm):
	
	reductionp = ChoiceField(label='',choices=(('0.011','1.1%'),('0.015','1.5%'),('0','0')))
#	reductionp = ChoiceField(label='',choices=(('0.015','1.6%'),('0','0')),initial='0.015')
	
	class Meta:
		model = AbstractVoucher
		fields = ()

class SWireTransferForm (ModelForm):
	class Meta:
		model = SWireTransfer
		fields = '__all__'

