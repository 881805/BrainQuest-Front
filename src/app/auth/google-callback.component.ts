import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";


@Component({
    selector: 'app-google-callback',
    template: '<p>Redirigiendo...</p>'
})
export class GoogleCallbackComponent implements OnInit{

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) {}


    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const token = params['token'];
            const user = JSON.parse(params['user']);
            if(token && user){
                this.authService.handleGoogleCallback(token, user);
                this.router.navigate(['/app/dashboard']);
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

} 