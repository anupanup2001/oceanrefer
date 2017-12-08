import { Component, OnInit } from '@angular/core';
import { Referral } from './referral.model';
import { HttpClient } from '@angular/common/http';

declare var gapi: any;
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

  getMyReferrals() {
    const auth2 = gapi.auth2.getAuthInstance();
    
        if (auth2.isSignedIn.get()) {
          const profile = auth2.currentUser.get().getBasicProfile();
          this.http.post('/api/get_my_referrals',{referer_name: profile.getEmail()}).subscribe(
            data => {
              console.log(data);
            }
          );
        }
  }

  onRefer() {
    // Check authentication
    this.alert_class = '';
    const auth2 = gapi.auth2.getAuthInstance();

    if (auth2.isSignedIn.get()) {
      const profile = auth2.currentUser.get().getBasicProfile();
      console.log('ID: ' + profile.getId());
      console.log('Full Name: ' + profile.getName());
      console.log('Given Name: ' + profile.getGivenName());
      console.log('Family Name: ' + profile.getFamilyName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
      this.referral.referer = profile.getEmail();
    }

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
