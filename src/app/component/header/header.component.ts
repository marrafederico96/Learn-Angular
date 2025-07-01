import { Component, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { UserInfoDTO } from '../../dto/UserInfoDTO';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private auth = inject(AuthService);
  isLoggedIn: Signal<boolean>;
  userInfo: Signal<UserInfoDTO | null>;

  constructor() {
    this.isLoggedIn = this.auth.isLoggedIn;
    this.userInfo = this.auth.userInfo;
    this.auth.initUserData();
  }

  logout(): void {
    this.auth.logout();
  }


}