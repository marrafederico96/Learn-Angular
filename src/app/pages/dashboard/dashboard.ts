import { Component, inject, OnInit } from '@angular/core';
import { GroupDTO } from '../../dto/GroupDTO';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../service/group.service';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private formBuilder = inject(FormBuilder);
  private groupAuth = inject(GroupService);
  groupList: GroupDTO[] | null = null;
  groupForm!: FormGroup;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.createForm();
    this.groupAuth.getGroup().subscribe({
      next: (data) => {
        this.groupList = data;
      }
    });

  }

  createForm() {
    this.groupForm = this.formBuilder.group({
      groupName: ['', Validators.required],
      groupDescription: [''],
    })
  }

  onSubmit() {
    this.createGroup()
  }

  createGroup() {
    this.groupAuth.createGroup(this.groupForm.value).subscribe({
      next: () => {
        this.groupForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    })
  }
}
