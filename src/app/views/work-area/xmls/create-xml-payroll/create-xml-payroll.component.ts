import { Component } from '@angular/core';
import { NgWizardConfig, NgWizardService, THEME } from 'ng-wizard';
import { SweetAlertsService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-create-xml-payroll',
  templateUrl: './create-xml-payroll.component.html',
  styleUrls: ['./create-xml-payroll.component.scss']
})

export class CreateXmlPayrollComponent {

  showBottonFinish: boolean = false;
  disabledButtonNext: boolean = true;
  disableButtonPreview: boolean = true;
  numberStep!: number;
  stepTitle!: string;

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.dots,
    toolbarSettings: {
      showPreviousButton: false,
      showNextButton: false,
    },
  };

  constructor(private ngWizardService: NgWizardService, private swal: SweetAlertsService){}

  ngOngInit(){
    this.ngWizardService.stepChanged().subscribe({
      next: (args) => {
        this.numberStep = args.step.index;
        this.showBottonFinish = String(args.position) == 'final' ? true : false;
        this.disabledButtonNext = String(args.position) == 'final' ? true : false;
        this.disableButtonPreview = String(args.position) == 'first' ? true : false;
        this.stepTitle = args.step.title;
      },
    });
  }

  showPreviousStep(): void { this.ngWizardService.previous(); }

  begin(): void {

  }

  showNextStep(): void {
    // let canNext: boolean = this.selectStep(this.numberStep);
    // por cuestiones de test se comenta
    // if (!canNext) { this.ngWizardService.next(); }
    this.ngWizardService.next();
  }

  resetWizard(): void {

  }

  saveData(): void {

  }
  
}
