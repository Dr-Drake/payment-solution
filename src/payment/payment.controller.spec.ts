import { Test, TestingModule } from '@nestjs/testing';
import { FundDto } from './dto/fund.dto';
import { TransferDto } from './dto/transfer.dto';
import { PAYMENT_SERVICE } from './interfaces/payment.interface';
import { FundResponse } from './interfaces/response/FundResponse';
import mockPaymentService from './mocks/payment.service.mock';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

describe('PaymentController', () => {
  let controller: PaymentController;

  let transferRequest: TransferDto = {
    amount: 100,
    account_to_credit: '0477890997',
    account_to_debit: '0577890937',
    pin: 1234
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        { provide: PAYMENT_SERVICE, useClass: PaymentService }
      ]
    })
    .overrideProvider(PAYMENT_SERVICE)
    .useValue(mockPaymentService)
    .compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  // All dependecies are in place
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should fund an account', async ()=>{
  //   expect( await controller.fundAccount(fundRequest, 'john.cain@mail.com'))
  //   .toEqual<FundResponse>({
  //     message: 'Account successfully funded',
  //     amount: fundRequest.amount,
  //     prevBalance: 100,
  //     balance: 100 + fundRequest.amount,
  //     transaction_ref: "REF123"
  //   })
  // });

  // it('should withdraw from account', async ()=>{
  //   expect( await controller.withdrawFromAccount(fundRequest, 'john.cain@mail.com'))
  //   .toEqual<FundResponse>({
  //     message: 'Withdrawal successful',
  //     amount: fundRequest.amount,
  //     prevBalance: 1000,
  //     balance: 1000 - fundRequest.amount,
  //     transaction_ref: "REF123"
  //   })
  // });

  // it('should transfer to another account', async ()=>{
  //   expect( await controller.transfer(transferRequest, 'john.cain@mail.com'))
  //   .toEqual<FundResponse>({
  //     message: 'Transfer successful',
  //     amount: transferRequest.amount,
  //     prevBalance: 100,
  //     balance: 100 - transferRequest.amount,
  //     transaction_ref: "REF123"
  //   })
  // });
});
