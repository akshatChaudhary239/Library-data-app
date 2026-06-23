import * as paymentsRepo from './payments.repository';

export const recordPayment = async (libraryId: string, data: any) => {
  return paymentsRepo.createPayment(data);
};

export const getPayments = async (libraryId: string, query: any) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const filters = {
    studentId: query.studentId,
    month: query.month,
  };

  const { payments, total } = await paymentsRepo.getPayments(libraryId, filters, skip, limit);

  return {
    payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getPaymentById = async (id: string, libraryId: string) => {
  const payment = await paymentsRepo.getPaymentById(id, libraryId);
  if (!payment) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Payment not found' };
  }
  return payment;
};

export const updatePayment = async (id: string, libraryId: string, data: any) => {
  await getPaymentById(id, libraryId);
  return paymentsRepo.updatePayment(id, data);
};

export const deletePayment = async (id: string, libraryId: string) => {
  await getPaymentById(id, libraryId);
  return paymentsRepo.deletePayment(id);
};

export const getReceiptData = async (id: string, libraryId: string) => {
  const payment = await getPaymentById(id, libraryId);
  
  return {
    receiptNumber: payment.receiptNumber,
    date: payment.paymentDate,
    amount: payment.amount,
    method: payment.paymentMethod,
    monthCovered: payment.monthCovered,
    remarks: payment.remarks,
    student: {
      name: payment.student.name,
      phone: payment.student.phone,
    },
    library: {
      name: payment.student.library.name,
      address: payment.student.library.address,
      phone: payment.student.library.phone,
    }
  };
};
