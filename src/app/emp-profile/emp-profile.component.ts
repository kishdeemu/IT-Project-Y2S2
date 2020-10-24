import { Component, OnInit, OnDestroy } from '@angular/core';
import { Employees } from 'models/employees.model';
import { Subscription } from 'rxjs';
import { EmployeeService } from 'service/employees.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-emp-profile',
  templateUrl: './emp-profile.component.html',
  styleUrls: ['./emp-profile.component.css'],
})
export class EmpProfileComponent implements OnInit, OnDestroy {
  employees: Employees[] = [];
  private subscription: Subscription;
  nic: string;
  name: string;
  designation: string;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.nic = this.authService.getNic();
      console.log(this.nic);
      this.employees = this.employeeService.getEmployee();
      this.subscription = this.employeeService.employeesChanged.subscribe(
        (employees: Employees[]) => {
          this.employees = employees;
          for (let employee of this.employees) {
            if (employee.nic === this.nic) {
              this.name = employee.fullName;
              this.designation = employee.empDes;
            }
          }
        }
      );
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
