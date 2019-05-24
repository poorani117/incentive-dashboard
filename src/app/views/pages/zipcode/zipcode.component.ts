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

export interface ZipcodeElement {
	id: number;
	zip_code: number;
	county_id: number;
	created_at: string;
	created_by: number;
	deleted_at: number;
	deleted_by: string;
	updated_at: string;
	updated_by: string;
}

@Component({
	selector: 'kt-zipcode',
	templateUrl: './zipcode.component.html',
	styleUrls: ['./zipcode.component.scss']
})
export class ZipcodeComponent implements OnInit {
	zipcodeForm: FormGroup;
	submitted = false;
	counties: any;
	zipcodes: ZipcodeElement[];
	zipcodesLoaded: Promise<boolean>;
	countiesLoaded: Promise<boolean>;
	displayedColumns: string[] = [
		'select',
		'position',
		'Zipcode',
		'county',
		'actions'
	];
	dataSource: any;
	selection = new SelectionModel<ZipcodeElement>(true, []);
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		public pages: PagesService,
		private formBuilder: FormBuilder,
		public dialog: MatDialog
	) {}

	ngOnInit() {
		this.zipcodeForm = new FormGroup({
			zipcode: new FormControl(null),
			countyId: new FormControl(null)
		});

		this.zipcodeForm = this.formBuilder.group({
			zipcode: ['', Validators.required],
			countyId: ['', Validators.required]
		});
		this.getZipcodes();
		this.pages.getCounties().subscribe((response: any = {}) => {
			this.counties = response.data;
			this.countiesLoaded = Promise.resolve(true);
		});
	}

	addZipcode() {
		this.submitted = true;
		const controls = this.zipcodeForm.controls;
		/** check form */
		if (this.zipcodeForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		const zipcodeData = {
			zip_code: controls['zipcode'].value,
			county_id: controls['countyId'].value
		};
		this.pages
			.addZipcode(zipcodeData.zip_code, zipcodeData.county_id)
			.subscribe(data => {
				if (data) {
					console.log('yes');
					this.getZipcodes();
				} else {
					console.log('no');
				}
			});
	}

	openEditDialog(row?: ZipcodeElement): void {
		const dialogRef = this.dialog.open(EditDialog, {
			width: '500px',
			height: '250px',
			data: row
		});
			dialogRef.afterClosed().subscribe(result => {
			this.getZipcodes();

		});
	}

	getZipcodes() {
		this.pages.getZipcodes().subscribe((response: any) => {
			this.zipcodes = response.data.data;
			this.dataSource = new MatTableDataSource<ZipcodeElement>(
				this.zipcodes
			);
			this.dataSource.paginator = this.paginator;

			this.zipcodesLoaded = Promise.resolve(true);
		});
	}

	openDeleteDialog(row?: ZipcodeElement): void {
		let data = row;
		const dialogRef = this.dialog.open(DeleteDialog, {
			width: '500px',
			height: '200px',
			data: row
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getZipcodes();

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

	checkboxLabel(row?: ZipcodeElement): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${
			this.selection.isSelected(row) ? 'deselect' : 'select'
		} row ${row.id + 1}`;
	}
}

@Component({
	selector: 'edit-dialog',
	templateUrl: 'edit-dialog.html',
	styleUrls: ['./zipcode.component.scss']
})
export class EditDialog {
	constructor(
		public dialogRef: MatDialogRef<EditDialog>,
		@Inject(MAT_DIALOG_DATA) public data: ZipcodeElement,
		public pages: PagesService
	) {}

	editZipcode(data) {
		this.pages.editZipcodes(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'delete-dialog',
	templateUrl: 'delete-dialog.html',
	styleUrls: ['./zipcode.component.scss']
})
export class DeleteDialog {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	dataSource = new MatTableDataSource<ZipcodeElement>(this.pages.zipcodes);
	constructor(
		public dialogRef: MatDialogRef<DeleteDialog>,
		@Inject(MAT_DIALOG_DATA) public data: ZipcodeElement,
		public pages: PagesService
	) {}

	deleteZipcode(data) {
		console.log(this.dataSource.data);
		this.pages.deleteZipcode(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
