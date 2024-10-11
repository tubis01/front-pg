import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSuscription?: Subscription;

  @Input()
  public initialValue:string = '';

  @Input()
  public placeHolder:string = 'Buscar...';

  @Output()
  public onValue: EventEmitter<string> = new EventEmitter();

  @Output()
  public onDebounce: EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {
    this.debouncerSuscription = this.debouncer.pipe(
      debounceTime(500)
    ).subscribe( value => {
      this.onDebounce.emit(value)
    }
    )
  }

  public emitValue(value: string){
    this.onValue.emit(value)
  }

  ngOnDestroy(): void {
      this.debouncerSuscription?.unsubscribe()
  }

  public onKeyPress(serachTerm: string): void{
    //next. para hacer la siguiente mision del observable
    this.debouncer.next(serachTerm)
  }

}
