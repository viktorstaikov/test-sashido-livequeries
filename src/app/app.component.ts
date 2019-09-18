import { Component, OnInit, NgZone } from '@angular/core';
import * as Parse from 'parse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'test-sashido-livequeries';

  createdNotifications = [];
  newNotifications = [];
  updatedNotifications = [];
  enteredNotifications = [];
  leftNotifications = [];

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
            this.newNotifications.push(e);
          });
        });
        subscription.on('update', e => {
          console.log('************ object update', e);
          this._ngZone.run(() => {
            this.updatedNotifications.push(e);
          });
        });
        subscription.on('enter', e => {
          console.log('************ object enter', e);
          this._ngZone.run(() => {
            this.enteredNotifications.push(e);
          });
        });
        subscription.on('leave', e => {
          console.log('************ object leave', e);
          this._ngZone.run(() => {
            this.leftNotifications.push(e);
          });
        });

        subscription.on('close', () => {
          console.log('************ subscription closed');
        });
      });
    });
  }

  create() {
    const user = Parse.User.current();

    const notification = new Parse.Object('Notifications');
    notification.set('text', new Date().toISOString());
    notification.relation('recipients').add(user);

    notification.save().then(r => {
      this._ngZone.run(() => {
        this.createdNotifications.push(r);
      });
    });
  }

  update() {
    const lastNotification = this.createdNotifications[this.createdNotifications.length - 1];
    if (!lastNotification) {
      return;
    }
    lastNotification.set('text', new Date().toISOString());
    lastNotification.save();
  }

  enter() {
    const lastNotification = this.createdNotifications[this.createdNotifications.length - 1];
    if (!lastNotification) {
      return;
    }

    const user = Parse.User.current();
    lastNotification.relation('recipients').add(user);
    lastNotification.save();
  }

  leave() {
    const lastNotification = this.createdNotifications[this.createdNotifications.length - 1];
    if (!lastNotification) {
      return;
    }

    const user = Parse.User.current();
    lastNotification.relation('recipients').remove(user);
    lastNotification.save();
  }
}
