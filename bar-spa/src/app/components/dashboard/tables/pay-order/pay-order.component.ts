import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { server } from '../../../../services/global';
import { OnInit } from '@angular/core';
import { format } from 'date-fns';
import { Cliente } from '../../../../models/cliente';
import { ClienteService } from '../../../../services/cliente.service';
import { Pedido } from '../../../../models/pedido';
import { PedidoService } from '../../../../services/pedido.service';
import { PedidoProductoService } from '../../../../services/pedidoProducto.service';
import { pedidoProducto } from '../../../../models/pedidoProducto';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Producto } from '../../../../models/producto';
import { Factura } from '../../../../models/factura';
import { DetalleFactura } from '../../../../models/detalleFactura';
import { FacturaService } from '../../../../services/factura.service';
import { detalleFacturaService } from '../../../../services/detalleFactura.service';
import { catchError, forkJoin, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { th } from 'date-fns/locale';


@Component({
  selector: 'app-pay-order',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule],
  templateUrl: './pay-order.component.html',
  styleUrl: './pay-order.component.css'
})

export class PayOrderComponent implements OnInit {


  public peticionDirectaImgUrl: string = server.url + "producto/getimage/";
  //fechaHoraActual: string;
  private intervalId: any;
  //public cliente: Cliente;
  public clientes: Cliente[];
  clientesCargados: boolean = false;
  public factura: Factura;
  public detalleFactura: DetalleFactura;
  public pedidoProducto: pedidoProducto;
  //public producto: Producto;
  public pedidos: Pedido[];
  //public pedido: Pedido;
  public pedidoProductos: any[] = [];


  private navigationSubscription: Subscription;



  constructor(
    private _PedidoService: PedidoService,
    private _PedidoProductoService: PedidoProductoService,
    private _ClienteService: ClienteService,
    private _FacturaService: FacturaService,
    private _DetalleFacturaService: detalleFacturaService,
    private router: Router


  ) {
    //this.fechaHoraActual = this.getFormattedDate(new Date());
    //this.cliente = new Cliente(1, 1, 1, "", "", "", "", "");
    this.clientes = [];
    this.clienteExistente = this.clientes;
    this.factura = new Factura(1, "", "", 1, 1, 1);
    this.detalleFactura = new DetalleFactura(1, 1, 1, 1);
    this.pedidoProducto = new pedidoProducto(1, 1, 1, "","");
   // this.producto = new Producto(1, 1, 1, "", "",1);
    this.pedidos = [];
    //this.pedido = new Pedido(1, 1, 1, 1, 1, new Date(), "")

    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url.includes('/dashboard/tables/pay-order')) {
          location.reload();
        }
      }
    });


  }
  ngOnInit(): void {
    //this.getOrdersFromStorage();
    //this.getClientes();
    //this.NumOrders();
    //this.getPedidosServicios();


    //this.intervalId = setInterval(() => {
     // this.fechaHoraActual = this.getFormattedDate(new Date());
   // }, 1000);
  }



  clienteExistente: Array<Cliente> = [];

/*

  // filterData(searchTerm: string) {
  //   this.filteredCliente = this.clientes.filter((item) => {
  //     return Object.values(item).some((value) => {
  //       return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
  //     });
  //   });
  // }


  // filterByCeldula(cedula: number) {
  //   if (cedula == 0) {
  //     this.filteredCliente = this.clientes;
  //   } else {
  //     this.filteredCliente = this.clientes.filter((cliente) => cliente.cedula == cedula);
  //     return ;
  //   }
  // }



  isDeleteModalOpen: boolean = false;
  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }
  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }


  getPedidoById(id: number): Observable<Pedido | undefined> {
    return this._PedidoService.getPedidoById(id).pipe(
      map((response: any) => response['data']),
      catchError((error: any) => {
        console.log(error);
        return of(undefined);
      })
    );
  }

  deleteOrder() {
    let pedidoStor = localStorage.getItem('pedido');
    if (pedidoStor) {
      let pedido: any = JSON.parse(pedidoStor);
      let idPedido = pedido.id;
      console.log(idPedido);

      this.getPedidoById(idPedido).pipe(
        switchMap((pedidoExistente: Pedido | undefined) => {
          if (pedidoExistente === undefined) {
            console.error("No se encontró el pedido");
            return of(null);
          }

          let pedidosProductosList = this.pedidoProductos.filter((pedidoProducto) => pedidoProducto.idPedido == idPedido);
          console.log(pedidosProductosList);

          if (pedidosProductosList.length > 0) {
            const deletePedidosProductos$ = pedidosProductosList.map(pedidoProducto =>
              this._PedidoProductoService.delete(pedidoProducto.id).pipe(
                catchError((error: any) => {
                  console.error("Error al eliminar el pedido producto", error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Error al eliminar el pedido producto',
                    showConfirmButton: false,
                    timer: 1500
                  });
                  return of(null);
                })
              )
            );

            return forkJoin(deletePedidosProductos$).pipe(
              switchMap(() => this._PedidoService.delete(idPedido)),
              catchError((error: any) => {
                console.error("Error al eliminar el pedido", error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error al eliminar el pedido',
                  showConfirmButton: false,
                  timer: 1500
                });
                return of(null);
              })
            );
          } else {
            return this._PedidoService.delete(idPedido).pipe(
              catchError((error: any) => {
                console.error("Error al eliminar el pedido", error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error al eliminar el pedido',
                  showConfirmButton: false,
                  timer: 1500
                });
                return of(null);
              })
            );
          }
        })
      ).subscribe({
        next: (response: any) => {
          if (response) {
            console.log(response);
            this.clearInfoFactura();
            Swal.fire({
              icon: 'success',
              title: 'Pedido eliminado correctamente',
              showConfirmButton: false,
              timer: 1000
            }).then(() => {
              this.router.navigate(['/dashboard/tables']);
            });
          }
        },
        error: (error: any) => {
          console.error("Error en el proceso de eliminación", error);
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar el pedido, no se encontró ningun pedido, cree uno nuevo',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }


  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Limpia el intervalo cuando el componente se destruya
    }
  }

  private getFormattedDate(date: Date): string {
    return format(date, 'PPpp'); // Formato de fecha y hora legible
  }

  getOrdersFromStorage() {

    return JSON.parse(localStorage.getItem('orders') || '[]');
  }
  NumOrders() {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.length;
  }

  CantidadProd() {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    let cant = orders.length;
    return cant;
  }

  getPedidoS() {
    return JSON.parse(localStorage.getItem('pedido') || '{}');
  }

  getOrdersTotal() {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    let total = 0;
    orders.forEach((order: any) => {
      total += order.precio;
    });
    return total;
  }


  getClientes() {
    this._ClienteService.getClientes().subscribe({
      next: (res: any) => {
        console.log(res);
        this.clientes = res['data'];
        console.log(this.clientes);


        this.clientesCargados = true;
      },
      error: (err) => {
        console.error("No se puede obtener los clientes", err);
        console.error(err);
      }
    });

  }

  // Optionally update the order status
  //.updateOrderStatus(idPedido);

  // updateOrderStatus(idPedido: number) {
  //   this._PedidoService.update(idPedido, { estado: 'Pagado' }).subscribe({
  //     next: (response: any) => {
  //       console.log(response);
  //       this.clearOdresFromStorage();
  //       this.clearOrderFromStorage();
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Pedido pagado correctamente',
  //         showConfirmButton: false,
  //         timer: 1000
  //       }).then(() => {
  //         this.router.navigate(['/dashboard/tables']);
  //       });
  //     },
  //     error: (error: any) => {
  //       console.error("Error al actualizar el estado del pedido", error);
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error al actualizar el estado del pedido',
  //         showConfirmButton: false,
  //         timer: 1500
  //       });
  //     }
  //   });
  // }


  submitOrder(form: NgForm) {
    // Primero, enviar los datos del cliente y esperar a que se complete
    this.clienteSubmit(form).then(() => {
      // Obtener el pedido del localStorage
      let pedidoStor = localStorage.getItem('pedido');
      if (pedidoStor) {
        let pedido: any = JSON.parse(pedidoStor);
        let idPedido = pedido.id;
        // Obtener el cliente del localStorage
        let clienteStor = localStorage.getItem('cliente');
        if (clienteStor) {
          let cliente = JSON.parse(clienteStor); // Convertir cadena JSON a objeto
          let idCliente = cliente.id;

          // Crear una nueva factura
          this.factura = {
            id: 1,
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toTimeString().split(' ')[0],
            total: 1,
            idCliente: idCliente,
            idPedido: idPedido
          };

          this._FacturaService.store(this.factura).subscribe({
            next: (response: any) => {

              let idFactura = response.factura.id; // Obtener el ID de la factura creada

              // Crear detalleFactura para cada producto en el pedido
              let products: any[] = this.getOrdersFromStorage();
              let successCount = 0; // Contador de detalles de factura guardados con éxito

              products.forEach((product: any) => {
                let cantProd = this.CantidadProd();
                this.detalleFactura = {
                  id: 1,
                  idFactura: idFactura,
                  idServicio: product.id,
                  subtotal: product.precio, // Calcular subtotal
                  cantidad: cantProd
                };

                this._DetalleFacturaService.store(this.detalleFactura).subscribe({
                  next: (detailResponse: any) => {
                    successCount++; // Incrementar el contador de éxitos
                    if (successCount === products.length) { // Si todos los detalles se guardan correctamente
                      this.clearInfoFactura();
                      Swal.fire({
                        icon: 'success',
                        title: 'Factura creada correctamente',
                        showConfirmButton: false,
                        timer: 1000
                      })
                    }
                  },
                  error: (error: any) => {
                    console.error("Error al guardar el detalle de la factura", error);
                    Swal.fire({
                      icon: 'error',
                      title: 'Error al guardar el detalle de la factura',
                      text: 'Por favor, inténtalo de nuevo más tarde.',
                      confirmButtonText: 'Aceptar'
                    });
                  }
                });

                // Crear la relación pedidoServicio
                this.pedidoServicio = {
                  id: 1,
                  idPedido: idPedido,
                  idServicio: product.id,
                  descripcion: "null"
                };

                this._PedidoServicioService.store(this.pedidoServicio).subscribe({
                  next: (response: any) => {
                    console.log("PedidoServicio guardado con éxito");
                  },
                  error: (error: any) => {
                    console.error("Error al guardar el pedidoServicio", error);
                    Swal.fire({
                      icon: 'error',
                      title: 'Error al guardar el pedidoServicio',
                      text: 'Por favor, inténtalo de nuevo más tarde.',
                      confirmButtonText: 'Aceptar'
                    })
                  }
                });
              });

              this._PedidoService.getPedidoById(idPedido).subscribe({
                next: (pedidoResponse: any) => {
                    let pedido = pedidoResponse.data;
                    pedido.estado = 'pagado';
                    console.log(pedido)
                    this._PedidoService.update(pedido).subscribe({
                        next: (updateResponse: any) => {
                            console.log("Pedido actualizado a pagado");
                            this.router.navigate(['/dashboard/tables'])
                        },
                        error: (error: any) => {
                            console.error("Error al actualizar el pedido", error);
                        }
                    });
                },
                error: (error: any) => {
                    console.error("Error al obtener el pedido por ID", error);
                }
            });


            },
            error: (error: any) => {
              console.error("Error al guardar la factura", error);
              Swal.fire({
                icon: 'error',
                title: 'Error al guardar la factura',
                text: 'Por favor, inténtalo de nuevo más tarde.',
                confirmButtonText: 'Aceptar'
              });
            }
          });
        } else {
          console.error("No se pudo obtener el cliente");
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el cliente. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'Aceptar'
          });
        }
      } else {
        console.error("No se pudo obtener el pedido");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener el pedido. Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  // Ajustar clienteSubmit para que devuelva una promes

  clienteSubmit(createForm: NgForm): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const cedulaCliente = this.cliente.cedula;
      this._ClienteService.getClientes().subscribe({
        next: (res) => {
          this.clientes = res['data'];
          const clienteExistente = this.clientes.find((cliente: Cliente) => cliente.cedula === cedulaCliente);

          if (clienteExistente) {
            localStorage.setItem('cliente', JSON.stringify(clienteExistente));
            createForm.reset();
            resolve();
          } else {
            this._ClienteService.store(this.cliente).subscribe({
              next: (res: any) => {
                localStorage.setItem('cliente', JSON.stringify(res['data']));
                createForm.reset();
                resolve();
              },
              error: (err: any) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al guardar el cliente',
                  text: 'Hubo un problema al intentar guardar la información del cliente. Por favor, inténtalo de nuevo más tarde.',
                  confirmButtonText: 'Aceptar'
                });
                reject(err);
              }
            });
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener los clientes',
            text: 'Hubo un problema al intentar obtener la lista de clientes. Por favor, inténtalo de nuevo más tarde.',
            confirmButtonText: 'Aceptar'
          });
          reject(err);
        }
      });
    });
  }


  clearInfoFactura() {
    this.clearOdresFromStorage();
    this.clearOrderFromStorage();
    localStorage.removeItem('cliente');

  }


  clearOdresFromStorage() {
    localStorage.removeItem('orders');
  }
  clearOrderFromStorage() {
    localStorage.removeItem('pedido');
  }

  getPedidosProducto() {
    this._PedidoProductoService.getPedidoServicios().subscribe({
      next: (response: any) => {
        console.log("Productos pedidos", response);
        this.pedidoProductos = response["data"];
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
*/

}








