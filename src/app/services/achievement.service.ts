import { inject, Injectable, signal } from "@angular/core";
import { IAchievement, ISearch } from "../interfaces";
import { BaseService } from "./base-service";
import { AlertService } from "./alert.service";

@Injectable({
    providedIn: 'root',
})
export class AchievementService extends BaseService<IAchievement> {
    protected override source: string = 'achievements';
    private achievementListSignal = signal<IAchievement[]>([]);

    get achievements$() {
        return this.achievementListSignal;
    }

    public search: ISearch = {
        page: 1,
        size: 5,
    };

    public totalItems: any = [];

    private alertService: AlertService = inject(AlertService);

    getAll(){
        this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
            next: (response : any) => {
                this.search = {...this.search, ...response.meta };
                this.totalItems = Array.from(
                    { length: this.search.totalPages ?? 0 },
                    (_, i) => i + 1
                );
                this.achievementListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('Error cargando los logros', err);
            }
        });
    }

    save(achievements: IAchievement) {
        this.add(achievements).subscribe({
            next: (resposne : any) => {
                this.alertService.displayAlert(
                    'success',
                    resposne.message,
                    'center',
                    'top',
                    ['success-snackbar']
                );
                    this.getAll();
            },
            error: (err : any ) => {
                this.alertService.displayAlert(
                    'error',
                    'Ocurrio un error al agregar el logro',
                    'center',
                    'top',
                    ['error-snackbar']
                );
                console.log('Error al agregar el logro', err);
            }
        });
    }

    update(achievement : IAchievement){
        this.editCustomSource(`${achievement.id}`, achievement).subscribe({
            next: (response : any) => {
                this.alertService.displayAlert(
                    'success',
                    response.message,
                    'center',
                    'top',
                    ['success-snackbar']
                );
                this.getAll();
            },
            error: (err : any) => {
                this.alertService.displayAlert(
                    'error',
                    'Ocurrio un error al actualizar el logro',
                    'center',
                    'top',
                    ['error-snackbar']
                );
                console.log('Error al actualizar el logro', err);
            }
        });
    }

    delete(achievement : IAchievement){
        this.delCustomSource(`${achievement.id}`).subscribe({
            next: (resposne : any) => {
                this.alertService.displayAlert(
                    'success',
                    resposne.message,
                    'center',
                    'top',
                    ['success-snackbar']
                );
                this.getAll();
            },
            error: (err : any) => {
                this.alertService.displayAlert(
                    'error',
                    'Ocurrio un error al eliminar el logro',
                    'center',
                    'top',
                    ['error-snackbar']
                );
                console.log('Error al eliminar el logro', err);
            }
        });
    }

    unlockAchievement(userId: string, achievementId: string){
        return this.addCustomSource(`${achievementId}/unlock`, { userId }).subscribe({
            next: (response: any) => {
                this.alertService.displayAlert(
                    'success',
                    'Logro Desbloqueado!',
                    'center',
                    'top',
                    ['success-snackbar']
                );
                this.getAll();
            },
            error: (err: any) => {
                this.alertService.displayAlert(
                    'error',
                    'Ocurrio un error al desbloquear el logro',
                    'center',
                    'top',
                    ['error-snackbar']
                );
                console.log('Error al desbloquear el logro', err);
            }
        });
    } 
}
