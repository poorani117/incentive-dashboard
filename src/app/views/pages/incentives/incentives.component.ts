import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { PagesService } from '../pages.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import {
	FormBuilder,
	FormGroup,
	Validators,
	FormControl
} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface IncentiveElement{
  created_at: string;
  created_by: number;
  deleted_at: string;
  deleted_by: string;
  id: number;
  name: string;
  updated_at: string
  updated_by: number
}


@Component({
	selector: 'kt-incentives',
	templateUrl: './incentives.component.html',
	styleUrls: ['./incentives.component.scss']
})
export class IncentivesComponent implements OnInit {
	incentiveForm: FormGroup;
	submitted = false;
	incentives: IncentiveElement[];
	incentivesLoaded: Promise<boolean>;
	displayedColumns: string[] = ['select', 'position', 'Incentive', 'actions'];
	dataSource: any;
	selection = new SelectionModel<IncentiveElement>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
	constructor(
		public pages: PagesService,
		private formBuilder: FormBuilder,
		public dialog: MatDialog
	) {}

	ngOnInit() {
		this.incentiveForm = new FormGroup({
			incentive: new FormControl(null)
		});

		this.incentiveForm = this.formBuilder.group({
			incentive: ['', Validators.required]
		});

		this.getIncentives();
	}

	addIncentive() {
		this.submitted = true;
		const controls = this.incentiveForm.controls;
		/** check form */
		if (this.incentiveForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		const incentiveData = {
			incentive: controls['incentive'].value
		};
		this.pages.addIncentive(incentiveData.incentive).subscribe(data => {
			if (data) {
				this.incentiveForm.reset();
				console.log('yes');
			} else {
				console.log('no');
			}
		});
	}

	getIncentives() {
		this.pages.getIncentives().subscribe((response: any) => {
      console.log(response);
      this.incentives = response.data.data;
      this.dataSource = new MatTableDataSource<IncentiveElement>(
				this.incentives
			);
			this.dataSource.paginator = this.paginator;

			this.incentivesLoaded = Promise.resolve(true);
		});
  }
  
  isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}


	masterToggle() {
		this.isAllSelected()
			? this.selection.clear()
			: this.dataSource.data.forEach(row => this.selection.select(row));
	}

	checkboxLabel(row?: IncentiveElement): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${
			this.selection.isSelected(row) ? 'deselect' : 'select'
		} row ${row.id + 1}`;
  }


  openEditDialog(row?: IncentiveElement): void {
    console.log(row);
		const dialogRef = this.dialog.open(EditIncentiveDialog, {
			width: '500px',
			height: '250px',
			data: row
		});
	}
  openDeleteDialog(row?: IncentiveElement): void {
		let data = row;
		const dialogRef = this.dialog.open(DeleteIncentiveDialog, {
			width: '500px',
			height: '200px',
			data: row
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getIncentives();

		});
	}
}

@Component({
	selector: 'edit-dialog',
	templateUrl: 'edit-incentive-dialog.html',
	styleUrls: ['../zipcode/zipcode.component.scss']
})
export class EditIncentiveDialog {
	constructor(
		public dialogRef: MatDialogRef<EditIncentiveDialog>,
		@Inject(MAT_DIALOG_DATA) public data: IncentiveElement,
		public pages: PagesService
	) {}

	editIncentive(data) {
		this.pages.editIncentive(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'delete-incentive-dialog',
	templateUrl: 'delete-incentive-dialog.html',
	styleUrls: ['../zipcode/zipcode.component.scss']
})
export class DeleteIncentiveDialog {

	constructor(
		public dialogRef: MatDialogRef<DeleteIncentiveDialog>,
		@Inject(MAT_DIALOG_DATA) public data: IncentiveElement,
		public pages: PagesService
	) {}

	deleteIncentive(data) {
		this.pages.deleteIncentive(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
