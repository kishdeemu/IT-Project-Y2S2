import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { ConfirmService } from '../../../shared/confirm.service';
import { EquipmentService } from '../../../_services/equipment.service';
import { ToastrService } from 'ngx-toastr';
import { IEquipment } from '../../../_models/equipment.model';
import { EmployeeService } from '../../../../../service/employees.service';
import { Subscription } from 'rxjs';
import { ProjectsService } from '../../../_services/projects.service';
import { IProject } from '../../../_models/project.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css'],
})
export class NewProjectComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  employees: any[] = [];
  supervisors: any[] = [];

  @Output() listComponent = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Input() isUpdate: boolean = false;
  @Input() project: IProject;
  constructor(
    private fb: FormBuilder,
    private confirmService: ConfirmService,
    private empService: EmployeeService,
    private equipmentService: EquipmentService,
    private toastr: ToastrService,
    private projectService: ProjectsService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      _id: '',
      projectId: new FormControl('aaaa', Validators.required),
      name: new FormControl('aaaaa', Validators.required),
      location: new FormControl('aaaaaa', Validators.required),
      startDate: new FormControl('', Validators.required),
      duration: new FormControl('aaa', Validators.required),
      clientName: new FormControl('aaa', Validators.required),
      clientPhone: new FormControl('aaa', Validators.required),
      clientAddress: new FormControl('aa', Validators.required),
      supervisor: new FormControl('', Validators.required),
      consultant: new FormControl('', Validators.required),
      employees: new FormControl('', Validators.required),
    });
    this.getEmployees();

    if (this.project) {
      setTimeout(()=>{
        this.project.employees = this.project.employees.map((el) => el._id);
        this.project.supervisor = this.project.supervisor._id;
        this.project.consultant = this.project.consultant._id;
        
        this.form.patchValue(this.project);
        this.form.patchValue({
          startDate: this.datePipe.transform(this.project.startDate,"yyyy-MM-dd")
        })
        this.isUpdate = true;
      },200)
    } else {
      this.isUpdate = false;
    }
  }

  get validator() {
    return this.form.controls;
  }

  getEmployees() {
    this.projectService.getEmployees().subscribe((employees) => {
      console.log(employees);

      this.employees = employees['employees'] as [];
      this.supervisors = this.employees.filter(
        (element) => element.empDes == 'manager'
      ); //change this to the supervisor once data availabel
    });
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.toastr.warning('Please select/provide value for every field');
      return;
    }
    this.confirmService
      .confirm(
        `${this.isUpdate ? 'Update Project ? ' : 'Register a new Project ?'}`
      )
      .then(
        (confirm) => {
          let req = this.form.value;
          if (this.isUpdate) {
            this.updateProject(req);
          } else {
            console.log(req);

            this.addProject(req);
          }
        },
        (reject) => {}
      );
  }

  addProject(req) {
    this.projectService.store(req).subscribe(
      (res) => {
        console.log(res);
        this.listComponent.next(res);
        this.resetForm();
        this.toastr.success('Project Registered');
      },
      (err) => {
        console.log(err);
        this.toastr.error('Error');
      }
    );
  }

  updateProject(req) {
    this.projectService.update(req).subscribe(
      (res) => {
        console.log(res);
        this.resetForm();
        this.update.next(res['project']);
        this.toastr.success('Project Updated');
      },
      (err) => {
        console.log(err);
        this.toastr.error('Error');
      }
    );
  }

  resetForm() {
    this.form.reset();
    this.submitted = false;
  }

  resetAllocations() {
    this.form.patchValue({
      project: '',
      duration: '',
      startDate: '',
      person: '',
      remarks: '',
    });
  }
}
