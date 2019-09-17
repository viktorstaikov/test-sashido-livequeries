import { Component, OnInit, NgZone } from '@angular/core';
import * as Parse from 'parse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'test-sashido-livequeries';

  notifications = 0;

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    const config = {
      url: 'https://pg-app-84kguxeu8wz2issg0ahhhyz2kced5j.scalabl.cloud/1/',
      appId: 'xOD0XpSaPG5rx8EKZar1bpf5iDTRPQSNoXnbXrdW',
      jsKey: '4L1LUFOcnrLDoB2QXzcnNuc3pPbJRdiXnSPWXbNI',
      masterKey: 'fov3dnmiyun6f7vzz4nbcdzpguy9i0rv6d9rxugl'
    };
    const email = 'zoro@mail.bg';
    const password = 'zoro';

    Parse.initialize(config.appId, config.jsKey, config.appId);
    Parse.serverURL = config.url;

    Parse.User.logIn<Parse.User>(email, password).then(user => {
      const query = new Parse.Query('Notifications');
      query.equalTo('recipients', user);

      return query.subscribe().then(subscription => {
        subscription.on('open', () => {
          console.log('************ subscription opened');
        });
        subscription.on('create', e => {
          console.log('************ object created', e);
          this._ngZone.run(() => {
            this.notifications++;
          });
          alert('New Notification came - ' + JSON.stringify(e));
        });
        subscription.on('close', () => {
          console.log('************ subscription closed');
        });
      });
    });
  }
}
