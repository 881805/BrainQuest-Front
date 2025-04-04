import { Component, Input } from "@angular/core";
import { ActivityCard } from "../../interfaces";
import { LucideAngularModule } from "lucide-angular/public-api";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-activities",
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: "./activities.component.html",
    styleUrls: ["./activities.component.css"],
})
export class ActivitiesComponent{
    @Input() activity!: ActivityCard
}
