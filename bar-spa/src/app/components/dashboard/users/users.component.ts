import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { server } from '../../../services/global';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  public user: User;
  private status: number;
  public userLists: User[];
  public fileSelected: any;
  public previsualizacion: string = "";


  constructor(
    private _userService: UserService,
    private _router: Router,
    private sanitizer: DomSanitizer



  ) {
    this.user = new User(1, "", "", "", "",);
    this.status = -1;
    this.userLists = [];
    this.filteredUser = this.userLists;

  }

  ngOnInit(): void {

    this.getUsers();
    this.visibleData();
    this.pageNumbers();
    // debugger;
  }




  isEditModalOpen: boolean = false;
  usertToEdit: User | null = null;

  cancelEdit() {
    this.isEditModalOpen = false;
    this.usertToEdit = null;
  }

  onEdit(form: any) {
    this.usertToEdit = form;
    if (this.usertToEdit) {
      this.isEditModalOpen = true;
      this.user = this.usertToEdit;
    }

  }

  onsubmitEdit() {
    if (this.usertToEdit) {
      if (this.user) {
        this._userService.update(this.user).subscribe({
          next: (response: any) => {
            this.getUsers();
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'El usuario se ha actualizado correctamente.'
            });
          },
          error: (error: any) => {
            console.error("Error al actualizar el usuario", error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al actualizar el usuario. Por favor, inténtalo de nuevo.'
            });
          }
        });
      }
    } else {
      console.error("No se ha seleccionado ningún usuario para actualizar");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha seleccionado ningún usuario para actualizar. Por favor, selecciona un producto.'
      });
    }
  }

  isCrudModalOpen: boolean = false;

  closeCrudModal() {
    this.isCrudModalOpen = false;
  }


  isDeleteModalOpen: boolean = false;
  selectedUserId: number | null = null;

  openDeleteConfirmation(userId: number) {
    this.isDeleteModalOpen = true;
    this.selectedUserId = userId;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedUserId = null;
  }


  confirmDelete() {
    console.log("ConfirmDelete llamado");

    if (this.selectedUserId !== null) {
      console.log(`Eliminando usuario con ID: ${this.selectedUserId}`);

      this._userService.delete(this.selectedUserId).subscribe({
        next: (response: any) => {
          console.log("Producto usuario con éxito:", response);
          this.getUsers();
          // Mostrar el SweetAlert después de que la eliminación sea exitosa
          Swal.fire({
            icon: 'success',
            title: 'usuario eliminado',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.closeDeleteModal();
          });

        },
        error: (error: any) => {
          console.error("Error al eliminar el usuario", error);

          // Opcional: Mostrar una alerta en caso de error
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar el usuario',
            text: 'No se pudo eliminar el usuario. Inténtalo de nuevo.',
            showConfirmButton: true
          });
        }
      });
    } else {
      console.error("No se ha seleccionado ningún usuario para eliminar");

      // Opcional: Manejar el caso donde no hay un producto seleccionado
      Swal.fire({
        icon: 'error',
        title: 'Ningún usuario seleccionado',
        text: 'Por favor selecciona un usuario para eliminar.',
        showConfirmButton: true
      });
    }
  }

  isShowModalOpen: boolean = false;

  openShowModal(userId: number) {
    this.isShowModalOpen = true;
    this.selectedUserId = userId;
    this._userService.getUser(userId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.user = response.data;
      },
      error: (error: any) => {
        console.error("Error al obtener el usuario", error);
      }
    });
  }

  closeShowModal() {
    this.isShowModalOpen = false;
    this.selectedUserId = null;
  }

  onSubmit(form: any) {
  debugger;
  // Crear una copia simple del objeto para evitar referencias circulares
  const userPayload = { ...this.user };

  this._userService.register(userPayload).subscribe({
    next: (response: any) => {
      if (response.status == 201) {
        form.reset();
        this.changeStatus(0);
        this.getUsers();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El usuario se ha registrado correctamente.',
        });
      } else {
        this.changeStatus(1);
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Hubo un problema al registrar el usuario. Por favor, inténtalo de nuevo.',
        });
      }
    },
    error: (error: any) => {
      this.changeStatus(2);
      console.error("Error al registrar el usuario", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo.',
      });
    },
  });
}


  getUsers() {
    this._userService.getUsers().subscribe({
      next: (response: any) => {
        console.log(response);
        this.userLists = response.data;
        // Asegúrate de que estás accediendo a 'data' en la respuesta
        this.filteredUser = this.userLists;
        this.visibleData();
      },
      error: (error: any) => {
        console.error("Error al obtener los Usuarios", error);
      }
    });
  };

  changeStatus(st: number) {
    this.status = st;
    let countdown = timer(3000);
    countdown.subscribe(() => {
      this.status = -1;
    });
  }
  isDropdownOpen: boolean[] = [];

  toggleDropdown(index: number) {
    this.isDropdownOpen[index] = !this.isDropdownOpen[index];
  }

  currentPage: number = 1;
  pageSize: number = 10;
  filteredUser: Array<User> = [];

  visibleData() {
    let start = (this.currentPage - 1) * this.pageSize;
    let end = start + this.pageSize;
    return this.filteredUser.slice(start, end);
  }

  nextPage() {
    this.currentPage++;
    this.visibleData();
  }

  previousPage() {
    this.currentPage--;
    this.visibleData();
  }

  pageNumbers() {
    let totalPage = Math.ceil(this.userLists.length / this.pageSize);
    let pageNumArray = new Array(totalPage);
    return pageNumArray;

  }

  filterData(searchTerm: string) {
    this.filteredUser = this.userLists.filter((item) => {
      return Object.values(item).some((value) => {
        return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

  }

  goToPage(page: number) {
    this.currentPage = page;
    this.visibleData();
  }


}
