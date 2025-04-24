import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { BaseService } from "./base-service";
import { IAchievement, ISearch, IUserAchievement } from "../interfaces";
import { AuthService } from "./auth.service";
import { AlertService } from "./alert.service";

@Injectable({
    providedIn: 'root'
})
export class AchievementsBadgesService extends BaseService<IAchievement> {

    private achievementsSignal = signal<IUserAchievement[]>([]);
    private availebleAchievementsSignal = signal<IAchievement[]>([]);
    private authService: AuthService = inject(AuthService);
    private alertService: AlertService = inject(AlertService);

    protected override source: string = 'achievements';

    get userAchievements$() : WritableSignal<IUserAchievement[]> {
        return this.achievementsSignal;
    }

    get availableAchievements$() : WritableSignal<IAchievement[]> {
        return this.availebleAchievementsSignal;
    }

    public search: ISearch = {
        page: 1,
        size: 10
    };

    public totalItems: any = [];

    constructor() {
        super();
    }

    assignInitialAchievements(userId : number) {
        this.addCustomSource(`assign-initial/${userId}`, {}).subscribe({
            next: (response: any)=> {
                this.alertService.displayAlert(
                    'Logros Asignados',
                    'Se han asignado los logros iniciales correctamente',
                    'center',
                    'top',
                    ['success-snackbar']
                    );
                    this.getUserAchievements(userId);
            },
            error: (err : any) => {
                this.alertService.displayAlert(
                    'Error',
                    'No se han podido asignar los logros iniciales',
                    'center',
                    'top',
                    ['error-snackbar']
                );
                console.error('Error', err);
            }
        });
    }

    getAllAvailableAchievements() {
        this.findAllWithParamsAndCustomSource('available').subscribe({
            next: (response: any) => {
                this.availebleAchievementsSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('Error obteniendo logros disponibles: ', err);
            }
        });
    }

    getUserAchievements(userId? : number) {
        const targetUserId = userId || this.authService.getUser()?.id;
        if(!targetUserId) return;

        this.findAllWithParamsAndCustomSource(`user/${targetUserId}`).subscribe({
            next: (response : any) => {
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from(
                    {length: this.search.totalPages ? this.search.totalPages : 0},
                    (_, i) => i + 1       
                );
                this.achievementsSignal.set(response.data);
            },
            error: (err : any) => {
                console.error('Error obteniendo logros del usuario: ', err);
            }
        });
    }

    updateAchievementProgress(achievement : IUserAchievement) {
        this.editCustomSource(`progress/${achievement.id}`, achievement).subscribe({
            next: (response : any) => {
                this.alertService.displayAlert(
                'Progreso actualizado',
                response.message,
                'center',
                'top',
                ['success-snackbar']
                );
                this.getUserAchievements();
            },
            error: (err : any) => {
                this.alertService.displayAlert(
                    'Error',
                    'No se ha podido actualizar el progreso del logro',
                    'center',
                    'top',
                    ['error-snackbar']
                );
                console.error('Error actualizando el logro: ', err);
            }
        });
    }
}