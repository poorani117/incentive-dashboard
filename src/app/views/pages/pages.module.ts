// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// NgBootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Partials
import { PartialsModule } from '../partials/partials.module';
import { MaterialModule } from './material/material.module';
import { MatTableModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog'
// Pages
import { CoreModule } from '../../core/core.module';
import { MailModule } from './apps/mail/mail.module';
import { ECommerceModule } from './apps/e-commerce/e-commerce.module';
import { UserManagementModule } from './user-management/user-management.module';
import { MyPageComponent } from './my-page/my-page.component';
import { ZipcodeComponent } from './zipcode/zipcode.component';
import { CountyComponent } from './county/county.component';
import { EditCountyDialog } from './county/county.component';
import { DeleteCountyDialog } from './county/county.component'
import { CountryComponent } from './country/country.component';
import { EditCountryDialog } from './country/country.component';
import { DeleteCountryDialog  } from './country/country.component';
import { StateComponent } from './state/state.component';
import { EditStateDialog } from './state/state.component';
import { DeleteStateDialog } from './state/state.component';
import { EditDialog } from './zipcode/zipcode.component';
import { DeleteDialog } from './zipcode/zipcode.component';
import { EditIncentiveDialog } from './incentives/incentives.component';
import { DeleteIncentiveDialog } from './incentives/incentives.component';
import { IncentivesComponent } from './incentives/incentives.component';
import { DealTypeComponent } from './deal-type/deal-type.component';
import { EditDealDialog} from './deal-type/deal-type.component';
import { DeleteDealDialog  } from './deal-type/deal-type.component';
import { ValueTypeComponent } from './value-type/value-type.component';
import { EditValueDialog } from './value-type/value-type.component';
import { DeleteValueDialog } from './value-type/value-type.component';

@NgModule({
	declarations: [MyPageComponent, ZipcodeComponent, CountyComponent, CountryComponent, StateComponent, EditDialog,DeleteDialog,EditStateDialog ,DeleteValueDialog,EditValueDialog,DeleteDealDialog,EditDealDialog,DeleteCountryDialog,EditCountryDialog,DeleteStateDialog,EditIncentiveDialog,DeleteIncentiveDialog,EditCountyDialog ,DeleteCountyDialog, IncentivesComponent, DealTypeComponent, ValueTypeComponent],
	exports: [FormsModule, ReactiveFormsModule,EditDialog, DeleteDialog, EditIncentiveDialog, DeleteIncentiveDialog, EditCountyDialog,DeleteCountyDialog,EditValueDialog,DeleteDealDialog,EditDealDialog,DeleteCountryDialog,EditCountryDialog,DeleteStateDialog,EditStateDialog  ],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		NgbModule,
		CoreModule,
		MaterialModule,
		MatTableModule,
		MatCheckboxModule,
		MatPaginatorModule,
		MatDialogModule,
		MatIconModule,
		PartialsModule,
		MailModule,
		ECommerceModule,
		UserManagementModule,
		ReactiveFormsModule
	],
	entryComponents: [EditDialog, DeleteDialog, EditIncentiveDialog, DeleteIncentiveDialog, EditCountyDialog, DeleteCountyDialog,EditCountryDialog ,EditDealDialog,DeleteValueDialog,EditValueDialog,DeleteDealDialog, EditStateDialog, DeleteCountryDialog,DeleteStateDialog ],
	providers: []
})
export class PagesModule {
}
