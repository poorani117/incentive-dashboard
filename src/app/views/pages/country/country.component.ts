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

export interface CountryElement {
	created_at: string;
	created_by: number;
	deleted_at: string;
	deleted_by: string;
	id: number;
	name: string;
	short_name: string;
	updated_at: string;
	updated_by: number;
}

@Component({
	selector: 'kt-country',
	templateUrl: './country.component.html',
	styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
	countryForm: FormGroup;
	submitted = false;
	countries: CountryElement[];
	countriesLoaded: Promise<boolean>;
	displayedColumns: string[] = [
		'select',
		'position',
		'country',
		'countryShort',
		'actions'
	];
	dataSource: any;
	selection = new SelectionModel<CountryElement>(true, []);
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		public pages: PagesService,
		private formBuilder: FormBuilder,
		public dialog: MatDialog
	) {}

	ngOnInit() {
		this.countryForm = new FormGroup({
			country: new FormControl(null),
			countryShort: new FormControl(null)
		});

		this.countryForm = this.formBuilder.group({
			country: ['', Validators.required],
			countryShort: ['', Validators.required]
		});

		this.getCountries();
	}

	addCountry() {
		this.submitted = true;
		const controls = this.countryForm.controls;
		/** check form */
		if (this.countryForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		const countryData = {
			country: controls['country'].value,
			countryShort: controls['countryShort'].value
		};
		this.pages
			.addCountry(countryData.country, countryData.countryShort)
			.subscribe(data => {
				if (data) {
					this.countryForm.reset();
					this.getCountries();
					console.log('yes');
				} else {
					console.log('no');
				}
			});
	}

	getCountries() {
		this.pages.getCountries().subscribe((response: any) => {
			console.log(response);
			this.countries = response.data.data;
			this.dataSource = new MatTableDataSource<CountryElement>(
				this.countries
			);
			this.dataSource.paginator = this.paginator;

			this.countriesLoaded = Promise.resolve(true);
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

	checkboxLabel(row?: CountryElement): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${
			this.selection.isSelected(row) ? 'deselect' : 'select'
		} row ${row.id + 1}`;
	}

	openEditDialog(row?: CountryElement): void {
		console.log(row);
		const dialogRef = this.dialog.open(EditCountryDialog, {
			width: '500px',
			height: '250px',
			data: row
		});
	}
	openDeleteDialog(row?: CountryElement): void {
		let data = row;
		const dialogRef = this.dialog.open(DeleteCountryDialog, {
			width: '500px',
			height: '200px',
			data: row
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getCountries();
		});
	}
}

@Component({
	selector: "edit-country-dialog",
	templateUrl: 'edit-country-dialog.html',
	styleUrls: ['../zipcode/zipcode.component.scss']
})
export class EditCountryDialog {
	constructor(
		public dialogRef: MatDialogRef<EditCountryDialog>,
		@Inject(MAT_DIALOG_DATA) public data: CountryElement,
		public pages: PagesService
	) {}

	editCountry(data) {
		this.pages.editCountry(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: "delete-country-dialog",
	templateUrl: 'delete-country-dialog.html',
	styleUrls: ['../zipcode/zipcode.component.scss']
})
export class DeleteCountryDialog {
	constructor(
		public dialogRef: MatDialogRef<DeleteCountryDialog>,
		@Inject(MAT_DIALOG_DATA) public data: CountryElement,
		public pages: PagesService
	) {}

	deleteCountry(data) {
		this.pages.deleteCountry(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
