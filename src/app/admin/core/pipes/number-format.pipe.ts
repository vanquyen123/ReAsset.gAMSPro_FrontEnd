import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFormatPipe'
})

export class NumberFormatPipe implements PipeTransform {
    transform(num: number) {
        if (num == 0) {
			return '0';
		}
		if (!num) {
			return '';
		}
		// return num.toString().replace(/(\d{4})(?!(\d{4})+(?!\d{0}))/g, '$1 ');
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');

    }
}