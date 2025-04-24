import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IAchievement } from "../../../interfaces";

@Component({
    selector: 'app-achievement-list',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './achivements-list.component.html',
    styleUrls: ['./achivements-list.component.scss'],
})
export class AchievementListComponent {
    @Input() title: string = '';
    @Input() achievements: any[] = []; 
    
    @Output() callModalAction: EventEmitter<IAchievement> = new EventEmitter<IAchievement>(); 
    @Output() callDeleteAction: EventEmitter<IAchievement> = new EventEmitter<IAchievement>();

}
