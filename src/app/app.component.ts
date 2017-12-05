import { Component, NgZone } from '@angular/core';

declare var gapi: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentSelection = 'home';
  title = 'app';
  signed_in = false;
  user_email = 'None';
  user_name = 'None';
  constructor(private ngZone: NgZone) {
    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));
  }


  onSignIn(user: any) {
    this.signed_in = true;
    const profile = user.getBasicProfile();
    this.user_name = profile.getName();
    this.user_email = profile.getEmail();
  }

  logOut() {
    const auth2 = gapi.auth2.getAuthInstance();

    if (auth2.isSignedIn.get()) {
      const profile = auth2.currentUser.get().getBasicProfile();
      console.log('ID: ' + profile.getId());
      console.log('Full Name: ' + profile.getName());
      console.log('Given Name: ' + profile.getGivenName());
      console.log('Family Name: ' + profile.getFamilyName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
    }

    auth2.signOut().then(() => {
      console.log('User logged out');
      this.ngZone.run(() => this.signed_in = false);
    });
  }
}
