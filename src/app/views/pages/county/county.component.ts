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

export interface countyElement {
	id: number;
	name: string;
  state_id: number;
  short_name:string;
	created_at: string;
	created_by: number;
	deleted_at: number;
	deleted_by: string;
	updated_at: string;
  updated_by: string;
}

@Component({
  selector: 'kt-county',
  templateUrl: './county.component.html',
  styleUrls: ['./county.component.scss']
})
export class CountyComponent implements OnInit {
  countyForm: FormGroup;
	submitted = false;
	states: any;
	counties: countyElement[];
	statesLoaded: Promise<boolean>;
	countiesLoaded: Promise<boolean>;
	displayedColumns: string[] = [
		'select',
		'position',
    'county',
    'countyShort',
		'stateId',
		'actions'
	];
	dataSource: any;
	selection = new SelectionModel<countyElement>(true, []);
	@ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(		public pages: PagesService,
		private formBuilder: FormBuilder,
		public dialog: MatDialog) { }

  ngOnInit() {
    this.countyForm = new FormGroup({
      county: new FormControl(null),
      countyShort: new FormControl(null),
			stateId: new FormControl(null)
		});

		this.countyForm = this.formBuilder.group({
      county: ['', Validators.required],
      countyShort: ['', Validators.required],
			stateId: ['', Validators.required]
    });
    this.getCounties();
    this.pages.getStates().subscribe((response: any = {}) => {
      this.states = response.data.data;
			this.statesLoaded = Promise.resolve(true);
		});
  }

  addCounty() {
		this.submitted = true;
		const controls = this.countyForm.controls;
		/** check form */
		if (this.countyForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		const countyData = {
			county: controls['county'].value,
      countyShort: controls['countyShort'].value,
      stateId: controls['stateId'].value
		};
		this.pages
			.addCounty(countyData.county, countyData.countyShort, countyData.stateId)
			.subscribe(data => {
				if (data) {
          this.countyForm.reset();
          this.getCounties()
					console.log('yes');
				} else {
					console.log('no');
				}
			});
  }
  
  getCounties() {
		this.pages.getCounties().subscribe((response: any) => {
			this.counties = response.data.data;
			this.dataSource = new MatTableDataSource<countyElement>(
				this.counties
			);
			this.dataSource.paginator = this.paginator;

			this.countiesLoaded = Promise.resolve(true);
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

	checkboxLabel(row?: countyElement): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${
			this.selection.isSelected(row) ? 'deselect' : 'select'
		} row ${row.id + 1}`;
  }

  openEditDialog(row?: countyElement): void {
		const dialogRef = this.dialog.open(EditCountyDialog, {
			width: '500px',
			height: '350px',
			data: row
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getCounties();

		});
  }
  
  openDeleteDialog(row?: countyElement): void {
		let data = row;
		const dialogRef = this.dialog.open(DeleteCountyDialog, {
			width: '500px',
			height: '200px',
			data: row
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getCounties();

		});
	}

}

@Component({
	selector: 'edit-county-dialog',
	templateUrl: 'edit-county-dialog.html',
	styleUrls: ['../zipcode/zipcode.component.scss']
})
export class EditCountyDialog {
	constructor(
		public dialogRef: MatDialogRef<EditCountyDialog>,
		@Inject(MAT_DIALOG_DATA) public data: countyElement,
		public pages: PagesService
	) {}

	editCounty(data) {
		this.pages.editCounty(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'delete-county-dialog',
	templateUrl: 'delete-county-dialog.html',
	styleUrls: ['../zipcode/zipcode.component.scss']
})
export class DeleteCountyDialog {
	constructor(
		public dialogRef: MatDialogRef<DeleteCountyDialog>,
		@Inject(MAT_DIALOG_DATA) public data: countyElement,
		public pages: PagesService
	) {}

	deleteCounty(data) {
		this.pages.deleteCounty(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
