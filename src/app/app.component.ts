import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';

enum Tool {
  PackageManager = 'pmc',
  CLI = 'cli',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  //#region Private fields
  private subSink: Subscription = new Subscription();
  //#endregion

  //#region Public properties
  fg: FormGroup;
  generatedCommand = '';
  //#endregion

  //#region Ctor
  constructor(private clipboard: Clipboard, private toastr: ToastrService) {}
  //#endregion

  //#region Lifecycle hooks
  ngOnInit() {
    this.fg = new FormGroup({
      tool: new FormControl(Tool.PackageManager),
      connectionString: new FormControl(''),
      provider: new FormControl(''),
      useAnnotations: new FormControl(false),
      useDatabaseNames: new FormControl(false),
      useForce: new FormControl(false),
      contextName: new FormControl(''),
      contextDir: new FormControl(''),
      outputDir: new FormControl(''),
      schemas: new FormControl(''),
      tables: new FormControl(''),
    });

    this.subSink.add(this.fg.valueChanges.subscribe(_ => this.onFormChange()));

    this.onFormChange();
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
  //#endregion

  //#region Event handlers
  onFormChange() {
    if (this.fg.controls.tool.value === Tool.PackageManager) {
      this.generatedCommand = this.getPMCString();
    } else if (this.fg.controls.tool.value === Tool.CLI) {
      this.generatedCommand = this.getCLIString();
    }
  }

  onClearForm() {
    this.fg.patchValue({
      tool: Tool.PackageManager,
      connectionString: '',
      provider: '',
      useAnnotations: false,
      useDatabaseNames: false,
      useForce: false,
      contextName: '',
      contextDir: '',
      outputDir: '',
      schemas: '',
      tables: '',
    });
  }

  onCopyToClipboard() {
    const result = this.clipboard.copy(this.generatedCommand);

    if (result) {
      this.toastr.success('Command successfully copied!');
    } else {
      this.toastr.error('Copying failed!');
    }
  }
  //#endregion

  //#region Helpers
  private getPMCString(): string {
    const controls = this.fg.controls;
    const sb = ['Scaffold-DbContext'];

    if (controls.connectionString.value) {
      sb.push(`"${controls.connectionString.value}"`);
    }

    if (controls.provider.value) {
      sb.push(controls.provider.value);
    }

    if (controls.outputDir.value) {
      sb.push(`-OutputDir ${controls.outputDir.value}`);
    }

    if (controls.contextDir.value) {
      sb.push(`-ContextDir ${controls.contextDir.value}`);
    }

    if (controls.contextName.value) {
      sb.push(`-Context ${controls.contextName.value}`);
    }

    if (controls.schemas.value) {
      const schemasString = (controls.schemas.value as string)
        .split(',')
        .map(val => `${val.trim()}`)
        .filter(val => !!val)
        .map(val => `"${val}"`)
        .join(',');
      sb.push(`-Schemas ${schemasString}`);
    }

    if (controls.tables.value) {
      const tablesString = (controls.tables.value as string)
        .split(',')
        .map(val => `${val.trim()}`)
        .filter(val => !!val)
        .map(val => `"${val}"`)
        .join(',');
      sb.push(`-Tables ${tablesString}`);
    }

    if (controls.useAnnotations.value) {
      sb.push('-DataAnnotations');
    }

    if (controls.useDatabaseNames.value) {
      sb.push('-UseDatabaseNames');
    }

    if (controls.useForce.value) {
      sb.push('-Force');
    }

    return sb.join(' ');
  }

  private getCLIString(): string {
    const controls = this.fg.controls;
    const sb = ['dotnet ef dbcontext scaffold'];

    if (controls.connectionString.value) {
      sb.push(`"${controls.connectionString.value}"`);
    }

    if (controls.provider.value) {
      sb.push(controls.provider.value);
    }

    if (controls.outputDir.value) {
      sb.push(`-o ${controls.outputDir.value}`);
    }

    if (controls.contextDir.value) {
      sb.push(`--context-dir ${controls.contextDir.value}`);
    }

    if (controls.contextName.value) {
      sb.push(`-c ${controls.contextName.value}`);
    }

    if (controls.schemas.value) {
      const schemasString = (controls.schemas.value as string)
        .split(',')
        .map(val => `${val.trim()}`)
        .filter(val => !!val)
        .map(val => `"${val}"`)
        .join(',');
      sb.push(`--schema ${schemasString}`);
    }

    if (controls.tables.value) {
      const tablesString = (controls.tables.value as string)
        .split(',')
        .map(val => `${val.trim()}`)
        .filter(val => !!val)
        .map(val => `"${val}"`)
        .join(',');
      sb.push(`-t ${tablesString}`);
    }

    if (controls.useAnnotations.value) {
      sb.push('-d');
    }

    if (controls.useDatabaseNames.value) {
      sb.push('--use-database-names');
    }

    if (controls.useForce.value) {
      sb.push('-f');
    }

    return sb.join(' ');
  }
  //#endregion
}
