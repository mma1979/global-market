import {Component, HostListener, OnInit} from '@angular/core';
import {GlobalDataService} from './shared/services/global-data.service';
import {Actions, ofActionDispatched} from '@ngxs/store';
import {HelperService} from './shared/services/helper.service';
import {Logout} from './state-management/auth/auth-actions';
import {fromEvent} from 'rxjs';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public gdService: GlobalDataService,
              private cookieService: CookieService,
              private router: Router, private actions: Actions, public helperService: HelperService) {
  }

  ngOnInit(): void {
    window.onclose = (e) => {
      this.gdService.clearAllData().subscribe(() => {

      });
    };
    this.checkOnlineStatus();
    this.actions.pipe(ofActionDispatched(Logout)).subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  checkOnlineStatus = () => {
    this.helperService.onlineEvent = fromEvent(window, 'online');
    this.helperService.offlineEvent = fromEvent(window, 'offline');
    this.helperService.subscriptions.push(this.helperService.onlineEvent.subscribe(() => {
      this.helperService.setIsOnline(true);
    }));
    this.helperService.subscriptions.push(this.helperService.offlineEvent.subscribe(() => {
      this.helperService.setIsOnline(false);
      this.router.navigate(['/no-internet']);
    }));
  };


}
