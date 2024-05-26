import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../auth.service';


interface VirtualMachine {
  name: string;
  vmId: number;
  status: string;
  maxmem: number;
}

@Component({
  selector: 'app-vm-view',
  templateUrl: './vm-view.component.html',
  styleUrls: ['./vm-view.component.css']
})
export class VmViewComponent implements OnInit {
  vms: VirtualMachine[] = [];
  selectedVM: VirtualMachine | null = null;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef  // Add ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listVMs();
  }

  listVMs(): void {
    this.authService.GetVms().then(vms => {
    
      this.vms = vms;
      console.log(vms)
      this.cdr.detectChanges();  // Manually trigger change detection
    }).catch(error => {
      console.error('Failed to fetch VMs', error);
    });
  }

  selectVM(vm: VirtualMachine): void {
    this.selectedVM = vm;
  }
}
