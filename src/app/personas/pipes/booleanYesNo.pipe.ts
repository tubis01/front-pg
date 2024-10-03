import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'YesOrNo'
})

export class YesNoPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Si' : 'No';
  }
}
