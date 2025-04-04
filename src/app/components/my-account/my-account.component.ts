import { Component, HostListener, OnInit, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-my-account",
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit {
  public userName: string = '';
  private service = inject(AuthService);
  isOpen = false;
  authService: any;

  constructor(public router: Router) {
    let user = localStorage.getItem('auth_user');
    if(user) {
      this.userName = JSON.parse(user)?.name;
    } 
  }
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {}

  // Cierra el dropdown al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-container')) {
      this.closeDropdown();
    }
  }
}


