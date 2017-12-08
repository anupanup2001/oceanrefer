import { Component, OnInit } from '@angular/core';
import { Referral } from './referral.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.css']
})
export class LeadComponent implements OnInit {
  referral: Referral = new Referral();
  alert_class: String;
  alert_message: String;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onRefer() {
    // Check authentication
    this.alert_class = '';
    this.http.post('/api/post_refer', this.referral).subscribe(
      data => {
        this.alert_class = 'alert-success';
        this.alert_message = 'Successfully referred';
        console.log(data);
      },
      error => {
        this.alert_class = 'alert-danger';
        this.alert_message = 'Failed to refer. Please try again';
        console.log(':(');
        console.log(error);
      }
    );
  }

}
