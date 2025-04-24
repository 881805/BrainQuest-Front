import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { IUser } from '../../../../interfaces';
import { LayoutService } from '../../../../services/layout.service';
import { MyAccountComponent } from '../../../my-account/my-account.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MyAccountComponent],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  public user?: IUser;
  public authService: AuthService = inject(AuthService);
  constructor(
    public router: Router,
    public layoutService: LayoutService,
  ) {}

  ngOnInit(): void {
    this.authService.getUserFromServer();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
