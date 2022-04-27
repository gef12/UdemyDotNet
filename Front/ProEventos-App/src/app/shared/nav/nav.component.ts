import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  constructor(
    public accountService: AccountService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {}

  showMenu(): boolean {
    //console.log(this.router.url !== '/user/login');
    return this.router.url !== '/user/login';
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/Home');
  }
}
