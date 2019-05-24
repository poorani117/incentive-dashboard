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

export interface StateElement {
	id: number;
	name: string;
  country_id: number;
  short_name:string;
	created_at: string;
	created_by: number;
	deleted_at: number;
	deleted_by: string;
	updated_at: string;
  updated_by: string;
}

@Component({
  selector: 'kt-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {
  stateForm: FormGroup;
	submitted = false;
	countries: any;
	states: StateElement[];
	statesLoaded: Promise<boolean>;
	countriesLoaded: Promise<boolean>;
	displayedColumns: string[] = [
		'select',
		'position',
    'state',
    'stateShort',
		'countryId',
		'actions'
	];
	dataSource: any;
	selection = new SelectionModel<StateElement>(true, []);
	@ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public pages: PagesService,
		private formBuilder: FormBuilder,
		public dialog: MatDialog) { }

  ngOnInit() {
    this.stateForm = new FormGroup({
      state: new FormControl(null),
      stateShort: new FormControl(null),
			countryId: new FormControl(null)
		});

		this.stateForm = this.formBuilder.group({
      state: ['', Validators.required],
      stateShort: ['', Validators.required],
			countryId: ['', Validators.required]
    });
    this.getStates();
    this.pages.getCountries().subscribe((response: any = {}) => {
      this.countries = response.data.data;
			this.countriesLoaded = Promise.resolve(true);
		});
  }

  addState() {
		this.submitted = true;
		const controls = this.stateForm.controls;
		/** check form */
		if (this.stateForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		const stateData = {
			state: controls['state'].value,
      stateShort: controls['stateShort'].value,
      countryId: controls['countryId'].value
		};
		this.pages
			.addState(stateData.state, stateData.stateShort, stateData.countryId)
			.subscribe(data => {
				if (data) {
          this.getStates()
					console.log('yes');
				} else {
					console.log('no');
				}
			});
  }
  
  getStates() {
		this.pages.getStates().subscribe((response: any) => {
			this.states = response.data.data;
			this.dataSource = new MatTableDataSource<StateElement>(
				this.states
			);
			this.dataSource.paginator = this.paginator;

			this.statesLoaded = Promise.resolve(true);
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

	checkboxLabel(row?: StateElement): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${
			this.selection.isSelected(row) ? 'deselect' : 'select'
		} row ${row.id + 1}`;
  }

  openEditDialog(row?: StateElement): void {
		const dialogRef = this.dialog.open(EditStateDialog, {
			width: '500px',
			height: '350px',
			data: row
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getStates();

		});
  }
  
  openDeleteDialog(row?: StateElement): void {
		let data = row;
		const dialogRef = this.dialog.open(DeleteStateDialog, {
			width: '500px',
			height: '200px',
			data: row
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getStates();

		});
	}

}

@Component({
	selector: 'edit-state-dialog',
	templateUrl: 'edit-state-dialog.html',
	styleUrls: ['../zipcode/zipcode.component.scss']
})
export class EditStateDialog {
	constructor(
		public dialogRef: MatDialogRef<EditStateDialog>,
		@Inject(MAT_DIALOG_DATA) public data: StateElement,
		public pages: PagesService
	) {}

	editState(data) {
		this.pages.editState(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'delete-state-dialog',
	templateUrl: 'delete-state-dialog.html',
	styleUrls: ['../zipcode/zipcode.component.scss']
})
export class DeleteStateDialog {
	constructor(
		public dialogRef: MatDialogRef<DeleteStateDialog>,
		@Inject(MAT_DIALOG_DATA) public data: StateElement,
		public pages: PagesService
	) {}

	deleteState(data) {
		this.pages.deleteState(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
