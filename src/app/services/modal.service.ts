import { inject, Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private ngbModalService: NgbModal = inject(NgbModal);

  displayModal(size: string, modalInstance: any) {
    const modalRef = this.ngbModalService.open(modalInstance, {
      size: size ? size : 'sm',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }

  closeAll() {
    this.ngbModalService.dismissAll();
  }

  open(title: string, message: string): void {
    // Aquí iría la lógica para abrir el modal
    console.log('Abrir modal con título:', title, 'y mensaje:', message);
  }
   
}