import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy } from "@angular/core";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { AchievementsBadgesComponent } from "../../components/achivements/achivements/achievementsbadges.component";
import { ModalService } from "../../services/modal.service";
import { AuthService } from "../../services/auth.service";
import { AlertService } from "../../services/alert.service";
import { AchievementsBadgesService } from "../../services/achievementsBadges.service";

@Component({
    selector: "app-achievementsbadges",
    standalone: true,
    templateUrl: "./achievementsbadges.component.html",
    styleUrls: ["./achievementsbadges.component.scss"],
    imports: [
        CommonModule,
        PaginationComponent,
        ModalComponent,
        LoaderComponent,
        AchievementsBadgesComponent
    ]
})

export class AchievementBadgesComponent implements OnDestroy {

    public modalService: ModalService = inject(ModalService);
    public authService: AuthService = inject(AuthService);
    public achievementsBadgeService: AchievementsBadgesService = inject(AchievementsBadgesService);
    public alertService: AlertService = inject(AlertService);


    constructor(private achievementsBadgesService: AchievementsBadgesService) {
        this.achievementsBadgesService.getUserAchievements();
    }

    ngOnDestroy(): void {
        
    }


}

