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

export interface ValueElement {
	id: number;
	name: string;
	perfPayment: boolean;
	paymentBased: string;
	created_at: string;
	created_by: number;
	deleted_at: number;
	deleted_by: string;
	updated_at: string;
	updated_by: string;
}

@Component({
	selector: 'kt-value-type',
	templateUrl: './value-type.component.html',
	styleUrls: ['./value-type.component.scss']
})
export class ValueTypeComponent implements OnInit {
	valueForm: FormGroup;
	submitted = false;
	values: ValueElement[];
	valueLoaded: Promise<boolean>;
	displayedColumns: string[] = [
		'select',
		'position',
		'valueType',
		'perfPayment',
		'paymentBased',
		'actions'
	];
	dataSource: any;
	selection = new SelectionModel<ValueElement>(true, []);
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		public pages: PagesService,
		private formBuilder: FormBuilder,
		public dialog: MatDialog
	) {}

	ngOnInit() {
		this.valueForm = new FormGroup({
			value: new FormControl(null),
			perfPayment: new FormControl(null),
			payment: new FormControl(null)
		});

		this.valueForm = this.formBuilder.group({
			value: ['', Validators.required],
			perfPayment: ['', Validators.required],
			payment: ['', Validators.required]
		});
		this.getValueTypes();
	}

	addValueType() {
		this.submitted = true;
		const controls = this.valueForm.controls;
		/** check form */
		if (this.valueForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		const valueData = {
			value: controls['value'].value,
			perfPayment: controls['perfPayment'].value,
			payment: controls['payment'].value
		};
		this.pages
			.addValueType(
				valueData.value,
				valueData.perfPayment,
				valueData.payment
			)
			.subscribe(data => {
				if (data) {
					this.getValueTypes();
					console.log('yes');
				} else {
					console.log('no');
				}
			});
	}

	getValueTypes() {
		this.pages.getValueTypes().subscribe((response: any) => {
			this.values = response.data.data;
			this.dataSource = new MatTableDataSource<ValueElement>(this.values);
			this.dataSource.paginator = this.paginator;

			this.valueLoaded = Promise.resolve(true);
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

	checkboxLabel(row?: ValueElement): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${
			this.selection.isSelected(row) ? 'deselect' : 'select'
		} row ${row.id + 1}`;
	}

	openEditDialog(row?: ValueElement): void {
		const dialogRef = this.dialog.open(EditValueDialog, {
			width: '500px',
			height: '350px',
			data: row
		});
		dialogRef.afterClosed().subscribe(result => {
			this.getValueTypes();
		});
	}

	openDeleteDialog(row?: ValueElement): void {
		let data = row;
		const dialogRef = this.dialog.open(DeleteValueDialog, {
			width: '500px',
			height: '200px',
			data: row
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getValueTypes();
		});
	}
}

@Component({
	selector: 'edit-value-dialog',
	templateUrl: 'edit-value-dialog.html',
	styleUrls: ['../zipcode/zipcode.component.scss']
})
export class EditValueDialog {
	constructor(
		public dialogRef: MatDialogRef<EditValueDialog>,
		@Inject(MAT_DIALOG_DATA) public data: ValueElement,
		public pages: PagesService
	) {}

  editValueTypes(data) {
		this.pages.editValueType(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'delete-value-dialog',
	templateUrl: 'delete-value-dialog.html',
	styleUrls: ['../zipcode/zipcode.component.scss']
})
export class DeleteValueDialog {
	constructor(
		public dialogRef: MatDialogRef<DeleteValueDialog>,
		@Inject(MAT_DIALOG_DATA) public data: ValueElement,
		public pages: PagesService
	) {}

	deleteValueType(data) {
		this.pages.deleteValueType(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
