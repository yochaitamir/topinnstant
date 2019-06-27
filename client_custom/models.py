from django.db import models

class SWireTransfer (models.Model):
	date = models.DateTimeField (auto_now_add=True)
	supplier = models.ForeignKey('suppliers.Hotel',editable=False,blank=True,null=True)
	supplier2 = models.ForeignKey('suppliers.HotelChain',editable=False,blank=True,null=True)
	bank = models.ForeignKey('agency.BankAccount', verbose_name='Bank Account',default=0)
	vouchers = models.ManyToManyField('vouchers.AbstractVoucher',editable=False)
	currency = models.ForeignKey('lists.Currency', verbose_name='Currency', default=1)
	sub_total = models.FloatField(default=0.0,editable=False)
	tax_deduction = models.FloatField(default=0.0,editable=False)
	total = models.FloatField(default=0.0,editable=False)
#   amount_words = models.CharField('Amount in words', max_length=200)  
#   notes = models.TextField (null=True, blank=True)
	def __unicode__(self): return str(self.id)
#       return u'#%d - %s' % (self.id, str(self.bank))

#	old - not in use
#	def calc_tax(self):
#		try: self.tax_deduction = self.total*-self.sup().account_tax_at_source/100.0
#		except: self.tax_deduction = 0
#		self.save()

	def calc(self):
		self.sub_total = 0
		for v in self.vouchers.all():
##			v.total = v.child().calc()
##			v.save()
##			print v.total
##			self.total += v.child().calc()
			self.sub_total += v.total
		try: self.tax_deduction = self.sub_total*-self.sup().account_tax_at_source/100.0
		except: self.tax_deduction = 0
		self.total = self.sub_total + self.tax_deduction
		super(SWireTransfer,self).save()

	def sup(self):
		if self.supplier is None: return self.supplier2
		return self.supplier

