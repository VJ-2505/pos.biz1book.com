import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import * as moment from "moment";

@Component({
  selector: 'app-pending-order',
  templateUrl: './pending-order.component.html',
  styleUrls: ['./pending-order.component.scss']
})
export class PendingOrderComponent implements OnInit {

  CompanyId: number = 3;
  orders: any;
  orderItems: any;
  transactions: any;
  data: any;
  orderid: any;
  total: any;
  smodel = ''
  Stores: any
  storeId: number = 0
  startdate: any;
  enddate: any;

  // ranges: any = {
  //   'Today': [moment(), moment()],
  //   'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  //   'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  //   'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  //   'This Month': [moment().startOf('month'), moment().endOf('month')],
  //   'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  // }
  // selected: any = {startDate: moment(), endDate: moment()};
  // invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  // isInvalidDate = (m: moment.Moment) => {
  //   return this.invalidDates.some(d => d.isSame(m, 'day'))
  // }

  constructor(private Auth: AuthService, private modalService: NgbModal) { }

  ngOnInit() {
    this.Getpendingorder()
    // this.getOrderItems()   
    // this.getTransaction()
    // this.startdate = moment().format('YYYY-MM-DD')
    // this.enddate = moment().format('YYYY-MM-DD')

  }

  Getpendingorder() {
    this.Auth.getpendingorder(this.CompanyId, this.storeId).subscribe(data => {
      this.orders = data["Orders"];
      console.log(this.orders)
    })
    this.getstores()


  }
  getOrderItems(OrderId, modalRef) {
    console.log(this.orderid)
    this.Auth.getOrderId(OrderId).subscribe(data => {
      this.orderItems = data["Orders"]
      console.log(this.orderItems)
      this.getTransaction(OrderId, modalRef)
    })
  }
  getTransaction(OrderId, modalRef) {
    this.Auth.getTransactionId(OrderId).subscribe(data => {
      this.transactions = data["Transactions"]
      console.log(this.transactions)
      this.openDetailpopup(modalRef)
    })

  }

  getstores() {
    this.Auth.getStores(this.CompanyId).subscribe(data => {
      this.Stores = data
      // console.log(data)
    })
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      map(term =>
        term === ''
          ? []
          : this.Stores
            .filter(v => v.Name.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10),
      ),
    )

  formatter = (x: { Name: string }) => x.Name

  selectedItem(store) {
    console.log(store)
    this.storeId = store.Id
  }

  openDetailpopup(contentdetail) {
    const modalRef = this.modalService
      .open(contentdetail, {
        ariaLabelledBy: "modal-basic-title",
        centered: true
      })
      .result.then(
        result => {
        },
        reason => {
        }
      );
  }

  // date(e) {
  //   // console.log(e);
  //   if (e && e.startDate && e.endDate) {
  //     this.startdate = e.startDate.format('YYYY-MM-DD')
  //     this.enddate = e.endDate.format('YYYY-MM-DD')
  //   }
  // }
  // focusAutocomplete() {
  //   var xPathResult = document.evaluate('//*[@id="maindiv"]/app-root/app-daywise-sales-rpt/div/div/div[2]/div/section/div[1]/div[1]/div/ng-autocomplete/div/div[1]/input', document, null, null, null);
  //   var element = null
  //   if (xPathResult) {
  //     element = xPathResult.iterateNext();
  //   }
  //   element.focus();
  // }


}
