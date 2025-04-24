import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { FormBuilder, FormsModule } from "@angular/forms";
import { MatGridListModule } from "@angular/material/grid-list";
import { NbCardModule, NbChatModule, NbStatusService } from "@nebular/theme";
import { AuthService } from "../../../services/auth.service";
import { IUserAchievement } from "../../../interfaces";


@Component({
    selector: 'app-achievements-badges',
    standalone: true,
    imports: [CommonModule, FormsModule, MatGridListModule, NbChatModule, NbCardModule],
    templateUrl: './achievementsbadges.component.html',
    styleUrls: ['./achievementsbadges.component.scss'],
    providers: [NbStatusService],
})
export class AchievementsBadgesComponent {
    public fb: FormBuilder = inject(FormBuilder);
    public authService: AuthService = inject(AuthService);

    @Input() userAchievement: IUserAchievement[] = [];

    constructor() {}

}